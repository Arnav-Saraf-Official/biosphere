<script lang="ts">
	import { Dna, Network, Plus, Puzzle, Repeat, Table2, Trash2, ArrowRight } from 'lucide-svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { deleteProject, projectStore, type ToolId } from '$lib/stores/projects.svelte';
	import { formatRelativeTime } from '$lib/utils/format';
	import { toast } from '$lib/stores/toast.svelte';

	const tools: {
		href: string;
		name: string;
		tool: ToolId;
		description: string;
		icon: typeof Dna;
	}[] = [
		{
			href: '/pedigree-analyzer',
			name: 'Pedigree Analyzer',
			tool: 'pedigree-analyzer',
			description:
				'Draw a family, record who is affected, and compare how well each inheritance model explains the observations.',
			icon: Network
		},
		{
			href: '/pedigree-solver',
			name: 'Pedigree Solver',
			tool: 'pedigree-solver',
			description:
				'Choose the inheritance model and solve for unknown individuals using the whole family structure.',
			icon: Puzzle
		},
		{
			href: '/punnett-squares',
			name: 'Punnett Squares',
			tool: 'punnett-squares',
			description:
				'Cross up to four independent loci and see every offspring genotype with its exact probability.',
			icon: Table2
		},
		{
			href: '/gene-analyzer',
			name: 'Gene Analyzer',
			tool: 'gene-analyzer',
			description:
				'Translate DNA or RNA with the standard genetic code and inspect predicted ORFs across six frames.',
			icon: Dna
		},
		{
			href: '/nucleotide-flipper',
			name: 'Nucleotide Flipper',
			tool: 'nucleotide-flipper',
			description:
				'Generate complementary, reverse-complementary, or transcribed sequences, including IUPAC codes.',
			icon: Repeat
		}
	];

	const toolNames = Object.fromEntries(tools.map((tool) => [tool.tool, tool.name])) as Record<
		ToolId,
		string
	>;

	const recent = $derived(
		[...projectStore.items].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6)
	);

	function remove(id: string, name: string) {
		deleteProject(id);
		toast(`“${name}” deleted.`, 'success');
	}
</script>

<svelte:head>
	<title>Biosphere</title>
	<meta
		name="description"
		content="Explore inheritance, analyze pedigrees, predict crosses, and translate nucleotide sequences — privately, in your browser."
	/>
</svelte:head>

<section class="hero">
	<div class="hero-text">
		<h1>Biosphere</h1>
		<p class="hero-lead">
			Build pedigrees and compare inheritance models, solve unknown individuals, predict crosses,
			and translate nucleotide sequences.
		</p>
		<p class="hero-note">
			Every probability and translation is computed in your browser, so nothing you type leaves
			this device.
		</p>
		<div class="hero-actions">
			<a class="btn btn-primary" href="/pedigree-analyzer">
				<Plus size={15} aria-hidden="true" /> Start a pedigree
			</a>
			<a class="btn" href="/gene-analyzer">
				<Dna size={15} aria-hidden="true" /> Analyze a sequence
			</a>
		</div>
	</div>

	<figure class="hero-figure">
		<svg
			viewBox="0 0 300 196"
			role="img"
			aria-label="A two-generation pedigree: two parents and three children, one child affected."
		>
			<!-- generation I -->
			<rect class="pd-sym" x="52" y="26" width="32" height="32" rx="2" />
			<circle class="pd-sym" cx="178" cy="42" r="16" />
			<line class="pd-link" x1="84" y1="42" x2="162" y2="42" />
			<line class="pd-link" x1="123" y1="42" x2="123" y2="74" />

			<!-- sibship -->
			<line class="pd-link" x1="74" y1="74" x2="236" y2="74" />
			<line class="pd-link" x1="74" y1="74" x2="74" y2="88" />
			<line class="pd-link" x1="155" y1="74" x2="155" y2="88" />
			<line class="pd-link" x1="236" y1="74" x2="236" y2="88" />

			<!-- generation II -->
			<rect class="pd-sym" x="58" y="88" width="32" height="32" rx="2" />
			<rect class="pd-sym pd-affected" x="139" y="88" width="32" height="32" rx="2" />
			<circle class="pd-sym" cx="236" cy="104" r="16" />

			<!-- generation III -->
			<line class="pd-link" x1="155" y1="120" x2="155" y2="142" />
			<line class="pd-link" x1="118" y1="142" x2="196" y2="142" />
			<line class="pd-link" x1="118" y1="142" x2="118" y2="154" />
			<line class="pd-link" x1="196" y1="142" x2="196" y2="154" />

			<rect class="pd-sym pd-affected" x="102" y="154" width="32" height="32" rx="2" />
			<circle class="pd-sym" cx="196" cy="170" r="16" />

			<text class="pd-label" x="52" y="16">I</text>
			<text class="pd-label" x="52" y="140">II</text>
		</svg>
		<figcaption class="sr-only">
			A filled symbol marks an affected individual, passed down two generations.
		</figcaption>
	</figure>
</section>

<section class="tools" aria-labelledby="tools-heading">
	<h2 id="tools-heading" class="section-heading">Tools</h2>
	<div class="tool-grid">
		{#each tools as tool, index (tool.href)}
			{@const Icon = tool.icon}
			<a class="tool-card" class:feature={index === 0} href={tool.href}>
				<span class="tool-icon"><Icon size={index === 0 ? 20 : 17} strokeWidth={1.9} aria-hidden="true" /></span>
				<span class="tool-body">
					<span class="tool-name">{tool.name}</span>
					<span class="tool-desc">{tool.description}</span>
				</span>
				<span class="tool-arrow"><ArrowRight size={15} aria-hidden="true" /></span>
			</a>
		{/each}
	</div>
</section>

<section class="recent" aria-labelledby="recent-heading">
	<div class="recent-head">
		<div>
			<h2 id="recent-heading" class="section-heading">Recent projects</h2>
			<p class="recent-desc">Saved locally in this browser; open one to continue where you left off.</p>
		</div>
	</div>

	{#if recent.length === 0}
		<EmptyState
			title="No saved projects yet"
			description="Open a tool, build something, and use Save project. Saved pedigrees and settings stay on this device."
		>
			<a class="btn btn-sm" href="/pedigree-analyzer">Open the Pedigree Analyzer</a>
		</EmptyState>
	{:else}
		<ul class="project-list">
			{#each recent as project (project.id)}
				<li class="project-row">
					<a class="project-main" href={`${project.tool}?project=${project.id}`}>
						<span class="project-name">{project.name}</span>
						<span class="project-meta">
							{toolNames[project.tool] ?? project.tool}
							<span class="dot" aria-hidden="true">·</span>
							{formatRelativeTime(project.updatedAt)}
						</span>
					</a>
					<button
						type="button"
						class="icon-btn"
						aria-label={`Delete project ${project.name}`}
						onclick={() => remove(project.id, project.name)}
					>
						<Trash2 size={14} aria-hidden="true" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<p class="footer-note">
	Model-based predictions only. Assumes single-locus Mendelian inheritance, complete penetrance, and
	correctly entered relationships.
</p>

<style>
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(240px, 0.92fr);
		align-items: center;
		gap: 44px;
		padding: 14px 0 40px;
		margin-bottom: 36px;
		border-bottom: 1px solid var(--border);
	}

	.hero-text {
		max-width: 58ch;
	}

	.hero h1 {
		font-size: clamp(2.5rem, 4.4vw, 3.4rem);
		line-height: 1.04;
		letter-spacing: -0.03em;
		font-weight: 500;
	}

	.hero-lead {
		margin-top: 16px;
		font-size: var(--fs-md);
		line-height: 1.55;
		color: var(--text-2);
		max-width: 56ch;
	}

	.hero-note {
		margin-top: 10px;
		font-size: var(--fs-sm);
		line-height: 1.6;
		color: var(--text-muted);
		max-width: 56ch;
	}

	.hero-actions {
		display: flex;
		gap: 9px;
		flex-wrap: wrap;
		margin-top: 24px;
	}

	.hero-figure {
		margin: 0;
		justify-self: center;
		width: 100%;
		max-width: 340px;
		color: var(--accent-strong);
	}

	.hero-figure svg {
		width: 100%;
		height: auto;
		display: block;
		overflow: visible;
	}

	.pd-sym {
		fill: var(--surface);
		stroke: currentColor;
		stroke-width: 1.6;
	}

	.pd-affected {
		fill: color-mix(in srgb, var(--accent) 55%, var(--surface));
		stroke: var(--accent-strong);
	}

	.pd-link {
		stroke: var(--border-strong);
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	.pd-label {
		fill: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 11px;
	}

	.section-heading {
		font-size: var(--fs-lg);
		font-weight: 600;
		letter-spacing: -0.012em;
	}

	.tools {
		margin-bottom: 40px;
	}

	.tools .section-heading {
		margin-bottom: 14px;
	}

	.tool-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.tool-card {
		display: flex;
		align-items: flex-start;
		gap: 13px;
		padding: 18px;
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		transition:
			border-color var(--dur-2) var(--ease-out),
			background-color var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}

	.tool-card:hover {
		border-color: color-mix(in srgb, var(--accent) 52%, var(--border));
		background: color-mix(in srgb, var(--surface) 94%, var(--accent) 6%);
		transform: translateY(-2px);
	}

	.tool-card:active {
		transform: translateY(0);
	}

	.tool-card.feature {
		grid-column: span 2;
	}

	.tool-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 34px;
		height: 34px;
		border-radius: var(--r-sm);
		background: var(--accent-soft);
		color: var(--accent-strong);
	}

	.tool-card.feature .tool-icon {
		width: 40px;
		height: 40px;
		border-radius: var(--r-md);
	}

	.tool-body {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-width: 0;
	}

	.tool-name {
		font-size: var(--fs-base);
		font-weight: 620;
		letter-spacing: -0.005em;
	}

	.tool-card.feature .tool-name {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
		font-weight: 600;
	}

	.tool-desc {
		font-size: var(--fs-sm);
		line-height: 1.55;
		color: var(--text-muted);
	}

	.tool-card.feature .tool-desc {
		max-width: 46ch;
	}

	.tool-arrow {
		display: inline-flex;
		flex: none;
		align-self: center;
		margin-left: auto;
		color: var(--text-muted);
		transition:
			transform var(--dur-2) var(--ease-out),
			color var(--dur-2) var(--ease-out);
	}

	.tool-card:hover .tool-arrow {
		color: var(--accent-strong);
		transform: translateX(3px);
	}

	.recent-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 11px;
	}

	.recent-desc {
		margin-top: 4px;
		font-size: var(--fs-sm);
		color: var(--text-muted);
	}

	.project-list {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: var(--surface);
		overflow: hidden;
	}

	.project-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 10px 5px 0;
	}

	.project-row + .project-row {
		border-top: 1px solid var(--border);
	}

	.project-main {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
		padding: 9px 16px;
		color: var(--text);
		text-decoration: none;
		border-radius: var(--r-sm);
	}

	.project-main:hover {
		background: var(--surface-2);
	}

	.project-name {
		font-size: var(--fs-sm);
		font-weight: 580;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.project-meta {
		font-size: var(--fs-xs);
		color: var(--text-muted);
	}

	.dot {
		padding: 0 4px;
	}

	.footer-note {
		margin-top: 32px;
		max-width: 72ch;
		font-size: var(--fs-xs);
		line-height: 1.65;
		color: var(--text-muted);
	}

	@media (max-width: 1080px) {
		.hero {
			grid-template-columns: minmax(0, 1fr) 240px;
			gap: 32px;
		}
		.tool-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 860px) {
		.hero {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}
		.hero-figure {
			max-width: 220px;
			justify-self: start;
		}
		.tool-card.feature {
			grid-column: span 2;
		}
	}

	@media (max-width: 600px) {
		.hero {
			padding-top: 4px;
		}
		.tool-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.tool-card.feature {
			grid-column: span 1;
		}
		.tool-card.feature .tool-name {
			font-family: var(--font-sans);
			font-size: var(--fs-base);
			font-weight: 620;
		}
	}
</style>
