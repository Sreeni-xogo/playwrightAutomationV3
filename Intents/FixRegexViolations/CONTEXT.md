# Fix Regex Violations in Spec Files

> Owner: TBD  ·  Created: 2026-02-25

## Begin (raw)
<!-- 3-minute brain dump. Do not edit or reinterpret. -->
Changes to the 'regex' in all the test spec files. There is a rule specifically for
claude to avoid regex patterns but it did not obey the rule and used regex selectors
anyway. Please change all the regex selectors to always use '' single quotes.
Sample: dashboard.spec.ts line 39 await expect(page).toHaveURL(/\/en\/library/);
Update the CLAUDE.md rule to never use 'regex' anywhere.

## Refine (scope)

- **Goal**: Replace all regex literals in *.spec.ts files with string alternatives.
  Strengthen no-regex rule in both Global CLAUDE.md and project CLAUDE.md.

- **In scope**:
  - All regex `/pattern/` in 9 spec files (auth, dashboard, library, overlays,
    planners, players, playlists, licenses, widgets)
  - Type A (exact path): replace with `toHaveURL('/path')`
  - Type B (contains/partial): replace with `expect(page.url()).toContain('/path')`
  - Negative patterns: replace with `expect(page.url()).not.toContain('/path')`
  - Global CLAUDE.md Rule 11 — remove directory scope, make no-regex apply to ALL projects
  - Project CLAUDE.md — add explicit no-regex rule

- **Out of scope**:
  - POM files (already clean)
  - playwright.config.ts
  - Any non-TypeScript files

- **Definition of Done**:
  - [ ] Zero regex literals remain in any *.spec.ts file
  - [ ] Global CLAUDE.md Rule 11 is not scoped to a single directory
  - [ ] Project CLAUDE.md has explicit no-regex coding rule
  - [ ] No spec file logic/behavior changed (only assertion syntax)

- **Constraints**:
  - Single quotes only
  - No regex anywhere
  - Do not modify POM files
