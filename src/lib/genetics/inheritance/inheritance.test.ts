import { describe, expect, it } from 'vitest';
import type { Individual, InheritanceModel, ObservedStatus, Pedigree, Sex } from '../../types/genetics';
import {
	carriesVariant,
	displayPhenotypeLabel,
	formatGenotype,
	parseGenotype,
	phenotypeOf,
	remapGenotype,
	statesForSex,
	transmit,
	variantAlleleCount
} from './model-spec';
import { analyzePedigree, solvePedigree } from './analysis';

function ind(
	id: string,
	sex: Sex,
	status: ObservedStatus,
	extra: Partial<Individual> = {}
): Individual {
	return { id, label: id, sex, status, position: { x: 0, y: 0 }, ...extra };
}

function couple(
	father: Individual,
	mother: Individual,
	children: Individual[]
): Pedigree {
	const ids = new Set([father.id, mother.id, ...children.map((c) => c.id)]);
	return {
		individuals: [father, mother, ...children].filter(
			(c, i, all) => all.findIndex((x) => x.id === c.id) === i && ids.has(c.id)
		),
		partnerships: [{ id: 'P1', parents: [father.id, mother.id] }],
		children: children.map((c) => ({ childId: c.id, partnershipId: 'P1' }))
	};
}

function probabilities(entries: Array<[string, number]>): Record<string, number> {
	return Object.fromEntries(entries);
}

describe('transmission rules', () => {
	it('autosomal dominant Gg x gg gives 50% affected, no carriers', () => {
		const p = probabilities(transmit('autosomal-dominant', 'Dd', 'dd', 'male'));
		expect(p.Dd).toBeCloseTo(0.5, 10);
		expect(p.dd).toBeCloseTo(0.5, 10);
		expect(p.DD).toBeUndefined();
	});

	it('autosomal recessive Gg x Gg gives 1:2:1', () => {
		const p = probabilities(transmit('autosomal-recessive', 'Dd', 'Dd', 'female'));
		expect(p.DD).toBeCloseTo(0.25, 10);
		expect(p.Dd).toBeCloseTo(0.5, 10);
		expect(p.dd).toBeCloseTo(0.25, 10);
	});

	it('X-linked recessive carrier mother x unaffected father', () => {
		const sons = probabilities(transmit('x-linked-recessive', 'M:d', 'F:Dd', 'male'));
		expect(sons['M:D']).toBeCloseTo(0.5, 10);
		expect(sons['M:d']).toBeCloseTo(0.5, 10);

		const daughters = probabilities(transmit('x-linked-recessive', 'M:d', 'F:Dd', 'female'));
		expect(daughters['F:Dd']).toBeCloseTo(0.5, 10);
		expect(daughters['F:dd']).toBeCloseTo(0.5, 10);
		expect(daughters['F:DD']).toBeUndefined();
	});

	it('X-linked dominant affected father transmits to all daughters and no sons', () => {
		const daughters = probabilities(transmit('x-linked-dominant', 'M:D', 'F:dd', 'female'));
		expect(daughters['F:Dd']).toBeCloseTo(1, 10);

		const sons = probabilities(transmit('x-linked-dominant', 'M:D', 'F:dd', 'male'));
		expect(sons['M:d']).toBeCloseTo(1, 10);
	});

	it('Y-linked is transmitted to sons and never to daughters', () => {
		const sons = probabilities(transmit('y-linked', 'M:V', 'F:none', 'male'));
		expect(sons['M:V']).toBeCloseTo(1, 10);

		const daughters = probabilities(transmit('y-linked', 'M:V', 'F:none', 'female'));
		expect(daughters['F:none']).toBeCloseTo(1, 10);
		expect(daughters['M:V']).toBeUndefined();
	});

	it('X-linked sons cannot be produced by two XX parents', () => {
		const sons = transmit('x-linked-recessive', 'F:dd', 'F:DD', 'male');
		expect(sons).toHaveLength(0);
	});
});

describe('phenotype classification', () => {
	it('a male with one X-linked recessive allele is affected, not a carrier', () => {
		expect(phenotypeOf('x-linked-recessive', 'M:D')).toBe('affected');
		expect(phenotypeOf('x-linked-recessive', 'M:d')).toBe('unaffected');
		expect(phenotypeOf('x-linked-recessive', 'F:Dd')).toBe('carrier');
		expect(phenotypeOf('x-linked-recessive', 'F:DD')).toBe('affected');
		expect(phenotypeOf('x-linked-recessive', 'F:dd')).toBe('unaffected');
	});

	it('the variant allele is the uppercase letter in every model', () => {
		expect(phenotypeOf('autosomal-recessive', 'DD')).toBe('affected');
		expect(phenotypeOf('autosomal-recessive', 'Dd')).toBe('carrier');
		expect(phenotypeOf('autosomal-recessive', 'dd')).toBe('unaffected');
	});

	it('dominant heterozygotes are affected under complete penetrance', () => {
		expect(phenotypeOf('autosomal-dominant', 'Dd')).toBe('affected');
		expect(phenotypeOf('x-linked-dominant', 'F:Dd')).toBe('affected');
	});

	it('the Gg-as-carrier display convention does not change the phenotype', () => {
		expect(displayPhenotypeLabel('autosomal-dominant', 'Dd', true)).toBe('carrier');
		expect(phenotypeOf('autosomal-dominant', 'Dd')).toBe('affected');
	});
});

describe('solver', () => {
	it('computes 50% affected for a child of Gg x gg under autosomal dominant', () => {
		const father = ind('f', 'male', 'affected', { genotype: 'Dd' });
		const mother = ind('m', 'female', 'unaffected');
		const child = ind('c', 'female', 'unknown');
		const result = solvePedigree(couple(father, mother, [child]), 'autosomal-dominant');
		const solution = result.solutions.find((s) => s.individualId === 'c');

		expect(solution).toBeDefined();
		expect(solution!.status.affected).toBeCloseTo(0.5, 6);
		expect(solution!.status.carrier).toBeCloseTo(0, 10);
		expect(solution!.status.unaffected).toBeCloseTo(0.5, 6);
		expect(result.compatible).toBe(true);
	});

	it('accounts for sex in X-linked recessive offspring', () => {
		const mother = ind('m', 'female', 'unknown', { carrier: 'carrier' });
		const father = ind('f', 'male', 'unaffected');
		const child = ind('c', 'unknown', 'unknown');
		const result = solvePedigree(couple(father, mother, [child]), 'x-linked-recessive');
		const solution = result.solutions.find((s) => s.individualId === 'c')!;

		expect(solution.status.affected).toBeCloseTo(0.25, 6);
		expect(solution.status.carrier).toBeCloseTo(0.25, 6);
		expect(solution.status.unaffected).toBeCloseTo(0.5, 6);
	});

	it('never overwrites an observed phenotype', () => {
		const father = ind('f', 'male', 'affected', { genotype: 'Dd' });
		const mother = ind('m', 'female', 'unaffected');
		const child = ind('c', 'male', 'affected');
		const result = solvePedigree(couple(father, mother, [child]), 'autosomal-dominant');
		const solution = result.solutions.find((s) => s.individualId === 'c')!;

		expect(solution.observed).toBe(true);
		expect(solution.status.affected).toBeCloseTo(1, 6);
	});

	it('uses the whole family rather than only the parents', () => {
		// Grandparents: affected grandfather (Dd), unaffected grandmother (dd).
		// Daughter is unaffected, so she must be dd; her child cannot be affected.
		const gf = ind('gf', 'male', 'affected', { genotype: 'Dd' });
		const gm = ind('gm', 'female', 'unaffected');
		const daughter = ind('d', 'female', 'unaffected');
		const partner = ind('p', 'male', 'unaffected');
		const grandchild = ind('gc', 'male', 'unknown');

		const pedigree: Pedigree = {
			individuals: [gf, gm, daughter, partner, grandchild],
			partnerships: [
				{ id: 'P1', parents: ['gf', 'gm'] },
				{ id: 'P2', parents: ['p', 'd'] }
			],
			children: [
				{ childId: 'd', partnershipId: 'P1' },
				{ childId: 'gc', partnershipId: 'P2' }
			]
		};

		const result = solvePedigree(pedigree, 'autosomal-dominant');
		const solution = result.solutions.find((s) => s.individualId === 'gc')!;
		expect(solution.status.affected).toBeCloseTo(0, 8);
		expect(solution.status.unaffected).toBeCloseTo(1, 8);
	});

	it('flags a model that the observations contradict', () => {
		const mother = ind('m', 'female', 'affected');
		const father = ind('f', 'male', 'unaffected');
		const result = solvePedigree(couple(father, mother, []), 'y-linked');
		expect(result.compatible).toBe(false);
	});
});

describe('meaning of "unaffected"', () => {
	const carrierCouple = () =>
		couple(
			ind('f', 'male', 'unknown', { carrier: 'carrier', genotype: 'Dd' }),
			ind('m', 'female', 'unknown', { carrier: 'carrier', genotype: 'Dd' }),
			[ind('c', 'female', 'unaffected')]
		);

	it('allows an unaffected child of two carriers to be a carrier by default', () => {
		const result = solvePedigree(carrierCouple(), 'autosomal-recessive');
		const child = result.solutions.find((s) => s.individualId === 'c')!;
		expect(child.status.carrier).toBeCloseTo(2 / 3, 6);
		expect(child.status.unaffected).toBeCloseTo(1 / 3, 6);
	});

	it('excludes carriers when unaffected is taken to mean not a carrier', () => {
		const result = solvePedigree(carrierCouple(), 'autosomal-recessive', {
			unaffectedMeansNonCarrier: true
		});
		const child = result.solutions.find((s) => s.individualId === 'c')!;
		expect(child.status.carrier).toBeCloseTo(0, 6);
		expect(child.status.unaffected).toBeCloseTo(1, 6);
	});

	it('accepts an affected carrier as a dominant heterozygote', () => {
		const father = ind('f', 'male', 'affected');
		const mother = ind('m', 'female', 'unaffected');
		const child = ind('c', 'female', 'affected', { carrier: 'carrier' });
		const result = solvePedigree(couple(father, mother, [child]), 'autosomal-dominant');
		const solution = result.solutions.find((s) => s.individualId === 'c')!;

		expect(solution.genotypes[0].genotype).toBe('Dd');
		expect(solution.status.affected).toBeCloseTo(1, 6);
	});

	it('a non-carrier finding excludes every variant allele', () => {
		const father = ind('f', 'male', 'unknown');
		const mother = ind('m', 'female', 'unknown');
		const child = ind('c', 'male', 'unaffected', { carrier: 'non-carrier' });
		const result = solvePedigree(couple(father, mother, [child]), 'autosomal-recessive');
		const solution = result.solutions.find((s) => s.individualId === 'c')!;

		expect(solution.genotypes[0].genotype).toBe('dd');
	});

	it('changes model compatibility in the analyzer', () => {
		const pedigree = couple(
			ind('f', 'male', 'affected'),
			ind('m', 'female', 'unaffected'),
			[ind('c', 'female', 'affected')]
		);
		const permissive = analyzePedigree(pedigree, { enabledModels: ['autosomal-recessive'] });
		const strict = analyzePedigree(pedigree, {
			enabledModels: ['autosomal-recessive'],
			unaffectedMeansNonCarrier: true
		});

		expect(permissive.incompatible).toBe(false);
		expect(strict.incompatible).toBe(true);
		expect(strict.assumptions.unaffectedMeaning).toMatch(/not a carrier/i);
	});
});

describe('analyzer', () => {
	const buildMaleToMale = (): Pedigree =>
		couple(
			ind('f', 'male', 'affected'),
			ind('m', 'female', 'unaffected'),
			[ind('s', 'male', 'affected'), ind('d', 'female', 'unaffected')]
		);

	it('returns a normalised posterior over every enabled model', () => {
		const result = analyzePedigree(buildMaleToMale());
		const total = result.results.reduce((sum, r) => sum + r.posterior, 0);
		expect(total).toBeCloseTo(1, 9);
		expect(result.results).toHaveLength(5);
		expect(result.incompatible).toBe(false);
	});

	it('gives zero posterior to X-linked dominant when male-to-male transmission is observed', () => {
		const result = analyzePedigree(buildMaleToMale());
		const xd = result.results.find((r) => r.model === 'x-linked-dominant')!;
		expect(xd.compatible).toBe(false);
		expect(xd.posterior).toBe(0);
	});

	it('ranks Y-linked highest for an affected father with an affected son and unaffected daughter', () => {
		const result = analyzePedigree(buildMaleToMale());
		expect(result.topModel).toBe('y-linked');
	});

	it('excluded models do not contribute to the posterior', () => {
		const enabled: InheritanceModel[] = ['autosomal-dominant', 'autosomal-recessive'];
		const result = analyzePedigree(buildMaleToMale(), { enabledModels: enabled });
		expect(result.results.map((r) => r.model).sort()).toEqual([...enabled].sort());
		expect(result.results.reduce((s, r) => s + r.posterior, 0)).toBeCloseTo(1, 9);
	});

	it('reports incompatibility instead of inventing an answer', () => {
		// An affected female cannot be explained by Y-linked inheritance.
		const result = analyzePedigree(couple(ind('f', 'male', 'unaffected'), ind('m', 'female', 'affected'), []), {
			enabledModels: ['y-linked']
		});
		expect(result.incompatible).toBe(true);
		expect(result.topModel).toBeNull();
		expect(result.results.every((r) => r.posterior === 0)).toBe(true);
	});

	it('marks a genuinely ambiguous pedigree as inconclusive', () => {
		const result = analyzePedigree(couple(ind('f', 'male', 'unaffected'), ind('m', 'female', 'unaffected'), []));
		expect(result.inconclusive).toBe(true);
		expect(result.topPosterior).toBeLessThan(0.6);
	});

	it('changing the allele frequency changes the posterior but not the structure', () => {
		const a = analyzePedigree(buildMaleToMale(), { alleleFrequency: 0.01 });
		const b = analyzePedigree(buildMaleToMale(), { alleleFrequency: 0.2 });
		const ya = a.results.find((r) => r.model === 'y-linked')!;
		const yb = b.results.find((r) => r.model === 'y-linked')!;
		expect(ya.posterior).not.toBeCloseTo(yb.posterior, 4);
		expect(a.results).toHaveLength(b.results.length);
	});
});

describe('genotype parsing', () => {
	it('accepts conventional notation', () => {
		expect(parseGenotype('Gg', 'autosomal-dominant', 'female')).toBe('Dd');
		expect(parseGenotype('gG', 'autosomal-recessive', 'male')).toBe('Dd');
		expect(parseGenotype('GG', 'autosomal-recessive', 'male')).toBe('DD');
	});

	it('requires a sex for sex-linked genotypes', () => {
		expect(parseGenotype('Gg', 'x-linked-recessive', 'female')).toBe('F:Dd');
		expect(parseGenotype('G', 'x-linked-recessive', 'male')).toBe('M:D');
		expect(parseGenotype('Gg', 'x-linked-recessive', 'unknown')).toBeNull();
	});
});

describe('genotype display letter', () => {
	it('rewrites the engine genotype into the configured letter', () => {
		expect(remapGenotype('Dd', 'G')).toBe('Gg');
		expect(remapGenotype('DD', 'A')).toBe('AA');
		expect(remapGenotype('dd', 't')).toBe('tt');
		expect(remapGenotype('none', 'G')).toBe('none');
	});

	it('drops the sex prefix and marks an absent chromosome', () => {
		expect(formatGenotype('F:DD')).toBe('DD');
		expect(formatGenotype('M:D')).toBe('D');
		expect(formatGenotype('M:V')).toBe('V');
		expect(formatGenotype('F:none')).toBe('—');
	});

	it('can spell out the chromosome of a hemizygous male', () => {
		expect(formatGenotype('M:D', { sex: true })).toBe('D (XY)');
		expect(formatGenotype('M:V', { sex: true })).toBe('V (Y)');
		expect(formatGenotype('F:DD', { sex: true })).toBe('DD');
		expect(formatGenotype('Dd', { sex: true })).toBe('Dd');
	});

	it('counts variant alleles in every model', () => {
		expect(variantAlleleCount('autosomal-recessive', 'DD')).toBe(2);
		expect(carriesVariant('autosomal-recessive', 'Dd')).toBe(true);
		expect(variantAlleleCount('autosomal-recessive', 'dd')).toBe(0);
		expect(carriesVariant('x-linked-recessive', 'M:D')).toBe(true);
		expect(carriesVariant('x-linked-recessive', 'M:d')).toBe(false);
	});
});

describe('state spaces', () => {
	it('exposes the right number of states per sex', () => {
		expect(statesForSex('autosomal-dominant', 'male')).toHaveLength(3);
		expect(statesForSex('x-linked-recessive', 'male')).toHaveLength(2);
		expect(statesForSex('x-linked-recessive', 'female')).toHaveLength(3);
		expect(statesForSex('x-linked-recessive', 'unknown')).toHaveLength(5);
		expect(statesForSex('y-linked', 'female')).toHaveLength(1);
		expect(statesForSex('y-linked', 'unknown')).toHaveLength(3);
	});
});
