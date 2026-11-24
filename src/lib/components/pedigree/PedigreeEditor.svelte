<script lang="ts">
	import type {
		CarrierDisplay,
		Individual,
		InheritanceModel,
		PartnershipRelationship,
		Pedigree,
		Sex,
		Vec2
	} from '$lib/types/genetics';
	import {
		autoLayout,
		canAttachChild,
		cleanupPedigree,
		generationIndexAt,
		generationRowY,
		generations,
		isDescendantOf,
		nearestGenerationRow,
		nextLabel,
		sameSexCouple,
		validatePedigree
	} from '$lib/genetics/pedigree/pedigree-graph';
	import { slugify, uid } from '$lib/utils/format';
	import { downloadPng, downloadSvg } from '$lib/utils/pedigree-export';
	import { toast } from '$lib/stores/toast.svelte';
	import {
		Circle,
		Diamond,
		Download,
		Hand,
		Image,
		LayoutGrid,
		Link2,
		Maximize,
		MousePointer2,
		Plus,
		Redo2,
		Sparkles,
		Square,
		Trash2,
		Undo2,
		Users,
		ZoomIn,
		ZoomOut
	} from 'lucide-svelte';
	import PedigreeCanvas from './PedigreeCanvas.svelte';
	import IndividualForm from './IndividualForm.svelte';
	import EmptyState from '../ui/EmptyState.svelte';

	type Tool = 'select' | 'pan' | 'male' | 'female' | 'unknown' | 'partner';

	interface CanvasApi {
		fit: () => void;
		zoomBy: (factor: number) => void;
		beginPartnerFrom: (id: string) => void;
		toSvgMarkup: () => { markup: string; width: number; height: number };
	}

	interface Props {
		pedigree?: Pedigree;
		selection?: string | null;
		model?: InheritanceModel;
		showGenotypes?: boolean;
		carrierDisplay?: CarrierDisplay;
		alleleLetter?: string;
		showSexInGenotype?: boolean;
		heterozygoteAsCarrier?: boolean;
		inferred?: Record<string, { genotype: string; probability: number }>;
		projectName?: string;
		hint?: string;
	}

	let {
		pedigree = $bindable({ individuals: [], partnerships: [], children: [] }),
		selection = $bindable(null),
		model = 'autosomal-dominant',
		showGenotypes = true,
		carrierDisplay = 'recessive-only',
		alleleLetter = 'G',
		showSexInGenotype = false,
		heterozygoteAsCarrier = false,
		inferred = {},
		projectName = 'pedigree',
		hint = ''
	}: Props = $props();

	let tool = $state<Tool>('select');
	let canvasRef = $state<CanvasApi | null>(null);
	let history = $state<Pedigree[]>([]);
	let future = $state<Pedigree[]>([]);
	let lastMove = { id: '', at: 0 };
	let linkRequest = $state<{ a: string; b: string } | null>(null);
	let parentChoice = $state<{ parentId: string; childId: string } | null>(null);
	let dialogEl = $state<HTMLDivElement | null>(null);

	const tools: Array<{ id: Tool; label: string; icon: typeof MousePointer2 }> = [
		{ id: 'select', label: 'Select and move', icon: MousePointer2 },
		{ id: 'pan', label: 'Pan the canvas', icon: Hand },
		{ id: 'male', label: 'Add male', icon: Square },
		{ id: 'female', label: 'Add female', icon: Circle },
		{ id: 'unknown', label: 'Add unspecified sex', icon: Diamond },
		{ id: 'partner', label: 'Link two people (asks the relationship)', icon: Link2 }
	];

	const graph = $derived(
		(() => {
			const map = new Map(pedigree.individuals.map((individual) => [individual.id, individual]));
			return map;
		})()
	);

	const selected = $derived(selection ? graph.get(selection) ?? null : null);

	const partnerEntries = $derived.by(() => {
		const current = selection;
		if (!current) return [];
		return pedigree.partnerships
			.filter((partnership) => partnership.parents.includes(current))
			.map((partnership) => {
				const otherId =
					partnership.parents[0] === current ? partnership.parents[1] : partnership.parents[0];
				const other = graph.get(otherId);
				const self = graph.get(current);
				return {
					partnershipId: partnership.id,
					label: other?.label ?? 'Unknown',
					name: other?.name,
					relationship: partnership.relationship ?? 'married',
					canHaveChildren: Boolean(
						other && self && !(other.sex !== 'unknown' && other.sex === self.sex)
					)
				};
			});
	});

	const linkLabels = $derived.by(() => {
		if (!linkRequest) return null;
		return {
			a: graph.get(linkRequest.a)?.label ?? linkRequest.a,
			b: graph.get(linkRequest.b)?.label ?? linkRequest.b
		};
	});

	const parentChoiceOptions = $derived.by(() => {
		const choice = parentChoice;
		if (!choice) return [];
		return pedigree.partnerships
			.filter((partnership) => partnership.parents.includes(choice.parentId))
			.map((partnership) => {
				const otherId =
					partnership.parents[0] === choice.parentId
						? partnership.parents[1]
						: partnership.parents[0];
				return {
					id: partnership.id,
					other: graph.get(otherId)?.label ?? 'Unknown',
					check: canAttachChild(pedigree, partnership.id, choice.childId)
				};
			});
	});

	const parentChoiceParent = $derived.by(() => {
		const choice = parentChoice;
		if (!choice) return '';
		return graph.get(choice.parentId)?.label ?? 'Parent';
	});

	const parentChoiceChild = $derived.by(() => {
		const choice = parentChoice;
		if (!choice || !linkRequest) return 'the child';
		return choice.parentId === linkRequest.a
			? (linkLabels?.b ?? 'the child')
			: (linkLabels?.a ?? 'the child');
	});

	const errors = $derived(validatePedigree(pedigree).filter((issue) => issue.severity === 'error'));

	function clone(value: Pedigree): Pedigree {
		return JSON.parse(JSON.stringify(value)) as Pedigree;
	}

	function commit(mutate: (draft: Pedigree) => void) {
		const draft = clone(pedigree);
		mutate(draft);
		history = [...history.slice(-49), clone(pedigree)];
		future = [];
		pedigree = draft;
	}

	function undo() {
		const previous = history.at(-1);
		if (!previous) return;
		history = history.slice(0, -1);
		future = [clone(pedigree), ...future].slice(0, 50);
		pedigree = previous;
	}

	function redo() {
		const next = future[0];
		if (!next) return;
		future = future.slice(1);
		history = [...history, clone(pedigree)].slice(-50);
		pedigree = next;
	}

	function defaultPosition(): Vec2 {
		if (pedigree.individuals.length === 0) return { x: 160, y: 110 };
		const xs = pedigree.individuals.map((individual) => individual.position.x);
		const ys = pedigree.individuals.map((individual) => individual.position.y);
		return {
			x: Math.round((Math.min(...xs) + Math.max(...xs)) / 2),
			y: generationRowY(generationIndexAt(Math.max(...ys)) + 1)
		};
	}

	function createIndividual(sex: Sex, position?: Vec2) {
		const id = uid('ind');
		const point = position ?? defaultPosition();
		const y = nearestGenerationRow(pedigree, point.y);
		const generation = generationIndexAt(y);
		commit((draft) => {
			draft.individuals.push({
				id,
				label: nextLabel(draft, generation),
				sex,
				status: 'unknown',
				position: { x: point.x, y }
			});
		});
		selection = id;
	}

	function addChild(partnershipId: string) {
		const partnership = pedigree.partnerships.find((item) => item.id === partnershipId);
		if (!partnership) return;
		const father = graph.get(partnership.parents[0]);
		const mother = graph.get(partnership.parents[1]);
		if (!father || !mother) return;
		if (sameSexCouple(pedigree, partnershipId)) {
			toast(
				'This couple is recorded as same-sex. This toolkit does not model same-sex biological parentage.',
				'error'
			);
			return;
		}

		const generationMap = generations(pedigree);
		const generation =
			Math.max(generationMap.get(father.id) ?? 0, generationMap.get(mother.id) ?? 0) + 1;

		const siblings = pedigree.children
			.filter((link) => link.partnershipId === partnershipId)
			.map((link) => graph.get(link.childId))
			.filter((child): child is Individual => Boolean(child));

		const baseX = (father.position.x + mother.position.x) / 2;
		const x = siblings.length
			? Math.max(...siblings.map((sibling) => sibling.position.x)) + 96
			: baseX;
		const y = generationRowY(generation);

		const id = uid('ind');
		commit((draft) => {
			draft.individuals.push({
				id,
				label: nextLabel(draft, generation),
				sex: 'unknown',
				status: 'unknown',
				position: { x, y }
			});
			draft.children.push({ childId: id, partnershipId });
		});
		selection = id;
	}

	/** Validate a candidate pair, then ask for the relationship before committing. */
	function requestLink(a: string, b: string) {
		if (a === b) {
			toast('An individual cannot partner with themselves.', 'error');
			return;
		}
		const existing = pedigree.partnerships.some(
			(partnership) =>
				partnership.parents.includes(a) && partnership.parents.includes(b)
		);
		if (existing) {
			toast('These two individuals are already linked.', 'info');
			return;
		}
		if (isDescendantOf(pedigree, a, b) || isDescendantOf(pedigree, b, a)) {
			toast('These individuals are direct ancestors of one another and cannot be partners.', 'error');
			return;
		}
		linkRequest = { a, b };
	}

	function linkPartners(a: string, b: string, relationship: PartnershipRelationship) {
		const personA = graph.get(a);
		const personB = graph.get(b);
		const order: [string, string] =
			personB?.sex === 'male' && personA?.sex !== 'male' ? [b, a] : [a, b];

		commit((draft) => {
			draft.partnerships.push({ id: uid('pair'), parents: order, relationship });
		});
		toast(
			relationship === 'divorced' ? 'Divorced partnership recorded.' : 'Partnership created.',
			'success'
		);
	}

	function confirmLink(relationship: PartnershipRelationship) {
		if (!linkRequest) return;
		const { a, b } = linkRequest;
		linkRequest = null;
		linkPartners(a, b, relationship);
	}

	function moveIndividual(id: string, position: Vec2) {
		const now = Date.now();
		if (lastMove.id !== id || now - lastMove.at > 700) {
			history = [...history.slice(-49), clone(pedigree)];
			future = [];
		}
		lastMove = { id, at: now };
		pedigree = {
			...pedigree,
			individuals: pedigree.individuals.map((individual) =>
				individual.id === id ? { ...individual, position } : individual
			)
		};
	}

	function patchIndividualById(id: string, patch: Partial<Individual>) {
		commit((draft) => {
			draft.individuals = draft.individuals.map((individual) =>
				individual.id === id ? { ...individual, ...patch } : individual
			);
		});
	}

	function patchIndividual(patch: Partial<Individual>) {
		if (!selection) return;
		patchIndividualById(selection, patch);
	}

	function removeIndividual(id: string) {
		commit((draft) => {
			const partnershipIds = draft.partnerships
				.filter((partnership) => partnership.parents.includes(id))
				.map((partnership) => partnership.id);
			draft.individuals = draft.individuals.filter((individual) => individual.id !== id);
			draft.partnerships = draft.partnerships.filter(
				(partnership) => !partnership.parents.includes(id)
			);
			draft.children = draft.children.filter(
				(link) => link.childId !== id && !partnershipIds.includes(link.partnershipId)
			);
		});
		if (selection === id) selection = null;
	}

	function deleteSelected() {
		if (!selection) return;
		removeIndividual(selection);
		toast('Individual removed.', 'info');
	}

	function setRelationship(partnershipId: string, relationship: PartnershipRelationship) {
		commit((draft) => {
			draft.partnerships = draft.partnerships.map((partnership) =>
				partnership.id === partnershipId ? { ...partnership, relationship } : partnership
			);
		});
		toast(
			relationship === 'divorced'
				? 'Relationship marked as divorced.'
				: 'Relationship marked as married.',
			'success'
		);
	}

	function removePartnership(partnershipId: string) {
		const count = pedigree.children.filter((link) => link.partnershipId === partnershipId).length;
		commit((draft) => {
			draft.partnerships = draft.partnerships.filter((partnership) => partnership.id !== partnershipId);
			draft.children = draft.children.filter((link) => link.partnershipId !== partnershipId);
		});
		toast(
			count > 0
				? `Relationship removed. ${count} child link${count === 1 ? '' : 's'} detached.`
				: 'Relationship removed.',
			'info'
		);
	}

	/** Attach an existing person beneath a couple. Returns whether it worked. */
	function attachChild(partnershipId: string, childId: string, sourceRow?: number): boolean {
		const check = canAttachChild(pedigree, partnershipId, childId, sourceRow);
		if (!check.ok) {
			toast(check.reason ?? 'That person cannot be attached as a child.', 'error');
			return false;
		}
		const union = pedigree.partnerships.find((partnership) => partnership.id === partnershipId);
		if (!union) return false;
		const parents = union.parents
			.map((id) => graph.get(id))
			.filter((parent): parent is Individual => Boolean(parent));
		if (parents.length < 2) return false;

		const generationMap = generations(pedigree);
		const generation = Math.max(...parents.map((parent) => generationMap.get(parent.id) ?? 0)) + 1;
		const siblings = pedigree.children
			.filter((link) => link.partnershipId === partnershipId)
			.map((link) => graph.get(link.childId))
			.filter((child): child is Individual => Boolean(child));
		const y = generationRowY(generation);
		const x = siblings.length
			? Math.max(...siblings.map((sibling) => sibling.position.x)) + 96
			: Math.round((parents[0].position.x + parents[1].position.x) / 2);

		commit((draft) => {
			draft.children.push({ childId, partnershipId });
			draft.individuals = draft.individuals.map((individual) =>
				individual.id === childId ? { ...individual, position: { x, y } } : individual
			);
		});
		selection = childId;
		toast(`${graph.get(childId)?.label ?? 'Person'} linked as a child.`, 'success');
		return true;
	}

	/** Drag-and-drop parenting: sourceRow is the row the person started the drag on. */
	function dropChild(partnershipId: string, childId: string, sourceRow: number) {
		attachChild(partnershipId, childId, sourceRow);
	}

	function chooseCouple(partnershipId: string) {
		const choice = parentChoice;
		if (!choice) return;
		parentChoice = null;
		linkRequest = null;			const child = graph.get(choice.childId);
			attachChild(
				partnershipId,
				choice.childId,
				child ? generationIndexAt(child.position.y) : undefined
			);
	}

	/** Link tool: attach one person as the child of the other person's couple. */
	function confirmParentRelationship(parent: 'a' | 'b') {
		if (!linkRequest) return;
		const parentId = parent === 'a' ? linkRequest.a : linkRequest.b;
		const childId = parent === 'a' ? linkRequest.b : linkRequest.a;
		const eligible = pedigree.partnerships
			.filter((partnership) => partnership.parents.includes(parentId))
			.filter((partnership) => canAttachChild(pedigree, partnership.id, childId).ok);

		if (eligible.length === 0) {
			const hasPartner = pedigree.partnerships.some((partnership) =>
				partnership.parents.includes(parentId)
			);
			toast(
				hasPartner
					? 'No eligible couple for this parent. Check the couple sexes and whether the child already has parents.'
					: `${graph.get(parentId)?.label ?? 'This person'} needs a partner first — every child in this model has two parents.`,
				'error'
			);
			return;
		}
		if (eligible.length === 1) {
			const child = graph.get(childId);
			linkRequest = null;
			attachChild(
				eligible[0].id,
				childId,
				child ? generationIndexAt(child.position.y) : undefined
			);
			return;
		}
		parentChoice = { parentId, childId };
	}

	function clearPedigree() {
		if (pedigree.individuals.length === 0) return;
		if (!window.confirm('Clear the entire pedigree? This cannot be undone with the undo button.')) {
			return;
		}
		history = [...history.slice(-49), clone(pedigree)];
		future = [];
		pedigree = { individuals: [], partnerships: [], children: [] };
		selection = null;
		toast('Pedigree cleared.', 'info');
	}

	function cleanUp() {
		if (pedigree.individuals.length === 0) return;
		const result = cleanupPedigree(pedigree);
		commit((draft) => {
			draft.individuals = result.pedigree.individuals;
			draft.partnerships = result.pedigree.partnerships;
			draft.children = result.pedigree.children;
		});
		const removed = result.removedPartnerships + result.removedLinks;
		toast(
			removed > 0
				? `Pedigree cleaned up by age. Removed ${removed} dangling link${removed === 1 ? '' : 's'}.`
				: 'Pedigree cleaned up and sorted by age.',
			'success'
		);
		canvasRef?.fit();
	}

	function arrange() {
		if (pedigree.individuals.length === 0) return;
		const positions = autoLayout(pedigree);
		commit((draft) => {
			draft.individuals = draft.individuals.map((individual) => ({
				...individual,
				position: positions.get(individual.id) ?? individual.position
			}));
		});
		canvasRef?.fit();
	}

	function beginPartner() {
		if (!selection) return;
		tool = 'partner';
		canvasRef?.beginPartnerFrom(selection);
	}

	function exportSvgFile() {
		const result = canvasRef?.toSvgMarkup();
		if (!result || !result.markup) {
			toast('There is nothing to export yet.', 'error');
			return;
		}
		downloadSvg(result.markup, `${slugify(projectName)}.svg`);
		toast('Diagram exported as SVG.', 'success');
	}

	async function exportPngFile() {
		const result = canvasRef?.toSvgMarkup();
		if (!result || !result.markup) {
			toast('There is nothing to export yet.', 'error');
			return;
		}
		try {
			await downloadPng(result.markup, `${slugify(projectName)}.png`, result.width, result.height);
			toast('Diagram exported as PNG.', 'success');
		} catch (error) {
			toast(error instanceof Error ? error.message : 'PNG export failed.', 'error');
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (target && target.closest('input, textarea, select, [contenteditable="true"]')) return;

			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
				event.preventDefault();
				if (event.shiftKey) redo();
				else undo();
				return;
			}
			if ((event.key === 'Delete' || event.key === 'Backspace') && selection) {
				event.preventDefault();
				deleteSelected();
			}
			if (event.key === 'Escape') {
				linkRequest = null;
				parentChoice = null;
				selection = null;
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});

	$effect(() => {
		if (linkRequest) dialogEl?.querySelector<HTMLButtonElement>('button')?.focus();
	});
</script>

<section class="editor panel">
	<div class="toolbar">
		<div class="tool-group" role="toolbar" aria-label="Pedigree tools">
			{#each tools as item (item.id)}
				{@const Icon = item.icon}
				<button
					type="button"
					class="icon-btn"
					aria-pressed={tool === item.id}
					aria-label={item.label}
					title={item.label}
					onclick={() => (tool = item.id)}
				>
					<Icon size={16} strokeWidth={1.9} aria-hidden="true" />
				</button>
			{/each}
		</div>

		<span class="toolbar-sep" aria-hidden="true"></span>

		<div class="tool-group">
			<button
				type="button"
				class="icon-btn"
				aria-label="Undo"
				title="Undo (Ctrl+Z)"
				disabled={history.length === 0}
				onclick={undo}
			>
				<Undo2 size={16} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Redo"
				title="Redo (Ctrl+Shift+Z)"
				disabled={future.length === 0}
				onclick={redo}
			>
				<Redo2 size={16} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Auto-arrange diagram"
				title="Auto-arrange diagram"
				disabled={pedigree.individuals.length === 0}
				onclick={arrange}
			>
				<LayoutGrid size={16} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Clean up and sort by age"
				title="Clean up and sort by age"
				disabled={pedigree.individuals.length === 0}
				onclick={cleanUp}
			>
				<Sparkles size={16} aria-hidden="true" />
			</button>
		</div>

		<span class="toolbar-sep" aria-hidden="true"></span>

		<div class="tool-group">
			<button
				type="button"
				class="icon-btn"
				aria-label="Zoom out"
				title="Zoom out"
				onclick={() => canvasRef?.zoomBy(1 / 1.18)}
			>
				<ZoomOut size={16} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Fit to screen"
				title="Fit to screen"
				onclick={() => canvasRef?.fit()}
			>
				<Maximize size={15} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Zoom in"
				title="Zoom in"
				onclick={() => canvasRef?.zoomBy(1.18)}
			>
				<ZoomIn size={16} aria-hidden="true" />
			</button>
		</div>

		<span class="toolbar-spacer"></span>

		<div class="tool-group">
			<button type="button" class="btn btn-sm" onclick={exportSvgFile} title="Export the diagram as SVG">
				<Download size={13} aria-hidden="true" /> SVG
			</button>
			<button type="button" class="btn btn-sm" onclick={exportPngFile} title="Export the diagram as PNG">
				<Image size={13} aria-hidden="true" /> PNG
			</button>
			<button
				type="button"
				class="icon-btn"
				aria-label="Clear pedigree"
				title="Clear pedigree"
				disabled={pedigree.individuals.length === 0}
				onclick={clearPedigree}
			>
				<Trash2 size={15} aria-hidden="true" />
			</button>
		</div>
	</div>

	{#if hint}
		<p class="editor-hint">{hint}</p>
	{/if}

	{#if errors.length > 0}
		<div class="editor-errors" role="alert">
			{#each errors as error, index (index)}
				<p>{error.message}</p>
			{/each}
		</div>
	{/if}

	<div class="editor-body">
		<div class="canvas-col">
			<PedigreeCanvas
				bind:this={canvasRef}
				{pedigree}
				{selection}
				{tool}
				{model}
				{showGenotypes}
				{carrierDisplay}
				{alleleLetter}
				{showSexInGenotype}
				{heterozygoteAsCarrier}
				{inferred}
				onselect={(id) => (selection = id)}
				onmove={moveIndividual}
				oncreate={createIndividual}
				onlink={requestLink}
				ondropchild={dropChild}
				onpatch={patchIndividualById}
				onrelationship={setRelationship}
				onremovepartnership={removePartnership}
				ondeleteindividual={removeIndividual}
				onrequestpartner={beginPartner}
				onnotice={(message) => toast(message, 'info')}
			/>
		</div>

		<aside class="inspector" aria-label="Individual details">
			{#if selected}
				<IndividualForm
					individual={selected}
					{model}
					{alleleLetter}
					partners={partnerEntries}
					onpatch={patchIndividual}
					ondelete={deleteSelected}
					onaddChild={addChild}
					onrequestPartner={beginPartner}
				/>
			{:else}
				<EmptyState
					title="Nothing selected"
					description="Select an individual to edit their sex, status, genotype, and relationships, or add the first person to the pedigree."
				>
					<button type="button" class="btn btn-sm" onclick={() => createIndividual('male')}>
						<Square size={13} aria-hidden="true" /> Add male
					</button>
					<button type="button" class="btn btn-sm" onclick={() => createIndividual('female')}>
						<Circle size={13} aria-hidden="true" /> Add female
					</button>
					<button type="button" class="btn btn-sm" onclick={() => createIndividual('unknown')}>
						<Diamond size={13} aria-hidden="true" /> Unspecified
					</button>
				</EmptyState>
			{/if}

			{#if pedigree.individuals.length > 0}
				<div class="individuals">
					<p class="individuals-title">
						<Users size={13} aria-hidden="true" />
						Individuals ({pedigree.individuals.length})
					</p>
					<ul class="individuals-list">
						{#each pedigree.individuals as individual (individual.id)}
							<li>
								<button
									type="button"
									class="individual-row"
									class:active={selection === individual.id}
									onclick={() => (selection = individual.id)}
								>
									<span class="individual-label">{individual.label}</span>
									<span class="individual-meta">
										{individual.sex === 'male' ? 'male' : individual.sex === 'female' ? 'female' : 'unspecified'}
										· {individual.status}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</aside>
	</div>

	{#if linkRequest && linkLabels}
		<div
			class="dialog-backdrop"
			role="presentation"				onclick={(event) => {
				if (event.target === event.currentTarget) {
					linkRequest = null;
					parentChoice = null;
				}
				}}
		>
			<div
				bind:this={dialogEl}
				class="dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="link-title"
			>
				{#if parentChoice}
					<p class="eyebrow">Parent–child</p>
					<h2 id="link-title" class="dialog-title">
						Attach {parentChoiceChild} to which of {parentChoiceParent}'s couples?
					</h2>
					<p class="dialog-text">
						A child needs two parents in this model, so choose the couple that should
						become {parentChoiceChild}'s parents.
					</p>
					<div class="dialog-options">
						{#each parentChoiceOptions as option (option.id)}
							<button
								type="button"
								class="dialog-option"
								disabled={!option.check.ok}
								title={option.check.reason ?? ''}
								onclick={() => chooseCouple(option.id)}
							>
								<span class="dialog-option-title">{parentChoiceParent} + {option.other}</span>
								<span class="dialog-option-text">
									{option.check.ok ? 'Attach the child to this couple.' : option.check.reason}
								</span>
							</button>
						{/each}
					</div>
					<div class="dialog-actions">
						<button
							type="button"
							class="btn btn-sm"
							onclick={() => {
								parentChoice = null;
								linkRequest = null;
							}}
						>
							Cancel
						</button>
					</div>
				{:else}
					<p class="eyebrow">Relationship</p>
					<h2 id="link-title" class="dialog-title">
						How are {linkLabels.a} and {linkLabels.b} related?
					</h2>
					<p class="dialog-text">
						This sets the line drawn between them, or makes one person the child of
						the other's couple. You can change a partnership later by right-clicking the
						link.
					</p>
					<div class="dialog-options">
						<button type="button" class="dialog-option" onclick={() => confirmLink('married')}>
							<span class="dialog-option-title">Married or partners</span>
							<span class="dialog-option-text">A plain mating line. Children can be attached to this couple.</span>
						</button>
						<button type="button" class="dialog-option" onclick={() => confirmLink('divorced')}>
							<span class="dialog-option-title">Divorced or separated</span>
							<span class="dialog-option-text">The link is marked with a strike. Children stay attached.</span>
						</button>
						<button
							type="button"
							class="dialog-option"
							onclick={() => confirmParentRelationship('a')}
						>
							<span class="dialog-option-title">{linkLabels.a} is a parent of {linkLabels.b}</span>
							<span class="dialog-option-text">
								{linkLabels.b} joins {linkLabels.a}'s couple as a child. {linkLabels.a} needs a
								partner already.
							</span>
						</button>
						<button
							type="button"
							class="dialog-option"
							onclick={() => confirmParentRelationship('b')}
						>
							<span class="dialog-option-title">{linkLabels.b} is a parent of {linkLabels.a}</span>
							<span class="dialog-option-text">
								{linkLabels.a} joins {linkLabels.b}'s couple as a child. {linkLabels.b} needs a
								partner already.
							</span>
						</button>
					</div>
					<div class="dialog-actions">
						<button
							type="button"
							class="btn btn-sm"
							onclick={() => {
								linkRequest = null;
								parentChoice = null;
							}}
						>
							Cancel
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	.editor {
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		padding: 8px 10px;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
	}

	.tool-group {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.toolbar-sep {
		width: 1px;
		height: 20px;
		background: var(--border);
		margin: 0 3px;
	}

	.toolbar-spacer {
		flex: 1;
	}

	.editor-hint {
		padding: 8px 14px;
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--surface-inset);
		border-bottom: 1px solid var(--border);
	}

	.editor-errors {
		padding: 8px 14px;
		background: var(--error-soft);
		border-bottom: 1px solid var(--error-border);
		color: var(--error);
		font-size: 0.75rem;
		line-height: 1.5;
	}

	.editor-body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 292px;
		gap: 0;
		min-height: 560px;
	}

	.canvas-col {
		min-width: 0;
		padding: 10px;
	}

	.inspector {
		border-left: 1px solid var(--border);
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		background: var(--surface);
		overflow-y: auto;
		max-height: 720px;
	}

	.individuals {
		border-top: 1px solid var(--border);
		padding-top: 10px;
	}

	.individuals-title {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 6px;
	}

	.individuals-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
		max-height: 200px;
		overflow-y: auto;
	}

	.individual-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 4px 7px;
		border: 0;
		border-radius: var(--r-xs);
		background: transparent;
		text-align: left;
		color: var(--text-2);
		font-size: 0.75rem;
	}

	.individual-row:hover {
		background: var(--surface-2);
	}

	.individual-row.active {
		background: var(--accent-soft);
		color: var(--accent-strong);
	}

	.individual-label {
		font-family: var(--font-mono);
		font-weight: 600;
	}

	.individual-meta {
		color: var(--text-muted);
		font-size: 0.6875rem;
		white-space: nowrap;
	}

	.icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.dialog-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: grid;
		place-items: center;
		padding: 20px;
		background: var(--overlay);
	}

	.dialog {
		width: min(420px, 100%);
		padding: 20px;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		background: var(--surface);
		box-shadow: var(--shadow-lg);
	}

	.dialog-title {
		font-size: 1rem;
		font-weight: 620;
		margin: 2px 0 6px;
	}

	.dialog-text {
		font-size: 0.8125rem;
		line-height: 1.55;
		color: var(--text-muted);
	}

	.dialog-options {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 14px 0;
	}

	.dialog-option {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px 12px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface);
		text-align: left;
	}

	.dialog-option:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.dialog-option:disabled:hover {
		border-color: var(--border);
		background: var(--surface);
	}

	.dialog-option:hover,
	.dialog-option:focus-visible {
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
		background: var(--accent-soft);
		outline: none;
	}

	.dialog-option-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text);
	}

	.dialog-option-text {
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--text-muted);
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 1080px) {
		.editor-body {
			grid-template-columns: minmax(0, 1fr);
		}
		.inspector {
			border-left: 0;
			border-top: 1px solid var(--border);
			max-height: none;
		}
	}

	@media (max-width: 720px) {
		.toolbar {
			gap: 4px;
		}
		.canvas-col {
			padding: 6px;
		}
	}
</style>
