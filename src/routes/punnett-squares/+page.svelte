<script lang="ts">
	import { buildPunnett, MAX_LOCI, type PunnettMode } from '$lib/genetics/punnett/punnett';
	import { ArrowLeftRight, RotateCcw, Info } from 'lucide-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { formatPercent } from '$lib/utils/format';
	import { toast } from '$lib/stores/toast.svelte';

	let parent1 = $state('AaBb');
	let parent2 = $state('AaBb');
	let selected = $state<string | null>(null);
	let mode = $state<PunnettMode>('condensed');

	const result = $derived(buildPunnett(parent1, parent2, mode));
	const error = $derived('error' in result ? result.error : null);
	const square = $derived('error' in result ? null : result);

	const selectedOutcome = $derived(
		square && selected ? square.outcomes.find((outcome) => outcome.genotype === selected) ?? null : null
	);

	function reset() {
		parent1 = 'AaBb';
		parent2 = 'AaBb';
		selected = null;
	}

	function swap() {
		const first = parent1;
		parent1 = parent2;
		parent2 = first;
		selected = null;
	}

	function pick(genotype: string) {
		selected = selected === genotype ? null : genotype;
	}

	function setExample(a: string, b: string) {
		parent1 = a;
		parent2 = b;
		selected = null;
	}
</script>

<svelte:head>
	<title>Punnett Squares · Biosphere</title>
	<meta
		name="description"
		content="Generate a Punnett square for up to four independent autosomal loci and inspect genotype probabilities."
	/>
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<p class="eyebrow">Cross prediction</p>
		<h1>Punnett Squares</h1>
		<p class="page-desc">
			Enter a genotype for each parent. The grid grows with the number of possible gametes, and
			every cell is weighted by its gamete probabilities.
		</p>
	</div>
</header>

<section class="panel config">
	<div class="mode-row">
		<div class="mode-control">
			<span class="label">Grid mode</span>
			<div class="seg" role="group" aria-label="Grid mode">
				<button
					type="button"
					class="seg-item"
					aria-pressed={mode === 'condensed'}
					onclick={() => (mode = 'condensed')}
				>
					Condensed
				</button>
				<button
					type="button"
					class="seg-item"
					aria-pressed={mode === 'expanded'}
					onclick={() => (mode = 'expanded')}
				>
					Expanded
				</button>
			</div>
		</div>
		<p class="mode-hint">
			{mode === 'condensed'
				? 'Identical gametes share one row or column.'
				: 'Every allele combination gets its own row and column, so identical gametes repeat in the headers.'}
		</p>
	</div>

	<div class="panel-body config-body">
		<div class="field parent-field">
			<label class="label" for="parent1">
				Parent 1
				<Tooltip text="Write one letter per locus, twice. Uppercase is the dominant allele: Aa, AABb." />
			</label>
			<input
				id="parent1"
				class="input mono input-lg"
				bind:value={parent1}
				placeholder="e.g. AaBb"
				spellcheck="false"
				autocapitalize="off"
				class:input-invalid={Boolean(error)}
			/>
		</div>

		<button type="button" class="icon-btn swap" onclick={swap} aria-label="Swap parents">
			<ArrowLeftRight size={16} aria-hidden="true" />
		</button>

		<div class="field parent-field">
			<label class="label" for="parent2">Parent 2</label>
			<input
				id="parent2"
				class="input mono input-lg"
				bind:value={parent2}
				placeholder="e.g. AaBb"
				spellcheck="false"
				autocapitalize="off"
				class:input-invalid={Boolean(error)}
			/>
		</div>

		<div class="config-actions">
			<button type="button" class="btn" onclick={reset}>
				<RotateCcw size={14} aria-hidden="true" /> Reset
			</button>
		</div>
	</div>

	<div class="examples">
		<span class="examples-label">Examples</span>
		<button type="button" class="chip" onclick={() => setExample('Aa', 'Aa')}>Aa × Aa</button>
		<button type="button" class="chip" onclick={() => setExample('AaBb', 'AaBb')}>AaBb × AaBb</button>
		<button type="button" class="chip" onclick={() => setExample('AABb', 'aabb')}>AABb × aabb</button>
		<button type="button" class="chip" onclick={() => setExample('AaBbCc', 'AaBbCc')}>
			AaBbCc × AaBbCc
		</button>
	</div>

	{#if error}
		<p class="config-error" role="alert">{error}</p>
	{:else}
		<p class="config-note">
			<Info size={12} aria-hidden="true" />
			Up to {MAX_LOCI} independent loci. Linkage and recombination are not modelled — loci are treated
			as independently assorting.
		</p>
	{/if}
</section>

{#if square}
	<div class="layout">
		<section class="panel grid-panel" aria-live="polite">
			<div class="panel-head">
				<div>
					<p class="panel-title">{square.gametes1.length} × {square.gametes2.length} square</p>
					<p class="panel-desc">
						{square.parent1} × {square.parent2} — {square.totalOutcomes} equally likely outcomes
					</p>
				</div>
				{#if selectedOutcome}
					<button type="button" class="badge badge-accent" onclick={() => (selected = null)}>
						Clear selection
					</button>
				{/if}
			</div>

			<div class="panel-body">
				<div class="grid-scroll">
					<div
						class="grid"
						style={`--gametes: ${square.gametes2.length}`}
						role="table"
						aria-label="Punnett square"
					>
						<div class="corner" role="columnheader" aria-label="Parents"></div>
						{#each square.gametes2 as gamete, col (col)}
							<div class="header-cell" role="columnheader">
								<span class="mono">{gamete.alleles}</span>
								{#if gamete.probability < 1}
									<span class="gamete-prob">{formatPercent(gamete.probability, 0)}</span>
								{/if}
							</div>
						{/each}

						{#each square.gametes1 as rowGamete, row (row)}
							<div class="header-cell row-header" role="rowheader">
								<span class="mono">{rowGamete.alleles}</span>
								{#if rowGamete.probability < 1}
									<span class="gamete-prob">{formatPercent(rowGamete.probability, 0)}</span>
								{/if}
							</div>

							{#each square.gametes2 as colGamete, col (col)}
								{@const cell = square.cells.find(
									(candidate) => candidate.row === row && candidate.col === col
								)}
								{@const index = cell ? square.outcomes.find((o) => o.genotype === cell.genotype)?.colorIndex ?? 0 : 0}
								{@const isDim = selected !== null && cell?.genotype !== selected}
								<button
									type="button"
									class="cell"
									class:selected={selected !== null && cell?.genotype === selected}
									class:dim={isDim}
									aria-pressed={selected !== null && cell?.genotype === selected}
									aria-label={`Offspring ${cell?.genotype}, ${formatPercent(cell?.probability ?? 0)}`}
									style={`--cell-bg: var(--geno-${(index % 10) + 1}-bg); --cell-fg: var(--geno-${(index % 10) + 1}-fg)`}
									onclick={() => cell && pick(cell.genotype)}
								>
									<span class="mono cell-genotype">{cell?.genotype}</span>
								</button>
							{/each}
						{/each}
					</div>
				</div>

				{#if selectedOutcome}
					<div class="selection-bar" aria-live="polite">
						<span class="mono selection-genotype">{selectedOutcome.genotype}</span>
						<span class="selection-arrow">—</span>
						<span class="selection-prob">{formatPercent(selectedOutcome.probability)} probability</span>
						<span class="selection-count">
							{selectedOutcome.count} of {square.totalOutcomes} cells
						</span>
					</div>
				{:else}
					<p class="selection-hint">
						Select a cell or an outcome below to highlight every matching offspring genotype.
						Hovering a cell shows the gametes that produced it.
					</p>
				{/if}
			</div>
		</section>

		<section class="panel outcomes" aria-live="polite">
			<div class="panel-head">
				<div>
					<p class="panel-title">Offspring genotypes</p>
					<p class="panel-desc">
						{square.outcomes.length} distinct genotype{square.outcomes.length === 1 ? '' : 's'}
					</p>
				</div>
			</div>

			<ul class="outcome-list">
				{#each square.outcomes as outcome (outcome.genotype)}
					{@const index = outcome.colorIndex % 10}
					<li>
						<button
							type="button"
							class="outcome"
							class:active={selected === outcome.genotype}
							aria-pressed={selected === outcome.genotype}
							onclick={() => pick(outcome.genotype)}
						>
							<span
								class="swatch"
								style={`background: var(--geno-${index + 1}-bg); border-color: var(--geno-${index + 1}-fg)`}
							></span>
							<span class="outcome-genotype mono">{outcome.genotype}</span>
							<span class="outcome-bar">
								<span
									class="outcome-fill"
									style={`width: ${outcome.probability * 100}%; background: var(--geno-${index + 1}-fg)`}
								></span>
							</span>
							<span class="outcome-value mono">{formatPercent(outcome.probability)}</span>
						</button>
					</li>
				{/each}
			</ul>

			<p class="outcome-note">
				Probabilities are gamete-weighted: each cell's probability is the product of the two gamete
				probabilities, so repeated genotypes are summed rather than counted.
			</p>
		</section>
	</div>
{/if}

<style>
	.page-head {
		max-width: 62ch;
		margin-bottom: 18px;
	}

	.page-desc {
		margin-top: 5px;
		color: var(--text-muted);
		font-size: 0.8125rem;
		line-height: 1.55;
	}

	.config-body {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		flex-wrap: wrap;
	}

	.parent-field {
		width: 210px;
	}

	.input-lg {
		height: 36px;
		font-size: 0.9375rem;
		letter-spacing: 0.06em;
	}

	.swap {
		margin-bottom: 4px;
	}

	.config-actions {
		margin-left: auto;
		padding-bottom: 2px;
	}

	.examples {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		padding: 0 16px 12px;
	}

	.examples-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		font-weight: 600;
	}

	.mode-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 16px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border);
	}

	.mode-control {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.mode-hint {
		flex: 1;
		min-width: 220px;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.config-note {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 0 16px 12px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.config-error {
		padding: 0 16px 12px;
		font-size: 0.75rem;
		color: var(--error);
		line-height: 1.5;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 14px;
		align-items: start;
	}

	.grid-scroll {
		overflow-x: auto;
		padding-bottom: 2px;
	}

	.grid {
		display: grid;
		grid-template-columns: 60px repeat(var(--gametes), minmax(58px, 1fr));
		gap: 4px;
		min-width: fit-content;
	}

	.corner {
		border-radius: var(--r-sm);
		background: var(--surface-inset);
		border: 1px solid var(--border);
	}

	.header-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-height: 34px;
		padding: 4px 6px;
		border-radius: var(--r-sm);
		background: var(--surface-2);
		border: 1px solid var(--border);
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-2);
	}

	.gamete-prob {
		font-size: 0.625rem;
		font-weight: 500;
		color: var(--text-muted);
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 6px 4px;
		border: 1px solid transparent;
		border-radius: var(--r-sm);
		background: var(--cell-bg);
		color: var(--cell-fg);
		transition:
			opacity var(--dur-2) var(--ease-out),
			transform var(--dur-1) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out);
	}

	.cell:hover {
		box-shadow: var(--shadow-sm);
	}

	.cell:active {
		transform: scale(0.97);
	}

	.cell.selected {
		box-shadow: 0 0 0 2px var(--accent-strong) inset;
		font-weight: 700;
	}

	.cell.dim {
		opacity: 0.42;
	}

	.cell-genotype {
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.selection-bar {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: 12px;
		padding: 8px 12px;
		border-radius: var(--r-md);
		background: var(--accent-soft);
		border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent);
		font-size: 0.8125rem;
	}

	.selection-genotype {
		font-weight: 700;
		font-size: 0.9375rem;
	}

	.selection-prob {
		font-weight: 560;
	}

	.selection-count {
		margin-left: auto;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.selection-hint {
		margin-top: 12px;
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.55;
	}

	.outcomes {
		position: sticky;
		top: 16px;
	}

	.outcome-list {
		list-style: none;
		margin: 0;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-height: 560px;
		overflow-y: auto;
	}

	.outcome {
		display: grid;
		grid-template-columns: 12px 1fr 62px 52px;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 5px 7px;
		border: 1px solid transparent;
		border-radius: var(--r-sm);
		background: transparent;
		text-align: left;
		font-size: 0.8125rem;
	}

	.outcome:hover {
		background: var(--surface-2);
	}

	.outcome.active {
		border-color: color-mix(in srgb, var(--accent) 40%, transparent);
		background: var(--accent-soft);
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		border: 1px solid;
	}

	.outcome-genotype {
		font-weight: 600;
	}

	.outcome-bar {
		height: 5px;
		border-radius: var(--r-full);
		background: var(--surface-3);
		overflow: hidden;
	}

	.outcome-fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		transition: width var(--dur-3) var(--ease-out);
	}

	.outcome-value {
		text-align: right;
		font-size: 0.75rem;
		color: var(--text-2);
	}

	.outcome-note {
		padding: 4px 14px 14px;
		font-size: 0.6875rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	@media (max-width: 980px) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.outcomes {
			position: static;
		}
		.config-actions {
			margin-left: 0;
		}
	}
</style>
