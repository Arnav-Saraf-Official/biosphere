<script lang="ts">
	import type { OrfRegion, SequenceType, UntranslatedRegion } from '$lib/types/genetics';
	import {
		complementSequence,
		dnaPairedWithRna,
		validateSequence
	} from '$lib/genetics/nucleotide/complement';
	import { detectOrfs } from '$lib/genetics/codons/orf-detection';
	import { reverseComplementFor, translateFrame } from '$lib/genetics/codons/translation';
	import OrfView from '$lib/components/gene/OrfView.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { AlertTriangle, Info, RotateCcw, Sparkles } from 'lucide-svelte';

	interface ViewResult {
		regions: OrfRegion[];
		untranslated: UntranslatedRegion[];
		warnings: string[];
	}

	const EXAMPLE = 'GGGATGGCCTACGGTTAACCATGAAATTTTAAGGGG';

	let input = $state('');
	let typeMode = $state<'auto' | SequenceType>('auto');
	let frame = $state(0);
	let labels = $state<Record<string, string>>({});

	const validation = $derived(
		validateSequence(input, { type: typeMode, maxLength: settings.maxSequenceLength })
	);

	const hasSequence = $derived(validation.sequence.length > 0);
	const blockingError = $derived(validation.error);

	const translation = $derived.by((): ViewResult | null => {
		if (!hasSequence || blockingError) return null;
		// The analysis always runs on RNA. RNA input is used exactly as pasted; a DNA
		// strand is base-paired with its RNA transcript first (A->U, T->A, C->G, G->C),
		// so DNA ATGC becomes RNA UACG.
		const rna =
			validation.type === 'rna'
				? validation.sequence
				: complementSequence(validation.sequence, 'dna', 'rna');

		if (settings.gene.readingMode === 'frame') {
			const displayed =
				settings.gene.strand === 'reverse' ? reverseComplementFor(rna, 'rna') : rna;
			const summary = translateFrame(displayed, frame, 'rna');
			if (summary.blocks.length === 0) return null;
			const region: OrfRegion = {
				id: `frame-${frame}-${settings.gene.strand}`,
				label: `Reading frame ${frame + 1}`,
				frame,
				strand: settings.gene.strand === 'reverse' ? 'reverse' : 'forward',
				start: frame,
				end: frame + summary.blocks.length * 3,
				codons: summary.blocks,
				proteinLength: summary.protein.length,
				complete: summary.complete
			};
			return {
				regions: [region],
				untranslated: [],
				warnings: summary.complete
					? []
					: ['No in-frame stop codon was found before the end of the sequence.']
			};
		}

		return detectOrfs(rna, 'rna', {
			strand: settings.gene.strand,
			frame: 'all',
			minProteinLength: settings.gene.minProteinLength
		});
	});

	const REGION_LIMIT = 40;
	const hiddenRegions = $derived(
		translation ? Math.max(0, translation.regions.length - REGION_LIMIT) : 0
	);

	type ResultItem =
		| { kind: 'region'; key: string; region: OrfRegion }
		| { kind: 'utr'; key: string; utr: UntranslatedRegion };

	const typeOptions: Array<{ value: 'auto' | SequenceType; label: string }> = [
		{ value: 'auto', label: 'Auto' },
		{ value: 'dna', label: 'DNA' },
		{ value: 'rna', label: 'RNA' }
	];

	/**
	 * Reading frames and untranslated stretches interleaved in nucleotide order, so
	 * each untranslated region sits between the frames it actually separates.
	 */
	const timeline = $derived.by((): ResultItem[] => {
		if (!translation) return [];
		const items: ResultItem[] = translation.regions
			.slice(0, REGION_LIMIT)
			.map((region) => ({ kind: 'region' as const, key: region.id, region }));
		if (settings.gene.showUntranslated) {
			for (const utr of translation.untranslated) {
				items.push({ kind: 'utr', key: utr.id, utr });
			}
		}
		return items.sort((a, b) => {
			const startA = a.kind === 'region' ? a.region.start : a.utr.start;
			const startB = b.kind === 'region' ? b.region.start : b.utr.start;
			return startA - startB;
		});
	});

	function loadExample() {
		input = EXAMPLE;
		typeMode = 'auto';
		labels = {};
	}

	function clearAll() {
		input = '';
		labels = {};
	}
</script>

<svelte:head>
	<title>Gene Analyzer · Biosphere</title>
	<meta
		name="description"
		content="Translate nucleotide sequences, detect open reading frames on both strands, and inspect codon-aligned proteins."
	/>
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<p class="eyebrow">Sequence translation</p>
		<h1>Gene Analyzer</h1>
		<p class="page-desc">
			Paste DNA or RNA and translate it with the standard genetic code. Detected regions are
			reported as predicted open reading frames — not as validated gene annotations.
		</p>
	</div>
	<div class="head-actions">
		<button type="button" class="btn" onclick={loadExample}>
			<Sparkles size={14} aria-hidden="true" /> Load example
		</button>
		<button type="button" class="btn" onclick={clearAll} disabled={!input}>
			<RotateCcw size={14} aria-hidden="true" /> Clear
		</button>
	</div>
</header>

<div class="layout">
	<section class="panel input-panel">
		<div class="panel-head">
			<div>
				<p class="panel-title">Nucleotide sequence</p>
				<p class="panel-desc">
					FASTA headers, line breaks, and numbering are ignored. DNA and RNA are both accepted.
				</p>
			</div>
			<span class="badge badge-{validation.type === 'rna' ? 'info' : 'accent'}">
				{validation.type.toUpperCase()}
			</span>
		</div>

		<div class="panel-body">
			<label class="sr-only" for="sequence">Nucleotide sequence</label>
			<textarea
				id="sequence"
				class="textarea textarea-mono sequence-input"
				class:textarea-invalid={Boolean(blockingError)}
				bind:value={input}
				placeholder="> example ORF&#10;GGGATGGCCTACGGTTAACCATGAAATTTTAAGGGG"
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"
				aria-describedby="sequence-help"
			></textarea>

			<div class="input-meta" id="sequence-help">
				<span class="mono">{validation.cleanedLength.toLocaleString()} nt</span>
				{#if validation.hasFastaHeader}<span class="badge">FASTA header</span>{/if}
				{#if validation.strippedNonLetters > 0}
					<span class="badge">{validation.strippedNonLetters} non-letter characters skipped</span>
				{/if}
				{#if validation.detectedType === 'ambiguous'}
					<span class="badge badge-warning">T and U both present</span>
				{/if}
				{#if validation.isTooLong}
					<span class="badge badge-warning">truncated to limit</span>
				{/if}
			</div>

			{#if blockingError}
				<div class="notice notice-error" role="alert">
					<AlertTriangle size={15} class="notice-icon" aria-hidden="true" />
					<span>{blockingError}</span>
				</div>
			{:else if validation.warning}
				<div class="notice notice-warning">
					<Info size={15} class="notice-icon" aria-hidden="true" />
					<span>{validation.warning}</span>
				</div>
			{/if}
		</div>
	</section>

	<section class="panel options-panel">
		<div class="panel-head">
			<div>
				<p class="panel-title">Analysis options</p>
				<p class="panel-desc">Controls for parsing, frames, and display.</p>
			</div>
		</div>

		<div class="panel-body options-body">
			<div class="field">
				<span class="label">
					Is this DNA or RNA?
					<Tooltip text="RNA is translated exactly as pasted. A DNA strand is base-paired with its RNA transcript (A → U, T → A, C → G, G → C) and that RNA is translated. Auto looks for T versus U." />
				</span>
				<div class="seg" role="group" aria-label="Sequence type">
					{#each typeOptions as option (option.value)}
						<button
							type="button"
							class="seg-item"
							aria-pressed={typeMode === option.value}
							onclick={() => (typeMode = option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="field">
				<span class="label">Mode</span>
				<div class="seg" role="group" aria-label="Analysis mode">
					<button
						type="button"
						class="seg-item"
						aria-pressed={settings.gene.readingMode === 'orf'}
						onclick={() => (settings.gene.readingMode = 'orf')}
					>
						ORF detection
					</button>
					<button
						type="button"
						class="seg-item"
						aria-pressed={settings.gene.readingMode === 'frame'}
						onclick={() => (settings.gene.readingMode = 'frame')}
					>
						Frame translation
					</button>
				</div>
			</div>

			<div class="field">
				<label class="label" for="strand">
					Strand
					<Tooltip text="Reverse-strand analysis translates the reverse complement. In all-six-frame mode both strands are scanned." />
				</label>
				<select id="strand" class="select" bind:value={settings.gene.strand}>
					<option value="forward">Forward only</option>
					<option value="reverse">Reverse only</option>
					<option value="both">Both strands (six frames)</option>
				</select>
			</div>

			{#if settings.gene.readingMode === 'frame'}
				<div class="field">
					<label class="label" for="frame">Reading frame</label>
					<select id="frame" class="select" bind:value={frame}>
						<option value={0}>Frame 1 (offset 0)</option>
						<option value={1}>Frame 2 (offset 1)</option>
						<option value={2}>Frame 3 (offset 2)</option>
					</select>
				</div>
			{:else}
				<div class="field">
					<label class="label" for="min-length">
						Minimum protein length
						<Tooltip text="Detected regions shorter than this many amino acids are hidden." />
					</label>
					<input
						id="min-length"
						class="input mono"
						type="number"
						min="1"
						max="500"
						bind:value={settings.gene.minProteinLength}
					/>
				</div>
			{/if}

			<hr class="divider" />

			<Toggle
				bind:checked={settings.gene.showProteins}
				label="Show protein names"
				hint="Unnamed regions are labelled as predicted ORFs."
			/>
			<Toggle
				bind:checked={settings.gene.showUntranslated}
				label="Show untranslated nucleotides"
				hint="Nucleotides outside detected ORFs, shown between the reading frames they separate."
			/>
		</div>
	</section>
</div>

<section class="panel results" aria-live="polite">
	<div class="panel-head">
		<div>
			<p class="panel-title">Translation</p>
			<p class="panel-desc">
				Each reading frame shows the DNA strand above the RNA it pairs with, and the amino acid
				under the RNA codon that produced it. Untranslated stretches appear where they fall in the
				sequence.
			</p>
		</div>
		{#if translation}
			<span class="badge">{translation.regions.length} region{translation.regions.length === 1 ? '' : 's'}</span>
		{/if}
	</div>

	<div class="panel-body">
		{#if !hasSequence}
			<EmptyState
				title="No sequence yet"
				description="Paste a nucleotide sequence above, or load the example. Valid characters are A, C, G, T (DNA) or A, C, G, U (RNA), plus IUPAC ambiguity codes such as N, R, and Y."
			>
				<button type="button" class="btn btn-sm" onclick={loadExample}>
					<Sparkles size={13} aria-hidden="true" /> Load example
				</button>
			</EmptyState>
		{:else if !translation}
			<p class="muted small">No translation could be produced from this input with the current options.</p>
		{:else}
			{#if translation.warnings.length > 0}
				<div class="notice notice-warning warnings">
					<Info size={15} class="notice-icon" aria-hidden="true" />
					<div>
						{#each translation.warnings as warning, index (index)}
							<p>{warning}</p>
						{/each}
					</div>
				</div>
			{/if}

			{#if translation.regions.length === 0}
				<div class="notice notice-info">
					<Info size={15} class="notice-icon" aria-hidden="true" />
					<span>
						No open reading frames matched. Try lowering the minimum protein length, scanning both
						strands, or choosing a specific reading frame.
					</span>
				</div>
			{:else}
				<div class="regions">
					{#each timeline as item (item.key)}
						{#if item.kind === 'region'}
							<div class="region">
								<div class="region-label">
									<label class="label" for={`label-${item.region.id}`}>
										Protein label
										<Tooltip text="Biosphere does not invent protein names. Anything you type here is your own annotation." />
									</label>
									<input
										id={`label-${item.region.id}`}
										class="input input-sm"
										placeholder={item.region.label}
										value={labels[item.region.id] ?? ''}
										oninput={(event) =>
											(labels = { ...labels, [item.region.id]: event.currentTarget.value })}
									/>
								</div>
								<OrfView
									region={item.region}
									showProtein={settings.gene.showProteins}
									label={labels[item.region.id] ?? ''}
								/>
							</div>
						{:else}
							<div class="utr">
								<div class="utr-head">
									<span class="mono utr-range">nt {item.utr.start + 1}–{item.utr.end}</span>
									<span class="utr-reason">{item.utr.reason}</span>
									<span class="badge">{item.utr.bases.length} nt</span>
								</div>
								<div class="utr-rows">
									<span class="row-label">DNA</span>
									<p class="utr-seq mono">{dnaPairedWithRna(item.utr.bases.join(''))}</p>
									<span class="row-label">RNA</span>
									<p class="utr-seq mono">{item.utr.bases.join('')}</p>
								</div>
							</div>
						{/if}
					{/each}

					{#if hiddenRegions > 0}
						<p class="hidden-note">
							{hiddenRegions} further region{hiddenRegions === 1 ? '' : 's'} not rendered. Raise the
							minimum protein length to focus on longer reading frames.
						</p>
					{/if}
				</div>
			{/if}

			<details class="limitations">
				<summary>What this tool does and does not do</summary>
				<ul>
					<li>Translation uses the standard genetic code (NCBI table 1) and complete codons only.</li>
					<li>
						Detected regions are <strong>predicted open reading frames</strong>: a start codon
						followed by the first in-frame stop. They are not validated genes.
					</li>
					<li>
						For DNA input the pasted strand is treated as the template: its base-paired RNA
						transcript is what gets translated.
					</li>
					<li>
						Genomic DNA containing introns will not produce the correct mature protein — no splicing
						or reference annotation is performed.
					</li>
					<li>Stop codons are shown as <span class="mono">Ter</span> and are never treated as amino acids.</li>
					<li>Protein names are only shown when you supply them.</li>
				</ul>
			</details>
		{/if}
	</div>
</section>

<style>
	.page-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
		flex-wrap: wrap;
		margin-bottom: 18px;
	}

	.head-text {
		max-width: 62ch;
	}

	.page-desc {
		margin-top: 5px;
		color: var(--text-muted);
		font-size: 0.8125rem;
		line-height: 1.55;
	}

	.head-actions {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.55fr) minmax(280px, 1fr);
		gap: 14px;
		align-items: start;
	}

	.sequence-input {
		min-height: 190px;
		font-size: 0.8125rem;
		line-height: 1.8;
	}

	.input-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 8px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.notice {
		margin-top: 10px;
	}

	.options-body {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.seg {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--surface-inset);
		align-self: flex-start;
	}

	.seg-item {
		padding: 5px 10px;
		border: 0;
		background: transparent;
		font-size: 0.75rem;
		font-weight: 540;
		color: var(--text-muted);
		cursor: pointer;
		transition: background-color var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
	}

	.seg-item + .seg-item {
		border-left: 1px solid var(--border);
	}

	.seg-item[aria-pressed='true'] {
		background: var(--surface);
		color: var(--text);
		box-shadow: var(--shadow-xs);
	}

	.results {
		margin-top: 14px;
	}

	.regions {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.region-label {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 5px;
	}

	.region-label .label {
		white-space: nowrap;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.input-sm {
		height: 27px;
		max-width: 320px;
		font-size: 0.75rem;
	}

	.hidden-note {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.warnings {
		margin-bottom: 12px;
	}

	.utr {
		border: 1px dashed var(--border-strong);
		border-radius: var(--r-md);
		padding: 8px 10px;
		background: var(--surface-inset);
	}

	.utr-rows {
		display: grid;
		grid-template-columns: 2.4em minmax(0, 1fr);
		row-gap: 2px;
		align-items: baseline;
	}

	.utr-rows .utr-seq {
		margin: 0;
	}

	.row-label {
		font-family: var(--font-sans);
		font-size: 8.5px;
		font-weight: 650;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		user-select: none;
	}

	.utr-head {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 4px;
	}

	.utr-range {
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.utr-reason {
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.utr-seq {
		font-size: 0.75rem;
		line-height: 1.7;
		color: var(--text-muted);
		word-break: break-all;
	}

	.limitations {
		margin-top: 18px;
		border-top: 1px solid var(--border);
		padding-top: 10px;
	}

	.limitations summary {
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 560;
		color: var(--text-2);
	}

	.limitations ul {
		margin: 6px 0 0;
		padding-left: 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 0.75rem;
		line-height: 1.55;
		color: var(--text-muted);
	}

	@media (max-width: 980px) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
