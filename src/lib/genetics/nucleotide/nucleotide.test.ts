import { describe, expect, it } from 'vitest';
import {
	complementSequence,
	convert,
	detectSequenceType,
	reverseComplement,
	transcribeCodingStrand,
	validateSequence
} from './complement';

describe('sequence cleaning and validation', () => {
	it('detects DNA and RNA', () => {
		expect(detectSequenceType('ACGT')).toBe('dna');
		expect(detectSequenceType('ACGU')).toBe('rna');
		expect(detectSequenceType('ACGTU')).toBe('ambiguous');
		expect(detectSequenceType('ACGN')).toBe('dna');
	});

	it('strips whitespace, digits, and FASTA headers', () => {
		const result = validateSequence('> BRCA1 fragment\n1 ACGT 12\nACGT\n');
		expect(result.sequence).toBe('ACGTACGT');
		expect(result.hasFastaHeader).toBe(true);
		expect(result.error).toBeNull();
	});

	it('reports invalid characters with their positions', () => {
		const result = validateSequence('ACGTX');
		expect(result.error).toContain('Invalid DNA character');
		expect(result.error).toContain('position 5');
		expect(result.invalid).toHaveLength(1);
		expect(result.sequence).toBe('ACGTX');
	});

	it('treats U as invalid in DNA mode and T as invalid in RNA mode', () => {
		expect(validateSequence('ACGU', { type: 'dna' }).error).not.toBeNull();
		expect(validateSequence('ACGT', { type: 'rna' }).error).not.toBeNull();
	});

	it('enforces the maximum length', () => {
		const result = validateSequence('A'.repeat(50), { maxLength: 10 });
		expect(result.isTooLong).toBe(true);
		expect(result.sequence).toHaveLength(10);
	});
});

describe('complementary conversions', () => {
	it('complements DNA', () => {
		expect(complementSequence('ATGC', 'dna', 'dna')).toBe('TACG');
	});

	it('complements RNA', () => {
		expect(complementSequence('AUGC', 'rna', 'rna')).toBe('UACG');
	});

	it('converts a DNA template into complementary RNA', () => {
		expect(complementSequence('ATGC', 'dna', 'rna')).toBe('UACG');
	});

	it('converts an RNA template into complementary DNA', () => {
		expect(complementSequence('AUGC', 'rna', 'dna')).toBe('TACG');
	});

	it('builds reverse complements', () => {
		expect(reverseComplement('ATGC', 'dna', 'dna')).toBe('GCAT');
		expect(reverseComplement('AUGG', 'rna', 'rna')).toBe('CCAU');
	});

	it('handles IUPAC ambiguity codes', () => {
		expect(complementSequence('ARYK', 'dna', 'dna')).toBe('TYRM');
		expect(complementSequence('N', 'dna', 'dna')).toBe('N');
		expect(complementSequence('SW', 'dna', 'dna')).toBe('SW');
		expect(complementSequence('BDHV', 'dna', 'dna')).toBe('VHDB');
	});

	it('transcribes a coding strand without complementing it', () => {
		expect(transcribeCodingStrand('ATGCTT')).toBe('AUGCUU');
	});

	it('preserves the original input', () => {
		const input = 'ATGC';
		convert(input, { from: 'dna', to: 'rna', mode: 'complement' });
		expect(input).toBe('ATGC');
	});

	it('reports the conversion metadata', () => {
		const result = convert('ATGC', { from: 'dna', to: 'rna', mode: 'reverse-complement' });
		expect(result.mode).toBe('reverse-complement');
		expect(result.length).toBe(4);
		expect(result.output).toBe('GCAU');
	});
});
