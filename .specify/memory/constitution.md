# Common — the engineering constitution

Normative for process. Where it and `SPEC.md` disagree on product semantics, `SPEC.md` wins.

## Principles

1. **SPEC.md first.** A behaviour change amends an article of `SPEC.md` in the same change, or it is not made.
2. **Strict TypeScript.** `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly` and `verbatimModuleSyntax`. Node runs the `.ts` sources directly; `tsc` emits `dist/` for consumers. Relative imports name `./x.ts`; the emit rewrites them to `./x.js`.
3. **node:test, no framework.** `pnpm test` runs `test/*.test.ts` directly. No network in tests.
4. **TSDoc carries the prose; annotations carry the types.** A summary sentence; `@remarks` for the rationale that still binds; `@param name - …` only when it says something; never a type restated in prose.
5. **Zero runtime dependencies.** The layering test enforces the realm rule of `SPEC.md`, Article 5.
6. **A mechanical port is proven by zero-diff**: each emitted `.js` against the `.js` it came from, both minified with every comment dropped, byte for byte.

## Releases

Versions follow semver. A release is a tag `vX.Y.Z` on `main` and a dated CHANGELOG entry. The npm publish runs later from the GitHub mirror, to the `@beltype` scope.
