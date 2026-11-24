/** Punnett square generation for independent autosomal loci. */

import type { Gamete, GenotypeOutcome, PunnettCell, PunnettResult } from '../../types/genetics';

export const MAX_LOCI = 4;
export const MAX_GAMETES = 16;

/**
 * Condensed: identical gametes share one row/column.
 * Expanded: every allele combination gets its own row/column, so a homozygous
 * parent repeats the same gamete across the header.
 */
export type PunnettMode = 'condensed' | 'expanded';

export type ParseParentResult =
	| { ok: true; loci: string[]; pairs: Record<string, [string, string]>; canonical: string }
	| { ok: false; error: string };

function canonicalPair(a: string, b: string): string {
	if (a.toLowerCase() === b.toLowerCase() && a !== b) return a.toUpperCase() + b.toLowerCase();
	return a + b;
}

export function parseParentGenotype(input: string): ParseParentResult {
	const letters = input.replace(/[^A-Za-z]/g, '');
	if (letters.length === 0) {
		return { ok: false, error: 'Enter a genotype such as Aa or AaBb.' };
	}
	if (letters.length % 2 !== 0) {
		return { ok: false, error: 'Each locus needs two alleles, for example Aa rather than A.' };
	}

	const pairs: Record<string, [string, string]> = {};
	const loci: string[] = [];

	for (let i = 0; i < letters.length; i += 2) {
		const a = letters[i];
		const b = letters[i + 1];
		if (a.toLowerCase() !== b.toLowerCase()) {
			return {
				ok: false,
				error: `“${a}${b}” pairs two different genes. Each locus is written with one letter twice, like Aa.`
			};
		}
		const locus = a.toUpperCase();
		if (pairs[locus]) {
			return { ok: false, error: `Locus ${locus} appears more than once.` };
		}
		pairs[locus] = [a, b];
		loci.push(locus);
	}

	if (loci.length > MAX_LOCI) {
		return { ok: false, error: `At most ${MAX_LOCI} loci are supported.` };
	}

	loci.sort();
	const canonical = loci.map((locus) => canonicalPair(pairs[locus][0], pairs[locus][1])).join('');
	return { ok: true, loci, pairs, canonical };
}

export function gametesOf(
	pairs: Record<string, [string, string]>,
	loci: string[],
	expanded = false
): Gamete[] {
	let combos: Gamete[] = [{ alleles: '', probability: 1 }];

	for (const locus of loci) {
		const [a, b] = pairs[locus];
		// Heterozygous means the same gene letter in two different cases (Aa).
		const heterozygous = a !== b;
		const options: Array<{ allele: string; probability: number }> = heterozygous
			? [
					{ allele: a.toUpperCase(), probability: 0.5 },
					{ allele: b.toLowerCase(), probability: 0.5 }
				]
			: expanded
				? [
						{ allele: a, probability: 0.5 },
						{ allele: b, probability: 0.5 }
					]
				: [{ allele: a, probability: 1 }];

		const next: Gamete[] = [];
		for (const combo of combos) {
			for (const option of options) {
				next.push({
					alleles: combo.alleles + option.allele,
					probability: combo.probability * option.probability
				});
			}
		}
		combos = next;
	}

	return combos;
}

/** Combine two gametes into a canonical offspring genotype. */
export function combineGametes(gamete1: string, gamete2: string): string {
	let out = '';
	for (let i = 0; i < gamete1.length; i++) {
		out += canonicalPair(gamete1[i], gamete2[i]);
	}
	return out;
}

/** Canonicalise any genotype string ("aA" -> "Aa", "BbAa" -> "AaBb"). */
export function canonicalGenotype(input: string): string {
	const parsed = parseParentGenotype(input);
	return parsed.ok ? parsed.canonical : input;
}

export interface PunnettError {
	error: string;
}

export function buildPunnett(
	parent1: string,
	parent2: string,
	mode: PunnettMode = 'condensed'
): PunnettResult | PunnettError {
	const p1 = parseParentGenotype(parent1);
	if (!p1.ok) return { error: `Parent 1: ${p1.error}` };
	const p2 = parseParentGenotype(parent2);
	if (!p2.ok) return { error: `Parent 2: ${p2.error}` };

	if (p1.loci.join(',') !== p2.loci.join(',')) {
		return {
			error: `Both parents must describe the same loci (parent 1: ${p1.canonical}, parent 2: ${p2.canonical}).`
		};
	}

	const gametes1 = gametesOf(p1.pairs, p1.loci, mode === 'expanded');
	const gametes2 = gametesOf(p2.pairs, p2.loci, mode === 'expanded');

	if (gametes1.length > MAX_GAMETES || gametes2.length > MAX_GAMETES) {
		return { error: `At most ${MAX_GAMETES} gametes per parent are supported.` };
	}

	const cells: PunnettCell[] = [];
	for (let row = 0; row < gametes1.length; row++) {
		for (let col = 0; col < gametes2.length; col++) {
			cells.push({
				row,
				col,
				genotype: combineGametes(gametes1[row].alleles, gametes2[col].alleles),
				probability: gametes1[row].probability * gametes2[col].probability
			});
		}
	}

	const grouped = new Map<string, { count: number; probability: number }>();
	for (const cell of cells) {
		const entry = grouped.get(cell.genotype) ?? { count: 0, probability: 0 };
		entry.count += 1;
		entry.probability += cell.probability;
		grouped.set(cell.genotype, entry);
	}

	const sortedKeys = [...grouped.keys()].sort();
	const outcomes: GenotypeOutcome[] = sortedKeys.map((genotype, index) => {
		const entry = grouped.get(genotype)!;
		return {
			genotype,
			count: entry.count,
			probability: entry.probability,
			colorIndex: index
		};
	});

	outcomes.sort((a, b) => b.probability - a.probability || a.genotype.localeCompare(b.genotype));

	return {
		loci: p1.loci,
		parent1: p1.canonical,
		parent2: p2.canonical,
		gametes1,
		gametes2,
		cells,
		outcomes,
		totalOutcomes: cells.length
	};
}

/** Stable palette index for a genotype within a result set. */
export function colorIndexFor(result: PunnettResult, genotype: string): number {
	const found = result.outcomes.find((o) => o.genotype === genotype);
	if (found) return found.colorIndex;
	const sorted = [...new Set(result.cells.map((c) => c.genotype))].sort();
	return Math.max(0, sorted.indexOf(genotype));
}
