/** Shared browser utilities. */

export function uid(prefix = 'id'): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function downloadBlob(filename: string, blob: Blob): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.rel = 'noopener';
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadText(filename: string, text: string, type = 'application/json'): void {
	downloadBlob(filename, new Blob([text], { type }));
}

export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const area = document.createElement('textarea');
			area.value = text;
			area.setAttribute('readonly', '');
			area.style.position = 'fixed';
			area.style.opacity = '0';
			document.body.appendChild(area);
			area.select();
			const ok = document.execCommand('copy');
			area.remove();
			return ok;
		} catch {
			return false;
		}
	}
}

export function formatPercent(value: number, digits = 1): string {
	const pct = value * 100;
	if (!Number.isFinite(pct)) return '—';
	if (pct > 0 && pct < 0.05) return '<0.1%';
	return `${pct.toFixed(digits)}%`;
}

export function formatRelativeTime(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.round(diff / 60000);
	if (minutes < 1) return 'just now';
	if (minutes < 60) return `${minutes} min ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours} h ago`;
	const days = Math.round(hours / 24);
	if (days < 30) return `${days} d ago`;
	return new Date(timestamp).toLocaleDateString();
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function slugify(value: string): string {
	return (
		value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'biosphere'
	);
}

export function readableError(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;
	return 'Something went wrong.';
}
