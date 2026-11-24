import type { CarrierDisplay, InheritanceModel } from '../types/genetics';

export const SETTINGS_KEY = 'biosphere.settings.v1';
export const DATA_VERSION = 1;

export interface GeneSettings {
	showProteins: boolean;
	showUntranslated: boolean;
	readingMode: 'orf' | 'frame';
	strand: 'forward' | 'reverse' | 'both';
	frame: number | 'all';
	minProteinLength: number;
}

export interface Settings {
	theme: 'light' | 'dark' | 'system';
	enabledModels: InheritanceModel[];
	showGenotypes: boolean;
	/** Letter used for genotypes across the whole pedigree, e.g. "G" -> Gg. */
	alleleLetter: string;
	/** When carriers get the standard half-shaded symbol. */
	carrierDisplay: CarrierDisplay;
	/** Spell out the chromosome beside a hemizygous male's single-letter genotype. */
	showSexInGenotype: boolean;
	heterozygoteAsCarrier: boolean;
	/** True when "unaffected" also rules out carrier status in the engine. */
	unaffectedMeansNonCarrier: boolean;
	alleleFrequency: number;
	maxSequenceLength: number;
	gene: GeneSettings;
}

export const ALL_MODELS: InheritanceModel[] = [
	'autosomal-dominant',
	'autosomal-recessive',
	'x-linked-dominant',
	'x-linked-recessive',
	'y-linked'
];

export const DEFAULT_SETTINGS: Settings = {
	theme: 'system',
	enabledModels: [...ALL_MODELS],
	showGenotypes: true,
	alleleLetter: 'G',
	carrierDisplay: 'recessive-only',
	showSexInGenotype: false,
	heterozygoteAsCarrier: false,
	unaffectedMeansNonCarrier: false,
	alleleFrequency: 0.01,
	maxSequenceLength: 120_000,
	gene: {
		showProteins: true,
		showUntranslated: true,
		readingMode: 'orf',
		strand: 'forward',
		frame: 'all',
		minProteinLength: 1
	}
};

function coerce(raw: unknown): Settings {
	const base: Settings = {
		...DEFAULT_SETTINGS,
		gene: { ...DEFAULT_SETTINGS.gene },
		enabledModels: [...DEFAULT_SETTINGS.enabledModels]
	};
	if (!raw || typeof raw !== 'object') return base;
	const input = raw as Partial<Settings>;

	if (input.theme === 'light' || input.theme === 'dark' || input.theme === 'system') {
		base.theme = input.theme;
	}
	if (Array.isArray(input.enabledModels)) {
		const models = input.enabledModels.filter((m): m is InheritanceModel =>
			ALL_MODELS.includes(m as InheritanceModel)
		);
		if (models.length > 0) base.enabledModels = [...new Set(models)];
	}
	if (typeof input.showGenotypes === 'boolean') base.showGenotypes = input.showGenotypes;
	if (typeof input.alleleLetter === 'string' && /^[A-Za-z]$/.test(input.alleleLetter.trim())) {
		base.alleleLetter = input.alleleLetter.trim().toUpperCase();
	}
	if (
		input.carrierDisplay === 'recessive-only' ||
		input.carrierDisplay === 'always' ||
		input.carrierDisplay === 'never'
	) {
		base.carrierDisplay = input.carrierDisplay;
	}
	if (typeof input.showSexInGenotype === 'boolean') {
		base.showSexInGenotype = input.showSexInGenotype;
	}
	if (typeof input.heterozygoteAsCarrier === 'boolean') {
		base.heterozygoteAsCarrier = input.heterozygoteAsCarrier;
	}
	if (typeof input.unaffectedMeansNonCarrier === 'boolean') {
		base.unaffectedMeansNonCarrier = input.unaffectedMeansNonCarrier;
	}
	if (typeof input.alleleFrequency === 'number' && input.alleleFrequency > 0 && input.alleleFrequency < 1) {
		base.alleleFrequency = input.alleleFrequency;
	}
	if (typeof input.maxSequenceLength === 'number' && input.maxSequenceLength >= 1000) {
		base.maxSequenceLength = Math.min(2_000_000, Math.round(input.maxSequenceLength));
	}
	if (input.gene && typeof input.gene === 'object') {
		base.gene = { ...base.gene, ...input.gene };
	}
	return base;
}

function readSettings(): Settings {
	if (typeof localStorage === 'undefined') return coerce(null);
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return coerce(null);
		return coerce(JSON.parse(raw));
	} catch {
		return coerce(null);
	}
}

export const settings = $state<Settings>(readSettings());

export function persistSettings(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch {
		// Storage can be full or blocked; the app still works in memory.
	}
}

export function setEnabledModel(model: InheritanceModel, enabled: boolean): boolean {
	const current = new Set(settings.enabledModels);
	if (enabled) current.add(model);
	else current.delete(model);
	if (current.size === 0) return false; // at least one model must stay enabled
	settings.enabledModels = ALL_MODELS.filter((m) => current.has(m));
	persistSettings();
	return true;
}

export function resetSettings(): void {
	const fresh = coerce(null);
	settings.theme = fresh.theme;
	settings.enabledModels = fresh.enabledModels;
	settings.showGenotypes = fresh.showGenotypes;
	settings.alleleLetter = fresh.alleleLetter;
	settings.carrierDisplay = fresh.carrierDisplay;
	settings.showSexInGenotype = fresh.showSexInGenotype;
	settings.heterozygoteAsCarrier = fresh.heterozygoteAsCarrier;
	settings.unaffectedMeansNonCarrier = fresh.unaffectedMeansNonCarrier;
	settings.alleleFrequency = fresh.alleleFrequency;
	settings.maxSequenceLength = fresh.maxSequenceLength;
	settings.gene = fresh.gene;
	persistSettings();
}
