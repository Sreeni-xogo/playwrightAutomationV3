# Memory — Fix Regex Violations

> Auto-generated. Updated on each intent dissolution.
> Human-readable record of all dissolved intents for this project.

---

## Intent 1 — UpdateClaudeMdRules
**Dissolved:** 2026-02-25
**Goal:** Fix no-regex rule coverage in both Global CLAUDE.md and project CLAUDE.md.
**Outcome:** Removed directory scope (`D:\XOGO\qa-tools\manager-tools`) from Global CLAUDE.md Rule 11 — rule now applies to ALL Playwright projects. Added explicit Coding Standards section to project CLAUDE.md with no-regex + single quotes rules.
**Key Decisions:** Root cause of the violation was that the global rule was scoped to one directory, so it never fired for this project. Made the rule unconditionally global to prevent recurrence across all future projects.
**Follow-ups:** None.

---

## Intent 2 — FixSpecFileRegex
**Dissolved:** 2026-02-25
**Goal:** Replace all regex literals in 9 spec files with string alternatives.
**Outcome:** 26 regex literals replaced across 9 spec files (auth, dashboard, library, overlays, planners, players, playlists, licenses, widgets). Zero regex remain. Grep confirmed clean.
**Key Decisions:** Type A (specific sub-path e.g. `/en/overlays/add`) → `toHaveURL('string')`; Type B (prefix/contains e.g. `/en/overlays`) → `expect(page.url()).toContain('string')`; negative patterns → `expect(page.url()).not.toContain('string')`; `{ timeout }` options dropped since `expect(page.url())` is synchronous (no retry loop).
**Follow-ups:** None.

---
