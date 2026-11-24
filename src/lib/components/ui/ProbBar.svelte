<script lang="ts">
	let {
		value,
		muted = false,
		label
	}: { value: number; muted?: boolean; label?: string } = $props();

	const width = $derived(`${Math.max(0, Math.min(1, value)) * 100}%`);
</script>

<div class="bar" role="img" aria-label={label ?? `${(value * 100).toFixed(1)} percent`}>
	<div class="bar-fill" class:bar-fill-muted={muted} style:width></div>
</div>
