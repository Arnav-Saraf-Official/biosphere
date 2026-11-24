<script lang="ts">
	import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-svelte';
	import { dismissToast, toastStore } from '$lib/stores/toast.svelte';

	const ICONS = {
		info: Info,
		success: CheckCircle2,
		error: XCircle,
		warning: AlertTriangle
	} as const;
</script>

<div class="toasts" aria-live="polite" aria-atomic="false">
	{#each toastStore.items as item (item.id)}
		<div class="toast toast-{item.tone}">
			{#if ICONS[item.tone]}
				{@const Icon = ICONS[item.tone]}
				<Icon size={15} strokeWidth={2} aria-hidden="true" />
			{/if}
			<span class="toast-message">{item.message}</span>
			<button type="button" class="toast-close" onclick={() => dismissToast(item.id)} aria-label="Dismiss">
				<X size={13} aria-hidden="true" />
			</button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		right: 18px;
		bottom: 18px;
		z-index: 200;
		display: flex;
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: min(380px, calc(100vw - 36px));
		padding: 8px 10px 8px 12px;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		background: var(--surface);
		color: var(--text);
		font-size: 0.8125rem;
		box-shadow: var(--shadow-md);
		pointer-events: auto;
		animation: toast-in var(--dur-2) var(--ease-out);
	}

	.toast-info {
		border-color: var(--info-border);
	}
	.toast-success {
		border-color: var(--success-border);
	}
	.toast-error {
		border-color: var(--error-border);
	}
	.toast-warning {
		border-color: var(--warning-border);
	}

	.toast-message {
		line-height: 1.4;
	}

	.toast-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		width: 20px;
		height: 20px;
		border: 0;
		border-radius: var(--r-xs);
		background: transparent;
		color: var(--text-muted);
	}

	.toast-close:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(6px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (max-width: 640px) {
		.toasts {
			left: 12px;
			right: 12px;
			bottom: 12px;
		}
		.toast {
			max-width: none;
		}
	}
</style>
