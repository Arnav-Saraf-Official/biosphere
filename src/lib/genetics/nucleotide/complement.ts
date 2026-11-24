/**
 * Sequence validation and nucleotide conversion helpers.
 * Handles FASTA-style input, IUPAC ambiguity codes, and DNA/RNA detection.
 */

import type { SequenceType, SequenceValidation } from '../../types/genetics';

const DNA_IUPAC = new Set(['A', 'C', 'G', 'T', 'R', 'Y', 'K', 'M', 'S', 'W', 'B', 'D', 'H', 'V', 'N']);
const RNA_IUPAC = new Set(['A', 'C', 'G', 'U', 'R', 'Y', 'K', 'M', 'S', 'W', 'B', 'D', 'H', 'V', 'N']);

export interface CleanResult {
	sequence: string;
	fastaHeader: string | null;
	lineBreaksRemoved: number;
	strippedCharacters: number;
	/** Characters that survived cleaning but are not valid for the chosen type. */
	invalidPositions: { index: number; char: string }[];
}

/** Strip FASTA headers, numbering, whitespace and anything that is not a base. */
export function cleanSequence(input: string, type: SequenceType = 'dna'): CleanResult {
	const lines = input.split(/\r?\n/);
	let fastaHeader: string | null = null;
	let lineBreaksRemoved = 0;
	let stripped = 0;

	let sequence = '';
	for (const line of lines) {
		if (line.trim().startsWith('>')) {
			if (!fastaHeader) fastaHeader = line.trim().slice(1).trim();
			continue;
		}
		for (const char of line) {
			if (/\s/.test(char)) continue;
			if (/[0-9]/.test(char)) {
				stripped++;
				continue;
			}
			if (/[A-Za-z]/.test(char)) {
				sequence += char.toUpperCase();
			} else {
				stripped++;
			}
		}
		lineBreaksRemoved++;
	}
	if (lineBreaksRemoved > 0) lineBreaksRemoved--;

	const valid = type === 'dna' ? DNA_IUPAC : RNA_IUPAC;
	const invalidPositions: { index: number; char: string }[] = [];
	for (let i = 0; i < sequence.length; i++) {
		if (!valid.has(sequence[i])) invalidPositions.push({ index: i, char: sequence[i] });
	}

	return {
		sequence,
		fastaHeader,
		lineBreaksRemoved,
		strippedCharacters: stripped,
		invalidPositions
	};
}

export function detectSequenceType(sequence: string, fallback: SequenceType = 'dna'): SequenceType | 'ambiguous' {
	let t = 0;
	let u = 0;
	for (const char of sequence) {
		if (char === 'T') t++;
		else if (char === 'U') u++;
	}
	if (t > 0 && u === 0) return 'dna';
	if (u > 0 && t === 0) return 'rna';
	if (t === 0 && u === 0) return fallback;
	return 'ambiguous';
}

export interface ValidateOptions {
	type?: SequenceType | 'auto';
	maxLength?: number;
}

export interface ValidationResult extends SequenceValidation {
	error: string | null;
	warning: string | null;
	isTooLong: boolean;
}

export function validateSequence(input: string, options: ValidateOptions = {}): ValidationResult {
	const requested = options.type ?? 'auto';
	const rawLetters = input.replace(/[^A-Za-z]/g, '').toUpperCase();
	const detected = detectSequenceType(rawLetters, 'dna');
	const type: SequenceType =
		requested === 'auto' ? (detected === 'ambiguous' ? 'dna' : detected) : requested;

	const cleaned = cleanSequence(input, type);
	const maxLength = options.maxLength ?? 120_000;
	const isTooLong = cleaned.sequence.length > maxLength;

	let error: string | null = null;
	let warning: string | null = null;

	if (cleaned.sequence.length === 0 && input.trim().length > 0) {
		error = 'No nucleotide characters were found in the input.';
	}
	if (cleaned.invalidPositions.length > 0) {
		const preview = cleaned.invalidPositions
			.slice(0, 5)
			.map((p) => `“${p.char}” at position ${p.index + 1}`)
			.join(', ');
		error = `Invalid ${type.toUpperCase()} character${cleaned.invalidPositions.length > 1 ? 's' : ''}: ${preview}${
			cleaned.invalidPositions.length > 5 ? ', …' : ''
		}`;
	}
	if (detected === 'ambiguous' && requested === 'auto') {
		warning = 'The input contains both T and U, so the sequence type could not be detected automatically.';
	}
	if (isTooLong) {
		warning = `The sequence exceeds the configured limit of ${maxLength.toLocaleString()} nucleotides and was truncated for analysis.`;
	}

	const sequence = isTooLong ? cleaned.sequence.slice(0, maxLength) : cleaned.sequence;

	return {
		sequence,
		type,
		detectedType: detected,
		invalid: isTooLong ? cleaned.invalidPositions.filter((p) => p.index < maxLength) : cleaned.invalidPositions,
		originalLength: rawLetters.length,
		cleanedLength: sequence.length,
		hasFastaHeader: cleaned.fastaHeader !== null,
		lineBreaksRemoved: cleaned.lineBreaksRemoved,
		strippedNonLetters: cleaned.strippedCharacters,
		error,
		warning,
		isTooLong
	};
}

/* ------------------------------------------------------------------ */
/* Complement / reverse complement                                     */
/* ------------------------------------------------------------------ */

const DNA_COMPLEMENT: Record<string, string> = {
	A: 'T', T: 'A', C: 'G', G: 'C',
	R: 'Y', Y: 'R', K: 'M', M: 'K',
	S: 'S', W: 'W', B: 'V', V: 'B',
	D: 'H', H: 'D', N: 'N'
};

const RNA_COMPLEMENT: Record<string, string> = {
	A: 'U', U: 'A', C: 'G', G: 'C',
	R: 'Y', Y: 'R', K: 'M', M: 'K',
	S: 'S', W: 'W', B: 'V', V: 'B',
	D: 'H', H: 'D', N: 'N'
};

export type ConversionMode = 'complement' | 'reverse-complement' | 'transcribe-coding';

export interface ConversionOptions {
	from: SequenceType;
	to: SequenceType;
	mode: ConversionMode;
}

/** True when the source alphabet can be complemented into the target alphabet. */
export function isComplementPair(from: SequenceType, to: SequenceType): boolean {
	return true;
}

/**
 * Complement a sequence.
 *
 * DNA -> DNA : A<->T, C<->G (plus IUPAC pairs)
 * RNA -> RNA : A<->U, C<->G
 * DNA -> RNA : template DNA to complementary RNA (A->U, T->A, C->G, G->C)
 * RNA -> DNA : template RNA to complementary DNA (A->T, U->A, C->G, G->C)
 *
 * Character-level truth table: the complement is always relative to the
 * *target* alphabet. A DNA base A pairs with T; in an RNA target that partner
 * is written U.
 */
export function complementSequence(sequence: string, from: SequenceType, to: SequenceType): string {
	const source = sequence.toUpperCase();
	let out = '';
	for (const char of source) {
		if (from === 'dna' && to === 'dna') {
			out += DNA_COMPLEMENT[char] ?? char;
		} else if (from === 'rna' && to === 'rna') {
			out += RNA_COMPLEMENT[char] ?? char;
		} else if (from === 'dna' && to === 'rna') {
			// DNA template -> RNA: A->U, T->A, C->G, G->C
			if (char === 'A') out += 'U';
			else if (char === 'T') out += 'A';
			else if (char === 'C') out += 'G';
			else if (char === 'G') out += 'C';
			else if (char === 'R') out += 'Y';
			else if (char === 'Y') out += 'R';
			else if (char === 'K') out += 'M';
			else if (char === 'M') out += 'K';
			else if (char === 'S') out += 'S';
			else if (char === 'W') out += 'W';
			else if (char === 'B') out += 'V';
			else if (char === 'V') out += 'B';
			else if (char === 'D') out += 'H';
			else if (char === 'H') out += 'D';
			else if (char === 'N') out += 'N';
			else out += char;
		} else {
			// RNA -> DNA: A->T, U->A, C->G, G->C
			if (char === 'A') out += 'T';
			else if (char === 'U') out += 'A';
			else if (char === 'C') out += 'G';
			else if (char === 'G') out += 'C';
			else if (char === 'R') out += 'Y';
			else if (char === 'Y') out += 'R';
			else if (char === 'K') out += 'M';
			else if (char === 'M') out += 'K';
			else if (char === 'S') out += 'S';
			else if (char === 'W') out += 'W';
			else if (char === 'B') out += 'V';
			else if (char === 'V') out += 'B';
			else if (char === 'D') out += 'H';
			else if (char === 'H') out += 'D';
			else if (char === 'N') out += 'N';
			else out += char;
		}
	}
	return out;
}

export function reverseSequence(sequence: string): string {
	return [...sequence].reverse().join('');
}

export function reverseComplement(sequence: string, from: SequenceType, to: SequenceType): string {
	return reverseSequence(complementSequence(sequence, from, to));
}

/** Coding strand -> mRNA (transcription): T becomes U, bases unchanged. */
export function transcribeCodingStrand(sequence: string): string {
	return sequence.toUpperCase().replace(/T/g, 'U');
}

const DNA_OF_RNA: Record<string, string> = {
	A: 'T', U: 'A', C: 'G', G: 'C',
	R: 'Y', Y: 'R', K: 'M', M: 'K',
	S: 'S', W: 'W', B: 'V', V: 'B',
	D: 'H', H: 'D', N: 'N'
};

/**
 * The DNA strand that base-pairs with an RNA sequence: A->T, U->A, C->G, G->C.
 * Transcription pairs DNA `ATGC` with RNA `UACG`.
 */
export function dnaPairedWithRna(sequence: string): string {
	let out = '';
	for (const char of sequence.toUpperCase()) out += DNA_OF_RNA[char] ?? char;
	return out;
}

export interface ConversionResult {
	output: string;
	from: SequenceType;
	to: SequenceType;
	mode: ConversionMode;
	length: number;
	label: string;
}

export function convert(sequence: string, options: ConversionOptions): ConversionResult {
	const source = sequence.toUpperCase();
	let output: string;
	let label: string;

	if (options.mode === 'transcribe-coding') {
		output = transcribeCodingStrand(source);
		label = 'Coding strand → mRNA (T→U)';
	} else if (options.mode === 'reverse-complement') {
		output = reverseComplement(source, options.from, options.to);
		label = `Reverse complement (${options.from.toUpperCase()} → ${options.to.toUpperCase()})`;
	} else {
		output = complementSequence(source, options.from, options.to);
		label = `Complement (${options.from.toUpperCase()} → ${options.to.toUpperCase()})`;
	}

	return {
		output,
		from: options.from,
		to: options.to,
		mode: options.mode,
		length: output.length,
		label
	};
}
