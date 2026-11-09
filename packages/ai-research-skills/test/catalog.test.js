import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORIES, INDIVIDUAL_SKILLS, QUICK_START_SKILLS, getTotalSkillCount } from '../src/prompts.js';
import { getAllCategoryIds } from '../src/installer.js';

// The package lives at packages/ai-research-skills inside the skills repository.
// The installer silently skips paths that don't exist upstream, so a stale ID
// here means users quietly get fewer skills than the menu promises.
const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const inRepo = existsSync(join(REPO_ROOT, '01-model-architecture'));
const needsRepo = { skip: inRepo ? false : 'skills repository not found next to the package' };

const isSkill = (path) => existsSync(join(REPO_ROOT, path, 'SKILL.md'));

function countSkills(categoryId) {
  const dir = join(REPO_ROOT, categoryId);
  if (existsSync(join(dir, 'SKILL.md'))) return 1; // standalone category, e.g. 20-ml-paper-writing
  return readdirSync(dir).filter(
    (name) => statSync(join(dir, name)).isDirectory() && isSkill(join(categoryId, name)),
  ).length;
}

test('menu categories match the installer category IDs', () => {
  assert.deepEqual(CATEGORIES.map((c) => c.id), getAllCategoryIds());
});

test('every category directory exists', needsRepo, () => {
  const missing = CATEGORIES.map((c) => c.id).filter((id) => !existsSync(join(REPO_ROOT, id)));
  assert.deepEqual(missing, []);
});

test('per-category skill counts match the repository', needsRepo, () => {
  for (const c of CATEGORIES) {
    assert.equal(c.skills, countSkills(c.id), `skill count for ${c.id}`);
  }
});

test('total skill count matches the repository', needsRepo, () => {
  const actual = CATEGORIES.reduce((sum, c) => sum + countSkills(c.id), 0);
  assert.equal(getTotalSkillCount(), actual);
});

test('every individual skill resolves to a SKILL.md', needsRepo, () => {
  assert.deepEqual(INDIVIDUAL_SKILLS.map((s) => s.id).filter((id) => !isSkill(id)), []);
});

test('every quick-start skill resolves to a SKILL.md', needsRepo, () => {
  assert.deepEqual(QUICK_START_SKILLS.filter((id) => !isSkill(id)), []);
});

test('skill IDs are unique', () => {
  const ids = INDIVIDUAL_SKILLS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(QUICK_START_SKILLS).size, QUICK_START_SKILLS.length);
});
