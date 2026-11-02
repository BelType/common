import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defineFlags } from '../src/flags.ts';
import { BelTypeError, FlagError } from '../src/errors.ts';

const flags = defineFlags('demo', {
  shaper: { values: ['harfbuzz', 'fontkit'], default: 'harfbuzz' },
  skipInk: { values: [true, false], default: true },
  dpi: { values: null, default: 300 }
});

test('the defaults are the table\'s, and resolving nothing answers them', () => {
  assert.deepEqual(flags.defaults, { shaper: 'harfbuzz', skipInk: true, dpi: 300 });
  assert.deepEqual(flags.resolve(), flags.defaults);
  assert.deepEqual(flags.resolve({ shaper: undefined }), flags.defaults, 'undefined is absent');
  assert.deepEqual(flags.resolve({ shaper: 'fontkit' }), { shaper: 'fontkit', skipInk: true, dpi: 300 });
});

test('an unknown name is refused, naming the owner, the flag and the known ones', () => {
  assert.throws(() => flags.resolve({ nope: 1 } as never), (e: unknown) => e instanceof FlagError && e instanceof BelTypeError && e.owner === 'demo' && e.flag === 'nope' && /unknown option 'nope'.*shaper, skipInk, dpi/.test(e.message));
  assert.throws(() => flags.resolve({ toString: 1 } as never), FlagError);
  assert.throws(() => flags.parse('nope', '1'), FlagError);
});

test('a value outside the set is refused, the message naming every accepted value', () => {
  assert.throws(() => flags.resolve({ shaper: 'x' as never }), { message: `demo: 'shaper' takes "harfbuzz" or "fontkit"; got "x".` });
  assert.throws(() => flags.resolve({ skipInk: 'yes' as never }), { message: `demo: 'skipInk' takes true or false; got "yes".` });
});

test('a number flag takes a positive finite number only', () => {
  assert.equal(flags.resolve({ dpi: 96 }).dpi, 96);
  for (const bad of [0, -1, NaN, Infinity, '300']) assert.throws(() => flags.resolve({ dpi: bad as never }), { message: /'dpi' takes a positive number/ });
});

test('parse turns a command-line string into the row\'s value', () => {
  assert.equal(flags.parse('skipInk', 'true'), true);
  assert.equal(flags.parse('skipInk', 'false'), false);
  assert.equal(flags.parse('dpi', '3'), 3);
  assert.equal(flags.parse('shaper', 'fontkit'), 'fontkit');
});

test('parse refuses a raw string that matches no row', () => {
  assert.throws(() => flags.parse('shaper', 'x'), { message: /takes "harfbuzz" or "fontkit"; got "x"/ });
  assert.throws(() => flags.parse('skipInk', '1'), FlagError);
  assert.throws(() => flags.parse('dpi', 'abc'), { message: /takes a positive number; got "abc"/ });
  assert.throws(() => flags.parse('dpi', ''), FlagError);
  assert.throws(() => flags.parse('dpi', '0'), FlagError);
});
