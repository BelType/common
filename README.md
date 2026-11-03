# BelType common

A pnpm workspace. It holds one package today, `@beltype/common`, the floor BelType's packages stand on (`packages/common`, with its own `SPEC.md`). Three packages join it, as the decision record *a definition is proved by two strangers* rules: `@beltype/display-list`, the definition of the display list (schema, types, validator); `@beltype/display-list-corpus`, the shared lists and their reference files, published as data; and `@beltype/display-list-conformance`, the private runner that proves a writer against the corpus.

A release is a tag `<dir>-vX.Y.Z` (`common-v0.1.3`), which publishes `packages/<dir>`.

MIT.
