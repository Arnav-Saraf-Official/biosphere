/**
 * Discrete factor-graph primitives used for exact pedigree inference.
 *
 * Everything is stored in log space so that long pedigrees do not underflow.
 * Sum-product variable elimination (i.e. the junction-tree algorithm) is
 * exact; if the induced tables would exceed a safe size the engine throws
 * `InferenceTooLargeError` rather than silently substituting a heuristic.
 */

export class InferenceTooLargeError extends Error {
	readonly estimatedSize: number;
	constructor(estimatedSize: number) {
		super(
			`Exact inference requires a factor table of ${estimatedSize.toLocaleString()} entries, which exceeds the safe limit.`
		);
		this.name = 'InferenceTooLargeError';
		this.estimatedSize = estimatedSize;
	}
}

/** Maximum number of entries in a single intermediate factor table. */
export const MAX_TABLE_SIZE = 4_000_000;

export type Cardinality = Record<string, number>;

export interface Factor {
	vars: string[];
	/** log-probabilities, row-major with vars[0] varying slowest */
	log: Float64Array;
}

export function logAdd(a: number, b: number): number {
	if (a === -Infinity) return b;
	if (b === -Infinity) return a;
	const max = a > b ? a : b;
	const min = a > b ? b : a;
	return max + Math.log1p(Math.exp(min - max));
}

export function logSumExp(values: ArrayLike<number>): number {
	let max = -Infinity;
	for (let i = 0; i < values.length; i++) if (values[i] > max) max = values[i];
	if (max === -Infinity) return -Infinity;
	let sum = 0;
	for (let i = 0; i < values.length; i++) sum += Math.exp(values[i] - max);
	return max + Math.log(sum);
}

export function tableSize(vars: string[], cards: Cardinality): number {
	let size = 1;
	for (const v of vars) size *= cards[v] ?? 1;
	return size;
}

export function strideMap(vars: string[], cards: Cardinality): number[] {
	const strides = new Array<number>(vars.length).fill(1);
	for (let i = vars.length - 1, acc = 1; i >= 0; i--) {
		strides[i] = acc;
		acc *= cards[vars[i]] ?? 1;
	}
	return strides;
}

export function multiply(a: Factor, b: Factor, cards: Cardinality): Factor {
	if (a.vars.length === 0) return scale(a, b);
	if (b.vars.length === 0) return scale(b, a);

	const vars = [...a.vars];
	for (const v of b.vars) if (!vars.includes(v)) vars.push(v);

	const size = tableSize(vars, cards);
	if (size > MAX_TABLE_SIZE) throw new InferenceTooLargeError(size);

	const rStride = strideMap(vars, cards);
	const aStride = strideMap(a.vars, cards);
	const bStride = strideMap(b.vars, cards);

	const pos = new Map<string, number>();
	vars.forEach((v, i) => pos.set(v, i));
	const aPos = a.vars.map((v) => pos.get(v) ?? 0);
	const bPos = b.vars.map((v) => pos.get(v) ?? 0);

	const out = new Float64Array(size);
	const assign = new Array<number>(vars.length).fill(0);

	for (let idx = 0; idx < size; idx++) {
		let rest = idx;
		for (let i = 0; i < vars.length; i++) {
			const step = rStride[i];
			assign[i] = Math.floor(rest / step);
			rest -= assign[i] * step;
		}
		let ai = 0;
		for (let k = 0; k < aPos.length; k++) ai += assign[aPos[k]] * aStride[k];
		let bi = 0;
		for (let k = 0; k < bPos.length; k++) bi += assign[bPos[k]] * bStride[k];
		out[idx] = a.log[ai] + b.log[bi];
	}

	return { vars, log: out };
}

/** Multiply a factor by a scalar (single-entry factor). */
function scale(scalar: Factor, factor: Factor): Factor {
	const value = scalar.log[0];
	const out = new Float64Array(factor.log.length);
	for (let i = 0; i < out.length; i++) out[i] = factor.log[i] + value;
	return { vars: [...factor.vars], log: out };
}

export function sumOut(f: Factor, variable: string, cards: Cardinality): Factor {
	const vars = f.vars.filter((v) => v !== variable);
	const size = tableSize(vars, cards);
	if (size > MAX_TABLE_SIZE) throw new InferenceTooLargeError(size);

	const out = new Float64Array(size).fill(-Infinity);
	const srcStride = strideMap(f.vars, cards);
	const dstStride = strideMap(vars, cards);
	const dstPos = new Map<string, number>();
	vars.forEach((v, i) => dstPos.set(v, i));
	const mapPos = f.vars.map((v) => dstPos.get(v) ?? -1);

	for (let idx = 0; idx < f.log.length; idx++) {
		let rest = idx;
		let target = 0;
		for (let i = 0; i < f.vars.length; i++) {
			const step = srcStride[i];
			const value = Math.floor(rest / step);
			rest -= value * step;
			const p = mapPos[i];
			if (p >= 0) target += value * dstStride[p];
		}
		out[target] = logAdd(out[target], f.log[idx]);
	}

	return { vars, log: out };
}

/** Greedy min-fill elimination ordering (a standard VE heuristic). */
export function minFillOrder(factors: Factor[], skip: Set<string>): string[] {
	const adjacency = new Map<string, Set<string>>();
	const ensure = (v: string): Set<string> => {
		let set = adjacency.get(v);
		if (!set) {
			set = new Set<string>();
			adjacency.set(v, set);
		}
		return set;
	};

	for (const f of factors) {
		const vars = f.vars.filter((v) => !skip.has(v));
		for (let i = 0; i < vars.length; i++) {
			for (let j = i + 1; j < vars.length; j++) {
				ensure(vars[i]).add(vars[j]);
				ensure(vars[j]).add(vars[i]);
			}
		}
	}

	const remaining = new Set(adjacency.keys());
	const order: string[] = [];

	while (remaining.size > 0) {
		let best = '';
		let bestFill = Infinity;
		for (const v of remaining) {
			const neighbours = [...(adjacency.get(v) ?? [])].filter((n) => remaining.has(n));
			let fill = 0;
			for (let i = 0; i < neighbours.length; i++) {
				for (let j = i + 1; j < neighbours.length; j++) {
					if (!adjacency.get(neighbours[i])?.has(neighbours[j])) fill++;
				}
			}
			if (fill < bestFill) {
				bestFill = fill;
				best = v;
			}
		}
		const chosen = best || [...remaining][0];
		const neighbours = [...(adjacency.get(chosen) ?? [])].filter((n) => remaining.has(n));
		for (let i = 0; i < neighbours.length; i++) {
			for (let j = i + 1; j < neighbours.length; j++) {
				ensure(neighbours[i]).add(neighbours[j]);
				ensure(neighbours[j]).add(neighbours[i]);
			}
		}
		remaining.delete(chosen);
		order.push(chosen);
	}

	return order;
}

export interface EliminationResult {
	logZ: number;
	/** Marginal factor over the requested variables (normalised), if any. */
	factor: Factor | null;
}

/**
 * Sum-product variable elimination.
 * `keep` lists variables that must not be summed out; the returned factor is
 * the normalised marginal over exactly those variables.
 */
export function variableElimination(
	factors: Factor[],
	cards: Cardinality,
	keep: string[] = []
): EliminationResult {
	const keepSet = new Set(keep);
	const order = minFillOrder(factors, keepSet);
	let working = factors.map((f) => ({ vars: [...f.vars], log: f.log }));

	for (const variable of order) {
		const involved = working.filter((f) => f.vars.includes(variable));
		if (involved.length === 0) continue;
		working = working.filter((f) => !f.vars.includes(variable));

		let combined = involved[0];
		for (let i = 1; i < involved.length; i++) {
			combined = multiply(combined, involved[i], cards);
		}
		working.push(sumOut(combined, variable, cards));
	}

	let product: Factor;
	if (working.length === 0) {
		product = { vars: [], log: new Float64Array([0]) };
	} else {
		product = working[0];
		for (let i = 1; i < working.length; i++) {
			product = multiply(product, working[i], cards);
		}
	}

	const logZ = logSumExp(product.log);
	if (keep.length === 0 || logZ === -Infinity) {
		return { logZ, factor: keep.length > 0 ? product : null };
	}

	const normalised = new Float64Array(product.log.length);
	for (let i = 0; i < product.log.length; i++) normalised[i] = Math.exp(product.log[i] - logZ);
	return { logZ, factor: { vars: product.vars, log: normalised } };
}
