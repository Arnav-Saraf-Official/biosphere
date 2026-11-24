import { describe, expect, it } from 'vitest';
import { aminoAcidForCodon } from './codon-table';
import { translateFrame } from './translation';
import { detectOrfs } from './orf-detection';
import { complementSequence, dnaPairedWithRna } from '../nucleotide/complement';

describe('DNA to RNA pairing', () => {
	it('pairs each DNA base with its RNA complement', () => {
		expect(complementSequence('ATGC', 'dna', 'rna')).toBe('UACG');
		expect(dnaPairedWithRna('UACG')).toBe('ATGC');
	});

	it('translates the RNA transcript produced from a DNA template', () => {
		const rna = complementSequence('TACCAT', 'dna', 'rna');
		expect(rna).toBe('AUGGUA');
		const orf = detectOrfs(rna, 'rna', { strand: 'forward', frame: 0 });
		expect(orf.regions[0].codons[0].aminoAcid.code3).toBe('Met');
		expect(orf.regions[0].codons[1].aminoAcid.code3).toBe('Val');
	});
});

describe('standard genetic code', () => {
	it('translates ATG GAA TAA', () => {
		expect(aminoAcidForCodon('ATG').code3).toBe('Met');
		expect(aminoAcidForCodon('GAA').code3).toBe('Glu');
		expect(aminoAcidForCodon('GAA').name).toBe('Glutamic acid');
		expect(aminoAcidForCodon('TAA').isStop).toBe(true);
		expect(aminoAcidForCodon('TAA').code3).toBe('Ter');
	});

	it('accepts RNA codons', () => {
		expect(aminoAcidForCodon('AUG').code3).toBe('Met');
		expect(aminoAcidForCodon('UAG').isStop).toBe(true);
	});

	it('covers all 64 codons with exactly three stops', () => {
		const bases = ['A', 'C', 'G', 'T'];
		let stops = 0;
		for (const a of bases) {
			for (const b of bases) {
				for (const c of bases) {
					const aa = aminoAcidForCodon(`${a}${b}${c}`);
					expect(aa.code3).not.toBe('Xaa');
					if (aa.isStop) stops++;
				}
			}
		}
		expect(stops).toBe(3);
	});
});

describe('frame translation', () => {
	it('stops at the first stop codon', () => {
		const summary = translateFrame('ATGGAATAA', 0, 'dna');
		expect(summary.protein.map((c) => c.aminoAcid.code3)).toEqual(['Met', 'Glu']);
		expect(summary.complete).toBe(true);
	});

	it('translates in a shifted frame', () => {
		const summary = translateFrame('CATGGAATAA', 1, 'dna');
		expect(summary.protein.map((c) => c.aminoAcid.code3)).toEqual(['Met', 'Glu']);
	});
});

describe('ORF detection', () => {
	const sequence = 'CCCATGGAATAAGGG';

	it('finds a start-anchored ORF ending at the first stop', () => {
		const result = detectOrfs(sequence, 'dna', { strand: 'forward', frame: 0 });
		expect(result.regions).toHaveLength(1);
		const [orf] = result.regions;
		expect(orf.start).toBe(3);
		expect(orf.end).toBe(12);
		expect(orf.proteinLength).toBe(2);
		expect(orf.codons.map((c) => c.aminoAcid.code3)).toEqual(['Met', 'Glu', 'Ter']);
		expect(orf.complete).toBe(true);
	});

	it('reports untranslated regions before and after the ORF', () => {
		const result = detectOrfs(sequence, 'dna', { strand: 'forward', frame: 0 });
		expect(result.untranslated).toHaveLength(2);
		expect(result.untranslated[0].start).toBe(0);
		expect(result.untranslated[0].end).toBe(3);
		expect(result.untranslated[1].start).toBe(12);
		expect(result.untranslated[1].end).toBe(15);
	});

	it('respects the minimum protein length', () => {
		const result = detectOrfs(sequence, 'dna', { strand: 'forward', frame: 0, minProteinLength: 3 });
		expect(result.regions).toHaveLength(0);
	});

	it('annotates reverse-strand ORFs separately', () => {
		const reverseSource = 'CCCTTATTCCATGGG';
		const result = detectOrfs(reverseSource, 'dna', { strand: 'both' });
		expect(result.regions.some((r) => r.strand === 'reverse')).toBe(true);
		expect(result.untranslated).toHaveLength(0);
	});

	it('handles RNA input', () => {
		const result = detectOrfs('CCCAUGGAAUAAGGG', 'rna', { strand: 'forward', frame: 0 });
		expect(result.regions).toHaveLength(1);
		expect(result.regions[0].codons[0].aminoAcid.code3).toBe('Met');
	});

	it('warns when the sequence is not a multiple of three', () => {
		const result = detectOrfs('ATGGAAT', 'dna', { strand: 'forward', frame: 0 });
		expect(result.warnings.some((w) => w.includes('multiple of three'))).toBe(true);
	});
});
