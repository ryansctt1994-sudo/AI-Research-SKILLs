"""Offline fixture tests for the skill source-tree integrity checker."""
from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts.check_skills import check_tree, markdown_local_targets


class SkillsTreeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        path = self.root / "01-example" / "demo"
        path.mkdir(parents=True)
        (path / "references").mkdir()
        (path / "references" / "ok.md").write_text("# OK\n")
        (path / "SKILL.md").write_text(
            "---\nname: demo\ndescription: Example skill\n---\n"
            "[reference](references/ok.md)\n"
            "```python\nx = y[\"not a markdown link\"]\n```\n"
        )
        marketplace = self.root / ".claude-plugin"
        marketplace.mkdir()
        (marketplace / "marketplace.json").write_text(
            json.dumps({"plugins": [{"skills": ["./01-example/demo"]}]}),
            encoding="utf-8",
        )

    def test_valid_skill_and_marketplace(self):
        self.assertEqual([], check_tree(self.root))

    def test_unlisted_skill_fails(self):
        path = self.root / ".claude-plugin" / "marketplace.json"
        path.write_text('{"plugins":[]}')
        self.assertTrue(any("unlisted" in e for e in check_tree(self.root)))

    def test_missing_local_reference_fails(self):
        path = self.root / "01-example" / "demo" / "SKILL.md"
        path.write_text(path.read_text().replace("references/ok.md", "references/missing.md"))
        self.assertTrue(any("missing link" in e for e in check_tree(self.root)))

    def test_escaping_link_fails(self):
        path = self.root / "01-example" / "demo" / "SKILL.md"
        path.write_text(path.read_text().replace("references/ok.md", "../../../outside.txt"))
        self.assertTrue(any("escaping link" in e for e in check_tree(self.root)))

    def test_fenced_code_and_inline_code_not_interpreted_as_links(self):
        sample = "```python\n[not-a-link](missing.md)\n```\n`[also](missing.md)`\n"
        self.assertEqual([], list(markdown_local_targets(sample)))

    def test_duplicate_marketplace_entry_fails(self):
        path = self.root / ".claude-plugin" / "marketplace.json"
        path.write_text(json.dumps({"plugins": [{"skills": ["./01-example/demo", "./01-example/demo"]}]}))
        self.assertTrue(any("duplicate" in e for e in check_tree(self.root)))


if __name__ == "__main__":
    unittest.main()
