import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildLocalAgentTargets,
  detectAgents,
  detectLocalAgents,
  getAgentById,
  getSupportedAgentIds,
} from '../src/agents.js';

function withTempDir(prefix, fn) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('agent IDs are unique and resolvable', () => {
  const ids = getSupportedAgentIds();
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.equal(getAgentById(id).id, id);
  assert.equal(getAgentById('not-an-agent'), null);
});

test('detectAgents finds agent config directories under HOME', () => {
  withTempDir('ars-home-', (home) => {
    const previous = process.env.HOME;
    process.env.HOME = home; // os.homedir() reads $HOME on POSIX
    try {
      mkdirSync(join(home, '.claude'));
      mkdirSync(join(home, '.config', 'opencode'), { recursive: true });

      const found = detectAgents();
      assert.deepEqual(found.map((a) => a.id).sort(), ['claude', 'opencode']);

      const claude = found.find((a) => a.id === 'claude');
      assert.equal(claude.path, '~/.claude');
      assert.equal(claude.skillsPath, join(home, '.claude', 'skills'));
    } finally {
      if (previous === undefined) delete process.env.HOME;
      else process.env.HOME = previous;
    }
  });
});

test('buildLocalAgentTargets maps agents into the project directory', () => {
  const [target] = buildLocalAgentTargets([getAgentById('opencode')], '/project');
  assert.equal(target.path, './.opencode');
  assert.equal(target.fullPath, join('/project', '.opencode'));
  assert.equal(target.skillsPath, join('/project', '.opencode', 'skills'));
  assert.equal(target.local, true);
});

test('OpenClaw installs local skills to ./skills in the project root', () => {
  const [target] = buildLocalAgentTargets([getAgentById('openclaw')], '/project');
  assert.equal(target.skillsPath, join('/project', 'skills'));
});

test('detectLocalAgents only reports agents whose skills directory exists', () => {
  withTempDir('ars-project-', (project) => {
    mkdirSync(join(project, '.cursor', 'skills'), { recursive: true });
    mkdirSync(join(project, '.gemini')); // config dir without skills/ is not an install target
    assert.deepEqual(detectLocalAgents(project).map((a) => a.id), ['cursor']);
  });
});
