/** Codon translation helpers. */

import type { AminoAcid, CodonBlock, SequenceType } from '../../types/genetics';
import { aminoAcidForCodon, isStopCodon } from './codon-table';
import { complementSequence, reverseSequence } from '../nucleotide/complement';

export function reverseComplementFor(sequence: string, type: SequenceType): string {
	return reverseSequence(complementSequence(sequence, type, type));
}

export function makeCodonBlock(
	codon: string,
	index: number,
	offset: number
): CodonBlock {
	const aminoAcid: AminoAcid = aminoAcidForCodon(codon);
	return {
		codon,
		bases: [...codon],
		aminoAcid,
		index,
		offset
	};
}

/**
 * Split a sequence into codons starting at `frame` (0, 1 or 2).
 * A trailing partial codon is ignored.
 */
export function codonsForFrame(
	sequence: string,
	frame: number,
	type: SequenceType
): CodonBlock[] {
	void type;
	const blocks: CodonBlock[] = [];
	let index = 0;
	for (let i = frame; i + 3 <= sequence.length; i += 3) {
		blocks.push(makeCodonBlock(sequence.slice(i, i + 3), index, i));
		index++;
	}
	return blocks;
}

export interface TranslationSummary {
	blocks: CodonBlock[];
	protein: CodonBlock[];
	stops: number;
	complete: boolean;
	length: number;
}

/** Translate a whole frame, stopping at the first stop codon. */
export function translateFrame(
	sequence: string,
	frame: number,
	type: SequenceType
): TranslationSummary {
	const blocks = codonsForFrame(sequence, frame, type);
	const protein: CodonBlock[] = [];
	let stops = 0;
	let complete = false;

	for (const block of blocks) {
		if (block.aminoAcid.isStop) {
			stops++;
			complete = true;
			break;
		}
		protein.push(block);
	}

	return { blocks, protein, stops, complete, length: protein.length };
}

export function isStop(block: CodonBlock): boolean {
	return block.aminoAcid.isStop;
}


export { isStopCodon };
