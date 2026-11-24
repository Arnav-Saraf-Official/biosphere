<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { text, label = 'More information' }: { text: string; label?: string } = $props();
</script>

<button type="button" class="tip" aria-label={`${label}: ${text}`}>
	<Info size={13} strokeWidth={2} aria-hidden="true" />
	<span class="tip-bubble" role="tooltip">{text}</span>
</button>
