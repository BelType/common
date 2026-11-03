# Changelog

## 0.1.2 — 2026-11-03

- **`@beltype/common/flags`**: the shape every package declares its flags in, lifted from Caster's `options.ts`. `defineFlags(owner, table)` answers the defaults, a `resolve` that fills them and refuses an unknown name or a value outside the row, and a `parse` that turns a command-line string into a value. `FlagError`, in `errors`, carries the `owner` and the `flag`. Nothing existing changes.
- **A number flag's refusal quotes what was typed.** `parse('rasterDpi', 'abc')` said `got null`, because `Number('abc')` is NaN and JSON spells it `null`; it now says `got "abc"`.

## 0.1.1 — 2026-10-30

- **The first release through the workflow**, `.github/workflows/release.yml`: a tag `vX.Y.Z` publishes to npm by trusted publishing, with provenance and no token, once the tag, `package.json` and this heading agree. `repository.url` names the GitHub mirror, as npm's provenance asks; `homepage` and `bugs` name Codeberg. No code change.

## 0.1.0 — 2026-10-29

- **Common leaves the BelType monorepo.** `errors`, `data-beltype` and `mime` move from `packages/common/src/` of `github.com/egildo/beltype`, at `main` f48afcef, into this repository, as TypeScript. The port is mechanical: a codemod turned the JSDoc types into annotations, and each emitted `.js` reads the same as the `.js` it came from once both are minified with comments dropped. The code is unchanged. `paths`, `logger`, `html` and the engine seam's types stay behind; the CLI is not being ported.
