import { describe, expect, it } from 'vitest';
import { buildPunnett } from './punnett';

describe('Punnett grid modes', () => {
	it('keeps condensed headers deduplicated', () => {
		const result = buildPunnett('AABb', 'aabb');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1.map((gamete) => gamete.alleles)).toEqual(['AB', 'Ab']);
		expect(result.cells.length).toBe(2);
	});

	it('repeats identical gametes when expanded', () => {
		const result = buildPunnett('AABb', 'aabb', 'expanded');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1.map((gamete) => gamete.alleles)).toEqual(['AB', 'Ab', 'AB', 'Ab']);
		expect(result.gametes2.length).toBe(4);
		expect(result.cells.length).toBe(16);
		expect(result.outcomes.reduce((sum, outcome) => sum + outcome.probability, 0)).toBeCloseTo(1, 10);
	});

	it('expands a fully homozygous parent on both axes', () => {
		const result = buildPunnett('AABB', 'aabb', 'expanded');
		if ('error' in result) throw new Error(result.error);
		expect(result.gametes1.length).toBe(4);
		expect(result.gametes1.every((gamete) => gamete.alleles === 'AB')).toBe(true);
		expect(result.gametes2.length).toBe(4);
		expect(result.gametes2.every((gamete) => gamete.alleles === 'ab')).toBe(true);
		expect(result.cells.length).toBe(16);
		expect(result.outcomes).toHaveLength(1);
		expect(result.outcomes[0].genotype).toBe('AaBb');
	});
});
