<script lang="ts">
	import { Dna, Network, Plus, Puzzle, Repeat, Table2, Trash2, ChevronRight } from 'lucide-svelte';
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
		[...projectStore.items]
			.sort((a, b) => b.updatedAt - a.updatedAt)
			.slice(0, 6)
	);

	function remove(id: string, name: string) {
		deleteProject(id);
		toast(`“${name}” deleted.`, 'success');
	}
</script>

<svelte:head>
	<title>Biosphere · Genetics toolkit</title>
	<meta
		name="description"
		content="Explore inheritance, analyze pedigrees, predict crosses, and translate nucleotide sequences — privately, in your browser."
	/>
</svelte:head>

<section class="hero">
	<p class="eyebrow">Genetics toolkit</p>
	<h1>Biosphere</h1>
	<p class="hero-desc">
		A working genetics workspace: build pedigrees and compare inheritance models, solve unknown
		individuals, predict crosses, and translate nucleotide sequences. Every probability and
		translation is computed in your browser.
	</p>
	<div class="hero-actions">
		<a class="btn btn-primary" href="/pedigree-analyzer">
			<Plus size={14} aria-hidden="true" /> Start a pedigree
		</a>
		<a class="btn" href="/gene-analyzer">
			<Dna size={14} aria-hidden="true" /> Analyze a sequence
		</a>
	</div>
</section>

<section class="tools" aria-label="Tools">
	{#each tools as tool (tool.href)}
		{@const Icon = tool.icon}
		<a class="tool-card" href={tool.href}>
			<span class="tool-icon"><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
			<span class="tool-body">
				<span class="tool-name">{tool.name}</span>
				<span class="tool-desc">{tool.description}</span>
			</span>				<span class="tool-arrow"><ChevronRight size={15} aria-hidden="true" /></span>
		</a>
	{/each}
</section>

<section class="recent" aria-labelledby="recent-heading">
	<div class="recent-head">
		<div>
			<h2 id="recent-heading">Recent projects</h2>
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
						class="icon-btn icon-btn-sm"
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
	correctly entered relationships. No data leaves your device.
</p>

<style>
	.hero {
		max-width: 68ch;
		padding: 6px 0 26px;
	}

	.hero h1 {
		font-size: clamp(1.7rem, 3.1vw, 2.15rem);
		letter-spacing: -0.022em;
		margin-top: 2px;
	}

	.hero-desc {
		margin-top: 8px;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--text-muted);
	}

	.hero-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 16px;
	}

	.tools {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
		gap: 10px;
	}

	.tool-card {
		display: flex;
		align-items: flex-start;
		gap: 11px;
		padding: 14px;
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		transition:
			border-color var(--dur-1) var(--ease-out),
			box-shadow var(--dur-2) var(--ease-out),
			transform var(--dur-2) var(--ease-out);
	}

	.tool-card:hover {
		border-color: color-mix(in srgb, var(--accent) 46%, var(--border));
		box-shadow: var(--shadow-sm);
		transform: translateY(-1px);
	}

	.tool-card:active {
		transform: translateY(0);
	}

	.tool-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: var(--r-sm);
		background: var(--accent-soft);
		color: var(--accent-strong);
	}

	.tool-body {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.tool-name {
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.tool-desc {
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.tool-arrow {
		display: inline-flex;
		flex: none;
		align-self: center;
		color: var(--text-muted);
		opacity: 0.75;
	}

	.recent {
		margin-top: 30px;
	}

	.recent-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.recent h2 {
		font-size: 0.9375rem;
		font-weight: 620;
	}

	.recent-desc {
		margin-top: 2px;
		font-size: 0.75rem;
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
		padding: 4px 8px 4px 0;
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
		padding: 8px 14px;
		color: var(--text);
		text-decoration: none;
		border-radius: var(--r-sm);
	}

	.project-main:hover {
		background: var(--surface-2);
	}

	.project-name {
		font-size: 0.8125rem;
		font-weight: 560;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.project-meta {
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.dot {
		padding: 0 3px;
	}

	.footer-note {
		margin-top: 28px;
		max-width: 70ch;
		font-size: 0.6875rem;
		line-height: 1.6;
		color: var(--text-muted);
		opacity: 0.8;
	}

	@media (max-width: 560px) {
		.tools {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
