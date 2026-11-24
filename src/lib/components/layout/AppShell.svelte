<script lang="ts">
	import { page } from '$app/state';
	import { Dna, Home, Leaf, Menu, Network, Puzzle, Settings, Table2, Repeat, X, Moon, Sun, Monitor } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import Toasts from '../ui/Toasts.svelte';
	import { settings, persistSettings, SETTINGS_KEY } from '$lib/stores/settings.svelte';

	let { children }: { children: Snippet } = $props();

	const nav = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/pedigree-analyzer', label: 'Pedigree Analyzer', icon: Network },
		{ href: '/pedigree-solver', label: 'Pedigree Solver', icon: Puzzle },
		{ href: '/punnett-squares', label: 'Punnett Squares', icon: Table2 },
		{ href: '/gene-analyzer', label: 'Gene Analyzer', icon: Dna },
		{ href: '/nucleotide-flipper', label: 'Nucleotide Flipper', icon: Repeat }
	];

	let navOpen = $state(false);

	const pathname = $derived(page.url.pathname);
	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

	// Apply the resolved theme and keep it in sync with the OS preference.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const mode = settings.theme;
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const apply = () => {
			const dark = mode === 'dark' || (mode === 'system' && media.matches);
			document.documentElement.dataset.theme = dark ? 'dark' : 'light';
		};
		apply();
		media.addEventListener('change', apply);
		return () => media.removeEventListener('change', apply);
	});

	// Persist settings whenever any field changes.
	$effect(() => {
		const serialised = JSON.stringify(settings);
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem(SETTINGS_KEY, serialised);
		} catch {
			/* storage may be unavailable */
		}
	});

	// Close the drawer on navigation.
	$effect(() => {
		void pathname;
		navOpen = false;
	});

	const ThemeIcon = $derived(
		settings.theme === 'light' ? Sun : settings.theme === 'dark' ? Moon : Monitor
	);

	function cycleTheme() {
		settings.theme =
			settings.theme === 'system' ? 'light' : settings.theme === 'light' ? 'dark' : 'system';
		persistSettings();
	}
</script>

<div class="shell">
	<aside class="sidebar">
		<a class="brand" href="/" aria-label="Biosphere home">
			<span class="brand-mark"><Leaf size={17} strokeWidth={2} aria-hidden="true" /></span>
			<span class="brand-text">
				<span class="brand-name">Biosphere</span>
				<span class="brand-sub">Genetics toolkit</span>
			</span>
		</a>

		<nav class="nav" aria-label="Main">
			{#each nav as item (item.href)}
				{@const Icon = item.icon}
				<a
					class="nav-item"
					class:active={isActive(item.href)}
					href={item.href}
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					<Icon size={16} strokeWidth={1.9} aria-hidden="true" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-spacer"></div>

		<nav class="nav nav-secondary" aria-label="Application">
			<a class="nav-item" class:active={isActive('/settings')} href="/settings" aria-current={isActive('/settings') ? 'page' : undefined}>
				<Settings size={16} strokeWidth={1.9} aria-hidden="true" />
				<span>Settings</span>
			</a>
		</nav>

		<div class="sidebar-footer">
			<button type="button" class="theme-button" onclick={cycleTheme} aria-label={`Theme: ${settings.theme}. Change theme`}>
				<ThemeIcon size={14} aria-hidden="true" />
				<span>{settings.theme === 'system' ? 'System theme' : settings.theme === 'light' ? 'Light theme' : 'Dark theme'}</span>
			</button>
			<p class="privacy">Runs entirely in your browser.</p>
		</div>
	</aside>

	<header class="mobile-bar">
		<button type="button" class="icon-btn" onclick={() => (navOpen = true)} aria-label="Open navigation">
			<Menu size={19} aria-hidden="true" />
		</button>
		<a class="brand brand-compact" href="/">
			<span class="brand-mark"><Leaf size={15} strokeWidth={2} aria-hidden="true" /></span>
			<span class="brand-name">Biosphere</span>
		</a>
		<button type="button" class="icon-btn" onclick={cycleTheme} aria-label="Change theme">
			<ThemeIcon size={17} aria-hidden="true" />
		</button>
	</header>

	{#if navOpen}
		<div class="drawer-layer">
			<button type="button" class="scrim" aria-label="Close navigation" onclick={() => (navOpen = false)}></button>
			<nav class="drawer" aria-label="Main">
				<div class="drawer-head">
					<span class="brand-name">Biosphere</span>
					<button type="button" class="icon-btn" onclick={() => (navOpen = false)} aria-label="Close navigation">
						<X size={18} aria-hidden="true" />
					</button>
				</div>
				{#each [...nav, { href: '/settings', label: 'Settings', icon: Settings }] as item (item.href)}
					{@const Icon = item.icon}
					<a
						class="nav-item"
						class:active={isActive(item.href)}
						href={item.href}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						<Icon size={17} strokeWidth={1.9} aria-hidden="true" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}

	<main class="content">
		<div class="content-inner">{@render children()}</div>
	</main>
</div>

<Toasts />

<style>
	.shell {
		min-height: 100vh;
		display: grid;
		grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
	}

	.sidebar {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 16px 12px 14px;
		background: var(--surface);
		border-right: 1px solid var(--border);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 4px 8px 8px;
		color: var(--text);
		text-decoration: none;
	}

	.brand-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		background: var(--accent-soft);
		color: var(--accent-strong);
		border: 1px solid color-mix(in srgb, var(--accent) 32%, transparent);
	}

	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}

	.brand-name {
		font-size: 0.9375rem;
		font-weight: 640;
		letter-spacing: -0.012em;
	}

	.brand-sub {
		font-size: 0.6875rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.nav {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 9px;
		border-radius: var(--r-sm);
		color: var(--text-2);
		text-decoration: none;
		font-size: 0.8125rem;
		font-weight: 500;
		transition:
			background-color var(--dur-1) var(--ease-out),
			color var(--dur-1) var(--ease-out);
	}

	.nav-item:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	.nav-item.active {
		background: var(--accent-soft);
		color: var(--accent-strong);
		font-weight: 560;
	}

	.sidebar-spacer {
		flex: 1;
	}

	.nav-secondary {
		padding-top: 8px;
		border-top: 1px solid var(--border);
	}

	.sidebar-footer {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 0 4px;
	}

	.theme-button {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 7px 8px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface);
		color: var(--text-2);
		font-size: 0.75rem;
		transition: background-color var(--dur-1) var(--ease-out);
	}

	.theme-button:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	.privacy {
		font-size: 0.6875rem;
		color: var(--text-muted);
		padding: 0 4px;
	}

	.content {
		min-width: 0;
	}

	.content-inner {
		max-width: 1440px;
		margin: 0 auto;
		padding: 28px 30px 64px;
	}

	.mobile-bar {
		display: none;
	}

	.drawer-layer {
		position: fixed;
		inset: 0;
		z-index: 120;
		display: flex;
	}

	.scrim {
		position: absolute;
		inset: 0;
		border: 0;
		background: var(--overlay);
		animation: fade-in var(--dur-2) var(--ease-out);
	}

	.drawer {
		position: relative;
		width: 268px;
		max-width: 82vw;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 10px;
		background: var(--surface);
		border-right: 1px solid var(--border);
		box-shadow: var(--shadow-lg);
		animation: slide-in var(--dur-3) var(--ease-out);
	}

	.drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 8px 12px;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-in {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@media (max-width: 900px) {
		.shell {
			grid-template-columns: minmax(0, 1fr);
		}
		.sidebar {
			display: none;
		}
		.mobile-bar {
			position: sticky;
			top: 0;
			z-index: 90;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: var(--topbar-h);
			padding: 0 10px;
			background: color-mix(in srgb, var(--surface) 88%, transparent);
			backdrop-filter: blur(12px) saturate(150%);
			border-bottom: 1px solid var(--border);
		}
		.brand-compact {
			padding: 0;
			gap: 7px;
		}
		.content-inner {
			padding: 18px 16px 72px;
		}
	}
</style>
