/**
 * Pedigree Analyzer (model comparison) and Pedigree Solver (individual
 * genotype/status inference). Both use the same factor graph engine.
 */

import type {
	AnalyzerResult,
	EvidenceStrength,
	GenotypeProbability,
	Individual,
	IndividualSolution,
	InheritanceModel,
	ModelAssumptions,
	ModelResult,
	Pedigree,
	SolverResult,
	StatusDistribution
} from '../../types/genetics';
import { buildGraph } from '../pedigree/pedigree-graph';
import { DEFAULT_ALLELE_FREQUENCY, buildInference, logLikelihood, marginalFor } from './pedigree-inference';
import { getModelDefinition, phenotypeOf, splitState, stateGenotype } from './model-spec';
import { InferenceTooLargeError, logSumExp } from './probability';

export const DEFAULT_ASSUMPTIONS: ModelAssumptions = {
	alleleFrequency: DEFAULT_ALLELE_FREQUENCY,
	equalModelPriors: true,
	unaffectedMeaning:
		'Unaffected means not affected; a carrier is possible (carrier status is not excluded)',
	penetrance: 'Complete penetrance (genotype fully determines phenotype)',
	deNovo: 'No de novo mutations',
	phenocopies: 'No phenocopies',
	sexDetermination: 'Standard XX/XY inheritance for sex-linked models'
};

export interface AnalysisOptions {
	alleleFrequency?: number;
	enabledModels?: InheritanceModel[];
	/** When true, "unaffected" is also taken to rule out carrier status. */
	unaffectedMeansNonCarrier?: boolean;
}

export interface SolveOptions {
	alleleFrequency?: number;
	/** When true, "unaffected" is also taken to rule out carrier status. */
	unaffectedMeansNonCarrier?: boolean;
}

function assumptionsFor(q: number, unaffectedMeansNonCarrier: boolean): ModelAssumptions {
	return {
		...DEFAULT_ASSUMPTIONS,
		alleleFrequency: q,
		unaffectedMeaning: unaffectedMeansNonCarrier
			? 'Unaffected also means not a carrier (carrier status is excluded)'
			: DEFAULT_ASSUMPTIONS.unaffectedMeaning
	};
}

/* ------------------------------------------------------------------ */
/* Structural observations (model independent)                         */
/* ------------------------------------------------------------------ */

interface PedigreeFacts {
	totalObserved: number;
	affectedMales: number;
	affectedFemales: number;
	affectedUnknownSex: number;
	maleToMale: number;
	affectedFatherWithUnaffectedDaughter: number;
	affectedFatherWithAffectedDaughter: number;
	unaffectedParentsWithAffectedChild: number;
	affectedChildWithUnaffectedFather: number;
	affectedChildWithUnaffectedMother: number;
	consanguineous: number;
}

function collectFacts(pedigree: Pedigree): PedigreeFacts {
	const graph = buildGraph(pedigree);
	const facts: PedigreeFacts = {
		totalObserved: 0,
		affectedMales: 0,
		affectedFemales: 0,
		affectedUnknownSex: 0,
		maleToMale: 0,
		affectedFatherWithUnaffectedDaughter: 0,
		affectedFatherWithAffectedDaughter: 0,
		unaffectedParentsWithAffectedChild: 0,
		affectedChildWithUnaffectedFather: 0,
		affectedChildWithUnaffectedMother: 0,
		consanguineous: 0
	};

	for (const individual of pedigree.individuals) {
		if (individual.status === 'unknown') continue;
		facts.totalObserved++;
		if (individual.status === 'affected') {
			if (individual.sex === 'male') facts.affectedMales++;
			else if (individual.sex === 'female') facts.affectedFemales++;
			else facts.affectedUnknownSex++;
		}
	}

	const ancestors = (id: string): Set<string> => {
		const seen = new Set<string>();
		const stack = [id];
		while (stack.length) {
			const current = stack.pop() as string;
			const parents = graph.parentsOf.get(current);
			if (!parents) continue;
			for (const parentId of [parents.fatherId, parents.motherId]) {
				if (!seen.has(parentId)) {
					seen.add(parentId);
					stack.push(parentId);
				}
			}
		}
		return seen;
	};

	for (const [childId, parents] of graph.parentsOf) {
		const child = graph.individuals.get(childId);
		const father = graph.individuals.get(parents.fatherId);
		const mother = graph.individuals.get(parents.motherId);
		if (!child || !father || !mother) continue;

		if (child.status === 'affected') {
			if (father.status === 'unaffected') facts.affectedChildWithUnaffectedFather++;
			if (mother.status === 'unaffected') facts.affectedChildWithUnaffectedMother++;
			if (father.status !== 'affected' && mother.status !== 'affected') {
				facts.unaffectedParentsWithAffectedChild++;
			}
			if (father.sex === 'male' && father.status === 'affected' && child.sex === 'male') {
				facts.maleToMale++;
			}
			if (father.status === 'affected' && child.sex === 'female') {
				facts.affectedFatherWithAffectedDaughter++;
			}
		}

		if (father.status === 'affected' && child.sex === 'female' && child.status === 'unaffected') {
			facts.affectedFatherWithUnaffectedDaughter++;
		}

		if (ancestors(father.id).has(mother.id) || ancestors(mother.id).has(father.id)) {
			facts.consanguineous++;
		}
	}

	return facts;
}

function observationsFromFacts(facts: PedigreeFacts): string[] {
	const notes: string[] = [];
	if (facts.maleToMale > 0) {
		notes.push(
			'Male-to-male transmission is present, which is incompatible with X-linked inheritance but compatible with autosomal and Y-linked models.'
		);
	}
	if (facts.affectedFatherWithUnaffectedDaughter > 0) {
		notes.push('An affected father has an unaffected daughter, which X-linked dominant inheritance cannot explain.');
	}
	if (facts.unaffectedParentsWithAffectedChild > 0) {
		notes.push('An affected child has two unaffected parents, which points towards a recessive model.');
	}
	if (facts.affectedFemales > 0) {
		notes.push('Females are affected, which rules out strictly Y-linked inheritance.');
	}
	if (facts.affectedChildWithUnaffectedFather > 0 && facts.affectedFemales > 0) {
		notes.push(
			'An affected female has an unaffected father, which X-linked recessive inheritance cannot explain.'
		);
	}
	if (facts.consanguineous > 0) {
		notes.push('Consanguinity is present in the pedigree; recessive models gain support from shared ancestry.');
	}
	if (facts.affectedMales > 0 && facts.affectedFemales === 0) {
		notes.push('Only males are affected so far, which makes sex-linked and Y-linked models worth considering.');
	}
	return notes;
}

function modelNotes(model: InheritanceModel, facts: PedigreeFacts): string[] {
	const notes: string[] = [];
	if (model === 'x-linked-dominant' && facts.affectedFatherWithUnaffectedDaughter > 0) {
		notes.push('Contradicted by an affected father with an unaffected daughter.');
	}
	if (model === 'x-linked-recessive' && facts.affectedChildWithUnaffectedFather > 0 && facts.affectedFemales > 0) {
		notes.push('Contradicted by an affected female whose father is unaffected.');
	}
	if (model === 'y-linked') {
		if (facts.affectedFemales > 0) notes.push('Contradicted by affected females.');
		if (facts.affectedUnknownSex > 0) notes.push('Y-linked inheritance cannot explain affected individuals of unknown sex.');
		if (facts.affectedMales === 0 && facts.totalObserved > 0) notes.push('No affected males are recorded.');
	}
	if ((model === 'autosomal-dominant' || model === 'x-linked-dominant') && facts.unaffectedParentsWithAffectedChild > 0) {
		notes.push('Requires an unaffected parent to carry a variant that is fully dominant.');
	}
	if (model === 'autosomal-recessive') {
		if (facts.unaffectedParentsWithAffectedChild > 0) notes.push('Explained naturally by two carrier parents.');
		if (facts.consanguineous > 0) notes.push('Shared ancestry increases the chance of two carrier partners.');
	}
	return notes;
}

/* ------------------------------------------------------------------ */
/* Analyzer                                                            */
/* ------------------------------------------------------------------ */

const ALL_MODELS: InheritanceModel[] = [
	'autosomal-dominant',
	'autosomal-recessive',
	'x-linked-dominant',
	'x-linked-recessive',
	'y-linked'
];

function strengthFromPosterior(p: number, compatible: boolean): EvidenceStrength {
	if (!compatible) return 'incompatible';
	if (p >= 0.9) return 'strong';
	if (p >= 0.7) return 'moderate';
	return 'weak';
}

export function analyzePedigree(pedigree: Pedigree, options: AnalysisOptions = {}): AnalyzerResult {
	const enabledModels = (options.enabledModels?.length ? options.enabledModels : ALL_MODELS).slice();
	const q = options.alleleFrequency ?? DEFAULT_ALLELE_FREQUENCY;
	const unaffectedMeansNonCarrier = options.unaffectedMeansNonCarrier ?? false;
	const assumptions = assumptionsFor(q, unaffectedMeansNonCarrier);
	const warnings: string[] = [];

	const facts = collectFacts(pedigree);
	const observations = observationsFromFacts(facts);

	const results: ModelResult[] = enabledModels.map((model) => {
		let logL = -Infinity;
		try {
			const inference = buildInference(pedigree, model, {
				alleleFrequency: q,
				unaffectedMeansNonCarrier
			});
			logL = logLikelihood(inference);
			warnings.push(...inference.warnings);
		} catch (error) {
			if (error instanceof InferenceTooLargeError || error instanceof Error) {
				warnings.push(`${getModelDefinition(model).label}: ${(error as Error).message}`);
			}
			logL = Number.NaN;
		}

		const compatible = Number.isFinite(logL) && logL > -Infinity;
		return {
			model,
			logLikelihood: Number.isNaN(logL) ? -Infinity : logL,
			likelihood: compatible ? Math.exp(logL) : 0,
			posterior: 0,
			compatible,
			strength: compatible ? 'weak' : 'incompatible',
			notes: modelNotes(model, facts),
			approximate: false
		};
	});

	const anyCompatible = results.some((r) => r.compatible);
	if (!anyCompatible) {
		return {
			results,
			enabledModels,
			incompatible: true,
			inconclusive: true,
			topModel: null,
			topPosterior: 0,
			assumptions,
			observations,
			approximate: false,
			warnings: [...new Set(warnings)]
		};
	}

	const logTotal = logSumExp(
		results.map((r) => (r.compatible ? r.logLikelihood + Math.log(1 / enabledModels.length) : -Infinity))
	);

	for (const result of results) {
		if (!result.compatible) {
			result.posterior = 0;
			continue;
		}
		const logPosterior = result.logLikelihood + Math.log(1 / enabledModels.length) - logTotal;
		result.posterior = Math.exp(logPosterior);
		result.strength = strengthFromPosterior(result.posterior, true);
	}

	// Renormalise to guard against floating point drift so bars sum to 100%.
	const total = results.reduce((sum, r) => sum + r.posterior, 0);
	if (total > 0) for (const r of results) r.posterior = r.posterior / total;

	const sorted = [...results].filter((r) => r.compatible).sort((a, b) => b.posterior - a.posterior);
	const top = sorted[0] ?? null;

	return {
		results,
		enabledModels,
		incompatible: false,
		inconclusive: top !== null && top.posterior < 0.6,
		topModel: top ? top.model : null,
		topPosterior: top ? top.posterior : 0,
		assumptions,
		observations,
		approximate: false,
		warnings: [...new Set(warnings)]
	};
}

/* ------------------------------------------------------------------ */
/* Solver                                                              */
/* ------------------------------------------------------------------ */

function statusOfGenotype(model: InheritanceModel, state: string): keyof StatusDistribution {
	const phenotype = phenotypeOf(model, state);
	return phenotype;
}

function emptyStatus(): StatusDistribution {
	return { affected: 0, carrier: 0, unaffected: 0 };
}

export function solvePedigree(
	pedigree: Pedigree,
	model: InheritanceModel,
	options: SolveOptions = {}
): SolverResult {
	const q = options.alleleFrequency ?? DEFAULT_ALLELE_FREQUENCY;
	const unaffectedMeansNonCarrier = options.unaffectedMeansNonCarrier ?? false;
	const assumptions = assumptionsFor(q, unaffectedMeansNonCarrier);
	const warnings: string[] = [];
	const solutions: IndividualSolution[] = [];
	let compatible = true;

	let inference;
	try {
		inference = buildInference(pedigree, model, { alleleFrequency: q, unaffectedMeansNonCarrier });
	} catch (error) {
		return {
			model,
			solutions: [],
			compatible: false,
			approximate: false,
			warnings: [(error as Error).message],
			assumptions
		};
	}

	warnings.push(...inference.warnings);
	if (logLikelihood(inference) === -Infinity) compatible = false;

	for (const individual of pedigree.individuals) {
		const solution = solveIndividual(inference, individual, model);
		if (solution) solutions.push(solution);
	}

	if (!compatible) {
		warnings.push(
			'The supplied observations cannot all be true under this model, so the distributions below are not normalised.'
		);
	}

	return {
		model,
		solutions,
		compatible,
		approximate: false,
		warnings: [...new Set(warnings)],
		assumptions
	};
}

function solveIndividual(
	inference: ReturnType<typeof buildInference>,
	individual: Individual,
	model: InheritanceModel
): IndividualSolution | null {
	const { states, probabilities } = marginalFor(inference, individual.id);
	if (states.length === 0) return null;

	const status = emptyStatus();
	const genotypes: GenotypeProbability[] = [];

	for (let i = 0; i < states.length; i++) {
		const probability = probabilities[i] ?? 0;
		if (probability <= 0) continue;
		const state = states[i];
		status[statusOfGenotype(model, state)] += probability;
		const { sex } = splitState(model, state);
		genotypes.push({
			genotype: state,
			probability,
			sex: sex ?? null
		});
	}

	genotypes.sort((a, b) => b.probability - a.probability);
	const total = status.affected + status.carrier + status.unaffected || 1;
	status.affected /= total;
	status.carrier /= total;
	status.unaffected /= total;

	const best = genotypes[0];
	const statusEntries: Array<[keyof StatusDistribution, number]> = [
		['affected', status.affected],
		['carrier', status.carrier],
		['unaffected', status.unaffected]
	];
	statusEntries.sort((a, b) => b[1] - a[1]);

	const unclear = statusEntries.every(([, p]) => p < 0.5);

	return {
		individualId: individual.id,
		label: individual.name?.trim() ? `${individual.label} · ${individual.name}` : individual.label,
		status,
		genotypes,
		mostLikelyGenotype: best ? stateGenotype(model, best.genotype) : '—',
		mostLikelyGenotypeProbability: best ? best.probability : 0,
		mostLikelyStatus: statusEntries[0][0],
		confidence: best ? best.probability : 0,
		observed: individual.status !== 'unknown',
		inferred: individual.status === 'unknown',
		note: unclear ? 'Insufficient information to resolve this individual.' : undefined
	};
}
