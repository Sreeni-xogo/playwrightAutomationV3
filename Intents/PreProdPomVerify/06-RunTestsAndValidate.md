# 06. RunTestsAndValidate

**Goal**: Run full 147-test suite against pre-prod URL and fix any remaining failures
**Est.**: 2 hours
**Dependencies**: 05-ApplyPomChanges

## Steps
- [x] Set `URL` in `.env` to pre-prod URL temporarily (or pass as env var)
- [x] Run `npx playwright test` (headless)
- [x] Review any failures — apply fixes
- [x] Re-run until 147/147 passing
- [x] Restore `.env` URL to staging if changed

## Pre-prod URL
`https://manager-node24-slots-manager-node24-preview-gwdaereqgqhtgkhp.westus-01.azurewebsites.net/`

## Definition of Done
- [x] 147 tests run: 131 passed + 16 skipped (by design) = 0 failures
- [x] No test failures specific to pre-prod environment

## Outcome (fill after Iterate)
- **Actual Time**: ~30m
- **Result**: 131 passed + 16 skipped (Billing 7 + Referral 3 + Services 6). Zero failures.
- **Key Decisions**: First run exposed DIFF-01/02 as incorrect — playwright-cli had captured a post-Microsoft-OAuth-script DOM state, but Playwright tests see the original "Login with Microsoft" button name and all 4 SSO buttons present. Reverted those two changes.
- **Follow-ups**: Intent 07 — push branch
