/**
 * Builds the factor graph for a pedigree under one inheritance model and runs
 * exact sum-product inference on it.
 */

import type { Individual, InheritanceModel, Pedigree } from '../../types/genetics';
import { buildGraph, modelRoleWarnings, type PedigreeGraph } from '../pedigree/pedigree-graph';
import {
	founderPrior,
	parseGenotype,
	phenotypeOf,
	statesForSex,
	transmit,
	variantAlleleCount
} from './model-spec';
import {
	MAX_TABLE_SIZE,
	tableSize,
	variableElimination,
	type Cardinality,
	type Factor
} from './probability';

export interface InferenceOptions {
	/** Frequency of the variant allele in the founder population. */
	alleleFrequency?: number;
	/**
	 * When true, an observed "unaffected" individual is also known not to be a
	 * carrier. When false (the default), "unaffected" only excludes the
	 * phenotype, so the individual may still be a carrier.
	 */
	unaffectedMeansNonCarrier?: boolean;
}

export interface InferenceModel {
	model: InheritanceModel;
	pedigree: Pedigree;
	graph: PedigreeGraph;
	variables: string[];
	cards: Cardinality;
	factors: Factor[];
	statesById: Record<string, string[]>;
	alleleFrequency: number;
	unaffectedMeansNonCarrier: boolean;
	warnings: string[];
}

export const DEFAULT_ALLELE_FREQUENCY = 0.01;

function observationFactor(
	individual: Individual,
	model: InheritanceModel,
	states: string[],
	unaffectedMeansNonCarrier: boolean
): Factor {
	const legacyCarrier = (individual.status as string) === 'carrier';
	const carrierObservation =
		individual.carrier ?? (legacyCarrier ? 'carrier' : 'unknown');
	const effectiveCarrier =
		carrierObservation !== 'unknown'
			? carrierObservation
			: individual.status === 'unaffected' && unaffectedMeansNonCarrier
				? 'non-carrier'
				: 'unknown';

	const log = new Float64Array(states.length);
	const knownGenotype =
		individual.genotype && individual.genotype.trim().length > 0
			? parseGenotype(individual.genotype, model, individual.sex)
			: null;

	for (let i = 0; i < states.length; i++) {
		const state = states[i];
		let allowed = true;

		if (individual.status === 'affected') {
			allowed = phenotypeOf(model, state) === 'affected';
		} else if (individual.status === 'unaffected' || legacyCarrier) {
			// A carrier is phenotypically unaffected, so it is allowed by default.
			allowed = phenotypeOf(model, state) !== 'affected';
		}

		if (allowed && effectiveCarrier !== 'unknown') {
			const count = variantAlleleCount(model, state);
			allowed = effectiveCarrier === 'carrier' ? count === 1 : count === 0;
		}

		if (allowed && knownGenotype && knownGenotype !== state) allowed = false;
		log[i] = allowed ? 0 : -Infinity;
	}

	return { vars: [individual.id], log };
}

function priorFactor(individual: Individual, model: InheritanceModel, q: number): Factor {
	const states = statesForSex(model, individual.sex);
	const { probabilities } = founderPrior(model, individual.sex, q);
	const log = new Float64Array(states.length);
	for (let i = 0; i < states.length; i++) {
		log[i] = probabilities[i] > 0 ? Math.log(probabilities[i]) : -Infinity;
	}
	return { vars: [individual.id], log };
}

/** Build the factor graph for one model. */
export function buildInference(
	pedigree: Pedigree,
	model: InheritanceModel,
	options: InferenceOptions = {}
): InferenceModel {
	const q = options.alleleFrequency ?? DEFAULT_ALLELE_FREQUENCY;
	const unaffectedMeansNonCarrier = options.unaffectedMeansNonCarrier ?? false;
	if (!(q > 0 && q < 1)) {
		throw new Error('Allele frequency must be between 0 and 1 (exclusive).');
	}

	const graph = buildGraph(pedigree);
	const warnings: string[] = [];
	const cards: Cardinality = {};
	const statesById: Record<string, string[]> = {};
	const variables: string[] = [];

	for (const id of graph.order) {
		const individual = graph.individuals.get(id);
		if (!individual) continue;
		const states = statesForSex(model, individual.sex);
		statesById[id] = states;
		cards[id] = states.length;
		variables.push(id);
	}

	const factors: Factor[] = [];

	for (const id of graph.order) {
		const individual = graph.individuals.get(id);
		if (!individual) continue;

		// Only founders receive a population prior; everyone else inherits.
		if (!graph.parentsOf.has(id)) {
			factors.push(priorFactor(individual, model, q));
		}
		factors.push(
			observationFactor(individual, model, statesById[id], unaffectedMeansNonCarrier)
		);
	}

	// Mendelian transmission for every child.
	for (const [childId, parents] of graph.parentsOf) {
		const child = graph.individuals.get(childId);
		const father = graph.individuals.get(parents.fatherId);
		const mother = graph.individuals.get(parents.motherId);
		if (!child || !father || !mother) continue;

		const fatherStates = statesById[father.id];
		const motherStates = statesById[mother.id];
		const childStates = statesById[child.id];
		if (!fatherStates || !motherStates || !childStates) continue;

		const size = fatherStates.length * motherStates.length * childStates.length;
		if (size > MAX_TABLE_SIZE) {
			throw new Error(
				`Pedigree is too large to analyse exactly: one transmission table would need ${size.toLocaleString()} entries.`
			);
		}

		const log = new Float64Array(size).fill(-Infinity);

		for (let f = 0; f < fatherStates.length; f++) {
			for (let m = 0; m < motherStates.length; m++) {
				const outcomes = transmit(model, fatherStates[f], motherStates[m], child.sex);
				for (const [childState, probability] of outcomes) {
					const c = childStates.indexOf(childState);
					if (c < 0 || probability <= 0) continue;
					const index = (f * motherStates.length + m) * childStates.length + c;
					log[index] = Math.log(probability);
				}
			}
		}

		factors.push({ vars: [father.id, mother.id, child.id], log });
	}

	warnings.push(...modelRoleWarnings(pedigree, model));

	return {
		model,
		pedigree,
		graph,
		variables,
		cards,
		factors,
		statesById,
		alleleFrequency: q,
		unaffectedMeansNonCarrier,
		warnings: [...new Set(warnings)]
	};
}

/** log P(observed pedigree | model) — the clamped partition function. */
export function logLikelihood(inference: InferenceModel): number {
	const { logZ } = variableElimination(inference.factors, inference.cards, []);
	return logZ;
}

/** Largest single factor table, used as a cheap complexity read-out. */
export function complexityEstimate(inference: InferenceModel): number {
	let max = 0;
	for (const factor of inference.factors) {
		const size = tableSize(factor.vars, inference.cards);
		if (size > max) max = size;
	}
	return max;
}

/** Marginal genotype distribution for one individual, conditioned on the whole pedigree. */
export function marginalFor(
	inference: InferenceModel,
	individualId: string
): { states: string[]; probabilities: number[] } {
	const states = inference.statesById[individualId] ?? [];
	if (states.length === 0) return { states: [], probabilities: [] };
	if (states.length === 1) return { states, probabilities: [1] };

	const { logZ, factor } = variableElimination(inference.factors, inference.cards, [individualId]);
	if (!factor || logZ === -Infinity) {
		return { states, probabilities: states.map(() => 0) };
	}

	const probabilities = states.map(() => 0);
	const position = factor.vars.indexOf(individualId);
	if (position < 0) return { states, probabilities };

	if (factor.vars.length === 1) {
		for (let i = 0; i < states.length; i++) probabilities[i] = factor.log[i] ?? 0;
		return { states, probabilities };
	}

	// Defensive: marginalise any joint factor that still carries extra variables.
	const stride = factor.vars
		.slice(position + 1)
		.reduce((acc, v) => acc * (inference.cards[v] ?? 1), 1);
	const outer = factor.vars
		.slice(0, position)
		.reduce((acc, v) => acc * (inference.cards[v] ?? 1), 1);
	for (let o = 0; o < outer; o++) {
		for (let i = 0; i < states.length; i++) {
			let sum = 0;
			for (let s = 0; s < stride; s++) {
				sum += factor.log[(o * states.length + i) * stride + s] ?? 0;
			}
			probabilities[i] += sum;
		}
	}
	const total = probabilities.reduce((a, b) => a + b, 0) || 1;
	return { states, probabilities: probabilities.map((p) => p / total) };
}
