# V3 Pre-Prod POM Verification

> Owner: Sreeni  ·  Created: 2026-03-02

## Begin (raw)

Create a new branch v3-pre-prod. Use playwright-cli to inspect all 28 POMs against
the pre-prod URL and cross-verify elements match staging. Expect minimal differences.
Use same account credentials as .env. Update POMs and specs if any differences found.
Confirm azure-pipelines.yml is pipeline-ready for the branch.

## Refine (scope)

- **Goal**: Verify all 28 POMs work against pre-prod URL; apply any locator fixes; confirm 147/147 tests pass on pre-prod
- **In scope**: All 28 POMs, full test run against pre-prod, pipeline trigger update
- **Out of scope**: qa-tools repo (touched separately later), new test coverage
- **Definition of Done**:
  - All 28 POMs audited via playwright-cli against pre-prod URL
  - Any locator differences applied to POMs
  - 147/147 tests passing with pre-prod URL
  - `azure-pipelines.yml` trigger updated to `v3-pre-prod`
  - Branch pushed to origin
- **Constraints**:
  - Branch: `v3-pre-prod` off `main@0741f69`
  - Pre-prod URL: `https://manager-node24-slots-manager-node24-preview-gwdaereqgqhtgkhp.westus-01.azurewebsites.net/`
  - Credentials: same EMAIL/PASSWORD from `.env`
  - Do NOT touch qa-tools repo
- **Risks**: Pre-prod may have feature flags or UI differences not present on staging
- **Dependencies**: `.env` must have valid EMAIL/PASSWORD for pre-prod account
