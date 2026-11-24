<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { InheritanceModel, Pedigree } from '$lib/types/genetics';
	import { emptyPedigree } from '$lib/genetics/pedigree/pedigree-graph';
	import { solvePedigree } from '$lib/genetics/inheritance/analysis';
	import {
		displayPhenotypeLabel,
		formatGenotype,
		getModelDefinition,
		remapGenotype
	} from '$lib/genetics/inheritance/model-spec';
	import PedigreeEditor from '$lib/components/pedigree/PedigreeEditor.svelte';
	import ModelSettings from '$lib/components/pedigree/ModelSettings.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { DATA_VERSION, settings } from '$lib/stores/settings.svelte';
	import { getProject, parseProjectFile, saveProject } from '$lib/stores/projects.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { downloadText, formatPercent, slugify } from '$lib/utils/format';
	import { Download, Info, Save, Upload } from 'lucide-svelte';

	let pedigree = $state<Pedigree>(emptyPedigree());
	let selection = $state<string | null>(null);
	let projectName = $state('Untitled pedigree');
	let projectId = $state<string | undefined>(undefined);
	let chosenModel = $state<InheritanceModel>('autosomal-recessive');
	let fileInput = $state<HTMLInputElement | null>(null);

	const hasData = $derived(pedigree.individuals.length > 0);

	const model = $derived<InheritanceModel>(
		settings.enabledModels.includes(chosenModel)
			? chosenModel
			: settings.enabledModels[0] ?? 'autosomal-dominant'
	);

	const definition = $derived(getModelDefinition(model));

	const result = $derived(
		hasData
			? solvePedigree(pedigree, model, {
					alleleFrequency: settings.alleleFrequency,
					unaffectedMeansNonCarrier: settings.unaffectedMeansNonCarrier
				})
			: null
	);

	const inferred = $derived.by(() => {
		const map: Record<string, { genotype: string; probability: number }> = {};
		for (const solution of result?.solutions ?? []) {
			const best = solution.genotypes[0];
			if (best) {
				map[solution.individualId] = { genotype: best.genotype, probability: best.probability };
			}
		}
		return map;
	});

	const selectedSolution = $derived(
		result?.solutions.find((solution) => solution.individualId === selection) ?? null
	);

	const selectedIndividual = $derived(
		selection ? pedigree.individuals.find((individual) => individual.id === selection) ?? null : null
	);

	function save() {
		const project = saveProject({
			id: projectId,
			name: projectName,
			tool: 'pedigree-solver',
			payload: { pedigree, model }
		});
		projectId = project.id;
		toast('Solver session saved on this device.', 'success');
	}

	function exportJson() {
		if (!hasData) {
			toast('Build a pedigree before exporting.', 'error');
			return;
		}
		const payload = {
			id: projectId ?? 'export',
			name: projectName,
			tool: 'pedigree-solver',
			updatedAt: Date.now(),
			dataVersion: DATA_VERSION,
			payload: { pedigree, model }
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
		const payload = parsed.project.payload as { pedigree?: Pedigree; model?: InheritanceModel };
		if (!payload?.pedigree || !Array.isArray(payload.pedigree.individuals)) {
			toast('That project does not contain pedigree data.', 'error');
			return;
		}
		pedigree = payload.pedigree;
		if (payload.model) chosenModel = payload.model;
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
		const payload = project.payload as { pedigree?: Pedigree; model?: InheritanceModel };
		if (payload?.pedigree && Array.isArray(payload.pedigree.individuals)) {
			pedigree = payload.pedigree;
			if (payload.model) chosenModel = payload.model;
			projectName = project.name;
			projectId = project.id;
		}
	});
</script>

<svelte:head>
	<title>Pedigree Solver · Biosphere</title>
	<meta
		name="description"
		content="Choose an inheritance pattern and calculate the likely genetic status of individuals whose information is missing."
	/>
</svelte:head>

<header class="page-head">
	<div class="head-text">
		<p class="eyebrow">Missing information</p>
		<h1>Pedigree Solver</h1>
		<p class="page-desc">
			Pick the inheritance pattern, record what is known, and leave the rest blank. Every blank
			individual is solved from the full family structure.
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

<section class="panel model-panel">
	<div class="panel-body model-body">
		<div class="field model-select">
			<label class="label" for="model">
				Inheritance model
				<Tooltip text="Only models enabled in the settings can be selected here." />
			</label>
			<select
				id="model"
				class="select"
				value={model}
				onchange={(event) => (chosenModel = event.currentTarget.value as InheritanceModel)}
			>
				{#each settings.enabledModels as option (option)}
					<option value={option}>{getModelDefinition(option).label}</option>
				{/each}
			</select>
		</div>
		<p class="model-transmission">{definition.description} {definition.transmission}</p>
	</div>
</section>

<PedigreeEditor
	bind:pedigree
	bind:selection
	{model}
	showGenotypes={settings.showGenotypes}
	carrierDisplay={settings.carrierDisplay}
	alleleLetter={settings.alleleLetter}
	showSexInGenotype={settings.showSexInGenotype}
	heterozygoteAsCarrier={settings.heterozygoteAsCarrier}
	{inferred}
	projectName={projectName}
	hint="Fill in what you know and leave unknowns blank. Drag one person onto another to link them, or drag a person onto the middle of a link to make them a child. Right-click a person or link for quick actions."
/>

<section class="panel results" aria-live="polite">
	<div class="panel-head">
		<div>
			<p class="panel-title">Solved individuals</p>
			<p class="panel-desc">
				Marginal probabilities conditioned on every recorded observation in the pedigree.
			</p>
		</div>
		{#if result}
			<span class="badge badge-{result.compatible ? 'accent' : 'error'}">
				{result.compatible ? `${result.solutions.length} individuals` : 'Incompatible data'}
			</span>
		{/if}
	</div>

	<div class="panel-body">
		{#if !result}
			<EmptyState
				title="No pedigree yet"
				description="Add individuals and link relationships first. Then record the affected, unaffected, and carrier status you know, and leave the remaining people blank."
			/>
		{:else if !result.compatible}
			<div class="notice notice-error" role="alert">
				<Info size={16} class="notice-icon" aria-hidden="true" />
				<div>
					<strong>These observations contradict the selected model.</strong>
					<p>
						At least one recorded phenotype or genotype is impossible under
						{definition.label.toLowerCase()}. Distributions below are not normalised — correct the
						pedigree or switch models before relying on them.
					</p>
				</div>
			</div>
		{:else}
			<div class="result-table">
				<div class="result-head">
					<span>Individual</span>
					<span>Status distribution</span>
					<span>Most likely genotype</span>
					<span class="num">Certainty</span>
				</div>
				{#each result.solutions as solution (solution.individualId)}
					<button
						type="button"
						class="result-row"
						class:active={selection === solution.individualId}
						onclick={() => (selection = solution.individualId)}
					>
						<span class="result-name">
							{solution.label}
							{#if solution.observed}
								<span class="badge">observed</span>
							{:else}
								<span class="badge badge-info">inferred</span>
							{/if}
						</span>

						<span class="distribution">
							<span class="stack-bar" aria-hidden="true">
								<span class="seg-affected" style:width={`${solution.status.affected * 100}%`}></span>
								<span class="seg-carrier" style:width={`${solution.status.carrier * 100}%`}></span>
								<span class="seg-unaffected" style:width={`${solution.status.unaffected * 100}%`}></span>
							</span>
							<span class="distribution-values">
								<span class="dist-affected">{formatPercent(solution.status.affected, 0)} affected</span>
								<span class="dist-carrier">{formatPercent(solution.status.carrier, 0)} carrier</span>
								<span class="dist-unaffected"
									>{formatPercent(solution.status.unaffected, 0)} non-carrier</span
								>
							</span>
						</span>

						<span class="genotype-cell mono">
							{remapGenotype(
								formatGenotype(solution.genotypes[0]?.genotype ?? solution.mostLikelyGenotype, {
									sex: settings.showSexInGenotype
								}),
								settings.alleleLetter
							)}
							{#if solution.mostLikelyGenotypeProbability > 0}
								<span class="genotype-prob">{formatPercent(solution.mostLikelyGenotypeProbability, 0)}</span>
							{/if}
						</span>

						<span class="num certainty">
							{formatPercent(solution.confidence, 0)}
						</span>
					</button>
				{/each}
			</div>

			<div class="legend-row">
				<span class="legend-item"><span class="dot dot-affected"></span> Affected</span>
				<span class="legend-item"><span class="dot dot-carrier"></span> Unaffected carrier</span>
				<span class="legend-item"><span class="dot dot-unaffected"></span> Unaffected non-carrier</span>
				<span class="legend-note">
					The carrier band is only non-zero for recessive models; the half-shaded carrier symbol follows
					the carrier display setting.
				</span>
			</div>

			{#if selectedSolution && selectedIndividual}
				<div class="detail">
					<div class="detail-head">
						<p class="detail-title">Detailed calculation · {selectedSolution.label}</p>
						<span class="badge badge-{selectedSolution.confidence >= 0.9 ? 'success' : 'warning'}">
							{selectedSolution.confidence >= 0.9 ? 'well constrained' : 'uncertain'}
						</span>
					</div>

					{#if selectedSolution.note}
						<p class="detail-note">{selectedSolution.note}</p>
					{/if}

					<div class="detail-grid">
						<div>
							<p class="section-label">Status probabilities</p>
							<ul class="detail-list">
								<li>
									<span>Affected</span>
									<span class="mono">{formatPercent(selectedSolution.status.affected)}</span>
								</li>
								<li>
									<span>Unaffected carrier</span>
									<span class="mono">{formatPercent(selectedSolution.status.carrier)}</span>
								</li>
								<li>
									<span>Unaffected non-carrier</span>
									<span class="mono">{formatPercent(selectedSolution.status.unaffected)}</span>
								</li>
							</ul>
						</div>

						<div>
							<p class="section-label">Genotype distribution</p>
							<ul class="detail-list">
								{#each selectedSolution.genotypes as genotype (genotype.genotype)}
									<li>
										<span class="mono"
										>{remapGenotype(
											formatGenotype(genotype.genotype, { sex: settings.showSexInGenotype }),
											settings.alleleLetter
										)}</span
									>
										<span class="mono">{formatPercent(genotype.probability)}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>

					{#if settings.heterozygoteAsCarrier && (model === 'autosomal-dominant' || model === 'x-linked-dominant')}
						<p class="detail-note">
							Display convention: a heterozygous genotype would be labelled
							“{displayPhenotypeLabel(
								model,
								model === 'x-linked-dominant' ? 'F:Dd' : 'Dd',
								true
							)}” here, while the probabilities above keep the correct complete-penetrance
							interpretation.
						</p>
					{/if}
				</div>
			{:else}
				<p class="detail-hint">Select an individual in the table or the diagram to inspect their calculation.</p>
			{/if}

			{#if result.warnings.length > 0}
				<div class="notice notice-warning warnings">
					<Info size={16} class="notice-icon" aria-hidden="true" />
					<div>
						<strong>Warnings</strong>
						<ul>
							{#each result.warnings as warning, index (index)}
								<li>{warning}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<details class="assumptions">
				<summary>Assumptions and limitations</summary>
				<ul>
					<li>Single-locus Mendelian inheritance with complete penetrance.</li>
					<li>No de novo mutations and no phenocopies.</li>
					<li>{result.assumptions.sexDetermination}.</li>
					<li>{result.assumptions.unaffectedMeaning}.</li>
					<li>
						Founder variant allele frequency q = {(result.assumptions.alleleFrequency * 100).toFixed(2)}%.
					</li>
					<li>Inferred values are never written back as observations.</li>
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
		max-width: 58ch;
	}

	.page-desc {
		margin-top: 5px;
		color: var(--text-muted);
		font-size: 0.8125rem;
		line-height: 1.55;
	}

	.head-actions {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.name-input {
		width: 190px;
	}

	.model-panel {
		margin-bottom: 14px;
	}

	.model-body {
		display: flex;
		align-items: flex-end;
		gap: 18px;
		flex-wrap: wrap;
	}

	.model-select {
		width: 240px;
	}

	.model-transmission {
		font-size: 0.8125rem;
		color: var(--text-muted);
		line-height: 1.5;
		max-width: 62ch;
		padding-bottom: 2px;
	}

	.settings-panel {
		margin-top: 14px;
	}

	.results {
		margin-top: 14px;
	}

	.result-table {
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		overflow: hidden;
	}

	.result-head {
		display: grid;
		grid-template-columns: 200px minmax(240px, 1fr) 130px 80px;
		gap: 14px;
		padding: 7px 12px;
		background: var(--surface-inset);
		border-bottom: 1px solid var(--border);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.result-row {
		display: grid;
		grid-template-columns: 200px minmax(240px, 1fr) 130px 80px;
		gap: 14px;
		align-items: center;
		width: 100%;
		padding: 9px 12px;
		border: 0;
		border-bottom: 1px solid var(--border);
		background: transparent;
		text-align: left;
		font-size: 0.8125rem;
		color: var(--text);
		transition: background-color var(--dur-1) var(--ease-out);
	}

	.result-row:last-child {
		border-bottom: 0;
	}

	.result-row:hover {
		background: var(--surface-inset);
	}

	.result-row.active {
		background: var(--accent-soft);
	}

	.result-name {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 540;
		min-width: 0;
	}

	.distribution {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.stack-bar {
		display: flex;
		height: 7px;
		border-radius: var(--r-full);
		overflow: hidden;
		background: var(--surface-3);
	}

	.seg-affected {
		background: var(--error);
	}
	.seg-carrier {
		background: var(--warning);
	}
	.seg-unaffected {
		background: var(--accent);
	}

	.distribution-values {
		display: flex;
		gap: 10px;
		font-size: 0.6875rem;
		color: var(--text-muted);
		flex-wrap: wrap;
	}

	.dist-affected {
		color: var(--error);
	}
	.dist-carrier {
		color: var(--warning);
	}

	.genotype-cell {
		display: flex;
		align-items: baseline;
		gap: 5px;
		font-weight: 600;
	}

	.genotype-prob {
		font-weight: 400;
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.certainty {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-2);
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		margin-top: 10px;
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}

	.dot-affected {
		background: var(--error);
	}
	.dot-carrier {
		background: var(--warning);
	}
	.dot-unaffected {
		background: var(--accent);
	}

	.legend-note {
		margin-left: auto;
	}

	.detail {
		margin-top: 16px;
		padding: 12px 14px;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		background: var(--surface-inset);
	}

	.detail-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 8px;
	}

	.detail-title {
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.detail-note {
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.55;
		margin-bottom: 8px;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 18px;
	}

	.section-label {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 5px;
	}

	.detail-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.detail-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-size: 0.75rem;
		color: var(--text-2);
		padding: 2px 0;
		border-bottom: 1px dotted var(--border);
	}

	.detail-list li:last-child {
		border-bottom: 0;
	}

	.detail-hint {
		margin-top: 12px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.warnings {
		margin-top: 16px;
	}

	.warnings ul,
	.assumptions ul {
		margin: 0;
		padding-left: 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 0.75rem;
		line-height: 1.5;
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
	}

	@media (max-width: 900px) {
		.result-head {
			display: none;
		}
		.result-row {
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas:
				'name genotype'
				'dist dist';
			row-gap: 8px;
		}
		.result-name {
			grid-area: name;
		}
		.distribution {
			grid-area: dist;
		}
		.genotype-cell {
			grid-area: genotype;
			justify-content: flex-end;
		}
		.certainty {
			display: none;
		}
	}
</style>
