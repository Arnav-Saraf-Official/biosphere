<script lang="ts">
	import type { ConversionMode } from '$lib/genetics/nucleotide/complement';
	import { convert, validateSequence } from '$lib/genetics/nucleotide/complement';
	import type { SequenceType } from '$lib/types/genetics';
	import { settings } from '$lib/stores/settings.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { copyText } from '$lib/utils/format';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { ArrowLeftRight, ArrowRight, Check, Copy, RotateCcw } from 'lucide-svelte';

	let input = $state('');
	let typeMode = $state<'auto' | SequenceType>('auto');
	let target = $state<SequenceType>('dna');
	let mode = $state<ConversionMode>('complement');
	let copied = $state(false);

	const validation = $derived(
		validateSequence(input, { type: typeMode, maxLength: settings.maxSequenceLength })
	);

	const from = $derived<SequenceType>(
		typeMode === 'auto'
			? validation.detectedType === 'rna'
				? 'rna'
				: 'dna'
			: (typeMode as SequenceType)
	);

	const effectiveMode = $derived<ConversionMode>(
		mode === 'transcribe-coding' && from === 'rna' ? 'complement' : mode
	);

	const conversion = $derived(
		validation.sequence.length > 0
			? convert(validation.sequence, {
					from,
					to: effectiveMode === 'transcribe-coding' ? 'rna' : target,
					mode: effectiveMode
				})
			: null
	);

	const invalid = $derived(validation.error !== null);

	async function copy() {
		if (!conversion) return;
		const ok = await copyText(conversion.output);
		copied = ok;
		toast(ok ? 'Converted sequence copied.' : 'Copying was blocked by the browser.', ok ? 'success' : 'error');
		setTimeout(() => (copied = false), 1400);
	}

	function useAsInput() {
		if (!conversion) return;
		input = conversion.output;
		typeMode = conversion.to;
	}

	function clear() {
		input = '';
		copied = false;
	}

	const modeLabel = $derived(
		effectiveMode === 'transcribe-coding'
			? 'Coding strand → mRNA (T→U)'
			: effectiveMode === 'reverse-complement'
				? `Reverse complement · ${from.toUpperCase()} → ${target.toUpperCase()}`
				: `Complement · ${from.toUpperCase()} → ${target.toUpperCase()}`
	);
</script>

<svelte:head>
	<title>Nucleotide Flipper · Biosphere</title>
	<meta
		name="description"
		content="Generate complementary and reverse-complementary DNA or RNA sequences, including IUPAC ambiguity codes."
	/>
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<h1>Nucleotide Flipper</h1>
		<p class="page-desc">
			Complement a strand, reverse-complement it, or transcribe a coding strand. Results update as
			you type.
		</p>
	</div>
</header>

<section class="panel">
	<div class="panel-body options">
		<div class="field">
			<label class="label" for="from-type">
				Source
				<Tooltip text="Auto-detect treats a sequence containing U as RNA and one containing T as DNA." />
			</label>
			<select id="from-type" class="select" bind:value={typeMode}>
				<option value="auto">Auto-detect</option>
				<option value="dna">DNA</option>
				<option value="rna">RNA</option>
			</select>
		</div>

		<div class="field">
			<label class="label" for="mode">Conversion</label>
			<select id="mode" class="select" bind:value={mode}>
				<option value="complement">Complementary strand</option>
				<option value="reverse-complement">Reverse complement</option>
				<option value="transcribe-coding">Coding strand → mRNA</option>
			</select>
		</div>

		<div class="field">
			<label class="label" for="target">Target</label>
			<select id="target" class="select" bind:value={target} disabled={effectiveMode === 'transcribe-coding'}>
				<option value="dna">DNA</option>
				<option value="rna">RNA</option>
			</select>
		</div>

		<div class="options-actions">
			<button type="button" class="btn" onclick={useAsInput} disabled={!conversion}>
				<ArrowLeftRight size={13} aria-hidden="true" /> Use output as input
			</button>
			<button type="button" class="btn" onclick={clear} disabled={!input}>
				<RotateCcw size={13} aria-hidden="true" /> Clear
			</button>
		</div>
	</div>

	<p class="mode-note">{modeLabel}</p>

	{#if mode === 'transcribe-coding' && from === 'rna'}
		<p class="mode-warning">
			Coding-strand transcription applies to DNA only. The complementary conversion is shown instead.
		</p>
	{/if}
</section>

<div class="columns">
	<section class="panel">
		<div class="panel-head">
			<div>
				<p class="panel-title">Input</p>
				<p class="panel-desc">Whitespace and line breaks are ignored.</p>
			</div>
			<span class="badge">{validation.cleanedLength.toLocaleString()} nt</span>
		</div>
		<div class="panel-body">
			<label class="sr-only" for="flipper-input">Nucleotide sequence</label>
			<textarea
				id="flipper-input"
				class="textarea textarea-mono"
				class:textarea-invalid={invalid}
				bind:value={input}
				placeholder="ATGCGTACGTAGCTAGCTAGC"
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"
			></textarea>
			{#if invalid}
				<p class="inline-error" role="alert">{validation.error}</p>
			{/if}
		</div>
	</section>

	<section class="panel">
		<div class="panel-head">
			<div>
				<p class="panel-title">Output</p>
				<p class="panel-desc">
					{#if conversion}{conversion.length.toLocaleString()} nt · {conversion.to.toUpperCase()}{/if}
				</p>
			</div>
			<button type="button" class="btn btn-sm" onclick={copy} disabled={!conversion}>
				{#if copied}<Check size={13} aria-hidden="true" /> Copied{:else}<Copy size={13} aria-hidden="true" /> Copy{/if}
			</button>
		</div>
		<div class="panel-body">
			{#if conversion}
				<output class="output mono" for="flipper-input">{conversion.output}</output>
			{:else}
				<EmptyState
					title="Nothing to convert yet"
					description="Paste a sequence on the left. Complement rules: DNA A↔T and C↔G; RNA A↔U and C↔G; a DNA template read into RNA maps A→U, T→A, C→G, G→C. IUPAC codes are complemented too (R↔Y, K↔M, B↔V, D↔H, S, W, and N stay self-complementary)."
				/>
			{/if}
		</div>
	</section>
</div>

<details class="panel help">
	<summary>Supported conversions and notation</summary>
	<div class="help-body">
		<div class="help-block">
			<p class="help-title">Complement <ArrowRight size={12} aria-hidden="true" /></p>
			<ul>
				<li>DNA → DNA: A↔T, C↔G</li>
				<li>RNA → RNA: A↔U, C↔G</li>
				<li>DNA template → RNA: A→U, T→A, C→G, G→C</li>
				<li>RNA template → DNA: A→T, U→A, C→G, G→C</li>
			</ul>
		</div>
		<div class="help-block">
			<p class="help-title">Orientation</p>
			<ul>
				<li><strong>Complement</strong> keeps the 5′→3′ order and replaces each base.</li>
				<li><strong>Reverse complement</strong> complements, then reverses the order.</li>
				<li><strong>Coding strand → mRNA</strong> is transcription, not complementation: T becomes U and no bases are paired.</li>
			</ul>
		</div>
		<div class="help-block">
			<p class="help-title">IUPAC ambiguity codes</p>
			<p class="help-note">
				R↔Y, K↔M, B↔V, D↔H; S, W, and N are self-complementary. Uppercase and lowercase input are
				accepted; output is uppercase.
			</p>
		</div>
	</div>
</details>

<style>
	.options {
		display: flex;
		align-items: flex-end;
		gap: 14px;
		flex-wrap: wrap;
	}

	.options .field {
		width: 190px;
	}

	.options-actions {
		display: flex;
		gap: 6px;
		margin-left: auto;
		flex-wrap: wrap;
	}

	.mode-note {
		padding: 0 16px 10px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.mode-warning {
		padding: 0 16px 12px;
		font-size: 0.75rem;
		color: var(--warning);
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		margin-top: 14px;
	}

	.columns :global(.textarea) {
		min-height: 220px;
		font-size: 0.8125rem;
		line-height: 1.8;
	}

	.output {
		display: block;
		min-height: 220px;
		padding: 8px 10px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface-inset);
		font-size: 0.8125rem;
		line-height: 1.8;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.inline-error {
		margin-top: 8px;
		font-size: 0.75rem;
		color: var(--error);
	}

	.help {
		margin-top: 14px;
		padding: 12px 16px;
	}

	.help summary {
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 560;
		color: var(--text-2);
	}

	.help-body {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 18px;
		margin-top: 12px;
	}

	.help-title {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 4px;
	}

	.help-block ul {
		margin: 0;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.help-note {
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	@media (max-width: 860px) {
		.columns {
			grid-template-columns: minmax(0, 1fr);
		}
		.options-actions {
			margin-left: 0;
		}
	}
</style>
