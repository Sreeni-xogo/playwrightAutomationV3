# 05. ApplyPomChanges

**Goal**: Apply all locator differences found in audits 02–04 to the POM files
**Est.**: 2 hours
**Dependencies**: 02-AuditAuthAndCore, 03-AuditContentPages, 04-AuditSettingsPages

## Steps
- [x] Collect all findings from intent 02, 03, 04
- [x] For each difference: update the relevant POM locator
- [x] Ensure no broken imports or TypeScript errors
- [x] Run `npx playwright test --list` to confirm test discovery still works

## Definition of Done
- [x] All POM differences from audits applied
- [x] No TypeScript compilation errors
- [x] Test list shows 147 tests

## POM Changes Applied
- `SignInPage.ts` — DIFF-01: microsoftSignInButton name `'Sign in with Microsoft'`; DIFF-02: SSO assertions removed from verifyPageElements
- `SignUpPage.ts` — DIFF-03: confirmPasswordToggle filter → `'Reenter your password'`; DIFF-04: eulaToggle `.or()` for pre-prod accessible name
- `WidgetsPage.ts` — DIFF-07: jetSetTab property removed; AIDEV comment updated
- `TeamsGroupingPage.ts` — DIFF-09: featureToggleButton gains `.or('Request Reset to Basic Mode')`
- `DashboardPage.ts` — DIFF-05: verifyPlayersSectionVisible no longer asserts playersViewAllLink
- `UploadPage.ts` — DIFF-06: verifyPageLoaded no longer asserts chooseFileButton

## Spec Changes Applied
- `billing.spec.ts` — DIFF-08: entire describe block → `test.describe.skip`
- `account-settings.spec.ts` — DIFF-10: Services describe → `test.describe.skip`; DIFF-13: Referral describe → `test.describe.skip`
- `widgets.spec.ts` — DIFF-07: JetSet removed from tab assertion array

## Outcome (fill after Iterate)
- **Actual Time**: ~1h
- **Result**: All 13 diffs applied. 7 POM files modified, 3 spec files updated. `tsc --noEmit` clean. `--list` shows 147 tests.
- **Key Decisions**: Used `test.describe.skip` for staging-only features (Billing/Services/Referral) rather than deleting tests — keeps them recoverable on main branch. Used `.or()` for dual-environment locators (eulaToggle, featureToggleButton).
- **Follow-ups**: Run full test suite against pre-prod URL (Intent 06)
