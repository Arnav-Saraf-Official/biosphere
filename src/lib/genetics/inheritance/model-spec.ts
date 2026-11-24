/**
 * Inheritance model definitions.
 *
 * Allele notation used throughout the engine:
 *   D = variant (disease-associated) allele
 *   d = reference allele
 *
 * Genotype states are model-specific strings:
 *   autosomal             "DD" | "Dd" | "dd"
 *   X-linked (female)     "F:DD" | "F:Dd" | "F:dd"
 *   X-linked (male)       "M:D" | "M:d"
 *   Y-linked (male)       "M:V" | "M:v"
 *   Y-linked (female)     "F:none"
 *
 * Sex is encoded inside the state for sex-linked models so that inference can
 * marginalise over unknown sex without a separate hidden variable.
 */

import type { InheritanceModel, PhenotypeClass, Sex } from '../../types/genetics';

export interface ModelDefinition {
	id: InheritanceModel;
	label: string;
	shortLabel: string;
	description: string;
	/** How the allele is transmitted, in one sentence. */
	transmission: string;
	sexLinked: boolean;
	/** Whether an unaffected heterozygote (carrier) class exists. */
	hasCarriers: boolean;
}

export const MODEL_DEFINITIONS: Record<InheritanceModel, ModelDefinition> = {
	'autosomal-dominant': {
		id: 'autosomal-dominant',
		label: 'Autosomal dominant',
		shortLabel: 'AD',
		description:
			'One variant allele on an autosome is enough to produce the phenotype (complete penetrance).',
		transmission: 'Each child of an affected heterozygote inherits the variant with probability 1/2.',
		sexLinked: false,
		hasCarriers: false
	},
	'autosomal-recessive': {
		id: 'autosomal-recessive',
		label: 'Autosomal recessive',
		shortLabel: 'AR',
		description: 'Two variant alleles on the autosomes are required to produce the phenotype.',
		transmission:
			'Heterozygotes are unaffected carriers; two carriers have a 1/4 chance of an affected child.',
		sexLinked: false,
		hasCarriers: true
	},
	'x-linked-dominant': {
		id: 'x-linked-dominant',
		label: 'X-linked dominant',
		shortLabel: 'XD',
		description:
			'One variant allele on the X chromosome is enough to produce the phenotype (complete penetrance).',
		transmission:
			'An affected father transmits the variant to all daughters and no sons; mothers transmit to half of all children.',
		sexLinked: true,
		hasCarriers: false
	},
	'x-linked-recessive': {
		id: 'x-linked-recessive',
		label: 'X-linked recessive',
		shortLabel: 'XR',
		description:
			'Two variant alleles are required in females; a single variant allele on his only X affects a male.',
		transmission:
			'Carrier mothers transmit the variant to half of their sons (affected) and half of their daughters (carriers).',
		sexLinked: true,
		hasCarriers: true
	},
	'y-linked': {
		id: 'y-linked',
		label: 'Y-linked',
		shortLabel: 'Y',
		description: 'The variant lies on the Y chromosome, so only males can carry and express it.',
		transmission: 'An affected father transmits the variant to every son and to no daughter.',
		sexLinked: true,
		hasCarriers: false
	}
};

export const MODEL_ORDER: InheritanceModel[] = [
	'autosomal-dominant',
	'autosomal-recessive',
	'x-linked-dominant',
	'x-linked-recessive',
	'y-linked'
];

export function getModelDefinition(model: InheritanceModel): ModelDefinition {
	return MODEL_DEFINITIONS[model];
}

export function isSexLinked(model: InheritanceModel): boolean {
	return MODEL_DEFINITIONS[model].sexLinked;
}

export function modelHasCarriers(model: InheritanceModel): boolean {
	return MODEL_DEFINITIONS[model].hasCarriers;
}

/* ------------------------------------------------------------------ */
/* State space                                                         */
/* ------------------------------------------------------------------ */

const X_FEMALE = ['F:DD', 'F:Dd', 'F:dd'] as const;
const X_MALE = ['M:D', 'M:d'] as const;
const Y_FEMALE = ['F:none'] as const;
const Y_MALE = ['M:V', 'M:v'] as const;
const AUTOSOMAL = ['DD', 'Dd', 'dd'] as const;

export function statesForSex(model: InheritanceModel, sex: Sex): string[] {
	const def = getModelDefinition(model);
	if (!def.sexLinked) return [...AUTOSOMAL];
	if (model === 'y-linked') {
		if (sex === 'male') return [...Y_MALE];
		if (sex === 'female') return [...Y_FEMALE];
		return [...Y_FEMALE, ...Y_MALE];
	}
	if (model === 'x-linked-dominant' || model === 'x-linked-recessive') {
		if (sex === 'male') return [...X_MALE];
		if (sex === 'female') return [...X_FEMALE];
		return [...X_FEMALE, ...X_MALE];
	}
	return [...AUTOSOMAL];
}

/** Split a state into its implied sex (for sex-linked models) and genotype. */
export function splitState(
	model: InheritanceModel,
	state: string
): { sex: Sex | null; genotype: string } {
	if (!getModelDefinition(model).sexLinked) return { sex: null, genotype: state };
	if (state.startsWith('F:')) return { sex: 'female', genotype: state.slice(2) };
	if (state.startsWith('M:')) return { sex: 'male', genotype: state.slice(2) };
	return { sex: null, genotype: state };
}

/** Genotype portion of a state, e.g. "M:D" -> "D". */
export function stateGenotype(model: InheritanceModel, state: string): string {
	return splitState(model, state).genotype;
}

/** Sex implied by a state; null for autosomal models. */
export function stateSex(model: InheritanceModel, state: string): Sex | null {
	return splitState(model, state).sex;
}

/** Human-readable state, e.g. "M:D" -> "D (male)". */
export function describeState(model: InheritanceModel, state: string): string {
	const { sex, genotype } = splitState(model, state);
	if (!sex) return genotype;
	if (genotype === 'none') return 'no Y chromosome';
	return `${genotype} (${sex === 'male' ? 'XY' : 'XX'})`;
}

/* ------------------------------------------------------------------ */
/* Phenotype                                                           */
/* ------------------------------------------------------------------ */

export function phenotypeOf(model: InheritanceModel, state: string): PhenotypeClass {
	const { sex, genotype } = splitState(model, state);

	switch (model) {
		case 'autosomal-dominant':
			return genotype.includes('D') ? 'affected' : 'unaffected';
		case 'autosomal-recessive':
			if (genotype === 'DD') return 'affected';
			return genotype === 'Dd' ? 'carrier' : 'unaffected';
		case 'x-linked-dominant':
			if (sex === 'female') return genotype.includes('D') ? 'affected' : 'unaffected';
			return genotype === 'D' ? 'affected' : 'unaffected';
		case 'x-linked-recessive':
			if (sex === 'female') {
				if (genotype === 'DD') return 'affected';
				return genotype === 'Dd' ? 'carrier' : 'unaffected';
			}
			return genotype === 'D' ? 'affected' : 'unaffected';
		case 'y-linked':
			return genotype === 'V' ? 'affected' : 'unaffected';
	}
}

/* ------------------------------------------------------------------ */
/* Founder priors                                                      */
/* ------------------------------------------------------------------ */

/**
 * Hardy-Weinberg founder prior keyed by state.
 * `q` is the frequency of the variant allele in the population.
 */
export function founderPrior(
	model: InheritanceModel,
	sex: Sex,
	q: number
): { states: string[]; probabilities: number[] } {
	const states = statesForSex(model, sex);
	const r = 1 - q;
	const probabilities = states.map((state) => {
		const { genotype } = splitState(model, state);
		switch (genotype) {
			case 'DD':
				return q * q;
			case 'Dd':
				return 2 * q * r;
			case 'dd':
				return r * r;
			case 'D':
				return q;
			case 'd':
				return r;
			case 'V':
				return q;
			case 'v':
				return r;
			case 'none':
			default:
				return 1;
		}
	});
	if (sex === 'unknown' && getModelDefinition(model).sexLinked) {
		// Everything is halved because the individual's sex is unknown.
		return { states, probabilities: probabilities.map((p) => p * 0.5) };
	}
	return { states, probabilities };
}

/* ------------------------------------------------------------------ */
/* Transmission                                                        */
/* ------------------------------------------------------------------ */

function canonicalPair(a: string, b: string): string {
	// Variant allele first for consistent display ("Dd", never "dD").
	return a === 'D' || b === 'D' ? 'D' + (a === 'D' ? b : a) : a + b;
}

/** X alleles carried by a state, and whether the state carries a Y. */
function xContent(state: string): { alleles: string[]; hasY: boolean } {
	if (state.startsWith('M:')) {
		const allele = state.slice(2);
		return { alleles: [allele], hasY: true };
	}
	if (state.startsWith('F:')) {
		const genotype = state.slice(2);
		return { alleles: [genotype[0], genotype[1]], hasY: false };
	}
	return { alleles: [state], hasY: false };
}

function yAllele(state: string): string | null {
	if (state === 'M:V') return 'V';
	if (state === 'M:v') return 'v';
	return null;
}

/**
 * Possible genotypes of a child given parental states.
 * The father/mother argument order follows pedigree roles, which for
 * sex-linked models is what determines gamete type.
 * Returns entries whose probabilities sum to 1, or an empty list when the
 * combination is biologically impossible for that child sex.
 */
export function transmit(
	model: InheritanceModel,
	fatherState: string,
	motherState: string,
	childSex: Sex
): Array<[string, number]> {
	const def = getModelDefinition(model);

	if (!def.sexLinked) {
		const fatherAlleles = [fatherState[0], fatherState[1]];
		const motherAlleles = [motherState[0], motherState[1]];
		const out = new Map<string, number>();
		for (const a of fatherAlleles) {
			for (const b of motherAlleles) {
				const child = canonicalPair(a, b);
				out.set(child, (out.get(child) ?? 0) + 0.25);
			}
		}
		return [...out.entries()];
	}

	if (model === 'y-linked') {
		const out: Array<[string, number]> = [];
		const sons: Array<[string, number]> = [];
		const allele = yAllele(fatherState);
		if (allele) sons.push([allele === 'V' ? 'M:V' : 'M:v', 1]);
		if (childSex === 'male') return sons;
		if (childSex === 'female') return [['F:none', 1]];
		// Unknown sex: 1/2 male, 1/2 female.
		out.push(['F:none', 0.5]);
		for (const [state, p] of sons) out.push([state, p * 0.5]);
		return out;
	}

	// X-linked
	const father = xContent(fatherState);
	const mother = xContent(motherState);
	const out = new Map<string, number>();

	const sonStates = (weight: number) => {
		if (!father.hasY) return;
		for (const mAllele of mother.alleles) {
			const key = `M:${mAllele}`;
			out.set(key, (out.get(key) ?? 0) + weight * (1 / mother.alleles.length));
		}
	};

	const daughterStates = (weight: number) => {
		for (const fAllele of father.alleles) {
			for (const mAllele of mother.alleles) {
				const key = `F:${canonicalPair(fAllele, mAllele)}`;
				const p = weight / (father.alleles.length * mother.alleles.length);
				out.set(key, (out.get(key) ?? 0) + p);
			}
		}
	};

	if (childSex === 'male') sonStates(1);
	else if (childSex === 'female') daughterStates(1);
	else {
		sonStates(0.5);
		daughterStates(0.5);
	}

	return [...out.entries()];
}

/* ------------------------------------------------------------------ */
/* Genotype input parsing                                              */
/* ------------------------------------------------------------------ */

/**
 * Accept conventional notation (e.g. "Gg", "AaBB") and map it onto the
 * engine's state space. Uppercase letters denote the variant allele.
 * Returns null when the input cannot describe a genotype for that sex.
 */
export function parseGenotype(
	input: string,
	model: InheritanceModel,
	sex: Sex
): string | null {
	const letters = input.replace(/[^A-Za-z]/g, '');
	if (letters.length === 0) return null;
	const def = getModelDefinition(model);
	const allele = (ch: string): string => (/[A-Z]/.test(ch) ? 'D' : 'd');

	if (!def.sexLinked) {
		if (letters.length !== 2) return null;
		return canonicalPair(allele(letters[0]), allele(letters[1]));
	}

	if (model === 'y-linked') {
		if (sex === 'female') return letters.length === 1 ? 'F:none' : null;
		if (sex !== 'male') return null;
		if (letters.length !== 1) return null;
		return /[A-Z]/.test(letters) ? 'M:V' : 'M:v';
	}

	// X-linked
	if (sex === 'unknown') return null;
	if (sex === 'male') {
		return letters.length === 1 ? `M:${allele(letters[0])}` : null;
	}
	return letters.length === 2
		? `F:${canonicalPair(allele(letters[0]), allele(letters[1]))}`
		: null;
}

/**
 * Number of variant alleles carried by a state.
 * Used to tell carrier (exactly one copy) from non-carrier (no copy) findings.
 */
export function variantAlleleCount(model: InheritanceModel, state: string): number {
	const { genotype } = splitState(model, state);
	if (genotype === 'none' || genotype === '') return 0;
	if (genotype.includes('V')) return genotype === 'V' ? 1 : 0;
	if (genotype.includes('v')) return 0;
	return [...genotype].filter((letter) => letter === 'D').length;
}

/** True when the state carries exactly one variant allele. */
export function carriesVariant(model: InheritanceModel, state: string): boolean {
	return variantAlleleCount(model, state) === 1;
}

/** Convert the engine's D/d notation into the configured allele letter. */
export function remapGenotype(genotype: string, letter: string): string {
	const variant = (letter.trim()[0] ?? 'G').toUpperCase();
	const reference = variant.toLowerCase();
	return genotype
		.replace(/D/g, variant)
		.replace(/d/g, reference)
		.replace(/V/g, variant)
		.replace(/v/g, reference);
}

/** Format a state for display in the pedigree, e.g. "M:D" -> "D". */
export function formatGenotype(state: string, options: { sex?: boolean } = {}): string {
	const prefixed = state.startsWith('F:') || state.startsWith('M:');
	const genotype = prefixed ? state.slice(2) : state;
	if (genotype === 'none') return '—';
	// A male carries one allele, so his genotype is a single letter. Adding the
	// chromosome keeps it from looking like a truncated pair.
	if (options.sex && state.startsWith('M:')) {
		const chromosome = genotype === 'V' || genotype === 'v' ? 'Y' : 'XY';
		return `${genotype} (${chromosome})`;
	}
	return genotype;
}

/**
 * Apply the dominant-heterozygote display convention.
 * This only changes the label shown to the user; `phenotypeOf` is untouched.
 */
export function displayPhenotypeLabel(
	model: InheritanceModel,
	state: string,
	heterozygoteAsCarrier: boolean
): PhenotypeClass {
	const phenotype = phenotypeOf(model, state);
	if (!heterozygoteAsCarrier) return phenotype;
	const { genotype, sex } = splitState(model, state);
	const isHeterozygous =
		!getModelDefinition(model).sexLinked
			? genotype === 'Dd'
			: sex === 'female' && genotype === 'Dd';
	if (!isHeterozygous) return phenotype;
	if (phenotype === 'affected') return 'carrier';
	return phenotype;
}
