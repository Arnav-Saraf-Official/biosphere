<script lang="ts">
	import { page } from '$app/state';
	import {
		Dna,
		Home,
		Leaf,
		Menu,
		Network,
		Puzzle,
		Settings,
		Table2,
		Repeat,
		X,
		Moon,
		Sun,
		Monitor,
		ArrowUpRight
	} from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import Toasts from '../ui/Toasts.svelte';
	import { settings, persistSettings, SETTINGS_KEY } from '$lib/stores/settings.svelte';

	let { children }: { children: Snippet } = $props();

	type NavItem = { href: string; label: string; icon: typeof Dna };

	const groups: { label: string; items: NavItem[] }[] = [
		{
			label: 'Inheritance',
			items: [
				{ href: '/pedigree-analyzer', label: 'Pedigree Analyzer', icon: Network },
				{ href: '/pedigree-solver', label: 'Pedigree Solver', icon: Puzzle },
				{ href: '/punnett-squares', label: 'Punnett Squares', icon: Table2 }
			]
		},
		{
			label: 'Sequences',
			items: [
				{ href: '/gene-analyzer', label: 'Gene Analyzer', icon: Dna },
				{ href: '/nucleotide-flipper', label: 'Nucleotide Flipper', icon: Repeat }
			]
		}
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

	const themes = [
		{ id: 'system' as const, label: 'System theme', icon: Monitor },
		{ id: 'light' as const, label: 'Light theme', icon: Sun },
		{ id: 'dark' as const, label: 'Dark theme', icon: Moon }
	];

	function selectTheme(next: 'light' | 'dark' | 'system') {
		settings.theme = next;
		persistSettings();
	}
</script>

<div class="shell">
	<aside class="sidebar">
		<a class="brand" href="/" aria-label="Biosphere home">
			<span class="brand-mark"><Leaf size={16} strokeWidth={2} aria-hidden="true" /></span>
			<span class="brand-text">
				<span class="brand-name">Biosphere</span>
			</span>
		</a>

		<nav class="nav" aria-label="Main">
			<a
				class="nav-item"
				class:active={isActive('/')}
				href="/"
				aria-current={isActive('/') ? 'page' : undefined}
			>
				<Home size={15} strokeWidth={1.9} aria-hidden="true" />
				<span>Home</span>
			</a>

			{#each groups as group (group.label)}
				<div class="nav-group">
					<p class="nav-group-label">{group.label}</p>
					{#each group.items as item (item.href)}
						{@const Icon = item.icon}
						<a
							class="nav-item"
							class:active={isActive(item.href)}
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							<Icon size={15} strokeWidth={1.9} aria-hidden="true" />
							<span>{item.label}</span>
						</a>
					{/each}
				</div>
			{/each}
		</nav>

		<div class="sidebar-spacer"></div>

		<nav class="nav nav-secondary" aria-label="Application">
			<a
				class="nav-item"
				class:active={isActive('/settings')}
				href="/settings"
				aria-current={isActive('/settings') ? 'page' : undefined}
			>
				<Settings size={15} strokeWidth={1.9} aria-hidden="true" />
				<span>Settings</span>
			</a>
		</nav>

		<div class="sidebar-footer">
			<div class="seg theme-seg" role="group" aria-label="Colour theme">
				{#each themes as theme (theme.id)}
					{@const Icon = theme.icon}
					<button
						type="button"
						class="seg-item theme-item"
						aria-pressed={settings.theme === theme.id}
						aria-label={theme.label}
						title={theme.label}
						onclick={() => selectTheme(theme.id)}
					>
						<Icon size={14} aria-hidden="true" />
					</button>
				{/each}
			</div>
		</div>
	</aside>

	<header class="mobile-bar">
		<button
			type="button"
			class="icon-btn"
			onclick={() => (navOpen = true)}
			aria-label="Open navigation"
			aria-expanded={navOpen}
		>
			<Menu size={19} aria-hidden="true" />
		</button>
		<a class="brand brand-compact" href="/">
			<span class="brand-mark"><Leaf size={14} strokeWidth={2} aria-hidden="true" /></span>
			<span class="brand-name">Biosphere</span>
		</a>
		<button
			type="button"
			class="icon-btn"
			onclick={() => selectTheme(settings.theme === 'dark' ? 'light' : 'dark')}
			aria-label={settings.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
		>
			{#if settings.theme === 'dark'}
				<Sun size={17} aria-hidden="true" />
			{:else}
				<Moon size={17} aria-hidden="true" />
			{/if}
		</button>
	</header>

	{#if navOpen}
		<div class="drawer-layer">
			<button
				type="button"
				class="scrim"
				aria-label="Close navigation"
				onclick={() => (navOpen = false)}
			></button>
			<nav class="drawer" aria-label="Main">
				<div class="drawer-head">
					<span class="brand-name">Biosphere</span>
					<button
						type="button"
						class="icon-btn"
						onclick={() => (navOpen = false)}
						aria-label="Close navigation"
					>
						<X size={18} aria-hidden="true" />
					</button>
				</div>

				<a
					class="nav-item"
					class:active={isActive('/')}
					href="/"
					aria-current={isActive('/') ? 'page' : undefined}
				>
					<Home size={16} strokeWidth={1.9} aria-hidden="true" />
					<span>Home</span>
				</a>

				{#each groups as group (group.label)}
					<div class="nav-group">
						<p class="nav-group-label">{group.label}</p>
						{#each group.items as item (item.href)}
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
					</div>
				{/each}

				<div class="nav-group">
					<a
						class="nav-item"
						class:active={isActive('/settings')}
						href="/settings"
						aria-current={isActive('/settings') ? 'page' : undefined}
					>
						<Settings size={16} strokeWidth={1.9} aria-hidden="true" />
						<span>Settings</span>
					</a>
				</div>
			</nav>
		</div>
	{/if}

	<main class="content">
		<div class="content-inner">{@render children()}</div>
	</main>

	<footer class="footer">
		<div class="footer-inner">
			<p>Created by <a href="https://arnavsaraf.pages.dev" rel="noreferrer">Arnav Saraf <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" /></a></p>
			<a class="github-link" href="https://github.com/Arnav-Saraf-Official/biosphere" rel="noreferrer" aria-label="View Biosphere on GitHub">
				GitHub <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
			</a>
		</div>
	</footer>
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
		gap: 22px;
		padding: 18px 13px 16px;
		background: var(--surface);
		border-right: 1px solid var(--border);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 2px 8px 10px;
		color: var(--text);
		text-decoration: none;
	}

	.brand-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--accent-soft);
		color: var(--accent-strong);
		border: 1px solid color-mix(in srgb, var(--accent) 32%, transparent);
	}

	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.brand-name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-group {
		display: flex;
		flex-direction: column;
		gap: 1px;
		margin-top: 14px;
	}

	.nav-group-label {
		padding: 0 9px 6px;
		font-size: 0.75rem;
		font-weight: 650;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 9px;
		border-radius: var(--r-sm);
		color: var(--text-2);
		text-decoration: none;
		font-size: var(--fs-sm);
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
		font-weight: 600;
	}

	.sidebar-spacer {
		flex: 1;
	}

	.nav-secondary {
		padding-top: 12px;
		border-top: 1px solid var(--border);
	}

	.sidebar-footer {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0 4px;
	}

	.theme-seg {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 100%;
	}

	.theme-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 0;
	}

	.content {
		min-width: 0;
		grid-column: 2;
	}

	.content-inner {
		max-width: var(--content-max);
		margin: 0 auto;
		padding: 32px 36px 80px;
	}

	.footer {
		grid-column: 2;
		border-top: 1px solid var(--border);
		background: var(--surface-inset);
		color: var(--text-muted);
	}

	.footer-inner {
		max-width: var(--content-max);
		min-height: 64px;
		margin: 0 auto;
		padding: 16px 36px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-size: var(--fs-xs);
	}

	.footer-inner p {
		margin: 0;
	}

	.footer-inner a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--text-2);
		font-weight: 600;
		text-decoration: none;
		text-underline-offset: 3px;
		transition: color var(--dur-1) var(--ease-out);
	}

	.footer-inner a:hover {
		color: var(--accent-strong);
		text-decoration: underline;
	}

	.footer-inner a:focus-visible {
		border-radius: 2px;
		outline: 2px solid var(--focus);
		outline-offset: 4px;
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
		width: 280px;
		max-width: 84vw;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 14px 12px;
		background: var(--surface);
		border-right: 1px solid var(--border);
		box-shadow: var(--shadow-lg);
		animation: slide-in var(--dur-3) var(--ease-out);
		overflow-y: auto;
	}

	.drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 8px 14px;
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
			padding: 0 12px;
			background: var(--surface);
			border-bottom: 1px solid var(--border);
		}
		.brand-compact {
			padding: 0;
			gap: 8px;
		}
		.brand-compact .brand-name {
			font-size: 1rem;
		}
		.content-inner {
			padding: 22px 18px 80px;
		}
		.content,
		.footer {
			grid-column: 1;
		}
		.footer-inner {
			padding-inline: 18px;
		}
	}

	@media (max-width: 480px) {
		.content-inner {
			padding: 18px 14px 72px;
		}
		.footer-inner {
			min-height: 72px;
			padding-inline: 14px;
		}
	}
</style>
