---
name: ml-paper-writing
description: Write publication-ready ML/AI papers for NeurIPS, ICML, ICLR, ACL, AAAI, COLM. Use when drafting papers from research repos, structuring arguments, verifying citations, or preparing camera-ready submissions. Includes LaTeX templates, reviewer guidelines, and citation verification workflows.
version: 1.0.1
author: Orchestra Research
license: MIT
tags: [Academic Writing, NeurIPS, ICML, ICLR, ACL, AAAI, COLM, LaTeX, Paper Writing, Citations, Research]
dependencies: [semanticscholar, arxiv, habanero, requests]
---

# ML Paper Writing for Top AI Conferences

Expert-level guidance for writing publication-ready papers targeting **NeurIPS, ICML, ICLR, ACL, AAAI, and COLM**. This skill combines writing philosophy from top researchers (Nanda, Farquhar, Karpathy, Lipton, Steinhardt) with practical tools: LaTeX templates, citation verification APIs, and conference checklists.

## Core Philosophy: Collaborative Writing

**Paper writing is collaborative, but Claude should be proactive in delivering drafts.**

The typical workflow starts with a research repository containing code, results, and experimental artifacts. Claude's role is to:

1. **Understand the project** by exploring the repo, results, and existing documentation
2. **Deliver a complete first draft** when confident about the contribution
3. **Search literature** using web search and APIs to find relevant citations
4. **Refine through feedback cycles** when the scientist provides input
5. **Ask for clarification** only when genuinely uncertain about key decisions

**Key Principle**: Be proactive. If the repo and results are clear, deliver a full draft. Don't block waiting for feedback on every section—scientists are busy. Produce something concrete they can react to, then iterate based on their response.

---

## ⚠️ CRITICAL: Never Hallucinate Citations

**This is the most important rule in academic writing with AI assistance.**

### The Problem
AI-generated citations have a **~40% error rate**. Hallucinated references—papers that don't exist, wrong authors, incorrect years, fabricated DOIs—are a serious form of academic misconduct that can result in desk rejection or retraction.

### The Rule
**NEVER generate BibTeX entries from memory. ALWAYS fetch programmatically.**

| Action | ✅ Correct | ❌ Wrong |
|--------|-----------|----------|
| Adding a citation | Search API → verify → fetch BibTeX | Write BibTeX from memory |
| Uncertain about a paper | Mark as `[CITATION NEEDED]` | Guess the reference |
| Can't find exact paper | Note: "placeholder - verify" | Invent similar-sounding paper |

### When You Can't Verify a Citation

If you cannot programmatically verify a citation, you MUST:

```latex
% EXPLICIT PLACEHOLDER - requires human verification
\cite{PLACEHOLDER_author2024_verify_this}  % TODO: Verify this citation exists
```

**Always tell the scientist**: "I've marked [X] citations as placeholders that need verification. I could not confirm these papers exist."

### Recommended: Install Exa MCP for Paper Search

For the best paper search experience, install **Exa MCP** which provides real-time academic search:

**Claude Code:**
```bash
claude mcp add exa -- npx -y mcp-remote "https://mcp.exa.ai/mcp"
```

**Cursor / VS Code** (add to MCP settings):
```json
{
  "mcpServers": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

Exa MCP enables searches like:
- "Find papers on RLHF for language models published after 2023"
- "Search for transformer architecture papers by Vaswani"
- "Get recent work on sparse autoencoders for interpretability"

Then verify results with Semantic Scholar API and fetch BibTeX via DOI.

---

## Workflow 0: Starting from a Research Repository

When beginning paper writing, start by understanding the project:

```text
Project Understanding:
- [ ] Step 1: Explore the repository structure
- [ ] Step 2: Read README, existing docs, and key results
- [ ] Step 3: Identify the main contribution with the scientist
- [ ] Step 4: Find papers already cited in the codebase
- [ ] Step 5: Search for additional relevant literature
- [ ] Step 6: Outline the paper structure together
- [ ] Step 7: Draft sections iteratively with feedback
```

**Step 1: Explore the Repository**

```bash
# Understand project structure
ls -la
find . -name "*.py" | head -20
find . -name "*.md" -o -name "*.txt" | xargs grep -l -i "result\|conclusion\|finding"
```

Look for:
- `README.md` - Project overview and claims
- `results/`, `outputs/`, `experiments/` - Key findings
- `configs/` - Experimental settings
- Existing `.bib` files or citation references
- Any draft documents or notes

**Step 2: Identify Existing Citations**

Check for papers already referenced in the codebase:

```bash
# Find existing citations
grep -r "arxiv\|doi\|cite" --include="*.md" --include="*.bib" --include="*.py"
find . -name "*.bib"
```

These are high-signal starting points for Related Work—the scientist has already deemed them relevant.

**Step 3: Clarify the Contribution**

Before writing, explicitly confirm with the scientist:

> "Based on my understanding of the repo, the main contribution appears to be [X].
> The key results show [Y]. Is this the framing you want for the paper,
> or should we emphasize different aspects?"

**Never assume the narrative—always verify with the human.**

**Step 4: Search for Additional Literature**

Use web search to find relevant papers:

```text
Search queries to try:
- "[main technique] + [application domain]"
- "[baseline method] comparison"
- "[problem name] state-of-the-art"
- Author names from existing citations
```

Then verify and retrieve BibTeX using the citation workflow below.

**Step 5: Deliver a First Draft**

**Be proactive—deliver a complete draft rather than asking permission for each section.**

If the repo provides clear results and the contribution is apparent:
1. Write the full first draft end-to-end
2. Present the complete draft for feedback
3. Iterate based on scientist's response

If genuinely uncertain about framing or major claims:
1. Draft what you can confidently
2. Flag specific uncertainties: "I framed X as the main contribution—let me know if you'd prefer to emphasize Y instead"
3. Continue with the draft rather than blocking

**Questions to include with the draft** (not before):
- "I emphasized X as the main contribution—adjust if needed"
- "I highlighted results A, B, C—let me know if others are more important"
- "Related work section includes [papers]—add any I missed"

---

## When to Use This Skill

Use this skill when:
- **Starting from a research repo** to write a paper
- **Drafting or revising** specific sections
- **Finding and verifying citations** for related work
- **Formatting** for conference submission
- **Resubmitting** to a different venue (format conversion)
- **Iterating** on drafts with scientist feedback

**Always remember**: First drafts are starting points for discussion, not final outputs.

---

## Balancing Proactivity and Collaboration

**Default: Be proactive. Deliver drafts, then iterate.**

| Confidence Level | Action |
|-----------------|--------|
| **High** (clear repo, obvious contribution) | Write full draft, deliver, iterate on feedback |
| **Medium** (some ambiguity) | Write draft with flagged uncertainties, continue |
| **Low** (major unknowns) | Ask 1-2 targeted questions, then draft |

**Draft first, ask with the draft** (not before):

| Section | Draft Autonomously | Flag With Draft |
|---------|-------------------|-----------------|
| Abstract | Yes | "Framed contribution as X—adjust if needed" |
| Introduction | Yes | "Emphasized problem Y—correct if wrong" |
| Methods | Yes | "Included details A, B, C—add missing pieces" |
| Experiments | Yes | "Highlighted results 1, 2, 3—reorder if needed" |
| Related Work | Yes | "Cited papers X, Y, Z—add any I missed" |

**Only block for input when:**
- Target venue is unclear (affects page limits, framing)
- Multiple contradictory framings seem equally valid
- Results seem incomplete or inconsistent
- Explicit request to review before continuing

**Don't block for:**
- Word choice decisions
- Section ordering
- Which specific results to show (make a choice, flag it)
- Citation completeness (draft with what you find, note gaps)

---

## The Narrative Principle

**The single most critical insight**: Your paper is not a collection of experiments—it's a story with one clear contribution supported by evidence.

Every successful ML paper centers on what Neel Nanda calls "the narrative": a short, rigorous, evidence-based technical story with a takeaway readers care about.

**Three Pillars (must be crystal clear by end of introduction):**

| Pillar | Description | Example |
|--------|-------------|---------|
| **The What** | 1-3 specific novel claims within cohesive theme | "We prove that X achieves Y under condition Z" |
| **The Why** | Rigorous empirical evidence supporting claims | Strong baselines, experiments distinguishing hypotheses |
| **The So What** | Why readers should care | Connection to recognized community problems |

**If you cannot state your contribution in one sentence, you don't yet have a paper.**

---

## Paper Structure Workflow

### Workflow 1: Writing a Complete Paper (Iterative)

Copy this checklist and track progress. **Each step involves drafting → feedback → revision:**

```text
Paper Writing Progress:
- [ ] Step 1: Define the one-sentence contribution (with scientist)
- [ ] Step 2: Draft Figure 1 → get feedback → revise
- [ ] Step 3: Draft abstract → get feedback → revise
- [ ] Step 4: Draft introduction → get feedback → revise
- [ ] Step 5: Draft methods → get feedback → revise
- [ ] Step 6: Draft experiments → get feedback → revise
- [ ] Step 7: Draft related work → get feedback → revise
- [ ] Step 8: Draft limitations → get feedback → revise
- [ ] Step 9: Complete paper checklist (required)
- [ ] Step 10: Final review cycle and submission
```

**Step 1: Define the One-Sentence Contribution**

**This step requires explicit confirmation from the scientist.**

Before writing anything, articulate and verify:
- What is the single thing your paper contributes?
- What was not obvious or present before your work?

> "I propose framing the contribution as: '[one sentence]'. Does this capture
> what you see as the main takeaway? Should we adjust the emphasis?"

**Step 2: Draft Figure 1**

Figure 1 deserves special attention—many readers skip directly to it.
- Convey core idea, approach, or most compelling result
- Use vector graphics (PDF/EPS for plots)
- Write captions that stand alone without main text
- Ensure readability in black-and-white (8% of men have color vision deficiency)

**Step 3: Write Abstract (5-Sentence Formula)**

From Sebastian Farquhar (DeepMind):

```text
1. What you achieved: "We introduce...", "We prove...", "We demonstrate..."
2. Why this is hard and important
3. How you do it (with specialist keywords for discoverability)
4. What evidence you have
5. Your most remarkable number/result
```

**Delete** generic openings like "Large language models have achieved remarkable success..."

**Step 4: Write Introduction (1-1.5 pages max)**

Must include:
- 2-4 bullet contribution list (max 1-2 lines each in two-column format)
- Clear problem statement
- Brief approach overview
- Methods should start by page 2-3 maximum

**Step 5: Methods Section**

Enable reimplementation:
- Conceptual outline or pseudocode
- All hyperparameters listed
- Architectural details sufficient for reproduction
- Present final design decisions; ablations go in experiments

**Step 6: Experiments Section**

For each experiment, explicitly state:
- What claim it supports
- How it connects to main contribution
- Experimental setting (details in appendix)
- What to observe: "the blue line shows X, which demonstrates Y"

Requirements:
- Error bars with methodology (standard deviation vs standard error)
- Hyperparameter search ranges
- Compute infrastructure (GPU type, total hours)
- Seed-setting methods

**Step 7: Related Work**

Organize methodologically, not paper-by-paper:

**Good:** "One line of work uses Floogledoodle's assumption [refs] whereas we use Doobersnoddle's assumption because..."

**Bad:** "Snap et al. introduced X while Crackle et al. introduced Y."

Cite generously—reviewers likely authored relevant papers.

**Step 8: Limitations Section (REQUIRED)**

All major conferences require this. Counter-intuitively, honesty helps:
- Reviewers are instructed not to penalize honest limitation acknowledgment
- Pre-empt criticisms by identifying weaknesses first
- Explain why limitations don't undermine core claims

**Step 9: Paper Checklist**

NeurIPS, ICML, and ICLR all require paper checklists. See [references/checklists.md](references/checklists.md).

---

## Writing Philosophy for Top ML Conferences

See [references/writing-philosophy.md](references/writing-philosophy.md) for: The Sources Behind This Guidance; Time Allocation (From Neel Nanda); Writing Style Guidelines; What Reviewers Actually Read.

---

## Conference Requirements Quick Reference

| Conference | Page Limit | Extra for Camera-Ready | Key Requirement |
|------------|------------|------------------------|-----------------|
| **NeurIPS 2025** | 9 pages | +0 | Mandatory checklist, lay summary for accepted |
| **ICML 2026** | 8 pages | +1 | Broader Impact Statement required |
| **ICLR 2026** | 9 pages | +1 | LLM disclosure required, reciprocal reviewing |
| **ACL 2025** | 8 pages (long) | varies | Limitations section mandatory |
| **AAAI 2026** | 7 pages | +1 | Strict style file adherence |
| **COLM 2025** | 9 pages | +1 | Focus on language models |

**Universal Requirements:**
- Double-blind review (anonymize submissions)
- References don't count toward page limit
- Appendices unlimited but reviewers not required to read
- LaTeX required for all venues

**LaTeX Templates:** See [templates/](templates/) directory for all conference templates.

---

## Using LaTeX Templates Properly

See [references/latex-templates.md](references/latex-templates.md) for: Workflow 4: Starting a New Paper from Template; Template Pitfalls to Avoid; Quick Template Reference.

---

## Conference Resubmission & Format Conversion

See [references/format-conversion.md](references/format-conversion.md) for: Workflow 3: Converting Between Conference Formats.

---

## Citation Workflow (Hallucination Prevention)

**Required whenever you add a citation:** follow Workflow 2 in [references/adding-citations.md](references/adding-citations.md) (the golden rule, the step-by-step verified citation workflow, and a summary of citation rules). The rules in the CRITICAL citation section above always apply.

---

## Common Issues and Solutions

**Issue: Abstract too generic**

Delete first sentence if it could be prepended to any ML paper. Start with your specific contribution.

**Issue: Introduction exceeds 1.5 pages**

Split background into Related Work. Front-load contribution bullets. Methods should start by page 2-3.

**Issue: Experiments lack explicit claims**

Add sentence before each experiment: "This experiment tests whether [specific claim]..."

**Issue: Reviewers find paper hard to follow**

- Add explicit signposting: "In this section, we show X"
- Use consistent terminology throughout
- Include figure captions that stand alone

**Issue: Missing statistical significance**

Always include:
- Error bars (specify: std dev or std error)
- Number of runs
- Statistical tests if comparing methods

---

## Reviewer Evaluation Criteria

Reviewers assess papers on four dimensions:

| Criterion | What Reviewers Look For |
|-----------|------------------------|
| **Quality** | Technical soundness, well-supported claims |
| **Clarity** | Clear writing, reproducible by experts |
| **Significance** | Community impact, advances understanding |
| **Originality** | New insights (doesn't require new method) |

**Scoring (NeurIPS 6-point scale):**
- 6: Strong Accept - Groundbreaking, flawless
- 5: Accept - Technically solid, high impact
- 4: Borderline Accept - Solid, limited evaluation
- 3: Borderline Reject - Solid but weaknesses outweigh
- 2: Reject - Technical flaws
- 1: Strong Reject - Known results or ethics issues

See [references/reviewer-guidelines.md](references/reviewer-guidelines.md) for detailed reviewer instructions.

---

## Tables and Figures

See [references/tables-figures.md](references/tables-figures.md) for: Tables; Figures.

---

## References & Resources

### Reference Documents (Deep Dives)

| Document | Contents |
|----------|----------|
| [writing-guide.md](references/writing-guide.md) | Gopen & Swan 7 principles, Ethan Perez micro-tips, word choice |
| [citation-workflow.md](references/citation-workflow.md) | Citation APIs, Python code, BibTeX management |
| [checklists.md](references/checklists.md) | NeurIPS 16-item, ICML, ICLR, ACL requirements |
| [reviewer-guidelines.md](references/reviewer-guidelines.md) | Evaluation criteria, scoring, rebuttals |
| [sources.md](references/sources.md) | Complete bibliography of all sources |

### LaTeX Templates

Templates in `templates/` directory: **ICML 2026**, **ICLR 2026**, **NeurIPS 2025**, **ACL/EMNLP**, **AAAI 2026**, **COLM 2025**.

**Compiling to PDF:**
- **VS Code/Cursor**: Install LaTeX Workshop extension + TeX Live → Save to auto-compile
- **Command line**: `latexmk -pdf main.tex` or `pdflatex` + `bibtex` workflow
- **Online**: Upload to [Overleaf](https://overleaf.com)

See [templates/README.md](templates/README.md) for detailed setup instructions.

### Key External Sources

**Writing Philosophy:**
- [Neel Nanda: How to Write ML Papers](https://www.alignmentforum.org/posts/eJGptPbbFPZGLpjsp/highly-opinionated-advice-on-how-to-write-ml-papers) - Narrative, "What/Why/So What"
- [Farquhar: How to Write ML Papers](https://sebastianfarquhar.com/on-research/2024/11/04/how_to_write_ml_papers/) - 5-sentence abstract
- [Gopen & Swan: Science of Scientific Writing](https://cseweb.ucsd.edu/~swanson/papers/science-of-writing.pdf) - 7 reader expectation principles
- [Lipton: Heuristics for Scientific Writing](https://www.approximatelycorrect.com/2018/01/29/heuristics-technical-scientific-writing-machine-learning-perspective/) - Word choice
- [Perez: Easy Paper Writing Tips](https://ethanperez.net/easy-paper-writing-tips/) - Micro-level clarity

**APIs:** [Semantic Scholar](https://api.semanticscholar.org/api-docs/) | [CrossRef](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | [arXiv](https://info.arxiv.org/help/api/basics.html)

**Venues:** [NeurIPS](https://neurips.cc/Conferences/2025/PaperInformation/StyleFiles) | [ICML](https://icml.cc/Conferences/2025/AuthorInstructions) | [ICLR](https://iclr.cc/Conferences/2026/AuthorGuide) | [ACL](https://github.com/acl-org/acl-style-files)

