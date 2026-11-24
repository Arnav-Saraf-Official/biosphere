<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children
	}: { title: string; description: string; children?: Snippet } = $props();
</script>

<div class="empty">
	<p class="empty-title">{title}</p>
	<p class="empty-desc">{description}</p>
	{#if children}
		<div class="empty-actions">{@render children()}</div>
	{/if}
</div>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		padding: 22px 18px;
		border: 1px dashed var(--border-strong);
		border-radius: var(--r-md);
		background: var(--surface-inset);
	}

	.empty-title {
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.empty-desc {
		font-size: 0.8125rem;
		line-height: 1.55;
		color: var(--text-muted);
		max-width: 52ch;
	}

	.empty-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 6px;
	}
</style>
