<script lang="ts">
	let {
		checked = $bindable(false),
		label,
		hint = '',
		disabled = false,
		onchange
	}: {
		checked?: boolean;
		label: string;
		hint?: string;
		disabled?: boolean;
		onchange?: (value: boolean) => void;
	} = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	class="switch"
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	onclick={toggle}
>
	<span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
	<span class="switch-text">
		<span class="switch-label">{label}</span>
		{#if hint}<span class="switch-hint">{hint}</span>{/if}
	</span>
</button>
