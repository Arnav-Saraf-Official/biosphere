import { describe, expect, it } from 'vitest';
import type { Individual, Pedigree, Sex } from '../../types/genetics';
import {
	canAttachChild,
	cleanupPedigree,
	generationRowY,
	nearestGenerationRow,
	sameSexCouple,
	validatePedigree
} from './pedigree-graph';

function person(id: string, sex: Sex, x = 100, y = 56): Individual {
	return { id, label: id.toUpperCase(), sex, status: 'unknown', position: { x, y } };
}

function family(overrides: Partial<Pedigree> = {}): Pedigree {
	return {
		individuals: [
			person('a', 'male', 100, 56),
			person('b', 'female', 300, 56),
			person('c', 'unknown', 200, 210)
		],
		partnerships: [{ id: 'p1', parents: ['a', 'b'] }],
		children: [{ childId: 'c', partnershipId: 'p1' }],
		...overrides
	};
}

describe('generation rows', () => {
	it('spaces rows evenly from the first row', () => {
		expect(generationRowY(0)).toBe(56);
		expect(generationRowY(1) - generationRowY(0)).toBe(154);
		expect(generationRowY(3) - generationRowY(2)).toBe(154);
	});

	it('snaps a loose y coordinate to the closest row', () => {
		const pedigree = family();
		expect(nearestGenerationRow(pedigree, 100)).toBe(generationRowY(0));
		expect(nearestGenerationRow(pedigree, 200)).toBe(generationRowY(1));
		expect(nearestGenerationRow(pedigree, 400)).toBe(generationRowY(2));
	});

	it('never snaps above the first row or more than one row below the deepest', () => {
		const pedigree = family();
		expect(nearestGenerationRow(pedigree, -500)).toBe(generationRowY(0));
		expect(nearestGenerationRow(pedigree, 5000)).toBe(generationRowY(2));
	});

	it('puts the first person in generation I wherever the click lands', () => {
		const empty: Pedigree = { individuals: [], partnerships: [], children: [] };
		expect(nearestGenerationRow(empty, -500)).toBe(generationRowY(0));
		expect(nearestGenerationRow(empty, 400)).toBe(generationRowY(0));
		expect(nearestGenerationRow(empty, 5000)).toBe(generationRowY(0));
	});
});

describe('same-sex couples', () => {
	it('detects a same-sex partnership', () => {
		const pedigree = family({
			individuals: [person('a', 'female'), person('b', 'female'), person('c', 'unknown')]
		});
		expect(sameSexCouple(pedigree, 'p1')).toBe(true);
	});

	it('treats mixed and unspecified sexes as not same-sex', () => {
		expect(sameSexCouple(family(), 'p1')).toBe(false);
		const unknown = family({
			individuals: [person('a', 'unknown'), person('b', 'female'), person('c', 'unknown')]
		});
		expect(sameSexCouple(unknown, 'p1')).toBe(false);
	});
});

describe('attaching children', () => {
	it('accepts an unrelated individual', () => {
		const pedigree = family();
		pedigree.individuals.push(person('d', 'male', 420, 210));
		expect(canAttachChild(pedigree, 'p1', 'd').ok).toBe(true);
	});

	it('rejects a partner, an existing child, and a same-sex couple', () => {
		const pedigree = family();
		expect(canAttachChild(pedigree, 'p1', 'a').ok).toBe(false);
		expect(canAttachChild(pedigree, 'p1', 'c').ok).toBe(false);

		const sameSex = family({
			individuals: [person('a', 'female'), person('b', 'female'), person('c', 'unknown'), person('d', 'male')],
			children: []
		});
		expect(canAttachChild(sameSex, 'p1', 'd').reason).toMatch(/same-sex/i);
	});

	it('rejects an individual who already has other parents', () => {
		const pedigree = family();
		pedigree.individuals.push(person('e', 'male'));
		pedigree.partnerships.push({ id: 'p2', parents: ['e', 'b'] });
		expect(canAttachChild(pedigree, 'p2', 'c').reason).toMatch(/already has parents/i);
	});

	it('enforces the source generation when one is supplied', () => {
		const pedigree = family();
		pedigree.individuals.push(person('d', 'male', 420, 210));
		// Parents sit on row 0, so only a source row below row 0 counts as a later generation.
		expect(canAttachChild(pedigree, 'p1', 'd', 0).reason).toMatch(/later generation/i);
		expect(canAttachChild(pedigree, 'p1', 'd', 1).ok).toBe(true);
	});

	it('rejects a child who is an ancestor of a partner', () => {
		const pedigree = family();
		pedigree.individuals.push(person('d', 'male', 420, 210));
		pedigree.partnerships.push({ id: 'p2', parents: ['c', 'd'] });
		// 'a' is 'c's father, so attaching 'a' under c would create a cycle.
		expect(canAttachChild(pedigree, 'p2', 'a').reason).toMatch(/ancestor/i);
	});
});

describe('cleanup', () => {
	it('removes orphaned and duplicate links', () => {
		const pedigree = family();
		pedigree.partnerships.push({ id: 'ghost', parents: ['x', 'y'] });
		pedigree.children.push({ childId: 'c', partnershipId: 'p1' });
		const result = cleanupPedigree(pedigree);
		expect(result.pedigree.partnerships.map((item) => item.id)).toEqual(['p1']);
		expect(result.pedigree.children).toHaveLength(1);
		expect(result.removedPartnerships).toBe(1);
		expect(result.removedLinks).toBe(1);
	});

	it('orders a generation oldest first and snaps everyone to its row', () => {
		const pedigree = family({
			individuals: [person('a', 'male', 100, 40), person('b', 'female', 300, 80), person('c', 'male', 500, 200)],
			partnerships: [],
			children: []
		});
		pedigree.individuals[0].age = 30;
		pedigree.individuals[1].age = 60;
		pedigree.individuals[2].age = 10;

		const result = cleanupPedigree(pedigree);
		const positions = new Map(result.pedigree.individuals.map((item) => [item.id, item.position]));
		expect(positions.get('b')!.x).toBeLessThan(positions.get('a')!.x);
		expect(positions.get('a')!.x).toBeLessThan(positions.get('c')!.x);
		expect(positions.get('b')!.y).toBe(generationRowY(0));
		expect(positions.get('c')!.y).toBe(generationRowY(0));
	});
});

describe('same-sex child rule in validation', () => {
	it('reports an error when a same-sex couple has children', () => {
		const pedigree = family({
			individuals: [person('a', 'female'), person('b', 'female'), person('c', 'unknown')]
		});
		const issues = validatePedigree(pedigree);
		expect(issues.some((issue) => /same sex/i.test(issue.message))).toBe(true);
	});

	it('leaves a childless same-sex partnership alone', () => {
		const pedigree = family({
			individuals: [person('a', 'female'), person('b', 'female')],
			children: []
		});
		expect(validatePedigree(pedigree).some((issue) => /same sex/i.test(issue.message))).toBe(false);
	});
});
