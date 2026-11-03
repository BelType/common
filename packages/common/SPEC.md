# Common — the product constitution

Normative for every semantic question about this package. Amend by article, with an entry in the CHANGELOG; never by drift.

## Article 1. What common is

Common is the floor BelType's packages stand on: what more than one of them needs and none of them owns. It holds four modules (`errors`, `data-beltype`, `flags`, `mime`) and nothing else. A module joins only when a second package needs it. The repository holds other packages beside it, each with its own `SPEC.md`; this one governs the floor alone.

## Article 2. Errors

1. Every error BelType throws on purpose is a `BelTypeError` or one of its three subclasses: `ConfigError` (the cascade's refusals, a reference nothing serves, a key misused), `ValidationError` (an input refused at a door) and `BuildError` (the build failed, or an engine cannot honour a seam member).
2. An error carries its `name`, its message and, on the root class alone, an optional `code` from the closed union `BelTypeErrorCode`. A falsy code leaves no `code` property at all. No other state, until a consumer needs it and its reader arrives in the same change.

## Article 3. The `data-beltype` grammar

1. BelType marks an element in one attribute, `data-beltype`: a space-separated list of words. A word is a flag (`split`) or a value written `key:value`; a value that reads as a number is a number.
2. This module is the grammar over the attribute's string value, a set of wrappers over anything with `getAttribute`, `setAttribute` and `removeAttribute`, and the words the belt writes: `pos` (a value, the source line) and `transform` (a flag).
3. A writer reads, modifies and writes; it never assigns the whole value. A value left with no word is the empty string, which a writer turns into no attribute.
4. Cicero keeps its own registry of the words the engine writes. The two must agree on the attribute, the belt's words and their kinds, and the parse of every value; Cicero's tests pin it.

## Article 4. MIME

One table maps a file's extension to its media type, with no `charset` parameter. An extension the table does not hold is `application/octet-stream`.

## Article 5. Realms

The modules run in node, a browser tab and a print frame alike. No module imports anything except `mime`, which imports `path`. The layering test enforces it.
