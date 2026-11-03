# @beltype/common

The floor BelType's packages stand on. Three modules, zero runtime dependencies:

- `@beltype/common/errors`: one typed hierarchy under `BelTypeError` (`ConfigError`, `ValidationError`, `BuildError`). Throw a subclass, never a bare `Error`.
- `@beltype/common/data-beltype`: the grammar of the `data-beltype` attribute, a space-separated list of words, each a flag (`split`) or a `key:value` (`pos:135`), and the two words the belt writes.
- `@beltype/common/mime`: one MIME table, one answer on every path.

Installed as a git dependency for now:

```json
"@beltype/common": "git+ssh://git@codeberg.org/BelType/common.git#v0.1.0"
```

`prepare` builds `dist/`, so the install is a built package.

## Working on it

```bash
pnpm install
pnpm run check   # tsc over src and test, strict
pnpm test        # node:test, the .ts files run directly
pnpm run build   # dist/
```

MIT.
