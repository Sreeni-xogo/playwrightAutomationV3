---
name: plan-splitter
description: Use when writing any plan file to ensure plans exceeding 200 lines are split into independently executable phases
---

# Plan Splitter

## Overview

Large plans are hard to execute, review, and commit. This skill ensures every plan is structured into phases that can be independently executed and committed.

## When to Use

Use when creating or writing ANY plan file (e.g., `PLAN*.md`).

## Rules

1. **Phase 1 always exists** — even for small plans, wrap content in Phase 1
2. **200-line threshold** — if a plan exceeds 200 lines, split into multiple phases
3. **Independent phases** — each phase must be independently executable and committable
4. **No cross-phase dependencies** — Phase 2 should not break if Phase 1 is committed alone
5. **Summary table required** — every plan starts with a phase summary table

## Process

### Step 1: Write the Plan

Draft the full plan content as normal.

### Step 2: Check Line Count

Count the total lines of the plan body (excluding frontmatter).

- **Under 200 lines**: Wrap in a single Phase 1. Add summary table with one row.
- **200+ lines**: Split into logical phases. Each phase should be 50-150 lines.

### Step 3: Add Phase Summary Table

At the top of the plan, add:

```markdown
| Phase | Description | Status |
|-------|-------------|--------|
| 1 | [what phase 1 does] | Pending |
| 2 | [what phase 2 does] | Pending |
```

### Step 4: Validate Each Phase

For each phase, verify:
- [ ] Can be executed without later phases existing
- [ ] Produces a committable state (no broken imports, no half-finished features)
- [ ] Has clear entry and exit criteria
- [ ] Lists files to be created/modified

## Phase Template

```markdown
## Phase N: [Title]

**Goal:** [One sentence]
**Files:** [List of files to create/modify]
**Depends on:** Phase N-1 (or "None" for Phase 1)

### Items

1. [Task item]
2. [Task item]

### Verification

- [ ] [How to verify this phase is complete]
```

## Anti-Patterns

- Do NOT create phases smaller than 3 items (merge with adjacent phase)
- Do NOT create phases that cannot be committed independently
- Do NOT split mid-feature (each phase should deliver a complete unit)
