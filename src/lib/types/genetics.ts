/**
 * Shared data models for Biosphere.
 * These types are intentionally UI-agnostic so the genetics engine can be
 * unit-tested without a DOM or a Svelte runtime.
 */

/* ------------------------------------------------------------------ */
/* Core enums                                                          */
/* ------------------------------------------------------------------ */

export type InheritanceModel =
	| 'autosomal-dominant'
	| 'autosomal-recessive'
	| 'x-linked-dominant'
	| 'x-linked-recessive'
	| 'y-linked';

export type Sex = 'male' | 'female' | 'unknown';

/** What the user observed for the phenotype. */
export type ObservedStatus = 'affected' | 'unaffected' | 'unknown';

/**
 * Carrier status is recorded separately from the phenotype, because a carrier
 * can be unaffected (a recessive heterozygote) or affected (a dominant
 * heterozygote).
 */
export type CarrierObservation = 'carrier' | 'non-carrier' | 'unknown';

/** How carrier status is drawn on the pedigree symbols. */
export type CarrierDisplay = 'recessive-only' | 'always' | 'never';

/** Phenotype class implied by a genotype under a given model. */
export type PhenotypeClass = 'affected' | 'unaffected' | 'carrier';

export interface Vec2 {
	x: number;
	y: number;
}

/* ------------------------------------------------------------------ */
/* Pedigree model                                                      */
/* ------------------------------------------------------------------ */

export interface Individual {
	id: string;
	label: string;
	name?: string;
	sex: Sex;
	status: ObservedStatus;
	/** Independent carrier finding; unknown means the engine deduces it. */
	carrier?: CarrierObservation;
	/** Explicitly known genotype, in the notation of the active model. */
	genotype?: string;
	notes?: string;
	/** Living status, shown as a diagonal strike through the symbol. */
	vital?: 'alive' | 'deceased';
	/** Optional age in years, used to order a generation oldest-first. */
	age?: number;
	position: Vec2;
}

/** Relationship state drawn on the mating line. */
export type PartnershipRelationship = 'married' | 'divorced';

export interface Partnership {
	id: string;
	/** Exactly two parents, in stable insertion order. */
	parents: [string, string];
	/** Defaults to a married/partner union when absent. */
	relationship?: PartnershipRelationship;
}

export interface ChildLink {
	childId: string;
	partnershipId: string;
}

export interface Pedigree {
	individuals: Individual[];
	partnerships: Partnership[];
	children: ChildLink[];
}

/* ------------------------------------------------------------------ */
/* Inference results                                                   */
/* ------------------------------------------------------------------ */

export interface ModelAssumptions {
	alleleFrequency: number;
	equalModelPriors: boolean;
	/** How an observed "unaffected" phenotype is interpreted by the engine. */
	unaffectedMeaning: string;
	penetrance: string;
	deNovo: string;
	phenocopies: string;
	sexDetermination: string;
}

export type EvidenceStrength = 'strong' | 'moderate' | 'weak' | 'incompatible';

export interface ModelResult {
	model: InheritanceModel;
	/** log P(observations | model) — the exact (clamped) partition function. */
	logLikelihood: number;
	/** P(model | observations), normalized across enabled models. 0..1 */
	posterior: number;
	/** Raw likelihood, may be 0 due to underflow; prefer logLikelihood. */
	likelihood: number;
	compatible: boolean;
	strength: EvidenceStrength;
	/** Human-readable observations that bear on this model. */
	notes: string[];
	approximate: boolean;
}

export interface AnalyzerResult {
	results: ModelResult[];
	enabledModels: InheritanceModel[];
	/** True when no enabled model can explain the observations. */
	incompatible: boolean;
	/** True when the data does not meaningfully favour one model. */
	inconclusive: boolean;
	topModel: InheritanceModel | null;
	topPosterior: number;
	assumptions: ModelAssumptions;
	/** Structural observations about the pedigree, model-independent. */
	observations: string[];
	approximate: boolean;
	warnings: string[];
}

export interface StatusDistribution {
	affected: number;
	carrier: number;
	unaffected: number;
}

export interface GenotypeProbability {
	genotype: string;
	probability: number;
	/** Display sex implied by the genotype state, when sex-linked. */
	sex: Sex | null;
}

export interface IndividualSolution {
	individualId: string;
	label: string;
	/** Marginal status distribution conditioned on the whole pedigree. */
	status: StatusDistribution;
	genotypes: GenotypeProbability[];
	mostLikelyGenotype: string;
	mostLikelyGenotypeProbability: number;
	mostLikelyStatus: keyof StatusDistribution;
	/** 0..1 — how much the family data constrains this individual. */
	confidence: number;
	observed: boolean;
	inferred: boolean;
	note?: string;
}

export interface SolverResult {
	model: InheritanceModel;
	solutions: IndividualSolution[];
	compatible: boolean;
	approximate: boolean;
	warnings: string[];
	assumptions: ModelAssumptions;
}

/* ------------------------------------------------------------------ */
/* Punnett squares                                                     */
/* ------------------------------------------------------------------ */

export interface Gamete {
	alleles: string;
	probability: number;
}

export interface PunnettCell {
	row: number;
	col: number;
	genotype: string;
	probability: number;
}

export interface GenotypeOutcome {
	genotype: string;
	count: number;
	probability: number;
	colorIndex: number;
}

export interface PunnettResult {
	loci: string[];
	parent1: string;
	parent2: string;
	gametes1: Gamete[];
	gametes2: Gamete[];
	cells: PunnettCell[];
	outcomes: GenotypeOutcome[];
	totalOutcomes: number;
}

/* ------------------------------------------------------------------ */
/* Sequences                                                           */
/* ------------------------------------------------------------------ */

export type SequenceType = 'dna' | 'rna';

export interface SequenceValidation {
	/** Sequence with whitespace / FASTA header / numbering removed. */
	sequence: string;
	type: SequenceType;
	detectedType: SequenceType | 'ambiguous';
	invalid: { index: number; char: string }[];
	originalLength: number;
	cleanedLength: number;
	hasFastaHeader: boolean;
	lineBreaksRemoved: number;
	strippedNonLetters: number;
}

export interface AminoAcid {
	code1: string;
	code3: string;
	name: string;
	isStop: boolean;
}

export interface CodonBlock {
	codon: string;
	bases: string[];
	aminoAcid: AminoAcid;
	/** 0-based codon index inside the reading frame. */
	index: number;
	/** 0-based nucleotide offset in the displayed strand. */
	offset: number;
}

export interface OrfRegion {
	id: string;
	label: string;
	customLabel?: string;
	frame: number;
	strand: 'forward' | 'reverse';
	/** 0-based inclusive nucleotide offsets on the displayed strand. */
	start: number;
	end: number;
	codons: CodonBlock[];
	proteinLength: number;
	complete: boolean;
}

export interface UntranslatedRegion {
	kind: 'untranslated';
	id: string;
	start: number;
	end: number;
	bases: string[];
	reason: string;
}

export interface TranslationResult {
	sequence: string;
	type: SequenceType;
	regions: OrfRegion[];
	untranslated: UntranslatedRegion[];
	/** Codon count of the analysed frame(s). */
	totalCodons: number;
	warnings: string[];
	strand: 'forward' | 'reverse' | 'both';
	frame: number | 'all';
}
