# Project Scaffold

> Owner: Sreeni  ·  Created: 2026-02-22

## Begin (raw)
<!-- 3-minute brain dump. Do not edit or reinterpret. -->
Set up the full e2e folder structure, config, and base POM architecture
for the XOGO Manager Playwright automation suite before writing any tests.

## Refine (scope)

- **Goal**: Create clean, scalable project scaffold — folder structure, config, base POM, tsconfig, env setup — ready for test authoring
- **In scope**:
  - `e2e/` root with subdirs: `pages/`, `utils/`, `fixtures/`, `types/`, `config/`
  - `playwright.config.ts` with 4 named projects (local, staging, pre-release, production)
  - Chromium only to start
  - `.env` + `.env.example` for credentials
  - `BasePage` class all page objects will extend
  - `tsconfig.json` configured for ES modules + TypeScript strict
  - `@playwright/cli` installed (replaces deprecated `playwright-cli`)
  - `package.json` scripts for each environment
- **Out of scope**: Writing actual test specs, auth global setup
- **Definition of Done**:
  - Folder structure created
  - `playwright.config.ts` working with all 4 envs
  - `BasePage` exists and is importable
  - `npx playwright test` runs without errors
- **Constraints**: Single quotes only, no regex, POM mandatory
- **Environments**:
  - local: `http://localhost:5173`
  - staging: `https://manager-staging.xogo.io`
  - pre-release: `https://manager-node24-slots-manager-node24-preview-gwdaereqgqhtgkhp.westus-01.azurewebsites.net/`
  - production: `https://manager.xogo.io`
- **Credentials** (via .env): `TEST_EMAIL=ss@xogo.io`, `TEST_PASSWORD=Balaji2022`
- **Dependencies**: Playwright init already complete (browsers installed)
