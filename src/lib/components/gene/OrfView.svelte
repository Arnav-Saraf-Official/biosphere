<script lang="ts">
	import type { OrfRegion } from '$lib/types/genetics';
	import { dnaPairedWithRna } from '$lib/genetics/nucleotide/complement';

	let {
		region,
		showProtein = true,
		label = '',
		maxCodons = 480
	}: {
		region: OrfRegion;
		showProtein?: boolean;
		label?: string;
		maxCodons?: number;
	} = $props();

	const CODES_PER_ROW = 16;

	const visible = $derived(region.codons.slice(0, maxCodons));
	const truncated = $derived(region.codons.length > maxCodons);
	const chunks = $derived.by(() => {
		const out: typeof visible[] = [];
		for (let i = 0; i < visible.length; i += CODES_PER_ROW) {
			out.push(visible.slice(i, i + CODES_PER_ROW));
		}
		return out;
	});

	const proteinName = $derived(label.trim() || region.label);
</script>

<article class="orf">
	<header class="orf-head">
		<div class="orf-title">
			<h3>{proteinName}</h3>
			<div class="orf-badges">
				<span class="badge">Frame {region.frame + 1}</span>
				<span class="badge">{region.strand === 'forward' ? 'forward strand' : 'reverse strand'}</span>
				<span class="badge">{region.proteinLength} aa</span>
				<span class="badge" class:badge-warning={!region.complete}>
					{region.complete ? 'stop codon' : 'no stop codon'}
				</span>
			</div>
		</div>
		<p class="orf-coords mono">
			nt {region.start + 1}–{region.end}
		</p>
	</header>

	<div class="sequence">
		{#each chunks as chunk, chunkIndex (chunkIndex)}
			<div class="chunk" style={`--cols: ${chunk.length * 3}`}>
				<span class="row-label">DNA</span>
				{#each chunk as codon (codon.index)}
					{#each codon.bases as base, baseIndex (baseIndex)}
						<span
							class="base"
							class:codon-start={baseIndex === 0}
							class:stop={codon.aminoAcid.isStop}>{dnaPairedWithRna(base)}</span
						>
					{/each}
				{/each}

				<span class="row-label">RNA</span>
				{#each chunk as codon (codon.index)}
					{#each codon.bases as base, baseIndex (baseIndex)}
						<span
							class="base rna"
							class:codon-start={baseIndex === 0}
							class:stop={codon.aminoAcid.isStop}>{base}</span
						>
					{/each}
				{/each}

				<span class="row-label" aria-hidden="true"></span>
				{#each chunk as codon (codon.index)}
					<button
						type="button"
						class="aa"
						class:stop={codon.aminoAcid.isStop}
						title={`${codon.aminoAcid.name} (${codon.codon})`}
						aria-label={`${codon.aminoAcid.code3}: ${codon.aminoAcid.name}, codon ${codon.codon}`}
					>
						{codon.aminoAcid.code3}
					</button>
				{/each}
			</div>
		{/each}

		{#if truncated}
			<p class="truncated">
				Showing the first {maxCodons} codons of {region.codons.length}. The rest of this region is
				not rendered.
			</p>
		{/if}
	</div>

	{#if showProtein}
		<div class="protein-band">
			<span class="protein-label">{proteinName}</span>
			<span class="protein-meta">
				{region.proteinLength} amino acids · {region.strand === 'forward' ? 'forward' : 'reverse'}
				frame {region.frame + 1}
			</span>
		</div>
	{/if}
</article>

<style>
	.orf {
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--surface);
	}

	.orf + :global(.orf) {
		margin-top: 12px;
	}

	.orf-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 12px;
		border-bottom: 1px solid var(--border);
		background: var(--surface-inset);
		flex-wrap: wrap;
	}

	.orf-title {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.orf-title h3 {
		font-size: 0.8125rem;
		font-weight: 620;
	}

	.orf-badges {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.orf-coords {
		font-size: 0.75rem;
		color: var(--text-muted);
		white-space: nowrap;
	}

	.sequence {
		padding: 10px 12px;
		overflow-x: auto;
	}

	.chunk {
		display: grid;
		grid-template-columns: 2.4em repeat(var(--cols), minmax(9px, 1fr));
		column-gap: 0;
		row-gap: 2px;
		min-width: calc(2.4em + var(--cols) * 10px);
		padding-bottom: 8px;
	}

	.chunk + .chunk {
		border-top: 1px dashed var(--border);
		padding-top: 8px;
	}

	.row-label {
		display: flex;
		align-items: center;
		padding-right: 6px;
		font-family: var(--font-sans);
		font-size: 8.5px;
		font-weight: 650;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		user-select: none;
	}

	.base {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		text-align: center;
		color: var(--text-2);
		border-radius: 2px;
	}

	/* Every third base starts a codon: a subtle tint marks the grouping. */
	.base.codon-start {
		color: var(--text);
		font-weight: 600;
	}

	.base.rna {
		color: var(--accent-strong);
	}

	.base.rna.codon-start {
		color: var(--accent-strong);
	}

	.base.stop {
		color: var(--error);
		background: var(--error-soft);
	}

	.aa {
		grid-column: span 3;
		appearance: none;
		border: 0;
		font-family: inherit;
		line-height: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 1px 0;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent-strong);
		background: var(--accent-soft);
		border-radius: 3px;
		cursor: help;
		overflow: hidden;
		text-overflow: clip;
		white-space: nowrap;
	}

	.aa.stop {
		color: var(--error);
		background: var(--error-soft);
	}

	.aa:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 1px;
	}

	.truncated {
		padding-top: 6px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.protein-band {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 7px 12px;
		border-top: 1px solid var(--border);
		background: var(--surface-2);
	}

	.protein-label {
		font-size: 0.75rem;
		font-weight: 620;
	}

	.protein-meta {
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
