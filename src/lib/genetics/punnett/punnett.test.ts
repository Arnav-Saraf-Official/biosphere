import { describe, expect, it } from 'vitest';
import { buildPunnett, canonicalGenotype, colorIndexFor, combineGametes, parseParentGenotype } from './punnett';

describe('genotype parsing', () => {
	it('canonicalises allele order', () => {
		expect(canonicalGenotype('aA')).toBe('Aa');
		expect(canonicalGenotype('bBaA')).toBe('AaBb');
		expect(canonicalGenotype('BBAA')).toBe('AABB');
		// "bA" pairs two different genes and must be rejected.
		expect(parseParentGenotype('bA').ok).toBe(false);
	});

	it('rejects mismatched pairs and odd lengths', () => {
		expect(parseParentGenotype('Ab').ok).toBe(false);
		expect(parseParentGenotype('A').ok).toBe(false);
		expect(parseParentGenotype('AaAa').ok).toBe(false);
	});
});

describe('Punnett squares', () => {
	it('Aa x Aa produces 1:2:1 and a 2x2 grid', () => {
		const result = buildPunnett('Aa', 'Aa');
		if ('error' in result) throw new Error(result.error);

		expect(result.totalOutcomes).toBe(4);
		expect(result.gametes1).toHaveLength(2);

		const byGenotype = Object.fromEntries(result.outcomes.map((o) => [o.genotype, o.probability]));
		expect(byGenotype.AA).toBeCloseTo(0.25, 10);
		expect(byGenotype.Aa).toBeCloseTo(0.5, 10);
		expect(byGenotype.aa).toBeCloseTo(0.25, 10);
	});

	it('AaBb x AaBb creates a 4x4 square', () => {
		const result = buildPunnett('AaBb', 'AaBb');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1).toHaveLength(4);
		expect(result.gametes2).toHaveLength(4);
		expect(result.totalOutcomes).toBe(16);
	});

	it('AaBbCc x AaBbCc creates an 8x8 square', () => {
		const result = buildPunnett('AaBbCc', 'AaBbCc');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1).toHaveLength(8);
		expect(result.totalOutcomes).toBe(64);
	});

	it('sums repeated outcomes into a single probability', () => {
		const result = buildPunnett('AaBb', 'AaBb');
		if ('error' in result) throw new Error(result.error);
		const aabb = result.outcomes.find((o) => o.genotype === 'aabb')!;
		expect(aabb.count).toBe(1);
		expect(aabb.probability).toBeCloseTo(1 / 16, 10);
		expect(result.outcomes.reduce((sum, o) => sum + o.probability, 0)).toBeCloseTo(1, 10);
	});

	it('highlights every cell sharing a genotype through a stable colour index', () => {
		const result = buildPunnett('AaBb', 'AaBb');
		if ('error' in result) throw new Error(result.error);

		const matching = result.cells.filter((c) => c.genotype === 'AaBb');
		expect(matching.length).toBeGreaterThan(1);
		const index = colorIndexFor(result, 'AaBb');
		for (const cell of matching) {
			expect(colorIndexFor(result, cell.genotype)).toBe(index);
		}
	});

	it('combines gametes in canonical order', () => {
		expect(combineGametes('aB', 'Ab')).toBe('AaBb');
		expect(combineGametes('AB', 'ab')).toBe('AaBb');
	});

	it('rejects parents that describe different loci', () => {
		const result = buildPunnett('Aa', 'Bb');
		expect('error' in result).toBe(true);
	});

	it('treats homozygous parents as a single gamete row', () => {
		const result = buildPunnett('AABB', 'aabb');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1).toHaveLength(1);
		expect(result.totalOutcomes).toBe(1);
		expect(result.cells[0].genotype).toBe('AaBb');
	});
});
