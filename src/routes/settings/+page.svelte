<script lang="ts">
	import { Monitor, Moon, RotateCcw, ShieldCheck, Sun, Trash2 } from 'lucide-svelte';
	import ModelSettings from '$lib/components/pedigree/ModelSettings.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { clearProjects, projectStore } from '$lib/stores/projects.svelte';
	import { persistSettings, resetSettings, settings } from '$lib/stores/settings.svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const themes = [
		{ value: 'light' as const, label: 'Light', icon: Sun },
		{ value: 'dark' as const, label: 'Dark', icon: Moon },
		{ value: 'system' as const, label: 'System', icon: Monitor }
	];

	function setTheme(theme: 'light' | 'dark' | 'system') {
		settings.theme = theme;
		persistSettings();
	}

	function setMaxLength(event: Event) {
		const value = Number((event.currentTarget as HTMLInputElement).value);
		if (!Number.isFinite(value)) return;
		settings.maxSequenceLength = Math.min(2_000_000, Math.max(1_000, Math.round(value)));
		persistSettings();
	}

	function resetAll() {
		resetSettings();
		toast('Settings restored to their defaults.', 'success');
	}

	function clearAllProjects() {
		if (projectStore.items.length === 0) return;
		const confirmed = window.confirm(
			`Delete all ${projectStore.items.length} saved project(s) from this browser? This cannot be undone.`
		);
		if (!confirmed) return;
		clearProjects();
		toast('Saved projects deleted.', 'success');
	}
</script>

<svelte:head>
	<title>Settings · Biosphere</title>
	<meta name="description" content="Configure Biosphere's theme, inheritance analysis defaults, and sequence tools." />
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<h1>Settings</h1>
		<p class="page-desc">
			These defaults apply across every tool. Analysis settings change how pedigrees are evaluated;
			display settings never change a calculation.
		</p>
	</div>
	<button type="button" class="btn" onclick={resetAll}>
		<RotateCcw size={14} aria-hidden="true" /> Restore defaults
	</button>
</header>

<section class="panel">
	<div class="panel-head">
		<div>
			<p class="panel-title">Appearance</p>
			<p class="panel-desc">System follows your operating system preference.</p>
		</div>
	</div>
	<div class="panel-body">
		<div class="seg" role="group" aria-label="Colour theme">
			{#each themes as theme (theme.value)}
				{@const Icon = theme.icon}
				<button
					type="button"
					class="seg-item seg-with-icon"
					aria-pressed={settings.theme === theme.value}
					onclick={() => setTheme(theme.value)}
				>
					<Icon size={14} aria-hidden="true" /> {theme.label}
				</button>
			{/each}
		</div>
	</div>
</section>

<section class="panel">
	<div class="panel-head">
		<div>
			<p class="panel-title">Pedigree analysis defaults</p>
			<p class="panel-desc">
				Both pedigree tools share one inference engine, so these settings apply identically to the
				Analyzer and the Solver.
			</p>
		</div>
	</div>
	<div class="panel-body">
		<ModelSettings />
	</div>
</section>

<section class="panel">
	<div class="panel-head">
		<div>
			<p class="panel-title">Sequence tools</p>
			<p class="panel-desc">Defaults for the Gene Analyzer and Nucleotide Flipper.</p>
		</div>
	</div>
	<div class="panel-body seq-body">
		<Toggle
			bind:checked={settings.gene.showProteins}
			label="Show protein names"
			hint="Regions without a user-supplied name are labelled as predicted ORFs."
			onchange={persistSettings}
		/>
		<Toggle
			bind:checked={settings.gene.showUntranslated}
			label="Show untranslated nucleotides"
			hint="Display nucleotides outside detected ORFs, muted, in their original order."
			onchange={persistSettings}
		/>

		<div class="field">
			<label class="label" for="max-length">
				Maximum sequence length
				<Tooltip text="Longer input is truncated for analysis, and the truncation is reported. Processing stays in your browser." />
			</label>
			<input
				id="max-length"
				class="input mono"
				type="number"
				min="1000"
				max="2000000"
				step="1000"
				value={settings.maxSequenceLength}
				oninput={setMaxLength}
			/>
			<p class="hint">Between 1,000 and 2,000,000 nucleotides. Default 120,000.</p>
		</div>
	</div>
</section>

<section class="panel">
	<div class="panel-head">
		<div>
			<p class="panel-title">Local data</p>
			<p class="panel-desc">
				Projects and settings are stored in this browser only. Nothing is uploaded.
			</p>
		</div>
		<span class="badge">{projectStore.items.length} project{projectStore.items.length === 1 ? '' : 's'}</span>
	</div>
	<div class="panel-body data-body">
		<p class="privacy-note">
			<ShieldCheck size={15} aria-hidden="true" />
			<span>
				Biosphere has no account system and no backend. Genetic data you enter stays on this device.
				Clearing your browser's site data will remove saved projects.
			</span>
		</p>
		<button
			type="button"
			class="btn btn-danger"
			onclick={clearAllProjects}
			disabled={projectStore.items.length === 0}
		>
			<Trash2 size={14} aria-hidden="true" /> Delete all saved projects
		</button>
	</div>
</section>

<style>
	.panel + .panel {
		margin-top: 14px;
	}

	.seg-with-icon {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.seq-body {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.field {
		max-width: 260px;
	}

	.hint {
		margin-top: 4px;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.data-body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.privacy-note {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		max-width: 70ch;
		font-size: 0.75rem;
		line-height: 1.55;
		color: var(--text-muted);
	}

	.privacy-note :global(svg) {
		flex: none;
		margin-top: 1px;
		color: var(--accent-strong);
	}
</style>
