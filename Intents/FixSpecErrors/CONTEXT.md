# Fix Spec Errors Staging

> Owner: Sreeni  ·  Created: 2026-02-25

## Begin (raw)
Run each spec file (auth → widgets) against staging/Chrome.
Get errors, fix broken locators and wrong assertions.
Use playwright-cli headless to verify element changes.
Update POMs and spec files as needed.
Pilot on auth.spec.ts first, then roll out to all spec files.

## Refine (scope)
- **Goal**: Run all 13 spec files against staging/Chrome, fix outright failures (broken locators + wrong assertions), list flaky/skipped for manual review
- **In / Out of scope**:
  - IN: broken locators, wrong assertions, POM updates, playwright-cli live element verification
  - OUT: flaky/skipped tests (list only), new test coverage, infrastructure changes
- **Definition of Done**: All 13 spec files pass with zero outright failures on staging/Chrome; flaky/skipped listed separately
- **Constraints**: staging + Chrome always; valid .env in place
- **Dependencies**: playwright-cli skill for live element verification
