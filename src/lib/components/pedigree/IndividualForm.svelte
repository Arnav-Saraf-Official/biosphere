<script lang="ts">
	import type {
		CarrierObservation,
		Individual,
		InheritanceModel,
		ObservedStatus,
		Sex
	} from '$lib/types/genetics';
	import {
		getModelDefinition,
		parseGenotype,
		phenotypeOf,
		remapGenotype,
		stateGenotype
	} from '$lib/genetics/inheritance/model-spec';
	import { Trash2, UserPlus, Baby, AlertTriangle } from 'lucide-svelte';
	import Tooltip from '../ui/Tooltip.svelte';

	interface PartnerInfo {
		partnershipId: string;
		label: string;
		name?: string;
		relationship: 'married' | 'divorced';
		canHaveChildren: boolean;
	}

	let {
		individual,
		model,
		alleleLetter,
		partners,
		onpatch,
		ondelete,
		onaddChild,
		onrequestPartner
	}: {
		individual: Individual;
		model: InheritanceModel;
		alleleLetter: string;
		partners: PartnerInfo[];
		onpatch: (patch: Partial<Individual>) => void;
		ondelete: () => void;
		onaddChild: (partnershipId: string) => void;
		onrequestPartner: () => void;
	} = $props();

	const statusOptions: Array<{ value: ObservedStatus; label: string; hint: string }> = [
		{ value: 'unknown', label: 'Unknown', hint: 'No phenotype information for this individual' },
		{ value: 'unaffected', label: 'Unaffected', hint: 'Not expressing the phenotype' },
		{ value: 'affected', label: 'Affected', hint: 'Expressing the phenotype' }
	];

	const carrierOptions: Array<{ value: CarrierObservation; label: string; hint: string }> = [
		{
			value: 'unknown',
			label: 'Unknown',
			hint: 'Let the engine deduce carrier status from the family data.'
		},
		{
			value: 'carrier',
			label: 'Carrier',
			hint: 'Carries one variant allele: unaffected under recessive models, affected under dominant models.'
		},
		{
			value: 'non-carrier',
			label: 'Not a carrier',
			hint: 'Carries no variant allele.'
		}
	];

	const definition = $derived(getModelDefinition(model));

	const genotypeCheck = $derived.by(() => {
		if (!individual.genotype || individual.genotype.trim() === '') return { ok: true, message: '' };
		const parsed = parseGenotype(individual.genotype, model, individual.sex);
		if (!parsed) {
			return {
				ok: false,
				message: definition.sexLinked
					? 'For sex-linked models, set the sex first and use one allele for males or two for females.'
					: 'Use two alleles, for example Gg or AA.'
			};
		}
		const phenotype = phenotypeOf(model, parsed);
		return {
			ok: true,
			message: `Reads as ${remapGenotype(stateGenotype(model, parsed), alleleLetter)} — ${phenotype} under ${definition.label.toLowerCase()}.`
		};
	});

	const sexOptions: Array<{ value: Sex; label: string }> = [
		{ value: 'unknown', label: 'Unspecified' },
		{ value: 'female', label: 'Female (XX)' },
		{ value: 'male', label: 'Male (XY)' }
	];
</script>

<div class="form">
	<div class="form-head">
		<div>
			<p class="form-title">{individual.label}</p>
			<p class="form-sub">Selected individual</p>
		</div>
		<button type="button" class="icon-btn danger" onclick={ondelete} aria-label="Delete individual">
			<Trash2 size={15} aria-hidden="true" />
		</button>
	</div>

	<div class="field">
		<label class="label" for="ind-label">Identifier</label>
		<input
			id="ind-label"
			class="input"
			value={individual.label}
			oninput={(event) => onpatch({ label: event.currentTarget.value })}
		/>
	</div>

	<div class="field">
		<label class="label" for="ind-name">Name <span class="optional">optional</span></label>
		<input
			id="ind-name"
			class="input"
			placeholder="e.g. Alex"
			value={individual.name ?? ''}
			oninput={(event) => onpatch({ name: event.currentTarget.value })}
		/>
	</div>

	<div class="field">
		<label class="label" for="ind-sex">
			Biological sex
			<Tooltip text="Sex is used by the inheritance calculations. Leave it unspecified if it is unknown — no sex will be assumed." />
		</label>
		<select
			id="ind-sex"
			class="select"
			value={individual.sex}
			onchange={(event) => onpatch({ sex: event.currentTarget.value as Sex, genotype: '' })}
		>
			{#each sexOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<div class="field">
		<span class="label">
			Phenotype
			<Tooltip text="What was observed clinically. Carrier status is recorded separately, below." />
		</span>
		<div class="status-grid" role="group" aria-label="Phenotype">
			{#each statusOptions as option (option.value)}
				<button
					type="button"
					class="status-button"
					class:active={individual.status === option.value}
					aria-pressed={individual.status === option.value}
					title={option.hint}
					onclick={() => onpatch({ status: option.value })}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="field">
		<span class="label">
			Carrier status
			<Tooltip
				text="Separate from the phenotype: a carrier is unaffected under a recessive model but affected under a dominant one. Unknown lets the engine deduce it, alone or alongside affected/unaffected."
			/>
		</span>
		<div class="status-grid" role="group" aria-label="Carrier status">
			{#each carrierOptions as option (option.value)}
				<button
					type="button"
					class="status-button"
					class:active={(individual.carrier ?? 'unknown') === option.value}
					aria-pressed={(individual.carrier ?? 'unknown') === option.value}
					title={option.hint}
					onclick={() => onpatch({ carrier: option.value })}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="field">
		<span class="label">
			Life status
			<Tooltip text="Deceased individuals are drawn with a diagonal strike. Their recorded data still takes part in the analysis." />
		</span>
		<div class="status-grid" role="group" aria-label="Life status">
			<button
				type="button"
				class="status-button"
				class:active={individual.vital !== 'deceased'}
				aria-pressed={individual.vital !== 'deceased'}
				onclick={() => onpatch({ vital: 'alive' })}
			>
				Living
			</button>
			<button
				type="button"
				class="status-button"
				class:active={individual.vital === 'deceased'}
				aria-pressed={individual.vital === 'deceased'}
				onclick={() => onpatch({ vital: 'deceased' })}
			>
				Deceased
			</button>
		</div>
	</div>

	<div class="field">
		<label class="label" for="ind-genotype">
			Known genotype
			<Tooltip
				text={`Optional. Every pedigree uses the letter ${alleleLetter}: uppercase is the variant allele, lowercase the reference allele. Leave it empty to use the inferred genotype.`}
			/>
		</label>
		<input
			id="ind-genotype"
			class="input mono"
			class:input-invalid={!genotypeCheck.ok}
			placeholder={definition.sexLinked && individual.sex === 'male'
				? `e.g. ${alleleLetter}`
				: `e.g. ${alleleLetter}${alleleLetter.toLowerCase()}`}
			value={individual.genotype ?? ''}
			oninput={(event) => onpatch({ genotype: event.currentTarget.value })}
		/>
		{#if individual.genotype && individual.genotype.trim() !== ''}
			<p class="hint" class:error={!genotypeCheck.ok}>
				{#if !genotypeCheck.ok}<AlertTriangle size={12} aria-hidden="true" />{/if}
				{genotypeCheck.message}
			</p>
		{:else}
			<p class="hint">
				Leave empty to use the genotype inferred from the family. Everyone shares the letter
				{alleleLetter}, set in the analysis settings.
			</p>
		{/if}
	</div>

	<div class="field">
		<label class="label" for="ind-age">Age <span class="optional">optional</span></label>
		<input
			id="ind-age"
			class="input mono"
			type="number"
			min="0"
			max="130"
			placeholder="e.g. 42"
			value={individual.age ?? ''}
			oninput={(event) => {
				const raw = event.currentTarget.value;
				const value = raw === '' ? undefined : Number(raw);
				onpatch({ age: value !== undefined && Number.isFinite(value) ? value : undefined });
			}}
		/>
		<p class="hint">Used by Clean up to order a generation, oldest first.</p>
	</div>

	<div class="field">
		<label class="label" for="ind-notes">Notes <span class="optional">optional</span></label>
		<textarea
			id="ind-notes"
			class="textarea"
			rows="2"
			placeholder="Clinical notes stay on this device."
			value={individual.notes ?? ''}
			oninput={(event) => onpatch({ notes: event.currentTarget.value })}
		></textarea>
	</div>

	<hr class="divider" />

	<div class="field">
		<span class="label">Relationships</span>
		{#if partners.length === 0}
			<button type="button" class="btn btn-block" onclick={onrequestPartner}>
				<UserPlus size={14} aria-hidden="true" /> Add a partner
			</button>
		{:else}
			<div class="partners">
				{#each partners as partner (partner.partnershipId)}
					<button
						type="button"
						class="partner-row"
						disabled={!partner.canHaveChildren}
						title={partner.canHaveChildren
							? `Add a child with ${partner.name || partner.label}`
							: 'This couple is recorded as same-sex; children are not modelled.'}
						onclick={() => onaddChild(partner.partnershipId)}
					>
						<span class="partner-name">
							<Baby size={13} aria-hidden="true" />
							{partner.canHaveChildren
								? `Add child with ${partner.name || partner.label}`
								: `No children with ${partner.name || partner.label}`}
						</span>
						<span class="partner-plus">{partner.canHaveChildren ? '+' : '—'}</span>
					</button>
					{#if partner.relationship === 'divorced'}
						<span class="partner-note">Marked as divorced</span>
					{/if}
				{/each}
			</div>
			<button type="button" class="btn btn-sm btn-block" onclick={onrequestPartner}>
				<UserPlus size={13} aria-hidden="true" /> Add another partner
			</button>
		{/if}
	</div>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.form-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
	}

	.form-title {
		font-size: 0.875rem;
		font-weight: 620;
	}

	.form-sub {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.icon-btn.danger:hover {
		background: var(--error-soft);
		color: var(--error);
	}

	.optional {
		font-weight: 400;
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 4px;
	}

	.status-button {
		padding: 6px 8px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface);
		color: var(--text-2);
		font-size: 0.75rem;
		font-weight: 520;
		transition:
			background-color var(--dur-1) var(--ease-out),
			border-color var(--dur-1) var(--ease-out),
			color var(--dur-1) var(--ease-out);
	}

	.status-button:hover {
		background: var(--surface-2);
	}

	.status-button.active {
		background: var(--accent-soft);
		border-color: color-mix(in srgb, var(--accent) 46%, transparent);
		color: var(--accent-strong);
		font-weight: 600;
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.hint.error {
		color: var(--error);
	}

	.partners {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.partner-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 7px 9px;
		border: 1px solid var(--border);
		border-radius: var(--r-sm);
		background: var(--surface);
		color: var(--text-2);
		font-size: 0.75rem;
		text-align: left;
		transition:
			background-color var(--dur-1) var(--ease-out),
			color var(--dur-1) var(--ease-out);
	}

	.partner-row:hover {
		background: var(--accent-soft);
		color: var(--accent-strong);
	}

	.partner-row:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.partner-row:disabled:hover {
		background: var(--surface);
		color: var(--text-2);
	}

	.partner-note {
		font-size: 0.75rem;
		color: var(--text-muted);
		padding: 0 9px;
	}

	.partner-name {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.partner-plus {
		font-weight: 700;
	}
</style>
