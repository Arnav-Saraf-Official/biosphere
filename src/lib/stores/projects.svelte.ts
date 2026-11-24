import { DATA_VERSION } from './settings.svelte';

export const PROJECTS_KEY = 'biosphere.projects.v1';

export type ToolId =
	| 'pedigree-analyzer'
	| 'pedigree-solver'
	| 'punnett-squares'
	| 'gene-analyzer'
	| 'nucleotide-flipper';

export interface SavedProject {
	id: string;
	name: string;
	tool: ToolId;
	updatedAt: number;
	dataVersion: number;
	payload: unknown;
}

const TOOL_IDS: ToolId[] = [
	'pedigree-analyzer',
	'pedigree-solver',
	'punnett-squares',
	'gene-analyzer',
	'nucleotide-flipper'
];

function isProject(value: unknown): value is SavedProject {
	if (!value || typeof value !== 'object') return false;
	const candidate = value as Partial<SavedProject>;
	return (
		typeof candidate.id === 'string' &&
		typeof candidate.name === 'string' &&
		typeof candidate.updatedAt === 'number' &&
		TOOL_IDS.includes(candidate.tool as ToolId)
	);
}

function readProjects(): SavedProject[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(PROJECTS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isProject).slice(0, 40);
	} catch {
		return [];
	}
}

export const projectStore = $state<{ items: SavedProject[] }>({ items: readProjects() });

export function persistProjects(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectStore.items));
	} catch {
		// ignore quota errors
	}
}

export function getProject(id: string): SavedProject | undefined {
	return projectStore.items.find((project) => project.id === id);
}

export function saveProject(input: {
	id?: string;
	name: string;
	tool: ToolId;
	payload: unknown;
}): SavedProject {
	const existing = input.id ? getProject(input.id) : undefined;
	const project: SavedProject = {
		id: existing?.id ?? `prj_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
		name: input.name.trim() || 'Untitled project',
		tool: input.tool,
		updatedAt: Date.now(),
		dataVersion: DATA_VERSION,
		payload: input.payload
	};

	const index = projectStore.items.findIndex((p) => p.id === project.id);
	if (index >= 0) projectStore.items[index] = project;
	else projectStore.items = [project, ...projectStore.items].slice(0, 40);

	persistProjects();
	return project;
}

export function renameProject(id: string, name: string): void {
	const project = getProject(id);
	if (!project) return;
	project.name = name.trim() || project.name;
	project.updatedAt = Date.now();
	persistProjects();
}

export function deleteProject(id: string): void {
	projectStore.items = projectStore.items.filter((project) => project.id !== id);
	persistProjects();
}

export function clearProjects(): void {
	projectStore.items = [];
	persistProjects();
}

/** Validate an imported project file before it reaches the app. */
export function parseProjectFile(text: string): { ok: true; project: SavedProject } | { ok: false; error: string } {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return { ok: false, error: 'The file is not valid JSON.' };
	}
	if (!isProject(parsed)) {
		return { ok: false, error: 'This file is not a Biosphere project.' };
	}
	if (!parsed.payload) {
		return { ok: false, error: 'The project file contains no data.' };
	}
	return { ok: true, project: parsed };
}
