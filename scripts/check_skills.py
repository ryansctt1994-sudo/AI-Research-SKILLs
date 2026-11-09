#!/usr/bin/env python3
"""Offline source-tree checks for installed AI research skills.

No URLs are fetched and no external skills are executed. Check the marketplace
inventory, required SKILL.md metadata, and local markdown reference targets.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import unquote

CATEGORY = re.compile(r"^[0-9]{2}-[^/]+$")
MD_LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^\s)]+)(?:\s+[^)]*)?\)")
INLINE_CODE = re.compile(r"`[^`]*`")


def find_skills(root: Path) -> set[str]:
    return {
        p.parent.relative_to(root).as_posix()
        for p in root.glob("[0-9][0-9]-*/**/SKILL.md")
        if p.is_file()
    }


def markdown_local_targets(source: str):
    """Skip fenced and inline code: bracket-like expressions are not links."""
    fence = None
    for number, line in enumerate(source.splitlines(), 1):
        stripped = line.lstrip()
        marker = re.match(r"^(`{3,}|~{3,})", stripped)
        if marker:
            char = marker.group(1)[0]
            if fence is None:
                fence = (char, len(marker.group(1)))
            elif char == fence[0] and len(marker.group(1)) >= fence[1]:
                fence = None
            continue
        if fence is not None:
            continue
        for match in MD_LINK.finditer(INLINE_CODE.sub("", line)):
            target = match.group(1)
            if target.startswith(("#", "https://", "http://", "mailto:", "data:")):
                continue
            yield number, unquote(target.split("#", 1)[0])


def check_tree(root: Path) -> list[str]:
    errors: list[str] = []
    skills = find_skills(root)
    manifest_path = root / ".claude-plugin" / "marketplace.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        declared = [
            path.removeprefix("./").rstrip("/")
            for plugin in manifest["plugins"]
            for path in plugin["skills"]
        ]
    except (OSError, UnicodeError, KeyError, TypeError, ValueError) as exc:
        return [f"invalid marketplace: {type(exc).__name__}"]

    if len(declared) != len(set(declared)):
        errors.append("duplicate marketplace skill paths")
    for missing in sorted(skills - set(declared)):
        errors.append(f"unlisted skill: {missing}")
    for extra in sorted(set(declared) - skills):
        errors.append(f"marketplace path lacks SKILL.md: {extra}")

    for relative in sorted(skills):
        path = root / relative / "SKILL.md"
        if path.is_symlink() or not path.resolve().is_relative_to(root.resolve()):
            errors.append(f"skill path escapes checkout: {relative}")
            continue
        content = path.read_text(encoding="utf-8")
        parts = content.split("---", 2)
        if not content.startswith("---\n") or len(parts) < 3:
            errors.append(f"missing frontmatter: {relative}")
        elif not all(re.search(rf"(?m)^{key}:\s*\S+", parts[1]) for key in ("name", "description")):
            errors.append(f"missing name/description metadata: {relative}")

        for lineno, target in markdown_local_targets(content):
            if not target:
                continue
            linked = path.parent / target
            if not linked.resolve(strict=False).is_relative_to(root.resolve()):
                errors.append(f"{relative}:{lineno} escaping link: {target}")
            elif not linked.exists():
                errors.append(f"{relative}:{lineno} missing link: {target}")
            elif linked.is_symlink():
                errors.append(f"{relative}:{lineno} symlinked link: {target}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    errors = check_tree(args.root)
    for problem in errors:
        print("FAIL:", problem)
    if errors:
        print(f"FAIL: {len(errors)} catalog/reference errors")
        return 1
    print(f"PASS: {len(find_skills(args.root))} skills, marketplace and local references")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
