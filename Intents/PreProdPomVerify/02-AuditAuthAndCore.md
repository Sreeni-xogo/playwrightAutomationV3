# 02. AuditAuthAndCore

**Goal**: Use playwright-cli to inspect 6 POMs against pre-prod URL and document any locator differences
**Est.**: 2 hours
**Dependencies**: 01-CreateBranchScaffold

## Pages to audit
- `SignInPage` → `/en/auth/login`
- `SignUpPage` → `/en/auth/signup`
- `ForgotPasswordPage` → `/en/auth/forgot-password`
- `DashboardPage` → `/en` (post-login)
- `LibraryPage` → `/en/library`
- `UploadPage` → `/en/library/upload`

## Steps
- [ ] Use playwright-cli to navigate to each page on pre-prod URL
- [ ] Capture key element selectors (inputs, buttons, headings, nav links)
- [ ] Compare against current POM locators in `e2e/pages/`
- [ ] Document any differences found

## Definition of Done
- [ ] All 6 pages inspected on pre-prod
- [ ] Differences (if any) documented in this file under ## Findings

## Findings
<!-- Fill during Iterate -->

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
