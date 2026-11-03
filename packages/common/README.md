# @beltype/common

The floor BelType's packages stand on. Four modules, zero runtime dependencies:

- `@beltype/common/errors`: one typed hierarchy under `BelTypeError` (`ConfigError`, `ValidationError`, `BuildError`). Throw a subclass, never a bare `Error`.
- `@beltype/common/data-beltype`: the grammar of the `data-beltype` attribute, a space-separated list of words, each a flag (`split`) or a `key:value` (`pos:135`), and the two words the belt writes.
- `@beltype/common/flags`: the shape every package declares its flags in, with defaults, a `resolve` and a command-line `parse`.
- `@beltype/common/mime`: one MIME table, one answer on every path.

```bash
npm install @beltype/common
```

## Working on it

```bash
pnpm install
pnpm run check   # tsc over src and test, strict
pnpm test        # node:test, the .ts files run directly
pnpm run build   # dist/
```

MIT.
