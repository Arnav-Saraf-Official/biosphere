<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<AppShell>{@render children()}</AppShell>
