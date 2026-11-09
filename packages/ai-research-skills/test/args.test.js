import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs } from '../src/prompts.js';

test('no arguments selects interactive mode', () => {
  assert.deepEqual(parseArgs([]), {
    command: null, all: false, local: false, category: null, skill: null, agent: null,
  });
});

test('install <category> keeps the category argument', () => {
  // Regression: the README documents `install post-training`, but the
  // positional argument was dropped after a command, so every category
  // was installed instead of the one requested.
  const options = parseArgs(['install', 'post-training']);
  assert.equal(options.command, 'install');
  assert.equal(options.skill, 'post-training');
});

test('a positional argument before the command is kept', () => {
  const options = parseArgs(['post-training', 'install']);
  assert.equal(options.command, 'install');
  assert.equal(options.skill, 'post-training');
});

test('only the first positional argument is used', () => {
  assert.equal(parseArgs(['install', 'post-training', 'rag']).skill, 'post-training');
});

test('long and short flags', () => {
  assert.equal(parseArgs(['install', '--all']).all, true);
  assert.equal(parseArgs(['install', '-a']).all, true);
  assert.equal(parseArgs(['install', '--all', '--local']).local, true);
  assert.equal(parseArgs(['install', '-l']).local, true);
});

test('--category and --agent consume their values', () => {
  const options = parseArgs(['install', '--category', 'post-training', '--agent', 'claude']);
  assert.equal(options.category, 'post-training');
  assert.equal(options.agent, 'claude');
  assert.equal(options.skill, null);
});

test('a value flag at the end without a value is ignored', () => {
  assert.equal(parseArgs(['install', '--category']).category, null);
});

test('list, update and uninstall commands', () => {
  for (const command of ['list', 'update', 'uninstall']) {
    assert.equal(parseArgs([command]).command, command);
  }
});
