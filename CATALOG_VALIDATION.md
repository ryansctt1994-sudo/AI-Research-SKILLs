# Offline skill-catalog integrity and installer regression checks

This document describes the repository's **ongoing source-tree checks**, not
the status of an individual pull request. The current results and exact commit
under test are recorded in GitHub Actions.

## Source of truth

- Skill directories contain `SKILL.md` files beneath numbered category folders.
- `.claude-plugin/marketplace.json` lists which skill directories are advertised.
- `packages/ai-research-skills/src/prompts.js` contains the installer's category,
  individual-skill, and quick-start selections.
- `packages/ai-research-skills/src/agents.js` lists supported coding agents.

Catalog counts and selectable paths should agree with the checked-in tree.
Any changing count belongs in generated test output rather than a permanent
claim of this document.

## Automated checks

`.github/workflows/skill-catalog-integrity.yml` runs on pull requests targeting
`main` and can also be dispatched manually. Its two jobs are read-only:

1. **Offline source integrity:** `python scripts/check_skills.py` checks
   marketplace membership, duplicate entries, basic `SKILL.md` frontmatter
   fields, local Markdown link targets in `SKILL.md`, the 500-line limit for
   `SKILL.md`, and language/info tags on its fenced code blocks.
   `python -m unittest discover -s tests -p 'test_*.py' -v` exercises the
   checker's positive and negative fixtures.
2. **npm installer regression:** from `packages/ai-research-skills`, install
   locked dependencies using `npm ci --ignore-scripts`, check CLI syntax
   with `node --check`, and run `npm test` for catalog paths, argument
   parsing, agent detection, and other package regressions.

The source checks do not execute a skill, synchronize skills into users'
installations, publish npm packages, or run AI models or training jobs.

## Limits and review requirements

These checks do **not** establish that instructions in the skills are accurate,
secure, current, or appropriate for any specific environment. The Python
link checker examines local Markdown links in each `SKILL.md`; it does not
currently walk nested `references/` documents, validate Markdown image
links, or fetch external URLs. Basic frontmatter-field checks are not a
complete semantic validation of the metadata schema. Test success is not
proof of real-machine installer behavior or npm release readiness.

For a release or merge decision, review the **exact head commit** and its
workflow logs, separately assess the content and any external dependencies,
and follow the repository's own review and release procedures.
