<script lang="ts">
	import type {
		CarrierDisplay,
		CarrierObservation,
		Individual,
		InheritanceModel,
		ObservedStatus,
		PartnershipRelationship,
		Pedigree,
		Sex,
		Vec2
	} from '$lib/types/genetics';
	import {
		carriesVariant,
		displayPhenotypeLabel,
		formatGenotype,
		parseGenotype,
		phenotypeOf,
		remapGenotype
	} from '$lib/genetics/inheritance/model-spec';
	import {
		generationIndexAt,
		generationRowY,
		generations,
		nearestGenerationRow,
		romanFor,
		sameSexCouple
	} from '$lib/genetics/pedigree/pedigree-graph';
	import { clamp } from '$lib/utils/format';
	import { exportStyles } from '$lib/utils/pedigree-export';
	import { Baby, Check, Pencil, Trash2, UserPlus, X } from 'lucide-svelte';

	type Tool = 'select' | 'pan' | 'male' | 'female' | 'unknown' | 'partner';

	interface Props {
		pedigree: Pedigree;
		selection: string | null;
		tool: Tool;
		model: InheritanceModel;
		showGenotypes: boolean;
		carrierDisplay: CarrierDisplay;
		alleleLetter: string;
		showSexInGenotype: boolean;
		heterozygoteAsCarrier: boolean;
		inferred: Record<string, { genotype: string; probability: number }>;
		onselect: (id: string | null) => void;
		onmove: (id: string, position: Vec2) => void;
		oncreate: (sex: Sex, position: Vec2) => void;
		onlink: (a: string, b: string) => void;
		ondropchild: (partnershipId: string, childId: string, sourceRow: number) => void;
		onpatch: (id: string, patch: Partial<Individual>) => void;
		onrelationship: (partnershipId: string, relationship: PartnershipRelationship) => void;
		onremovepartnership: (partnershipId: string) => void;
		ondeleteindividual: (id: string) => void;
		onrequestpartner: (id: string) => void;
		onnotice: (message: string) => void;
	}

	let {
		pedigree,
		selection,
		tool,
		model,
		showGenotypes,
		carrierDisplay,
		alleleLetter,
		showSexInGenotype,
		heterozygoteAsCarrier,
		inferred,
		onselect,
		onmove,
		oncreate,
		onlink,
		ondropchild,
		onpatch,
		onrelationship,
		onremovepartnership,
		ondeleteindividual,
		onrequestpartner,
		onnotice
	}: Props = $props();

	const SIZE = 46;
	const HALF = SIZE / 2;
	const DROP_RADIUS = 40;

	let wrapEl: HTMLDivElement;
	let svgEl: SVGSVGElement | null = null;
	let menuEl = $state<HTMLDivElement | null>(null);
	let width = $state(900);
	let height = $state(560);
	let view = $state({ x: 0, y: 0, k: 1 });
	let pending = $state<string | null>(null);
	let autoFitted = $state(false);
	let dropTarget = $state<string | null>(null);
	let hoverUnion = $state<string | null>(null);

	type MenuState =
		| { kind: 'person'; id: string; x: number; y: number }
		| { kind: 'union'; id: string; x: number; y: number };

	let menu = $state<MenuState | null>(null);

	type Drag =
		| { kind: 'node'; id: string; offset: Vec2; sourceRow: number }
		| { kind: 'pan'; startX: number; startY: number; originX: number; originY: number };

	let drag = $state<Drag | null>(null);

	const byId = $derived(new Map(pedigree.individuals.map((individual) => [individual.id, individual])));

	const unions = $derived.by(() =>
		pedigree.partnerships
			.map((partnership) => {
				const a = byId.get(partnership.parents[0]);
				const b = byId.get(partnership.parents[1]);
				if (!a || !b) return null;

				const children = pedigree.children
					.filter((link) => link.partnershipId === partnership.id)
					.map((link) => byId.get(link.childId))
					.filter((child): child is Individual => Boolean(child));

				const y = Math.max(a.position.y, b.position.y);
				const midX = (a.position.x + b.position.x) / 2;
				const busY = y + HALF + 58;
				const childXs = children.map((child) => child.position.x);

				return {
					id: partnership.id,
					a,
					b,
					relationship: partnership.relationship ?? 'married',
					blocked: sameSexCouple(pedigree, partnership.id),
					y,
					midX,
					busY,
					children,
					minX: childXs.length ? Math.min(...childXs) : midX,
					maxX: childXs.length ? Math.max(...childXs) : midX
				};
			})
			.filter((union): union is NonNullable<typeof union> => Boolean(union))
	);

	const rows = $derived.by(() => {
		if (pedigree.individuals.length === 0) return [];
		const generation = generations(pedigree);
		const max = Math.max(0, ...generation.values());
		return Array.from({ length: max + 2 }, (_, index) => ({
			index,
			label: romanFor(index),
			y: generationRowY(index)
		}));
	});

	const guideExtent = $derived.by(() => {
		if (pedigree.individuals.length === 0) return { x1: 0, x2: 0 };
		const xs = pedigree.individuals.map((individual) => individual.position.x);
		return { x1: Math.min(...xs) - 115, x2: Math.max(...xs) + 110 };
	});

	const menuPerson = $derived.by(() => {
		const current = menu;
		if (!current || current.kind !== 'person') return null;
		return byId.get(current.id) ?? null;
	});
	const menuUnion = $derived.by(() => {
		const current = menu;
		if (!current || current.kind !== 'union') return null;
		return unions.find((union) => union.id === current.id) ?? null;
	});

	const menuStyle = $derived.by(() => {
		if (!menu) return '';
		const left = clamp(menu.x, 8, Math.max(8, width - 224));
		const top = clamp(menu.y, 8, Math.max(8, height - 340));
		return `left:${left}px; top:${top}px;`;
	});

	function toWorld(event: PointerEvent | MouseEvent): Vec2 {
		if (!svgEl) return { x: 0, y: 0 };
		const rect = svgEl.getBoundingClientRect();
		return {
			x: (event.clientX - rect.left - view.x) / view.k,
			y: (event.clientY - rect.top - view.y) / view.k
		};
	}

	function genotypeText(individual: Individual): { text: string; inferred: boolean; uncertain: boolean } {
		const entry = inferred[individual.id];
		const typed = individual.genotype?.trim() ? individual.genotype : null;
		const parsed = typed ? parseGenotype(typed, model, individual.sex) : null;
		if (parsed) {
			return {
				text: remapGenotype(formatGenotype(parsed, { sex: showSexInGenotype }), alleleLetter),
				inferred: false,
				uncertain: false
			};
		}
		// An entry that does not describe a genotype (e.g. one allele for a female
		// in an X-linked model) is flagged in the inspector; never print it here as
		// if it were a genotype.
		if (entry) {
			return {
				text: remapGenotype(formatGenotype(entry.genotype, { sex: showSexInGenotype }), alleleLetter),
				inferred: true,
				uncertain: entry.probability < 0.985
			};
		}
		return { text: '', inferred: false, uncertain: false };
	}

	const recessiveModel = $derived(
		model === 'autosomal-recessive' || model === 'x-linked-recessive'
	);

	/** Whether carriers are half shaded under the current display setting. */
	function carrierShading(): boolean {
		if (carrierDisplay === 'never') return false;
		if (carrierDisplay === 'recessive-only') return recessiveModel;
		return true;
	}

	/** Carrier finding: explicit observation first, then the inferred genotype. */
	function isCarrier(individual: Individual): boolean {
		if (!carrierShading()) return false;
		const observation: CarrierObservation = individual.carrier ?? 'unknown';
		if (observation === 'carrier') return true;
		if (observation === 'non-carrier') return false;
		const entry = inferred[individual.id];
		if (entry) return carriesVariant(model, entry.genotype);
		if (individual.genotype) {
			const parsed = parseGenotype(individual.genotype, model, individual.sex);
			return parsed ? carriesVariant(model, parsed) : false;
		}
		return false;
	}

	function phenotypeLabel(individual: Individual): string {
		const carrier = isCarrier(individual);
		if (individual.status === 'unknown') return carrier ? 'status unknown, carrier' : 'status unknown';
		if (individual.status === 'affected') return carrier ? 'affected carrier' : 'affected';
		const entry = inferred[individual.id];
		if (entry && showGenotypes && !carrier) {
			const label = displayPhenotypeLabel(model, entry.genotype, heterozygoteAsCarrier);
			return `unaffected, inferred ${label}`;
		}
		return carrier ? 'unaffected carrier' : 'unaffected';
	}

	function symbolClass(individual: Individual): string {
		const classes = ['shape'];
		// A half-shaded carrier is drawn by the carrier overlay instead of a full fill.
		if (individual.status === 'affected' && !isCarrier(individual)) classes.push('affected');
		if (individual.status === 'unknown') classes.push('unknown');
		return classes.join(' ');
	}

	function handleNodeDown(event: PointerEvent, individual: Individual) {
		if (event.button === 2) return;
		event.stopPropagation();
		menu = null;

		if (tool === 'partner') {
			handlePartner(individual.id);
			return;
		}
		if (tool === 'male' || tool === 'female' || tool === 'unknown') {
			onselect(individual.id);
			return;
		}
		if (tool === 'pan') {
			startPan(event);
			return;
		}

		onselect(individual.id);
		const world = toWorld(event);
		drag = {
			kind: 'node',
			id: individual.id,
			offset: { x: individual.position.x - world.x, y: individual.position.y - world.y },
			sourceRow: generationIndexAt(individual.position.y)
		};
		svgEl?.setPointerCapture(event.pointerId);
	}

	function handlePartner(id: string) {
		if (!pending) {
			pending = id;
			onselect(id);
			onnotice('Now click the second person. You will be asked what the relationship is.');
			return;
		}
		if (pending === id) {
			pending = null;
			return;
		}
		onlink(pending, id);
		pending = null;
	}

	function startPan(event: PointerEvent) {
		menu = null;
		drag = {
			kind: 'pan',
			startX: event.clientX,
			startY: event.clientY,
			originX: view.x,
			originY: view.y
		};
		svgEl?.setPointerCapture(event.pointerId);
	}

	function handleBackgroundDown(event: PointerEvent) {
		if (event.button === 2) {
			menu = null;
			return;
		}
		if (event.button === 1 || tool === 'pan') {
			startPan(event);
			return;
		}
		if (tool === 'male' || tool === 'female' || tool === 'unknown') {
			const world = toWorld(event);
			oncreate(tool, { x: Math.round(world.x), y: nearestGenerationRow(pedigree, world.y) });
			return;
		}
		onselect(null);
		pending = null;
		menu = null;
	}

	function distanceToSegment(point: Vec2, start: Vec2, end: Vec2): number {
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const lengthSq = dx * dx + dy * dy;
		const t =
			lengthSq === 0
				? 0
				: Math.max(
						0,
						Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq)
					);
		return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
	}

	function detectDropTarget(center: Vec2) {
		let best = DROP_RADIUS;
		let target: string | null = null;
		for (const union of unions) {
			const distance = distanceToSegment(
				center,
				{ x: union.midX, y: union.y },
				{ x: union.midX, y: union.busY }
			);
			if (distance < best) {
				best = distance;
				target = union.id;
			}
		}
		dropTarget = target;
	}

	function handleMove(event: PointerEvent) {
		if (!drag) return;
		if (drag.kind === 'pan') {
			view = {
				...view,
				x: drag.originX + (event.clientX - drag.startX),
				y: drag.originY + (event.clientY - drag.startY)
			};
			return;
		}
		const world = toWorld(event);
		const x = Math.round((world.x + drag.offset.x) / 2) * 2;
		const rawY = world.y + drag.offset.y;
		onmove(drag.id, { x, y: nearestGenerationRow(pedigree, rawY) });
		detectDropTarget({ x, y: rawY });
	}

	function handleUp() {
		if (drag?.kind === 'node' && dropTarget) {
			ondropchild(dropTarget, drag.id, drag.sourceRow);
		}
		drag = null;
		dropTarget = null;
	}

	function openMenu(event: MouseEvent, kind: 'person' | 'union', id: string) {
		event.preventDefault();
		event.stopPropagation();
		pending = null;
		const rect = wrapEl.getBoundingClientRect();
		menu = {
			kind,
			id,
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	function openUnionMenu(unionId: string) {
		const union = unions.find((item) => item.id === unionId);
		if (!union) return;
		menu = {
			kind: 'union',
			id: unionId,
			x: view.x + union.midX * view.k,
			y: view.y + union.y * view.k
		};
	}

	function menuSelect(id: string) {
		menu = null;
		onselect(id);
	}

	function menuPatch(id: string, patch: Partial<Individual>) {
		menu = null;
		onpatch(id, patch);
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		if (!svgEl) return;
		const rect = svgEl.getBoundingClientRect();
		const px = event.clientX - rect.left;
		const py = event.clientY - rect.top;
		const factor = Math.exp(-event.deltaY * 0.0015);
		const k = clamp(view.k * factor, 0.25, 2.6);
		const worldX = (px - view.x) / view.k;
		const worldY = (py - view.y) / view.k;
		view = { k, x: px - worldX * k, y: py - worldY * k };
	}

	function handleKey(event: KeyboardEvent, individual: Individual) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onselect(individual.id);
			return;
		}
		const step = event.shiftKey ? 20 : 8;
		const deltas: Record<string, Vec2> = {
			ArrowUp: { x: 0, y: -step },
			ArrowDown: { x: 0, y: step },
			ArrowLeft: { x: -step, y: 0 },
			ArrowRight: { x: step, y: 0 }
		};
		const delta = deltas[event.key];
		if (delta) {
			event.preventDefault();
			onmove(individual.id, {
				x: individual.position.x + delta.x,
				y: nearestGenerationRow(pedigree, individual.position.y + delta.y)
			});
		}
	}

	function contentBox() {
		if (pedigree.individuals.length === 0) return { x: 0, y: 0, w: 640, h: 480 };
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const individual of pedigree.individuals) {
			minX = Math.min(minX, individual.position.x);
			maxX = Math.max(maxX, individual.position.x);
			minY = Math.min(minY, individual.position.y);
			maxY = Math.max(maxY, individual.position.y);
		}
		const pad = 76;
		return {
			x: minX - pad,
			y: minY - pad,
			w: maxX - minX + pad * 2,
			h: maxY - minY + pad * 2
		};
	}

	export function fit() {
		const box = contentBox();
		if (width <= 0 || height <= 0) return;
		const k = clamp(Math.min(width / box.w, height / box.h), 0.25, 1.5);
		view = {
			k,
			x: (width - box.w * k) / 2 - box.x * k,
			y: (height - box.h * k) / 2 - box.y * k
		};
	}

	export function beginPartnerFrom(id: string) {
		pending = id;
		onnotice('Now click the second person. You will be asked what the relationship is.');
	}

	export function zoomBy(factor: number) {
		const k = clamp(view.k * factor, 0.25, 2.6);
		const cx = width / 2;
		const cy = height / 2;
		const worldX = (cx - view.x) / view.k;
		const worldY = (cy - view.y) / view.k;
		view = { k, x: cx - worldX * k, y: cy - worldY * k };
	}

	/** Serialise the current diagram to a standalone SVG document. */
	export function toSvgMarkup(): { markup: string; width: number; height: number } {
		if (!svgEl) return { markup: '', width: 0, height: 0 };
		const box = contentBox();
		const clone = svgEl.cloneNode(true) as SVGSVGElement;

		clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		clone.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
		clone.setAttribute('width', String(Math.round(box.w)));
		clone.setAttribute('height', String(Math.round(box.h)));

		const world = clone.querySelector('[data-world]');
		world?.setAttribute('transform', 'translate(0 0) scale(1)');

		for (const node of clone.querySelectorAll('[data-export="hide"]')) node.remove();

		const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
		style.textContent = exportStyles();
		clone.insertBefore(style, clone.firstChild);

		return {
			markup: new XMLSerializer().serializeToString(clone),
			width: Math.round(box.w),
			height: Math.round(box.h)
		};
	}

	// Fit once the diagram has content and the container has been measured.
	$effect(() => {
		if (autoFitted) return;
		if (width > 0 && pedigree.individuals.length > 0) {
			autoFitted = true;
			fit();
		}
	});

	$effect(() => {
		if (pedigree.individuals.length === 0) autoFitted = false;
	});

	// Move focus into a freshly opened menu, and close on outside press / Escape.
	$effect(() => {
		if (!menu) return;
		menuEl?.querySelector<HTMLButtonElement>('button')?.focus();
		const close = (event: Event) => {
			if (event instanceof KeyboardEvent && event.key === 'Escape') {
				menu = null;
				return;
			}
			if (event instanceof PointerEvent && menuEl && event.target instanceof Node) {
				if (!menuEl.contains(event.target)) menu = null;
			}
		};
		window.addEventListener('keydown', close);
		window.addEventListener('pointerdown', close, true);
		return () => {
			window.removeEventListener('keydown', close);
			window.removeEventListener('pointerdown', close, true);
		};
	});

	const cursor = $derived(
		tool === 'pan' ? 'grab' : tool === 'select' ? 'default' : 'crosshair'
	);

	const statusActions: Array<{ value: ObservedStatus; label: string }> = [
		{ value: 'affected', label: 'Affected' },
		{ value: 'unaffected', label: 'Unaffected' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const carrierActions: Array<{ value: CarrierObservation; label: string }> = [
		{ value: 'carrier', label: 'Carrier' },
		{ value: 'non-carrier', label: 'Not a carrier' },
		{ value: 'unknown', label: 'Carrier unknown' }
	];

	const sexActions: Array<{ value: Sex; label: string }> = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'unknown', label: 'Unspecified' }
	];
</script>

<div class="canvas-wrap" bind:this={wrapEl} bind:clientWidth={width} bind:clientHeight={height}>
	<svg
		bind:this={svgEl}
		class="canvas"
		style:cursor
		role="application"
		aria-label="Pedigree diagram. Drag people between generation rows, drag a person onto a relationship to make them a child, or right-click a person or link for quick actions."
		onpointerdown={handleBackgroundDown}
		onpointermove={handleMove}
		onpointerup={handleUp}
		onpointercancel={handleUp}
		onwheel={handleWheel}
		oncontextmenu={(event) => event.preventDefault()}
	>
		<g data-world transform="translate({view.x} {view.y}) scale({view.k})">
			{#each rows as row (row.index)}
				<line
					class="generation-guide"
					x1={guideExtent.x1}
					y1={row.y}
					x2={guideExtent.x2}
					y2={row.y}
					data-export="hide"
				/>
				<text
					class="generation-label"
					x={guideExtent.x1 + 8}
					y={row.y - 9}
					data-export="hide"
				>
					Generation {row.label}
				</text>
			{/each}

			{#each unions as union (union.id)}
				{#if union.relationship === 'divorced'}
					<line
						class="divorce-mark"
						x1={union.midX - 6}
						y1={union.y - 10}
						x2={union.midX + 6}
						y2={union.y + 10}
					/>
				{/if}
				<line class="link" x1={union.a.position.x} y1={union.y} x2={union.b.position.x} y2={union.y} />
				<line
					class="link"
					class:drop-hot={dropTarget === union.id}
					x1={union.midX}
					y1={union.y}
					x2={union.midX}
					y2={union.busY}
				/>
				{#if union.children.length > 0}
					<line class="link" x1={union.minX} y1={union.busY} x2={union.maxX} y2={union.busY} />
					{#each union.children as child (child.id)}
						<line
							class="link"
							x1={child.position.x}
							y1={union.busY}
							x2={child.position.x}
							y2={child.position.y - HALF}
						/>
					{/each}
				{/if}

				<!-- Wide invisible hit area for the relationship line. -->
				<line
					class="link-hit"
					x1={Math.min(union.a.position.x, union.b.position.x)}
					y1={union.y}
					x2={Math.max(union.a.position.x, union.b.position.x)}
					y2={union.y}
					data-export="hide"
					role="button"
					tabindex="0"
					aria-label={`Relationship between ${union.a.label} and ${union.b.label}. Press Enter for actions.`}
					onpointerenter={() => (hoverUnion = union.id)}
					onpointerleave={() => (hoverUnion = null)}
					oncontextmenu={(event) => openMenu(event, 'union', union.id)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							openUnionMenu(union.id);
						}
					}}
				>
					<title>{union.a.label} and {union.b.label} — {union.relationship}. Right-click for actions.</title>
				</line>

				{#if drag?.kind === 'node'}
					<line
						class="drop-branch"
						class:hot={dropTarget === union.id}
						x1={union.midX}
						y1={union.y}
						x2={union.midX}
						y2={union.busY}
						data-export="hide"
					/>
					<circle
						class="drop-target"
						class:hot={dropTarget === union.id}
						class:blocked={union.blocked}
						cx={union.midX}
						cy={union.busY}
						r={dropTarget === union.id ? 16 : 10}
						data-export="hide"
					/>
				{/if}

				{#if hoverUnion === union.id && !drag}
					<text
						class="union-tag"
						x={union.midX}
						y={union.busY + 18}
						text-anchor="middle"
						data-export="hide"
					>
						{union.relationship === 'divorced' ? 'divorced' : 'partners'}
					</text>
				{/if}
			{/each}

			{#each pedigree.individuals as individual (individual.id)}
				{@const genotype = genotypeText(individual)}
				{@const isPending = pending === individual.id}
				<g
					class="node"
					class:deceased={individual.vital === 'deceased'}
					transform="translate({individual.position.x} {individual.position.y})"
					role="button"
					tabindex="0"
					aria-label="{individual.label}: {individual.sex}, {phenotypeLabel(individual)}{individual.vital ===
					'deceased'
						? ', deceased'
						: ''}"
					onpointerdown={(event) => handleNodeDown(event, individual)}
					onkeydown={(event) => handleKey(event, individual)}
					oncontextmenu={(event) => openMenu(event, 'person', individual.id)}
				>
					{#if selection === individual.id || isPending}
						<circle
							class="select-ring"
							r={HALF + 6}
							data-export={selection === individual.id ? undefined : 'hide'}
						/>
					{/if}

					{#if individual.sex === 'female'}
						<circle class={symbolClass(individual)} r={HALF} />
					{:else if individual.sex === 'male'}
						<rect class={symbolClass(individual)} x={-HALF} y={-HALF} width={SIZE} height={SIZE} rx="3" />
					{:else}
						<path
							class={symbolClass(individual)}
							d="M0,-{HALF + 2} L{HALF + 2},0 L0,{HALF + 2} L-{HALF + 2},0 Z"
						/>
					{/if}

					{#if individual.vital === 'deceased'}
						<line class="deceased-line" x1={-HALF - 7} y1={HALF + 7} x2={HALF + 7} y2={-HALF - 7} />
					{/if}

					{#if isCarrier(individual)}
						{#if individual.sex === 'female'}
							<path
								class="carrier-half"
								d={`M0,-${HALF} A ${HALF} ${HALF} 0 0 0 0,${HALF} Z`}
							/>
						{:else if individual.sex === 'male'}
							<rect class="carrier-half" x={-HALF} y={-HALF} width={HALF} height={SIZE} />
						{:else}
							<path
								class="carrier-half"
								d={`M0,-${HALF + 2} L-${HALF + 2},0 L0,${HALF + 2} Z`}
							/>
						{/if}
					{/if}

					<text class="label" y={-HALF - 10} text-anchor="middle">{individual.label}</text>

					{#if showGenotypes && genotype.text}
						<text
							class="genotype"
							class:inferred={genotype.inferred}
							y={HALF + 14}
							text-anchor="middle"
						>
							{genotype.text}{genotype.uncertain ? '*' : ''}
						</text>
					{/if}

					{#if individual.name}
						<text class="name" y={showGenotypes && genotype.text ? HALF + 27 : HALF + 14} text-anchor="middle">
							{individual.name}
						</text>
					{/if}
				</g>
			{/each}
		</g>
	</svg>

	{#if menu}
		<div
			bind:this={menuEl}
			class="menu"
			style={menuStyle}
			role="menu"
			aria-label={menu.kind === 'person' ? 'Individual actions' : 'Relationship actions'}
		>
			{#if menuPerson}
				<p class="menu-title">
					{menuPerson.label}
					<span class="menu-sub">
						{menuPerson.sex === 'male'
							? 'male'
							: menuPerson.sex === 'female'
								? 'female'
								: 'sex unspecified'}{menuPerson.vital === 'deceased' ? ' · deceased' : ''}
					</span>
				</p>
				<button type="button" class="menu-item" role="menuitem" onclick={() => menuSelect(menuPerson.id)}>
					<Pencil size={13} aria-hidden="true" /> Edit details
				</button>

				<p class="menu-label">Sex</p>
				{#each sexActions as action (action.value)}
					<button
						type="button"
						class="menu-item"
						role="menuitemradio"
						aria-checked={menuPerson.sex === action.value}
						onclick={() => menuPatch(menuPerson.id, { sex: action.value, genotype: '' })}
					>
						{#if menuPerson.sex === action.value}
							<Check size={13} aria-hidden="true" />
						{:else}
							<span class="menu-dot" aria-hidden="true"></span>
						{/if}
						{action.label}
					</button>
				{/each}

				<p class="menu-label">Phenotype</p>
				{#each statusActions as action (action.value)}
					<button
						type="button"
						class="menu-item"
						role="menuitemradio"
						aria-checked={menuPerson.status === action.value}
						onclick={() => menuPatch(menuPerson.id, { status: action.value })}
					>
						{#if menuPerson.status === action.value}
							<Check size={13} aria-hidden="true" />
						{:else}
							<span class="menu-dot" aria-hidden="true"></span>
						{/if}
						{action.label}
					</button>
				{/each}

				<p class="menu-label">Carrier status</p>
				{#each carrierActions as action (action.value)}
					<button
						type="button"
						class="menu-item"
						role="menuitemradio"
						aria-checked={(menuPerson.carrier ?? 'unknown') === action.value}
						onclick={() => menuPatch(menuPerson.id, { carrier: action.value })}
					>
						{#if (menuPerson.carrier ?? 'unknown') === action.value}
							<Check size={13} aria-hidden="true" />
						{:else}
							<span class="menu-dot" aria-hidden="true"></span>
						{/if}
						{action.label}
					</button>
				{/each}

				<div class="menu-sep" role="separator"></div>

				<button
					type="button"
					class="menu-item"
					role="menuitem"
					onclick={() =>
						menuPatch(menuPerson.id, {
							vital: menuPerson.vital === 'deceased' ? 'alive' : 'deceased'
						})}
				>
					{#if menuPerson.vital === 'deceased'}
						<X size={13} aria-hidden="true" /> Mark as living
					{:else}
						<X size={13} aria-hidden="true" /> Mark as deceased
					{/if}
				</button>
				<button
					type="button"
					class="menu-item"
					role="menuitem"
					onclick={() => {
						menu = null;
						onrequestpartner(menuPerson.id);
					}}
				>
					<UserPlus size={13} aria-hidden="true" /> Add a partner
				</button>
				<button
					type="button"
					class="menu-item danger"
					role="menuitem"
					onclick={() => {
						const id = menuPerson.id;
						menu = null;
						ondeleteindividual(id);
					}}
				>
					<Trash2 size={13} aria-hidden="true" /> Delete individual
				</button>
			{:else if menuUnion}
				<p class="menu-title">
					{menuUnion.a.label} + {menuUnion.b.label}
					<span class="menu-sub">{menuUnion.children.length} child{menuUnion.children.length === 1 ? '' : 'ren'}</span>
				</p>
				<button
					type="button"
					class="menu-item"
					role="menuitemradio"
					aria-checked={menuUnion.relationship === 'married'}
					onclick={() => {
						menu = null;
						onrelationship(menuUnion.id, 'married');
					}}
				>
					{#if menuUnion.relationship === 'married'}
						<Check size={13} aria-hidden="true" />
					{:else}
						<span class="menu-dot" aria-hidden="true"></span>
					{/if}
					Married / partners
				</button>
				<button
					type="button"
					class="menu-item"
					role="menuitemradio"
					aria-checked={menuUnion.relationship === 'divorced'}
					onclick={() => {
						menu = null;
						onrelationship(menuUnion.id, 'divorced');
					}}
				>
					{#if menuUnion.relationship === 'divorced'}
						<Check size={13} aria-hidden="true" />
					{:else}
						<span class="menu-dot" aria-hidden="true"></span>
					{/if}
					Divorced / separated
				</button>
				{#if menuUnion.blocked}
					<p class="menu-note">Same-sex relationship — this toolkit does not attach biological children.</p>
				{/if}
				<div class="menu-sep" role="separator"></div>
				<button
					type="button"
					class="menu-item danger"
					role="menuitem"
					onclick={() => {
						const id = menuUnion.id;
						menu = null;
						onremovepartnership(id);
					}}
				>
					<Trash2 size={13} aria-hidden="true" /> Remove relationship
				</button>
			{/if}
		</div>
	{/if}

	{#if pedigree.individuals.length === 0}
		<div class="canvas-empty">
			<p class="canvas-empty-title">Start a pedigree</p>
			<p class="canvas-empty-text">
				Pick a symbol from the toolbar and click anywhere on the canvas. Drag one person onto another to
				link them, then drag a person onto the <strong>branch below a couple</strong> to make them a child.
				Right-click a person or a link for quick actions.
			</p>
		</div>
	{/if}
</div>

<style>
	.canvas-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 520px;
		background:
			linear-gradient(var(--surface-2) 1px, transparent 1px) 0 0 / 100% 24px,
			var(--surface-2);
		border-radius: var(--r-md);
		overflow: hidden;
	}

	.canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		touch-action: none;
	}

	.node {
		cursor: pointer;
	}

	.node:focus-visible {
		outline: none;
	}

	.node:focus-visible .select-ring {
		stroke-dasharray: 3 3;
	}

	.shape {
		fill: var(--surface);
		stroke: var(--text);
		stroke-width: 1.7;
		transition: fill var(--dur-1) var(--ease-out);
	}

	.shape.affected {
		fill: var(--text);
	}

	.shape.unknown {
		stroke-dasharray: 4 3.5;
	}

	.deceased-line {
		stroke: var(--text);
		stroke-width: 1.7;
		pointer-events: none;
	}

	.carrier-half {
		fill: var(--text);
	}

	.link {
		stroke: var(--border-strong);
		stroke-width: 1.6;
		fill: none;
		pointer-events: none;
	}

	.divorce-mark {
		stroke: var(--text);
		stroke-width: 2;
		pointer-events: none;
	}

	.link.drop-hot {
		stroke: var(--accent-strong);
		stroke-width: 2.2;
	}

	.drop-branch {
		stroke: var(--accent);
		stroke-width: 1.6;
		stroke-dasharray: 4 3;
		pointer-events: none;
	}

	.drop-branch.hot {
		stroke: var(--accent-strong);
		stroke-width: 3;
		stroke-dasharray: none;
	}

	.link-hit {
		stroke: transparent;
		stroke-width: 22;
		pointer-events: stroke;
		cursor: context-menu;
	}

	.generation-guide {
		stroke: var(--border);
		stroke-width: 1;
		stroke-dasharray: 2 6;
		opacity: 0.7;
		pointer-events: none;
	}

	.generation-label {
		font-family: var(--font-sans);
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--text-muted);
		opacity: 0.7;
		pointer-events: none;
	}

	.drop-target {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.6;
		stroke-dasharray: 3 2;
		pointer-events: none;
		transition: r var(--dur-1) var(--ease-out);
	}

	.drop-target.hot {
		fill: var(--accent-soft);
		stroke: var(--accent-strong);
		stroke-width: 2.4;
		stroke-dasharray: none;
	}

	.drop-target.blocked {
		stroke: var(--warning);
	}

	.union-tag {
		font-family: var(--font-sans);
		font-size: 9.5px;
		fill: var(--text-muted);
		pointer-events: none;
	}

	.select-ring {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
	}

	.label {
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		fill: var(--text-muted);
		letter-spacing: 0.01em;
	}

	.name {
		font-family: var(--font-sans);
		font-size: 10px;
		fill: var(--text-muted);
	}

	.genotype {
		font-family: var(--font-mono);
		font-size: 10px;
		fill: var(--text);
	}

	.genotype.inferred {
		fill: var(--accent-strong);
	}

	.menu {
		position: absolute;
		z-index: 20;
		width: 208px;
		max-height: calc(100% - 16px);
		overflow-y: auto;
		padding: 5px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface);
		box-shadow: var(--shadow-lg);
	}

	.menu-title {
		padding: 5px 8px 4px;
		font-size: 0.75rem;
		font-weight: 620;
		line-height: 1.35;
	}

	.menu-sub {
		display: block;
		font-size: 0.6875rem;
		font-weight: 450;
		color: var(--text-muted);
	}

	.menu-label {
		padding: 6px 8px 2px;
		font-size: 0.625rem;
		font-weight: 650;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 7px;
		width: 100%;
		padding: 5px 8px;
		border: 0;
		border-radius: var(--r-xs);
		background: transparent;
		color: var(--text-2);
		font-size: 0.75rem;
		font-weight: 500;
		text-align: left;
	}

	.menu-item:hover,
	.menu-item:focus-visible {
		background: var(--surface-2);
		outline: none;
	}

	.menu-item.danger {
		color: var(--error);
	}

	.menu-item.danger:hover,
	.menu-item.danger:focus-visible {
		background: var(--error-soft);
	}

	.menu-dot {
		width: 13px;
		height: 13px;
		flex: none;
	}

	.menu-note {
		padding: 4px 8px 6px;
		font-size: 0.6875rem;
		line-height: 1.45;
		color: var(--warning);
	}

	.menu-sep {
		height: 1px;
		margin: 4px 2px;
		background: var(--border);
	}

	.canvas-empty {
		position: absolute;
		inset: auto 0 0 0;
		top: 50%;
		transform: translateY(-50%);
		margin: 0 auto;
		max-width: 380px;
		padding: 0 20px;
		text-align: center;
		pointer-events: none;
	}

	.canvas-empty-title {
		font-size: 0.9375rem;
		font-weight: 620;
		margin-bottom: 6px;
	}

	.canvas-empty-text {
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--text-muted);
	}

	.canvas-empty-text :global(strong) {
		color: var(--text-2);
		font-weight: 600;
	}

	@media (max-width: 720px) {
		.canvas-wrap {
			min-height: 420px;
		}
	}
</style>
