/**
 * `errors.js` — one typed hierarchy under {@link BelTypeError}, distinguished by `name` (which appears in stack traces) and message. Throw a subclass, never a bare Error.
 *
 * @remarks
 * They deliberately carry no other state beyond an optional `code` (see CHANGELOG 2026-10-17).
 *
 * A construction site throws `BelTypeError(message, code)` directly, `code` naming the kind in the closed union {@link BelTypeErrorCode} (see CHANGELOG 2026-09-03). If a future consumer needs structured context, add the field back together with its reader, in the same change — not before.
 *
 * @see .claude/decisions/project/the-mvp-cut.md
 * @packageDocumentation
 */

/** The kinds a bare {@link BelTypeError} names in `code` — the closed union of every code thrown today (grepped 2026-09-21, all of them in `packages/core/src`): `'circular-include'` and `'include'` from `plugins/include.js`, `'not-found'` from `pipeline.js`, `'parse'` from `frontmatter.js`, `'plugin'` from `plugin-loader.js` and `processor-factory.js`. A new code joins this union in the change that first throws it; the three named subclasses carry none. */
export type BelTypeErrorCode = 'circular-include' | 'include' | 'not-found' | 'parse' | 'plugin';

/** The root of the hierarchy, and the one class that may carry a `code` — thrown bare, with a kind from {@link BelTypeErrorCode}. */
export class BelTypeError extends Error {
  declare code: BelTypeErrorCode | undefined;
  /**
   * @param code - The kind, where no subclass names it. A falsy code leaves the instance with no `code` property at all, not an `undefined` one.
   */
  constructor(message: string, code?: BelTypeErrorCode) {
    super(message);
    this.name = 'BelTypeError';
    if (code) this.code = code;
  }
}

/** Configuration-related errors: the cascade's refusals, a ref nothing serves, a key misused. */
export class ConfigError extends BelTypeError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/** Validation errors — an input refused at a door: the command line's flags, targets and modes, and a path the editing server will not open. */
export class ValidationError extends BelTypeError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/** The build or the pipeline failed — and what an engine throws from a seam member it cannot honour. */
export class BuildError extends BelTypeError {
  constructor(message: string) {
    super(message);
    this.name = 'BuildError';
  }
}

/** A flag refused at its table: an unknown name, or a value outside the row. Carries the table's `owner` and the `flag`. */
export class FlagError extends BelTypeError {
  declare owner: string;
  declare flag: string;
  constructor(message: string, owner: string, flag: string) {
    super(message);
    this.name = 'FlagError';
    this.owner = owner;
    this.flag = flag;
  }
}
