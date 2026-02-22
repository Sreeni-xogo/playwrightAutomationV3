---
name: phase-committer
description: Use after completing a phase of work to create a properly formatted commit following project conventions
---

# Phase Committer

## Overview

Every completed phase of work should result in a commit. This skill ensures commits follow the project's Conventional Commits format with mandatory scope and correct footer.

## When to Use

Use after:
- Completing any phase in a multi-phase plan
- Completing a single-phase plan
- Any logical unit of work that should be checkpointed

## Process

### Step 1: Read Commit Template

Read `Commit_and_PR.md` for the latest commit conventions.

### Step 2: Review Changes

Run `git status` and `git diff` to understand what changed.

### Step 3: Stage Files

Stage only files relevant to the completed phase. Use specific file paths, not `git add -A`.

### Step 4: Write Commit Message

Follow Conventional Commits v1.0.0:

```
<type>(<scope>): <description>

[optional body explaining WHY]

Assist - Claude code.
```

**Required elements:**
- **type**: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`, `style`
- **scope**: mandatory — e.g., `e2e-tests`, `pom`, `config`, `auth`, `utils`, `docs`, `skills`
- **description**: imperative mood, lowercase, no period
- **footer**: `Assist - Claude code.` (NEVER `Co-Authored-By`, NEVER `Generated with Claude Code`)

### Step 5: Confirm with User

Before committing, show the user:
- Files to be committed
- Proposed commit message
- Ask for approval

### Step 6: Commit

Only after user approval, create the commit.

## Examples

```
feat(skills): add plan-splitter and phase-committer skills

New skills for plan management and commit workflow automation.

Assist - Claude code.
```

```
fix(auth): resolve token refresh race condition

Token was expiring between validation check and API call.

Assist - Claude code.
```

## Anti-Patterns

- Do NOT commit without user confirmation
- Do NOT use `git add -A` or `git add .`
- Do NOT include `Co-Authored-By` in footer
- Do NOT skip the scope in commit type
- Do NOT commit unrelated changes together
