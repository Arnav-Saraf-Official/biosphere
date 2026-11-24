/**
 * Pedigree graph construction, validation, and automatic layout.
 * Pure data — no DOM, no Svelte.
 */

import type { Individual, InheritanceModel, Pedigree, Sex, Vec2 } from '../../types/genetics';

export interface PedigreeIssue {
	severity: 'error' | 'warning';
	message: string;
	individualIds?: string[];
}

export interface PedigreeGraph {
	individuals: Map<string, Individual>;
	order: string[];
	/** child id -> parent ids + partnership */
	parentsOf: Map<string, { fatherId: string; motherId: string; partnershipId: string }>;
	/** partnership id -> child ids (insertion order) */
	childrenOf: Map<string, string[]>;
	/** individual id -> partnership ids they take part in */
	partnershipsOf: Map<string, string[]>;
	partnershipById: Map<string, { id: string; parents: [string, string] }>;
	founders: string[];
}

export function emptyPedigree(): Pedigree {
	return { individuals: [], partnerships: [], children: [] };
}

export function buildGraph(pedigree: Pedigree): PedigreeGraph {
	const individuals = new Map<string, Individual>();
	const order: string[] = [];
	for (const ind of pedigree.individuals) {
		individuals.set(ind.id, ind);
		order.push(ind.id);
	}

	const parentsOf = new Map<string, { fatherId: string; motherId: string; partnershipId: string }>();
	const childrenOf = new Map<string, string[]>();
	const partnershipsOf = new Map<string, string[]>();
	const partnershipById = new Map<string, { id: string; parents: [string, string] }>();

	for (const p of pedigree.partnerships) {
		partnershipById.set(p.id, { id: p.id, parents: [p.parents[0], p.parents[1]] });
		childrenOf.set(p.id, []);
		for (const parentId of p.parents) {
			const list = partnershipsOf.get(parentId) ?? [];
			list.push(p.id);
			partnershipsOf.set(parentId, list);
		}
	}

	for (const link of pedigree.children) {
		const partnership = partnershipById.get(link.partnershipId);
		if (!partnership || !individuals.has(link.childId)) continue;
		if (parentsOf.has(link.childId)) continue;
		parentsOf.set(link.childId, {
			fatherId: partnership.parents[0],
			motherId: partnership.parents[1],
			partnershipId: partnership.id
		});
		childrenOf.get(partnership.id)?.push(link.childId);
	}

	const founders: string[] = [];
	for (const id of order) if (!parentsOf.has(id)) founders.push(id);

	return {
		individuals,
		order,
		parentsOf,
		childrenOf,
		partnershipsOf,
		partnershipById,
		founders
	};
}

export interface ChildAttachmentCheck {
	ok: boolean;
	reason?: string;
}

/** True when both partners are recorded as the same known sex. */
export function sameSexCouple(pedigree: Pedigree, partnershipId: string): boolean {
	const partnership = pedigree.partnerships.find((item) => item.id === partnershipId);
	if (!partnership) return false;
	const graph = buildGraph(pedigree);
	const a = graph.individuals.get(partnership.parents[0]);
	const b = graph.individuals.get(partnership.parents[1]);
	if (!a || !b) return false;
	return a.sex !== 'unknown' && a.sex === b.sex;
}

/** Validate attaching an existing individual as a child of a couple. */
export function canAttachChild(
	pedigree: Pedigree,
	partnershipId: string,
	childId: string,
	sourceRow?: number
): ChildAttachmentCheck {
	const graph = buildGraph(pedigree);
	const partnership = graph.partnershipById.get(partnershipId);
	if (!partnership) return { ok: false, reason: 'That relationship no longer exists.' };
	if (!graph.individuals.has(childId)) {
		return { ok: false, reason: 'That individual no longer exists.' };
	}
	if (partnership.parents.includes(childId)) {
		return { ok: false, reason: 'A partner cannot also be a child of the same relationship.' };
	}
	const existing = graph.parentsOf.get(childId);
	if (existing?.partnershipId === partnershipId) {
		return { ok: false, reason: 'This individual is already a child of this couple.' };
	}
	if (existing) {
		return {
			ok: false,
			reason: `${graph.individuals.get(childId)?.label ?? 'This individual'} already has parents. Remove the existing parent link first.`
		};
	}
	if (sameSexCouple(pedigree, partnershipId)) {
		return {
			ok: false,
			reason: 'This couple is recorded as same-sex; this toolkit does not model same-sex biological parentage.'
		};
	}
	if (sourceRow !== undefined) {
		const a = graph.individuals.get(partnership.parents[0]);
		const b = graph.individuals.get(partnership.parents[1]);
		const parentRow = Math.max(
			generationIndexAt(a?.position.y ?? 0),
			generationIndexAt(b?.position.y ?? 0)
		);
		if (sourceRow <= parentRow) {
			return {
				ok: false,
				reason: 'A child must come from a later generation row than the couple. Move the person down a row first.'
			};
		}
	}
	if (
		isDescendantOf(pedigree, partnership.parents[0], childId) ||
		isDescendantOf(pedigree, partnership.parents[1], childId)
	) {
		return { ok: false, reason: 'That would make an individual their own ancestor.' };
	}
	return { ok: true };
}

/** Detect ancestry cycles and other structural problems. */
export function validatePedigree(pedigree: Pedigree): PedigreeIssue[] {
	const issues: PedigreeIssue[] = [];
	const graph = buildGraph(pedigree);

	// Duplicate or missing individuals referenced by partnerships.
	for (const p of pedigree.partnerships) {
		const [a, b] = p.parents;
		if (a === b) {
			issues.push({
				severity: 'error',
				message: 'A partnership cannot link an individual to themselves.',
				individualIds: [a]
			});
		}
		for (const id of p.parents) {
			if (!graph.individuals.has(id)) {
				issues.push({
					severity: 'error',
					message: 'A partnership references an individual that no longer exists.',
					individualIds: [id]
				});
			}
		}
	}

	// Duplicate child links.
	const seenChild = new Set<string>();
	for (const link of pedigree.children) {
		if (seenChild.has(link.childId)) {
			issues.push({
				severity: 'error',
				message: 'An individual is linked to more than one parent couple.',
				individualIds: [link.childId]
			});
		}
		seenChild.add(link.childId);
	}

	// Same-sex couples cannot have biological children in this toolkit.
	for (const p of pedigree.partnerships) {
		if (!pedigree.children.some((link) => link.partnershipId === p.id)) continue;
		if (!sameSexCouple(pedigree, p.id)) continue;
		const a = graph.individuals.get(p.parents[0]);
		const b = graph.individuals.get(p.parents[1]);
		issues.push({
			severity: 'error',
			message: `${a?.label ?? 'One partner'} and ${b?.label ?? 'the other partner'} are recorded as the same sex but have linked children. Remove those child links or correct the sexes.`,
			individualIds: [p.parents[0], p.parents[1]]
		});
	}

	// Cycle detection over the parent relation.
	const state = new Map<string, 0 | 1 | 2>();
	const stack: string[] = [];
	const visit = (id: string): void => {
		const current = state.get(id) ?? 0;
		if (current === 2) return;
		if (current === 1) {
			issues.push({
				severity: 'error',
				message: 'Circular ancestry detected — an individual cannot be their own ancestor.',
				individualIds: [...stack.slice(stack.indexOf(id)), id]
			});
			return;
		}
		state.set(id, 1);
		stack.push(id);
		const parents = graph.parentsOf.get(id);
		if (parents) {
			visit(parents.fatherId);
			visit(parents.motherId);
		}
		stack.pop();
		state.set(id, 2);
	};
	for (const id of graph.order) visit(id);

	// Sex-linked role warnings are surfaced per-model by the inference layer.
	return issues;
}

/** Warnings specific to a chosen inheritance model. */
export function modelRoleWarnings(pedigree: Pedigree, model: InheritanceModel): string[] {
	if (model !== 'x-linked-dominant' && model !== 'x-linked-recessive' && model !== 'y-linked') {
		return [];
	}
	const graph = buildGraph(pedigree);
	const warnings: string[] = [];
	for (const [childId, parents] of graph.parentsOf) {
		const father = graph.individuals.get(parents.fatherId);
		const mother = graph.individuals.get(parents.motherId);
		if (father?.sex === 'female') {
			warnings.push(
				`${father.label} is recorded as female but occupies the father role; under X-linked inheritance this pairing cannot produce a son.`
			);
		}
		if (mother?.sex === 'male') {
			warnings.push(
				`${mother.label} is recorded as male but occupies the mother role; under X-linked inheritance this pairing cannot produce a son.`
			);
		}
		if (model === 'y-linked' && mother?.sex === 'female') {
			// expected; nothing to warn about
		}
		void childId;
	}
	return [...new Set(warnings)];
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export const NODE_SIZE = 46;
const H_GAP = 74;
const V_GAP = 108;
const MARGIN = 56;

export const GENERATION_STEP = NODE_SIZE + V_GAP;
export const FIRST_GENERATION_Y = MARGIN;

/** Vertical centre of a generation row. */
export function generationRowY(index: number): number {
	return FIRST_GENERATION_Y + index * GENERATION_STEP;
}

/** Closest generation index for an arbitrary y coordinate (never negative). */
export function generationIndexAt(y: number): number {
	return Math.max(0, Math.round((y - FIRST_GENERATION_Y) / GENERATION_STEP));
}

/** Snap a y coordinate to the nearest generation row, allowing one new row below. */
export function nearestGenerationRow(pedigree: Pedigree, y: number): number {
	// The first person always founds the pedigree in generation I, no matter where
	// on the canvas the click landed.
	if (pedigree.individuals.length === 0) return generationRowY(0);
	const generation = generations(pedigree);
	const max = Math.max(0, ...generation.values());
	const index = Math.min(Math.max(0, generationIndexAt(y)), max + 1);
	return generationRowY(index);
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function romanFor(index: number): string {
	return ROMAN[index] ?? `G${index + 1}`;
}

/** Generation index (0-based) for each individual, longest-path from founders. */
export function generations(pedigree: Pedigree): Map<string, number> {
	const graph = buildGraph(pedigree);
	const gen = new Map<string, number>();
	for (const id of graph.order) gen.set(id, 0);

	for (let pass = 0; pass < graph.order.length + 1; pass++) {
		let changed = false;
		for (const [childId, parents] of graph.parentsOf) {
			const father = gen.get(parents.fatherId) ?? 0;
			const mother = gen.get(parents.motherId) ?? 0;
			const target = Math.max(father, mother) + 1;
			if ((gen.get(childId) ?? 0) < target) {
				gen.set(childId, target);
				changed = true;
			}
		}
		if (!changed) break;
	}
	return gen;
}

/** Compute a readable auto-layout for the whole pedigree. */
export function autoLayout(pedigree: Pedigree): Map<string, Vec2> {
	const graph = buildGraph(pedigree);
	const gen = generations(pedigree);
	const positions = new Map<string, Vec2>();

	const byGeneration = new Map<number, string[]>();
	for (const id of graph.order) {
		const g = gen.get(id) ?? 0;
		const list = byGeneration.get(g) ?? [];
		list.push(id);
		byGeneration.set(g, list);
	}

	const xPositions = new Map<string, number>();
	const maxGen = Math.max(0, ...byGeneration.keys());

	// Barycentre ordering keeps children near their parents.
	const barycentre = (id: string): number => {
		const parents = graph.parentsOf.get(id);
		if (!parents) return 0;
		const fx = xPositions.get(parents.fatherId);
		const mx = xPositions.get(parents.motherId);
		const values = [fx, mx].filter((v): v is number => v !== undefined);
		if (values.length === 0) return 0;
		return values.reduce((a, b) => a + b, 0) / values.length;
	};

	for (let g = 0; g <= maxGen; g++) {
		const ids = byGeneration.get(g) ?? [];
		if (ids.length === 0) continue;

		const scored = ids
			.map((id, index) => ({ id, score: barycentre(id), index }))
			.sort((a, b) => a.score - b.score || a.index - b.index);

		// Keep partners adjacent: process in order, pulling a partner along.
		const ordered: string[] = [];
		const placed = new Set<string>();
		for (const entry of scored) {
			if (placed.has(entry.id)) continue;
			ordered.push(entry.id);
			placed.add(entry.id);
			const partnershipIds = graph.partnershipsOf.get(entry.id) ?? [];
			for (const pid of partnershipIds) {
				const partnership = graph.partnershipById.get(pid);
				if (!partnership) continue;
				const other = partnership.parents[0] === entry.id ? partnership.parents[1] : partnership.parents[0];
				if (!placed.has(other) && (gen.get(other) ?? 0) === g) {
					ordered.push(other);
					placed.add(other);
				}
			}
		}

		ordered.forEach((id, index) => {
			xPositions.set(id, MARGIN + index * (NODE_SIZE + H_GAP));
		});
	}

	for (const [id, x] of xPositions) {
		const g = gen.get(id) ?? 0;
		positions.set(id, { x, y: generationRowY(g) });
	}

	return positions;
}

export interface CleanupResult {
	pedigree: Pedigree;
	removedPartnerships: number;
	removedLinks: number;
}

/**
 * Deterministic tidy-up: drop dangling links, snap everyone to generation rows,
 * keep partners adjacent and order each generation oldest-first. Unknown ages
 * sort after known ones.
 */
export function cleanupPedigree(pedigree: Pedigree): CleanupResult {
	const seenIndividuals = new Set<string>();
	const individuals = pedigree.individuals.filter((individual) => {
		if (seenIndividuals.has(individual.id)) return false;
		seenIndividuals.add(individual.id);
		return true;
	});
	const byId = new Map(individuals.map((individual) => [individual.id, individual]));

	const seenPairs = new Set<string>();
	const partnerships = pedigree.partnerships.filter((partnership) => {
		const [a, b] = partnership.parents;
		if (!byId.has(a) || !byId.has(b) || a === b) return false;
		if (seenPairs.has([a, b].sort().join('|'))) return false;
		seenPairs.add([a, b].sort().join('|'));
		return true;
	});
	const partnershipById = new Map(partnerships.map((partnership) => [partnership.id, partnership]));

	const seenChildren = new Set<string>();
	const children = pedigree.children.filter((link) => {
		const partnership = partnershipById.get(link.partnershipId);
		if (!partnership || !byId.has(link.childId)) return false;
		if (seenChildren.has(link.childId)) return false;
		if (partnership.parents.includes(link.childId)) return false;
		seenChildren.add(link.childId);
		return true;
	});

	const cleaned: Pedigree = { individuals, partnerships, children };
	const generation = generations(cleaned);
	const graph = buildGraph(cleaned);
	const positions = new Map<string, Vec2>();
	const byGeneration = new Map<number, string[]>();
	for (const id of graph.order) {
		const index = generation.get(id) ?? 0;
		const list = byGeneration.get(index) ?? [];
		list.push(id);
		byGeneration.set(index, list);
	}

	const ageOf = (id: string) => graph.individuals.get(id)?.age ?? -1;
	const labelOf = (id: string) => graph.individuals.get(id)?.label ?? '';
	const maxGeneration = Math.max(0, ...byGeneration.keys());

	for (let index = 0; index <= maxGeneration; index++) {
		const ids = [...(byGeneration.get(index) ?? [])];
		ids.sort((a, b) => ageOf(b) - ageOf(a) || labelOf(a).localeCompare(labelOf(b)));

		const placed = new Set<string>();
		const clusters: string[][] = [];
		for (const id of ids) {
			if (placed.has(id)) continue;
			const cluster = [id];
			placed.add(id);
			for (const partnershipId of graph.partnershipsOf.get(id) ?? []) {
				const partnership = graph.partnershipById.get(partnershipId);
				if (!partnership) continue;
				const other =
					partnership.parents[0] === id ? partnership.parents[1] : partnership.parents[0];
				if (!placed.has(other) && (generation.get(other) ?? 0) === index) {
					cluster.push(other);
					placed.add(other);
				}
			}
			clusters.push(cluster);
		}

		clusters.sort(
			(a, b) => Math.max(...b.map(ageOf)) - Math.max(...a.map(ageOf))
		);

		let cursor = MARGIN;
		for (const cluster of clusters) {
			for (const id of cluster) {
				positions.set(id, { x: cursor, y: generationRowY(index) });
				cursor += NODE_SIZE + H_GAP;
			}
			cursor += H_GAP / 2;
		}
	}

	cleaned.individuals = individuals.map((individual) => ({
		...individual,
		position: positions.get(individual.id) ?? individual.position
	}));

	return {
		pedigree: cleaned,
		removedPartnerships: pedigree.partnerships.length - partnerships.length,
		removedLinks: pedigree.children.length - children.length
	};
}

/** Next conventional label ("II-3") for a new individual. */
export function nextLabel(pedigree: Pedigree, generation: number): string {
	const prefix = romanFor(generation);
	const used = new Set(
		pedigree.individuals
			.map((i) => i.label)
			.filter((label) => label.startsWith(`${prefix}-`))
			.map((label) => Number(label.split('-')[1]))
			.filter((n) => Number.isFinite(n))
	);
	let n = 1;
	while (used.has(n)) n++;
	return `${prefix}-${n}`;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

export function sexOf(graph: PedigreeGraph, id: string): Sex {
	return graph.individuals.get(id)?.sex ?? 'unknown';
}

export function isDescendantOf(pedigree: Pedigree, candidateId: string, ancestorId: string): boolean {
	const graph = buildGraph(pedigree);
	let frontier = [candidateId];
	const seen = new Set<string>();
	while (frontier.length) {
		const next: string[] = [];
		for (const id of frontier) {
			if (id === ancestorId) return true;
			if (seen.has(id)) continue;
			seen.add(id);
			const parents = graph.parentsOf.get(id);
			if (parents) next.push(parents.fatherId, parents.motherId);
		}
		frontier = next;
	}
	return false;
}
