export type ToastTone = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
	id: number;
	message: string;
	tone: ToastTone;
}

let counter = 0;

export const toastStore = $state<{ items: ToastItem[] }>({ items: [] });

function dismiss(id: number): void {
	toastStore.items = toastStore.items.filter((item) => item.id !== id);
}

export function toast(message: string, tone: ToastTone = 'info', duration = 3200): void {
	const id = ++counter;
	toastStore.items = [...toastStore.items.slice(-2), { id, message, tone }];
	if (typeof window !== 'undefined') {
		setTimeout(() => dismiss(id), duration);
	}
}

export function dismissToast(id: number): void {
	dismiss(id);
}
