<!-- Built with ClaudeTemplate - see ClaudeTemplate.md -->
<!-- WARNING: Do not remove. Enables template features (/brain, /commit, etc.) -->

# Project Context

## Project Overview

End-to-end automation suite for the XOGO Manager web application.
Covers the full product surface: auth, library, playlists, players, planners, overlays, account, billing, licenses, teams, and groupings.

## Project Structure

- **Tests**: `e2e/` (Page Object Model)
- **Pages**: `e2e/pages/`
- **Utils**: `e2e/utils/`
- **Fixtures**: `e2e/fixtures/`
- **Types**: `e2e/types/`
- **Config**: `e2e/config/`
- **Config file**: `playwright.config.ts`
- **Generated artifacts**: `test-results/`, `playwright-report/`

## Language & Tooling

- **Language**: TypeScript
- **Framework**: Playwright
- **Build**: none
- **Test**: `npx playwright test`
- **Package manager**: npm

## Build & Test Entry Points

These are the approved commands. Do not invent alternatives.

- Test (all): `npx playwright test`
- Test (chromium): `npx playwright test --project=chromium`
- Test (firefox): `npx playwright test --project=firefox`
- Test (webkit): `npx playwright test --project=webkit`
- Test (UI mode): `npx playwright test --ui`
- Test (debug): `npx playwright test --debug`
- Report: `npx playwright show-report`

## Environments

| Name | Key |
|---|---|
| Local | `local` |
| Staging | `staging` |
| Pre-production / Pre-release | `pre-release` |
| Production | `production` |

Environment base URLs are configured in `playwright.config.ts` via env vars or config projects.

## Intent Management

Intents are stored under `Intents/{FeatureName}/` with numbered intent files.
See `/brain` command for the BRAIN workflow.

## Constraints

- **No regex** anywhere in the codebase — use string literals only
- **Single quotes** (`'`) only — no double quotes in TypeScript/JS code
- **Page Object Model** mandatory for all page interactions
- **No `console.log`** in test files
- **TypeScript ES modules** — no CommonJS
- **Naming**: `kebab-case` files, `camelCase` variables, `PascalCase` classes
