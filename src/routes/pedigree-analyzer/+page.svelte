<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { InheritanceModel, Pedigree } from '$lib/types/genetics';
	import { emptyPedigree } from '$lib/genetics/pedigree/pedigree-graph';
	import { analyzePedigree } from '$lib/genetics/inheritance/analysis';
	import { solvePedigree } from '$lib/genetics/inheritance/analysis';
	import { getModelDefinition } from '$lib/genetics/inheritance/model-spec';
	import PedigreeEditor from '$lib/components/pedigree/PedigreeEditor.svelte';
	import ModelSettings from '$lib/components/pedigree/ModelSettings.svelte';
	import ProbBar from '$lib/components/ui/ProbBar.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { settings, DATA_VERSION } from '$lib/stores/settings.svelte';
	import { getProject, parseProjectFile, saveProject } from '$lib/stores/projects.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { downloadText, formatPercent, slugify } from '$lib/utils/format';
	import {
		AlertTriangle,
		Download,
		FlaskConical,
		Info,
		Save,
		Upload
	} from 'lucide-svelte';

	let pedigree = $state<Pedigree>(emptyPedigree());
	let selection = $state<string | null>(null);
	let projectName = $state('Untitled pedigree');
	let projectId = $state<string | undefined>(undefined);
	let fileInput = $state<HTMLInputElement | null>(null);

	const hasData = $derived(pedigree.individuals.length > 0);

	const analysis = $derived(
		hasData
			? analyzePedigree(pedigree, {
					enabledModels: settings.enabledModels,
					alleleFrequency: settings.alleleFrequency,
					unaffectedMeansNonCarrier: settings.unaffectedMeansNonCarrier
				})
			: null
	);

	const displayModel = $derived<InheritanceModel>(
		analysis?.topModel ?? settings.enabledModels[0] ?? 'autosomal-dominant'
	);

	const inferred = $derived.by(() => {
		const map: Record<string, { genotype: string; probability: number }> = {};
		if (!hasData) return map;
		const solved = solvePedigree(pedigree, displayModel, {
			alleleFrequency: settings.alleleFrequency,
			unaffectedMeansNonCarrier: settings.unaffectedMeansNonCarrier
		});
		for (const solution of solved.solutions) {
			const best = solution.genotypes[0];
			if (best) {
				map[solution.individualId] = {
					genotype: best.genotype,
					probability: best.probability
				};
			}
		}
		return map;
	});

	const topDefinition = $derived(analysis?.topModel ? getModelDefinition(analysis.topModel) : null);

	const strengthTone = $derived.by(() => {
		if (!analysis) return 'weak';
		if (analysis.incompatible) return 'error';
		if (analysis.topPosterior >= 0.9) return 'success';
		if (analysis.topPosterior >= 0.7) return 'accent';
		return 'warning';
	});

	function save() {
		const project = saveProject({
			id: projectId,
			name: projectName,
			tool: 'pedigree-analyzer',
			payload: { pedigree }
		});
		projectId = project.id;
		toast('Analysis saved on this device.', 'success');
	}

	function exportJson() {
		if (!hasData) {
			toast('Build a pedigree before exporting.', 'error');
			return;
		}
		const payload = {
			id: projectId ?? 'export',
			name: projectName,
			tool: 'pedigree-analyzer',
			updatedAt: Date.now(),
			dataVersion: DATA_VERSION,
			payload: { pedigree }
		};
		downloadText(`${slugify(projectName)}.json`, JSON.stringify(payload, null, 2));
		toast('Project JSON exported.', 'success');
	}

	async function importFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		const parsed = parseProjectFile(await file.text());
		if (!parsed.ok) {
			toast(parsed.error, 'error');
			return;
		}
		const payload = parsed.project.payload as { pedigree?: Pedigree };
		if (!payload?.pedigree || !Array.isArray(payload.pedigree.individuals)) {
			toast('That project does not contain pedigree data.', 'error');
			return;
		}
		pedigree = payload.pedigree;
		projectName = parsed.project.name;
		projectId = undefined;
		selection = null;
		toast('Project imported.', 'success');
	}

	onMount(() => {
		const id = page.url.searchParams.get('project');
		if (!id) return;
		const project = getProject(id);
		if (!project) return;
		const payload = project.payload as { pedigree?: Pedigree };
		if (payload?.pedigree && Array.isArray(payload.pedigree.individuals)) {
			pedigree = payload.pedigree;
			projectName = project.name;
			projectId = project.id;
		}
	});
</script>

<svelte:head>
	<title>Pedigree Analyzer · Biosphere</title>
	<meta
		name="description"
		content="Build a genetic pedigree and compare how well each inheritance model explains the observations."
	/>
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<h1>Pedigree Analyzer</h1>
		<p class="page-desc">
			Diagram the family, record what is known, and compare how strongly each enabled inheritance
			model explains the observations.
		</p>
	</div>

	<div class="head-actions">
		<input
			class="input name-input"
			bind:value={projectName}
			aria-label="Project name"
			placeholder="Project name"
		/>
		<button type="button" class="btn" onclick={save}>
			<Save size={14} aria-hidden="true" /> Save
		</button>
		<button type="button" class="btn" onclick={exportJson}>
			<Download size={14} aria-hidden="true" /> JSON
		</button>
		<button type="button" class="btn" onclick={() => fileInput?.click()}>
			<Upload size={14} aria-hidden="true" /> Import
		</button>
		<input
			bind:this={fileInput}
			type="file"
			accept="application/json,.json"
			onchange={importFile}
			hidden
		/>
	</div>
</header>

<section class="panel settings-panel">
	<div class="panel-head">
		<div>
			<p class="panel-title">Analysis settings</p>
			<p class="panel-desc">These settings apply to both pedigree tools.</p>
		</div>
	</div>
	<div class="panel-body">
		<ModelSettings />
	</div>
</section>

<PedigreeEditor
	bind:pedigree
	bind:selection
	model={displayModel}
	showGenotypes={settings.showGenotypes}
	carrierDisplay={settings.carrierDisplay}
	alleleLetter={settings.alleleLetter}
	showSexInGenotype={settings.showSexInGenotype}
	heterozygoteAsCarrier={settings.heterozygoteAsCarrier}
	{inferred}
	projectName={projectName}
	hint="Add people, then drag one onto another to link them and choose the relationship. Drag a person onto the middle of a link to make them a child. Right-click a person or link for quick actions."
/>

<section class="panel results" aria-live="polite">
	<div class="panel-head">
		<div>
			<p class="panel-title">Inheritance model comparison</p>
			<p class="panel-desc">
				Posterior probability P(model | observations) computed from the whole family structure.
			</p>
		</div>
		{#if analysis && !analysis.incompatible}
			<span class="badge badge-{strengthTone}">
				{analysis.inconclusive ? 'Inconclusive' : `Top: ${formatPercent(analysis.topPosterior, 0)}`}
			</span>
		{/if}
	</div>

	<div class="panel-body">
		{#if !analysis}
			<EmptyState
				title="No pedigree to analyse yet"
				description="Add at least one individual and record their phenotype. The analyzer needs observations to compare models against."
			/>
		{:else if analysis.incompatible}
			<div class="notice notice-error" role="alert">
				<AlertTriangle size={16} class="notice-icon" aria-hidden="true" />
				<div>
					<strong>No enabled model can explain these observations.</strong>
					<p>
						The combined likelihood is zero for every model, so no probability distribution is
						shown. Check the recorded phenotypes, sexes, and known genotypes — one of them
						contradicts the others under every enabled model.
					</p>
				</div>
			</div>
		{:else}
			{#if topDefinition}
				<div class="callout">
					<FlaskConical size={17} aria-hidden="true" class="callout-icon" />
					<div>
						<p class="callout-title">{topDefinition.label} is most consistent with this pedigree</p>
						<p class="callout-text">
							Estimated probability {formatPercent(analysis.topPosterior)} — this is a
							likelihood-based estimate from the entered data, not a diagnosis or proof.
							{#if analysis.inconclusive}
								The evidence does not separate the models strongly.
							{/if}
						</p>
					</div>
				</div>
			{/if}

			<div class="model-table">
				<div class="model-head">
					<span>Model</span>
					<span>Probability</span>
					<span class="num">Estimate</span>
					<span>Evidence</span>
				</div>
				{#each analysis.results as result (result.model)}
					{@const definition = getModelDefinition(result.model)}
					<div class="model-row" class:incompatible={!result.compatible}>
						<div class="model-label">
							<span class="model-name">{definition.label}</span>
							<span class="model-abbr">{definition.shortLabel}</span>
						</div>
						<div class="model-bar">
							<ProbBar
								value={result.posterior}
								muted={!result.compatible}
								label={`${definition.label}: ${formatPercent(result.posterior)}`}
							/>
						</div>
						<span class="num model-value">
							{result.compatible ? formatPercent(result.posterior) : '—'}
						</span>
						<div class="model-notes">
							{#if !result.compatible}
								<span class="badge badge-error">Incompatible</span>
							{:else}
								<span class="badge badge-{result.strength === 'strong' ? 'success' : result.strength === 'moderate' ? 'accent' : 'warning'}">
									{result.strength}
								</span>
							{/if}
							{#each result.notes as note, index (index)}
								<p class="note">{note}</p>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			{#if analysis.observations.length > 0}
				<div class="observations">
					<p class="section-label">What the pedigree shows</p>
					<ul>
						{#each analysis.observations as observation, index (index)}
							<li>{observation}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if analysis.warnings.length > 0}
				<div class="notice notice-warning warnings">
					<Info size={16} class="notice-icon" aria-hidden="true" />
					<div>
						<strong>Warnings</strong>
						<ul>
							{#each analysis.warnings as warning, index (index)}
								<li>{warning}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<details class="assumptions">
				<summary>Assumptions and limitations</summary>
				<ul>
					<li>Single-locus Mendelian inheritance with {analysis.assumptions.penetrance.toLowerCase()}.</li>
					<li>{analysis.assumptions.deNovo}; {analysis.assumptions.phenocopies.toLowerCase()}.</li>
					<li>{analysis.assumptions.sexDetermination}.</li>
					<li>{analysis.assumptions.unaffectedMeaning}.</li>
					<li>
						Founder variant allele frequency q = {(analysis.assumptions.alleleFrequency * 100).toFixed(2)}%,
						with Hardy–Weinberg genotype priors.
					</li>
					<li>Equal priors across enabled models; posterior ∝ P(observations | model).</li>
					<li>Pairwise relationships are assumed to be entered correctly.</li>
				</ul>
			</details>
		{/if}
	</div>
</section>

<style>
	.name-input {
		width: 190px;
	}

	.settings-panel {
		margin-top: 14px;
	}

	.results {
		margin-top: 14px;
	}

	.callout {
		display: flex;
		gap: 10px;
		padding: 12px 14px;
		border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent);
		background: var(--accent-soft);
		border-radius: var(--r-md);
		margin-bottom: 16px;
	}

	.callout-icon {
		color: var(--accent-strong);
		flex: 0 0 auto;
		margin-top: 1px;
	}

	.callout-title {
		font-size: 0.875rem;
		font-weight: 620;
		color: var(--text);
	}

	.callout-text {
		font-size: 0.8125rem;
		color: var(--text-2);
		line-height: 1.55;
		margin-top: 2px;
	}

	.model-table {
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		overflow: hidden;
	}

	.model-head {
		display: grid;
		grid-template-columns: 190px minmax(120px, 1fr) 74px minmax(180px, 240px);
		gap: 14px;
		padding: 7px 12px;
		background: var(--surface-inset);
		border-bottom: 1px solid var(--border);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.model-row {
		display: grid;
		grid-template-columns: 190px minmax(120px, 1fr) 74px minmax(180px, 240px);
		gap: 14px;
		align-items: center;
		padding: 10px 12px;
		border-bottom: 1px solid var(--border);
		transition: background-color var(--dur-1) var(--ease-out);
	}

	.model-row:last-child {
		border-bottom: 0;
	}

	.model-row:hover {
		background: var(--surface-inset);
	}

	.model-row.incompatible {
		background: color-mix(in srgb, var(--error-soft) 55%, transparent);
	}

	.model-label {
		display: flex;
		align-items: baseline;
		gap: 6px;
		min-width: 0;
	}

	.model-name {
		font-size: 0.8125rem;
		font-weight: 560;
	}

	.model-abbr {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.model-value {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.model-notes {
		display: flex;
		flex-direction: column;
		gap: 3px;
		align-items: flex-start;
	}

	.note {
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--text-muted);
	}

	.observations {
		margin-top: 18px;
	}

	.section-label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 6px;
	}

	.observations ul,
	.assumptions ul,
	.warnings ul {
		margin: 0;
		padding-left: 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-2);
	}

	.warnings {
		margin-top: 16px;
	}

	.assumptions {
		margin-top: 16px;
		border-top: 1px solid var(--border);
		padding-top: 10px;
	}

	.assumptions summary {
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 560;
		color: var(--text-2);
	}

	.assumptions ul {
		margin-top: 6px;
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	@media (max-width: 860px) {
		.model-head {
			display: none;
		}
		.model-row {
			grid-template-columns: minmax(0, 1fr) 64px;
			grid-template-areas:
				'label value'
				'bar bar'
				'notes notes';
			row-gap: 6px;
		}
		.model-label {
			grid-area: label;
		}
		.model-bar {
			grid-area: bar;
		}
		.model-value {
			grid-area: value;
		}
		.model-notes {
			grid-area: notes;
		}
	}
</style>
