import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORIES, INDIVIDUAL_SKILLS, QUICK_START_SKILLS, getTotalSkillCount } from '../src/prompts.js';
import { showWelcome } from '../src/ascii.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const skillFile = (path) => join(root, path, 'SKILL.md');

function actualCategoryCount(category) {
  const directory = join(root, category);
  if (existsSync(join(directory, 'SKILL.md'))) return 1;
  return readdirSync(directory, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory() && existsSync(join(directory, entry.name, 'SKILL.md'))
  ).length;
}

test('catalog counts reflect shipped skills, not stale marketing totals', () => {
  const counts = CATEGORIES.map(({ id }) => actualCategoryCount(id));
  CATEGORIES.forEach(({ id, skills }, i) => {
    assert.equal(skills, counts[i], `incorrect count for ${id}`);
  });
  assert.equal(getTotalSkillCount(), counts.reduce((a, b) => a + b, 0));
  assert.equal(getTotalSkillCount(), 83);
});

test('every individual and quick-start selection points at an installed skill', () => {
  for (const { id } of INDIVIDUAL_SKILLS) {
    assert.ok(existsSync(skillFile(id)), `missing individual skill: ${id}`);
  }
  for (const id of QUICK_START_SKILLS) {
    assert.ok(existsSync(skillFile(id)), `missing quick-start skill: ${id}`);
  }
});

test('marketplace paths match all 83 catalog skills', () => {
  const marketplace = JSON.parse(readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const listed = marketplace.plugins.flatMap((plugin) => plugin.skills)
    .map((path) => path.replace(/^\.\//, '').replace(/\/$/, ''));
  assert.equal(listed.length, new Set(listed).size, 'marketplace must not contain duplicates');
  const actual = CATEGORIES.flatMap(({ id }) => {
    const path = join(root, id);
    if (existsSync(join(path, 'SKILL.md'))) return [id];
    return readdirSync(path, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(path, entry.name, 'SKILL.md')))
      .map((entry) => `${id}/${entry.name}`);
  });
  assert.deepEqual(listed.sort(), actual.sort());
});

test('welcome screen default uses the real shipped catalog total', () => {
  const originalClear = console.clear;
  const originalLog = console.log;
  const captured = [];
  console.clear = () => {};
  console.log = (line = '') => captured.push(String(line));
  try {
    showWelcome();
  } finally {
    console.clear = originalClear;
    console.log = originalLog;
  }
  assert.ok(captured.some((line) => line.includes('83 skills')), 'default banner reports real count');
});
