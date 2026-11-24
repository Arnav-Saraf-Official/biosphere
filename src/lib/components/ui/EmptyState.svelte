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
	/* A tinted region rather than another card, so it can sit inside a panel
	   without adding a second layer of nested borders. */
	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		padding: 22px 20px;
		border-radius: var(--r-md);
		background: var(--surface-2);
	}

	.empty-title {
		font-size: var(--fs-base);
		font-weight: 620;
	}

	.empty-desc {
		font-size: var(--fs-sm);
		line-height: 1.6;
		color: var(--text-muted);
		max-width: 56ch;
	}

	.empty-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 6px;
	}
</style>
