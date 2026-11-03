/**
 * `flags.js` — the shape every BelType package declares its flags in: a table of name, accepted values and default, and a resolver that fills the defaults and refuses anything the table does not name.
 *
 * @remarks
 * Lifted from Caster's `options.ts`, which stays the model: the reason for each default sits beside its row as a comment, and a flag's absence reproduces the previous behaviour exactly.
 *
 * @packageDocumentation
 */

import { FlagError } from './errors.ts';

/** One row: every value the flag accepts, or `null` where it takes a positive finite number; and its default. */
export type FlagSpec<V> = { readonly values: readonly V[] | null; readonly default: V };
export type FlagTable = Record<string, FlagSpec<unknown>>;
export type FlagValues<T extends FlagTable> = { -readonly [K in keyof T]: T[K]['default'] };

/**
 * The defaults, and a resolver that fills them and refuses an unknown name or a value outside the row.
 *
 * @param owner - Prefixes every message: `caster: 'shaper' takes "harfbuzz" or "fontkit"; got "x".`
 */
export function defineFlags<T extends FlagTable>(owner: string, table: T): {
  readonly owner: string;
  readonly table: T;
  readonly defaults: FlagValues<T>;
  resolve(given?: Partial<FlagValues<T>>): FlagValues<T>;
  /** Parse a command-line string against the row: a value whose `String()` matches one of `values`, or a number where `values` is null. */
  parse(name: string, raw: string): unknown;
} {
  const defaults = Object.fromEntries(Object.entries(table).map(([name, spec]) => [name, spec.default])) as FlagValues<T>;
  const row = (name: string): FlagSpec<unknown> => {
    const spec = Object.hasOwn(table, name) ? table[name] : undefined;
    if (!spec) throw new FlagError(`${owner}: unknown option '${name}'. The flags are ${Object.keys(table).join(', ')}.`, owner, name);
    return spec;
  };
  const refuse = (name: string, spec: FlagSpec<unknown>, got: unknown): never => {
    throw new FlagError(spec.values === null
      ? `${owner}: '${name}' takes a positive number; got ${JSON.stringify(got)}.`
      : `${owner}: '${name}' takes ${spec.values.map((v) => JSON.stringify(v)).join(' or ')}; got ${JSON.stringify(got)}.`, owner, name);
  };
  const check = (name: string, value: unknown) => {
    const spec = row(name);
    if (spec.values === null) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) refuse(name, spec, value);
    } else if (!spec.values.includes(value)) refuse(name, spec, value);
  };
  return {
    owner,
    table,
    defaults,
    resolve(given = {}) {
      const out: Record<string, unknown> = { ...defaults };
      for (const [name, value] of Object.entries(given)) {
        if (value === undefined) continue;
        check(name, value);
        out[name] = value;
      }
      return out as FlagValues<T>;
    },
    parse(name, raw) {
      const spec = row(name);
      if (spec.values === null) {
        const n = Number(raw);
        // The refusal quotes what was typed: `Number('abc')` is NaN, which JSON spells `null`.
        if (raw.trim() === '' || !Number.isFinite(n) || n <= 0) refuse(name, spec, raw);
        return n;
      }
      const hit = spec.values.find((v) => String(v) === raw);
      if (hit === undefined) refuse(name, spec, raw);
      return hit;
    }
  };
}
