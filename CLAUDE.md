# Working on common

`@beltype/common`: BelType's floor, three modules (`errors`, `data-beltype`, `mime`). This file is the working method.

## The document hierarchy — read in this order

1. **`SPEC.md`** — the product constitution. Normative for every semantic question.
2. **`.specify/memory/constitution.md`** — the engineering constitution. Normative for process.
3. **`specs/NNN-*/`** — per-change spec, plan and tasks (Spec Kit, `.claude/skills/speckit-*`).

## Non-negotiables

- Zero runtime dependencies. `mime` may import `path`; nothing else imports anything. `test/common.test.ts`'s layering test enforces it.
- TypeScript `strict` + `noUncheckedIndexedAccess` + `erasableSyntaxOnly`. Relative imports name `./x.ts`.
- `node:test`, no framework, no network.
- TSDoc prose as in BelType's house convention: types in annotations, prose in tags, never a type restated in prose.

## Run & verify

```bash
pnpm run check   # keep green
pnpm test        # keep green
pnpm run build   # dist/, also run by prepare
```

Names: the repo name is the package name without the scope. Codeberg (`codeberg.org/BelType/common`) is the source of truth; GitHub mirrors it.
