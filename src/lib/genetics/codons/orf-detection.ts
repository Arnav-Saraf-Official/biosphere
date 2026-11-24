/**
 * Open reading frame detection on one or both strands.
 * This is ORF finding, not gene annotation — it intentionally makes no claims
 * about splicing, regulatory elements, or which ORF is biologically real.
 */

import type { CodonBlock, OrfRegion, SequenceType, TranslationResult, UntranslatedRegion } from '../../types/genetics';
import { isStartCodon, isStopCodon } from './codon-table';
import { makeCodonBlock, reverseComplementFor } from './translation';

export interface OrfOptions {
	/** Minimum number of amino acids (stop codon excluded). */
	minProteinLength?: number;
	strand?: 'forward' | 'reverse' | 'both';
	frame?: number | 'all';
	/** When false, every codon-run is reported, not just start-anchored ORFs. */
	requireStart?: boolean;
}

const DEFAULT_MIN_LENGTH = 1;

interface ScanResult {
	regions: OrfRegion[];
	covered: Array<[number, number]>;
}

function scanStrand(
	sequence: string,
	type: SequenceType,
	frames: number[],
	strand: 'forward' | 'reverse',
	minLength: number,
	startCounter: number,
	requireStart: boolean
): ScanResult {
	const regions: OrfRegion[] = [];
	const covered: Array<[number, number]> = [];
	let counter = startCounter;

	for (const frame of frames) {
		let i = frame;
		while (i + 3 <= sequence.length) {
			const codon = sequence.slice(i, i + 3);
			const starter = requireStart ? isStartCodon(codon, type) : true;
			if (!starter) {
				i += 3;
				continue;
			}

			const codons: CodonBlock[] = [];
			let j = i;
			let complete = false;
			while (j + 3 <= sequence.length) {
				const current = sequence.slice(j, j + 3);
				codons.push(makeCodonBlock(current, (j - i) / 3, j));
				j += 3;
				if (isStopCodon(current, type)) {
					complete = true;
					break;
				}
			}

			const proteinLength = codons.filter((c) => !c.aminoAcid.isStop).length;
			const end = i + codons.length * 3;

			if (codons.length > 0 && proteinLength >= minLength) {
				regions.push({
					id: `orf-${counter}`,
					label: `Predicted ORF ${counter}`,
					frame,
					strand,
					start: i,
					end,
					codons,
					proteinLength,
					complete
				});
				counter++;
				covered.push([i, end]);
			}

			if (!complete) break;
			i = end;
		}
	}

	return { regions, covered };
}

function buildUntranslated(
	sequence: string,
	covered: Array<[number, number]>
): UntranslatedRegion[] {
	const sorted = [...covered].sort((a, b) => a[0] - b[0]);
	const gaps: UntranslatedRegion[] = [];
	let cursor = 0;
	let index = 0;

	const push = (start: number, end: number, reason: string) => {
		if (end <= start) return;
		gaps.push({
			kind: 'untranslated',
			id: `utr-${index++}`,
			start,
			end,
			bases: [...sequence.slice(start, end)],
			reason
		});
	};

	for (const [start, end] of sorted) {
		if (start > cursor) {
			push(cursor, start, cursor === 0 ? 'Before the first detected ORF' : 'Between detected ORFs');
		}
		cursor = Math.max(cursor, end);
	}
	if (cursor < sequence.length) push(cursor, sequence.length, 'After the last detected ORF');

	return gaps;
}

export function detectOrfs(
	sequence: string,
	type: SequenceType,
	options: OrfOptions = {}
): TranslationResult {
	const minLength = Math.max(1, options.minProteinLength ?? DEFAULT_MIN_LENGTH);
	const strand = options.strand ?? 'forward';
	const frames =
		options.frame === 'all' || options.frame === undefined
			? [0, 1, 2]
			: [Math.max(0, Math.min(2, Math.floor(options.frame)))];
	const requireStart = options.requireStart ?? true;

	const warnings: string[] = [];
	const strands: Array<'forward' | 'reverse'> =
		strand === 'both' ? ['forward', 'reverse'] : [strand];

	const regions: OrfRegion[] = [];
	let coveredByStrand: Array<[number, number]> = [];
	let displayedSequence = sequence;
	let counter = 1;

	for (const current of strands) {
		const analysed =
			current === 'forward' ? sequence : reverseComplementFor(sequence, type);
		const result = scanStrand(analysed, type, frames, current, minLength, counter, requireStart);
		counter += result.regions.length;
		regions.push(...result.regions);
		if (current === strands[0]) {
			coveredByStrand = result.covered;
			displayedSequence = analysed;
		}
	}

	if (strands.length > 1) {
		warnings.push(
			'Untranslated regions are not shown in all-six-frame mode because ORFs from different strands overlap.'
		);
	}

	if (sequence.length % 3 !== 0) {
		warnings.push(
			'The sequence length is not a multiple of three; trailing nucleotides cannot form a complete codon.'
		);
	}

	const untranslated =
		strands.length === 1 ? buildUntranslated(displayedSequence, coveredByStrand) : [];

	if (regions.length === 0) {
		warnings.push('No open reading frames matched the current settings.');
	}

	return {
		sequence: displayedSequence,
		type,
		regions,
		untranslated,
		totalCodons: Math.floor(sequence.length / 3),
		warnings,
		strand,
		frame: options.frame ?? 'all'
	};
}
