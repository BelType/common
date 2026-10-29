# Changelog

## 0.1.0 — 2026-10-29

- **Common leaves the BelType monorepo.** `errors`, `data-beltype` and `mime` move from `packages/common/src/` of `github.com/egildo/beltype`, at `main` f48afcef, into this repository, as TypeScript. The port is mechanical: a codemod turned the JSDoc types into annotations, and each emitted `.js` reads the same as the `.js` it came from once both are minified with comments dropped. The code is unchanged. `paths`, `logger`, `html` and the engine seam's types stay behind; the CLI is not being ported.
