/** SVG/PNG export helpers for the pedigree diagram. */

import { downloadBlob } from './format';

function token(name: string, fallback: string): string {
	if (typeof document === 'undefined') return fallback;
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return value || fallback;
}

/** Standalone styles embedded into exported SVG files. */
export function exportStyles(): string {
	const surface = token('--surface-2', '#edf2ea');
	const text = token('--text', '#18382f');
	const muted = token('--text-muted', '#718078');
	const borderStrong = token('--border-strong', '#c4d0c1');
	const accent = token('--accent', '#80b77c');
	const accentStrong = token('--accent-strong', '#356b3f');
	const fontSans = token('--font-sans', 'system-ui, sans-serif');
	const fontMono = token('--font-mono', 'monospace');

	return `
svg { background: ${surface}; }
.link { stroke: ${borderStrong}; stroke-width: 1.6; fill: none; }
.shape { fill: #fff; stroke: ${text}; stroke-width: 1.7; }
.shape.affected { fill: ${text}; }
.shape.unknown { stroke-dasharray: 4 3.5; }
.deceased-line { stroke: ${text}; stroke-width: 1.7; }
.divorce-mark { stroke: ${text}; stroke-width: 2; }
.carrier-half { fill: ${text}; }
.label { font-family: ${fontSans}; font-size: 11px; font-weight: 600; fill: ${muted}; }
.name { font-family: ${fontSans}; font-size: 10px; fill: ${muted}; }
.genotype { font-family: ${fontMono}; font-size: 10px; fill: ${text}; }
.genotype.inferred { fill: ${accentStrong}; }
.select-ring { fill: none; stroke: ${accent}; stroke-width: 2; }
`;
}

export function downloadSvg(markup: string, filename: string): void {
	downloadBlob(filename, new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
}

export async function downloadPng(
	markup: string,
	filename: string,
	width: number,
	height: number,
	scale = 2
): Promise<void> {
	const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	try {
		const image = new Image();
		image.decoding = 'sync';
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('The diagram could not be rasterised.'));
			image.src = url;
		});

		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, Math.round(width * scale));
		canvas.height = Math.max(1, Math.round(height * scale));
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Canvas is unavailable in this browser.');
		context.fillStyle = token('--surface-2', '#edf2ea');
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
		if (!pngBlob) throw new Error('The PNG could not be generated.');
		downloadBlob(filename, pngBlob);
	} finally {
		URL.revokeObjectURL(url);
	}
}
