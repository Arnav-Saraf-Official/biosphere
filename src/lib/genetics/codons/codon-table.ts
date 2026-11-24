/** The standard genetic code (NCBI translation table 1). */

import type { AminoAcid } from '../../types/genetics';

const AA: Record<string, AminoAcid> = {
	A: { code1: 'A', code3: 'Ala', name: 'Alanine', isStop: false },
	R: { code1: 'R', code3: 'Arg', name: 'Arginine', isStop: false },
	N: { code1: 'N', code3: 'Asn', name: 'Asparagine', isStop: false },
	D: { code1: 'D', code3: 'Asp', name: 'Aspartic acid', isStop: false },
	C: { code1: 'C', code3: 'Cys', name: 'Cysteine', isStop: false },
	Q: { code1: 'Q', code3: 'Gln', name: 'Glutamine', isStop: false },
	E: { code1: 'E', code3: 'Glu', name: 'Glutamic acid', isStop: false },
	G: { code1: 'G', code3: 'Gly', name: 'Glycine', isStop: false },
	H: { code1: 'H', code3: 'His', name: 'Histidine', isStop: false },
	I: { code1: 'I', code3: 'Ile', name: 'Isoleucine', isStop: false },
	L: { code1: 'L', code3: 'Leu', name: 'Leucine', isStop: false },
	K: { code1: 'K', code3: 'Lys', name: 'Lysine', isStop: false },
	M: { code1: 'M', code3: 'Met', name: 'Methionine', isStop: false },
	F: { code1: 'F', code3: 'Phe', name: 'Phenylalanine', isStop: false },
	P: { code1: 'P', code3: 'Pro', name: 'Proline', isStop: false },
	S: { code1: 'S', code3: 'Ser', name: 'Serine', isStop: false },
	T: { code1: 'T', code3: 'Thr', name: 'Threonine', isStop: false },
	W: { code1: 'W', code3: 'Trp', name: 'Tryptophan', isStop: false },
	Y: { code1: 'Y', code3: 'Tyr', name: 'Tyrosine', isStop: false },
	V: { code1: 'V', code3: 'Val', name: 'Valine', isStop: false },
	'*': { code1: '*', code3: 'Ter', name: 'Stop codon', isStop: true }
};

const CODON_AA: Record<string, keyof typeof AA> = {
	TTT: 'F', TTC: 'F', TTA: 'L', TTG: 'L',
	CTT: 'L', CTC: 'L', CTA: 'L', CTG: 'L',
	ATT: 'I', ATC: 'I', ATA: 'I', ATG: 'M',
	GTT: 'V', GTC: 'V', GTA: 'V', GTG: 'V',
	TCT: 'S', TCC: 'S', TCA: 'S', TCG: 'S',
	CCT: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
	ACT: 'T', ACC: 'T', ACA: 'T', ACG: 'T',
	GCT: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
	TAT: 'Y', TAC: 'Y', TAA: '*', TAG: '*',
	CAT: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
	AAT: 'N', AAC: 'N', AAA: 'K', AAG: 'K',
	GAT: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
	TGT: 'C', TGC: 'C', TGA: '*', TGG: 'W',
	CGT: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
	AGT: 'S', AGC: 'S', AGA: 'R', AGG: 'R',
	GGT: 'G', GGC: 'G', GGA: 'G', GGG: 'G'
};

export const STOP_AA: AminoAcid = AA['*'];
export const UNKNOWN_AA: AminoAcid = {
	code1: 'X',
	code3: 'Xaa',
	name: 'Unknown amino acid',
	isStop: false
};

/** Normalise a codon to DNA alphabet for table lookup. */
export function codonKey(codon: string): string {
	return codon.toUpperCase().replace(/U/g, 'T');
}

export function aminoAcidForCodon(codon: string): AminoAcid {
	const key = codonKey(codon);
	const symbol = CODON_AA[key];
	if (!symbol) return UNKNOWN_AA;
	return AA[symbol];
}

export const START_CODONS_DNA = ['ATG'];
export const START_CODONS_RNA = ['AUG'];
export const STOP_CODONS_DNA = ['TAA', 'TAG', 'TGA'];
export const STOP_CODONS_RNA = ['UAA', 'UAG', 'UGA'];

export function isStartCodon(codon: string, type: 'dna' | 'rna'): boolean {
	return type === 'dna' ? codon === 'ATG' : codon === 'AUG';
}

export function isStopCodon(codon: string, type: 'dna' | 'rna'): boolean {
	return type === 'dna'
		? STOP_CODONS_DNA.includes(codon)
		: STOP_CODONS_RNA.includes(codon);
}

/** All 64 codons with their amino acids (used by the reference panel). */
export const CODON_TABLE: Array<{ codon: string; aminoAcid: AminoAcid }> = Object.keys(CODON_AA)
	.sort()
	.map((codon) => ({ codon, aminoAcid: AA[CODON_AA[codon]] }));
