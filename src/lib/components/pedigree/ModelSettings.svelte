<script lang="ts">
	import {
		MODEL_ORDER,
		getModelDefinition
	} from '$lib/genetics/inheritance/model-spec';
	import { settings, setEnabledModel, persistSettings } from '$lib/stores/settings.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import type { CarrierDisplay, InheritanceModel } from '$lib/types/genetics';
	import Toggle from '../ui/Toggle.svelte';
	import Tooltip from '../ui/Tooltip.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	const carrierOptions: Array<{ value: CarrierDisplay; label: string }> = [
		{ value: 'recessive-only', label: 'Recessive only' },
		{ value: 'always', label: 'Always' },
		{ value: 'never', label: 'Never' }
	];

	function setAlleleLetter(raw: string) {
		const picked = raw.trim().slice(-1);
		if (!/^[A-Za-z]$/.test(picked)) return;
		settings.alleleLetter = picked.toUpperCase();
		persistSettings();
	}

	function toggleModel(model: InheritanceModel, enabled: boolean) {
		if (!setEnabledModel(model, enabled)) {
			toast('At least one inheritance model must stay enabled.', 'warning');
		}
	}

	function setFrequency(event: Event) {
		const value = Number((event.currentTarget as HTMLInputElement).value);
		if (!Number.isFinite(value) || value <= 0) return;
		settings.alleleFrequency = Math.min(0.5, Math.max(0.001, value / 100));
		persistSettings();
	}
</script>

<div class="settings" class:compact>
	<div class="block">
		<label class="block-title" for="allele-letter">
			Genotype letter
			<Tooltip
				text="Every genotype in the pedigree uses this letter. Uppercase is the variant allele, lowercase the reference allele."
			/>
		</label>
		<input
			id="allele-letter"
			class="input mono letter-input"
			maxlength="1"
			aria-label="Genotype letter"
			value={settings.alleleLetter}
			oninput={(event) => setAlleleLetter(event.currentTarget.value)}
		/>
		<p class="hint">
			Applies to everyone, e.g. {settings.alleleLetter}{settings.alleleLetter.toLowerCase()} or
			{settings.alleleLetter}{settings.alleleLetter.toLowerCase()} × {settings.alleleLetter}{settings.alleleLetter.toLowerCase()}.
		</p>
	</div>

	<div class="block">
		<p class="block-title">
			Carrier symbols
			<Tooltip
				text="Carriers are drawn as the standard half-shaded symbol. Recessive heterozygotes are unaffected carriers; dominant heterozygotes are affected carriers."
			/>
		</p>
		<div class="seg" role="group" aria-label="When carriers are half shaded">
			{#each carrierOptions as option (option.value)}
				<button
					type="button"
					class="seg-item"
					aria-pressed={settings.carrierDisplay === option.value}
					onclick={() => {
						settings.carrierDisplay = option.value;
						persistSettings();
					}}
				>
					{option.label}
				</button>
			{/each}
		</div>
		<p class="hint">
			Half shading is the pedigree standard for carriers. Recessive only keeps an affected dominant
			heterozygote fully shaded.
		</p>
	</div>

	<div class="block">
		<p class="block-title">
			Single-allele genotypes
			<Tooltip
				text="Males in X- and Y-linked models carry one allele, so their genotype is a single letter. Adding the chromosome keeps it from reading as a truncated pair."
			/>
		</p>
		<div class="seg" role="group" aria-label="How hemizygous male genotypes are shown">
			<button
				type="button"
				class="seg-item"
				aria-pressed={!settings.showSexInGenotype}
				onclick={() => {
					settings.showSexInGenotype = false;
					persistSettings();
				}}
			>
				Just the letter
			</button>
			<button
				type="button"
				class="seg-item"
				aria-pressed={settings.showSexInGenotype}
				onclick={() => {
					settings.showSexInGenotype = true;
					persistSettings();
				}}
			>
				With sex
			</button>
		</div>
		<p class="hint">
			With sex, an X-linked male shows {settings.alleleLetter} (XY); a Y-linked male shows the allele
			with (Y). Females keep two letters.
		</p>
	</div>

	<div class="block models">
		<p class="block-title">
			Inheritance models
			<Tooltip text="Excluded models are removed from the probability distribution entirely. They are not assigned 0%." />
		</p>
		<p class="hint">Toggle the models this analysis should consider.</p>
		<div class="model-list">
			{#each MODEL_ORDER as model (model)}
				{@const definition = getModelDefinition(model)}
				<Toggle
					checked={settings.enabledModels.includes(model)}
					label={definition.label}
					hint={compact ? '' : definition.shortLabel}
					onchange={(value) => toggleModel(model, value)}
				/>
			{/each}
		</div>
	</div>

	<div class="block">
		<p class="block-title">
			"Unaffected" means
			<Tooltip
				text="This changes the analysis engine. If unaffected only excludes the condition, a recessive carrier still counts as unaffected; if it also excludes carrier status, only non-carriers are accepted."
			/>
		</p>
		<div class="seg" role="group" aria-label="Meaning of an unaffected observation">
			<button
				type="button"
				class="seg-item"
				aria-pressed={settings.unaffectedMeansNonCarrier}
				onclick={() => {
					settings.unaffectedMeansNonCarrier = true;
					persistSettings();
				}}
			>
				Not a carrier
			</button>
			<button
				type="button"
				class="seg-item"
				aria-pressed={!settings.unaffectedMeansNonCarrier}
				onclick={() => {
					settings.unaffectedMeansNonCarrier = false;
					persistSettings();
				}}
			>
				May be a carrier
			</button>
		</div>
		<p class="hint">
			Default for people whose carrier status is left Unknown. An explicit carrier finding on a
			person always overrides it.
		</p>
	</div>

	<div class="block">
		<p class="block-title">Diagram display</p>
		<Toggle
			bind:checked={settings.showGenotypes}
			label="Show genotypes on pedigree symbols"
			hint="Inferred genotypes are marked with an asterisk when the model is not certain."
			onchange={persistSettings}
		/>
	</div>

	<div class="block">
		<p class="block-title">
			Display Gg in dominant models as
			<Tooltip text="This changes only the label shown in the interface. The calculations always treat a heterozygote as affected under complete-penetrance dominant inheritance." />
		</p>
		<div class="seg" role="group" aria-label="Heterozygote display convention">
			<button
				type="button"
				class="seg-item"
				aria-pressed={!settings.heterozygoteAsCarrier}
				onclick={() => {
					settings.heterozygoteAsCarrier = false;
					persistSettings();
				}}
			>
				Affected
			</button>
			<button
				type="button"
				class="seg-item"
				aria-pressed={settings.heterozygoteAsCarrier}
				onclick={() => {
					settings.heterozygoteAsCarrier = true;
					persistSettings();
				}}
			>
				Carrier
			</button>
		</div>
		<p class="hint">
			Display convention only. Status probabilities are unchanged either way.
		</p>
	</div>

	<div class="block">
		<label class="block-title" for="allele-frequency">
			Founder variant allele frequency
			<Tooltip text="Frequency of the disease-associated allele in the population. Founder genotypes are drawn from Hardy–Weinberg proportions using this value." />
		</label>
		<div class="frequency">
			<input
				id="allele-frequency"
				class="input mono"
				type="number"
				min="0.1"
				max="50"
				step="0.1"
				value={(settings.alleleFrequency * 100).toFixed(2)}
				oninput={setFrequency}
			/>
			<span class="percent-sign">%</span>
		</div>
		<p class="hint">
			Default 1%. Posterior probabilities can depend on this assumption, so it is shown with the results.
		</p>
	</div>
</div>

<style>
	.settings {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 20px 26px;
	}

	/* The model list is the tallest block, so it takes its own full-width row
	   instead of forcing empty space beneath its neighbours. */
	.models {
		order: 1;
		grid-column: 1 / -1;
		padding-top: 16px;
		border-top: 1px solid var(--border);
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-width: 0;
	}

	.block-title {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-2);
		letter-spacing: 0.01em;
	}

	.letter-input {
		width: 58px;
		text-align: center;
		text-transform: uppercase;
		font-weight: 600;
	}

	.seg {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--surface-inset);
		align-self: flex-start;
	}

	.seg-item {
		padding: 5px 10px;
		border: 0;
		background: transparent;
		font-size: 0.75rem;
		font-weight: 540;
		color: var(--text-muted);
		cursor: pointer;
		transition: background-color var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
	}

	.seg-item[aria-pressed='true'] {
		background: var(--surface);
		color: var(--text);
		box-shadow: var(--shadow-xs);
	}

	.model-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 0 24px;
		margin-top: 4px;
	}

	.frequency {
		position: relative;
		display: flex;
		align-items: center;
		max-width: 140px;
	}

	.percent-sign {
		position: absolute;
		right: 9px;
		font-size: 0.75rem;
		color: var(--text-muted);
		pointer-events: none;
	}

	.frequency :global(.input) {
		padding-right: 24px;
	}
</style>
