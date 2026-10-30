import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { BelTypeError, BuildError, ConfigError, ValidationError } from '../src/errors.ts';
import * as grammar from '../src/data-beltype.ts';
import { contentType } from '../src/mime.ts';

test('every error is a BelTypeError, named by its class, and only the root carries a code', () => {
  for (const [Kind, name] of [[ConfigError, 'ConfigError'], [ValidationError, 'ValidationError'], [BuildError, 'BuildError']] as const) {
    const e = new Kind('x');
    assert.ok(e instanceof BelTypeError);
    assert.equal(e.name, name);
    assert.ok(!('code' in e));
  }
  assert.equal(new BelTypeError('x', 'parse').code, 'parse');
  assert.ok(!('code' in new BelTypeError('x')), 'no code leaves no property, not an undefined one');
});

test('the grammar parses flags and values, numbers as numbers', () => {
  const { flags, values } = grammar.words('split slice:2 pos:7 has:3gv2ab');
  assert.deepEqual([...flags], ['split']);
  assert.deepEqual([...values], [['slice', 2], ['pos', 7], ['has', '3gv2ab']]);
  assert.equal(grammar.withoutPos('split pos:7'), 'split');
  assert.equal(grammar.withoutWord('split', 'split'), '');
  const attrs = new Map<string, string>();
  const el = { getAttribute: (k: string) => attrs.get(k) ?? null, setAttribute: (k: string, v: string) => void attrs.set(k, v), removeAttribute: (k: string) => void attrs.delete(k) };
  grammar.setPos(el, 9);
  grammar.addWordTo(el, 'fragment');
  assert.equal(attrs.get('data-beltype'), 'pos:9 fragment');
  assert.equal(grammar.posOf(el), 9);
});

test('one MIME table, no charset parameter', () => {
  assert.equal(contentType('a/b.css'), 'text/css');
  assert.equal(contentType('x.unknown-ext'), 'application/octet-stream');
});

test('the layering: src imports nothing outside the package but node:path, and that from mime alone', () => {
  const src = new URL('../src/', import.meta.url);
  for (const file of readdirSync(src).filter((f) => f.endsWith('.ts'))) {
    const specs = [...readFileSync(new URL(file, src), 'utf8').matchAll(/^\s*import\s[^;]*?from\s*'([^']+)'/gm)].map((m) => m[1]).filter((spec) => !spec?.startsWith('./'));
    assert.deepEqual(specs, file === 'mime.ts' ? ['path'] : [], file);
  }
});
