/**
 * The belt's side of the `data-beltype` grammar (*one grammar in common*, 2026-10-11; `.claude/plans/cicero-optimisation/data-beltype.md`).
 *
 * BelType marks an element in one attribute, `data-beltype`, a space-separated list of WORDS: a flag (`split`) or a value written `key:value` (`pos:135`). This module is the grammar over the attribute's STRING value, a thin set of wrappers that apply it to anything with `getAttribute`/`setAttribute`/`removeAttribute` (a DOM element, a test double), one helper for a hast `properties` object, and the words the BELT writes (`pos`, `transform`). It is the one copy that core, the editing tools' tab and Caster share (see CHANGELOG 2026-10-11).
 *
 * **The engine keeps its own registry** (`engine-cicero/src/data-beltype.js`), because the engine's `src/` imports nothing. `test/data-beltype.test.js` pins the two equal: the attribute, the belt's words and their kinds, and the parse of a table of sample values. The engine's registry owns every word the ENGINE writes; this module owns the grammar and the belt's two.
 *
 * Zero imports, no DOM types: every function here runs in node, a tab and a print frame alike.
 *
 * @packageDocumentation
 */

/** The attribute's name. */
export const ATTRIBUTE = 'data-beltype';

/** The key of the line stamp, the belt's `pos:<merged line>`, written only when a host asks for stamps (`new Pipeline(..., { stamp: true })`). */
export const POS_KEY = 'pos';

/** Every stamped element, by substring (safe because no registered key ends in `pos`: the engine's registry refuses such a key at load). */
export const POS_SELECTOR = '[data-beltype*="pos:"]';

/** The flag on the site engine's JSON binding block (`<script type="application/json">`). */
export const TRANSFORM = 'transform';

/** The words the belt writes and their kinds, which the engine's registry must declare the same (the pin in `test/data-beltype.test.js`). */
export const BELT_WORDS = Object.freeze([{ name: POS_KEY, kind: 'value' }, { name: TRANSFORM, kind: 'flag' }]);

/** Is this attribute name the reserved one — `data-beltype` as markdown, a directive or hast spells it (`dataBeltype`, any case, hyphens or none)? */
export const isReserved = (name: string): boolean => name.toLowerCase().replace(/-/g, '') === 'databeltype';

/** A value's words, split. Empty and absent are the same: no words. */
const split = (text: string|null|undefined): string[] => (text ? text.split(/\s+/).filter(Boolean) : []);

/** A value parsed: the flags as a set and the `key:value` words as a map, a value that reads as a number parsed to one. */
export function words(value: string|null|undefined): { flags: Set<string>; values: Map<string,string|number>; } {
  const flags: Set<string> = new Set();
  const values: Map<string,string|number> = new Map();
  for (const word of split(value)) {
    const colon = word.indexOf(':');
    if (colon < 0) flags.add(word);
    else {
      const key = word.slice(0, colon);
      const text = word.slice(colon + 1);
      values.set(key, /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : text);
    }
  }
  return { flags, values };
}

/** The value of a key, or `undefined`. */
export const wordOf = (value: string|null|undefined, key: string): string|number|undefined => words(value).values.get(key);

/** Does the value carry this exact word, a flag or a whole `key:value` word? */
export const hasWord = (value: string|null|undefined, word: string): boolean => split(value).includes(word);

/** The value with a word added, every word already there kept; the same value where it is there already. */
export function withWord(value: string|null|undefined, word: string): string {
  const now = split(value);
  return now.includes(word) ? now.join(' ') : [...now, word].join(' ');
}

/** The value with a word out, the rest kept; the empty string where nothing is left. */
export const withoutWord = (value: string|null|undefined, word: string): string => split(value).filter((w) => w !== word).join(' ');

/** The value with a key given its value: the key's old word, if any, goes and `key:value` takes its place at the end. */
export const withValue = (value: string|null|undefined, key: string, to: string|number): string => [...split(value).filter((w) => !w.startsWith(`${key}:`)), `${key}:${to}`].join(' ');

/** The value with a key's word out, whatever its value; the empty string where nothing is left. */
export const withoutKey = (value: string|null|undefined, key: string): string => split(value).filter((w) => !w.startsWith(`${key}:`)).join(' ');

/** The value with the line stamp out and every other word kept, for a comparison that must not move when only a stamp moved. */
export const withoutPos = (value: string|null|undefined) => withoutKey(value, POS_KEY);

/** The minimum an element must answer: the three attribute verbs. A DOM element or a plain test double supplies them. */
export type Bearer = { getAttribute(name: string): string | null, setAttribute(name: string, value: string): void, removeAttribute(name: string): void };

/** Does the element carry this word? */
export const hasWordOn = (el: Pick<Bearer,'getAttribute'>, word: string) => hasWord(el.getAttribute?.(ATTRIBUTE), word);

/** The element's value for a key, or `undefined`. */
export const wordOn = (el: Pick<Bearer,'getAttribute'>, key: string) => wordOf(el.getAttribute?.(ATTRIBUTE), key);

/** Add a word to an element, keeping every word already there: read, modify, write, never a bare assignment of the whole value. */
export function addWordTo(el: Bearer, word: string) {
  const now = el.getAttribute(ATTRIBUTE);
  if (!hasWord(now, word)) el.setAttribute(ATTRIBUTE, withWord(now, word));
}

/** The stamp an element carries, as a number, or `null`. */
export function posOf(el: Pick<Bearer,'getAttribute'>): number|null {
  const word = wordOn(el, POS_KEY);
  return typeof word === 'number' ? word : null;
}

/** Put a stamp on an element: the word only, every other word kept. */
export function setPos(el: Bearer, line: number|string) {
  el.setAttribute(ATTRIBUTE, withValue(el.getAttribute(ATTRIBUTE), POS_KEY, line));
}

/** Give a hast element's `properties` a key's value: the attribute is `dataBeltype` there. Appended to whatever the element already says, never assigned over it. */
export function setValueIn(properties: Record<string,unknown>, key: string, to: string|number) {
  const had = properties.dataBeltype;
  properties.dataBeltype = withValue(typeof had === 'string' ? had : '', key, to);
}
