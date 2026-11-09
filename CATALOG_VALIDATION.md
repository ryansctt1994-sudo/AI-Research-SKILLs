# Offline skill-catalog validation scope

This draft builds on the existing unmerged reference-link repair PR #1.
The library has **83 checked-in SKILL.md documents** in 20 categories.
Previously the npm installer's category counts summed to 85, its banner
defaulted to 82, and four selection paths did not exist. This candidate
aligns counts and paths to the source tree.

The new pull-request-only CI validates local references, metadata and
marketplace membership without fetching research websites, publishing
packages, invoking LLMs or running model/tool training. The Node tests also
check every quick-start and individual installer path, category counts and
marketplace parity.

**This does not verify:** accuracy of technical claims within any skill,
framework versions, model-training recipes, external links, installer effects
on actual user machines, or safety of commands suggested in skills. Publishing
and the existing synchronization workflow stay outside this review.
