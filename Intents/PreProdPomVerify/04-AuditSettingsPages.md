# 04. AuditSettingsPages

**Goal**: Use playwright-cli to inspect 13 settings/teams POMs against pre-prod URL
**Est.**: 2 hours
**Dependencies**: 01-CreateBranchScaffold

## Pages to audit
- `ProfilePage` → `/en/settings/profile`
- `MembersPage` → `/en/settings/members`
- `LicensesPage` → `/en/settings/licenses`
- `BillingPage` → `/en/settings/billing`
- `BillingPlansPage` → `/en/billing/plans`
- `ReferralPage` → `/en/settings/referral`
- `HandoverDeletePage` → `/en/settings/handover`
- `IntegrationPage` → `/en/settings/integration`
- `ServicesPage` → `/en/settings/services`
- `CompanyPlayersPage` → `/en/settings/company-players`
- `TeamsPage` → `/en/teams`
- `TeamDetailPage` → `/en/teams/:id`
- `TeamsGroupingPage` → `/en/teams/grouping`

## Steps
- [ ] Use playwright-cli to navigate to each page on pre-prod URL (authenticated)
- [ ] Capture key element selectors (headings, buttons, tables, inputs)
- [ ] Compare against current POM locators in `e2e/pages/`
- [ ] Document any differences found

## Definition of Done
- [ ] All 13 POMs inspected on pre-prod
- [ ] Differences documented under ## Findings

## Findings
<!-- Fill during Iterate -->

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
