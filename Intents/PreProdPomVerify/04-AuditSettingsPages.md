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
- [x] Use playwright-cli to navigate to each page on pre-prod URL (authenticated)
- [x] Capture key element selectors (headings, buttons, tables, inputs)
- [x] Compare against current POM locators in `e2e/pages/`
- [x] Document any differences found

## Definition of Done
- [x] All 13 POMs inspected on pre-prod
- [x] Differences documented under ## Findings

## Findings

### DIFF-08 — BillingPage: Enterprise Tier content on pre-prod
- **File**: `e2e/pages/settings/BillingPage.ts`
- **Pre-prod**: Shows only `heading "Enterprise Tier" [level=4]` + `button "Contact Support"` — no Billing Info, Card Details, Update Billing, Credit Codes, Recent Invoices, or Transaction History sections
- **Staging**: Shows all billing sections with payment card management
- **Cause**: Pre-prod test account is on Enterprise Tier (billing managed externally)
- **Action**: Guard all billing section tests with account tier check, or mark billing tests as staging-only (skip on pre-prod)

### DIFF-09 — TeamsGroupingPage: Missing "Request Reset to Basic Mode" button state
- **File**: `e2e/pages/teams/TeamsGroupingPage.ts`
- **Locator**: `featureToggleButton = page.locator('button').filter({ hasText: 'Teams and Grouping' }).or(page.getByRole('button', { name: 'Request Pending' }))`
- **Pre-prod**: Shows `button "Request Reset to Basic Mode"` (Teams is fully ON/active)
- **Staging**: Shows `button "Request Pending"` (Teams in pending state)
- **Action**: Add third `.or()` branch: `.or(page.getByRole('button', { name: 'Request Reset to Basic Mode' }))` to `featureToggleButton`

### DIFF-10 — ServicesPage: Route not found on pre-prod
- **File**: `e2e/pages/settings/ServicesPage.ts`
- **Pre-prod**: `/en/company/services` returns "Not Found" (404) — page doesn't exist on pre-prod
- **Staging**: Page exists and shows Media Processor + Screenshot Processor health
- **Action**: Skip ServicesPage tests on pre-prod (mark with `test.skip` condition or remove from pre-prod suite entirely)

### DIFF-11 — TeamDetailPage: "Edit Team" button absent
- **File**: `e2e/pages/teams/TeamDetailPage.ts`
- **Locator**: `editTeamButton = page.getByRole('button', { name: 'Edit Team' })`
- **Pre-prod**: Page header shows only `button "Go back"` + team name heading — no "Edit Team" button
- **Possible cause**: "Default" team cannot be edited, or Teams UI changed with full activation
- **Action**: Investigate if "Edit Team" appears on non-Default teams; update tests to skip or add guard

### DIFF-12 — TeamDetailPage: No "Delete" button per member row
- **File**: `e2e/pages/teams/TeamDetailPage.ts`
- **Method**: `deleteMemberByEmail(email)` uses `row.getByRole('button', { name: 'Delete' })`
- **Pre-prod**: Actions column shows only `button "Edit"` per row (no Delete button)
- **Staging**: Actions column shows both "Edit" and "Delete" per row
- **Possible cause**: Different Teams feature configuration or role-based visibility
- **Action**: Skip `deleteMemberByEmail` tests on pre-prod or guard with feature check

### DIFF-13 — ReferralPage: Route not found on pre-prod
- **File**: `e2e/pages/settings/ReferralPage.ts`
- **Pre-prod**: `/en/account/referral` returns "Not Found" (404) — page doesn't exist on pre-prod
- **Staging**: Page exists and shows referral code + copy buttons
- **Action**: Skip ReferralPage tests on pre-prod (same pattern as ServicesPage)

### No diffs found on:
- ProfilePage ✅ — all Settings sidebar nav links, Personal Details, Account Security sections confirmed
- MembersPage ✅ — heading, Sent Invites/Pending Users/All Members sections, Add New button confirmed
- LicensesPage ✅ — heading, summary cards, filter checkboxes, table columns all confirmed
- BillingPlansPage ✅ — License Plans heading, Annual/Monthly plan cards, Purchase buttons, Buy links confirmed
- HandoverDeletePage ✅ — heading, placeholders (Enter user email address / Your email address), Find/Delete buttons confirmed
- IntegrationPage ✅ — heading, Generate Integration ID button, Integration Tokens heading/table confirmed
- CompanyPlayersPage ✅ — Players heading, Export to CSV button, table with all columns confirmed
- TeamsPage ✅ — Company Teams heading, Add New button, My Teams/All Teams tabs, Manage Team links confirmed
- TeamDetailPage ✅ (partial) — Go back, h1 heading, Members/Player Groups tabs, Team Members table columns confirmed

## Outcome (fill after Iterate)
- **Actual Time**: ~2h
- **Result**: 6 diffs found (DIFF-08 through DIFF-13). 9 of 13 POMs require no changes. BillingPage and TeamDetailPage have significant account-state differences. ServicesPage and ReferralPage routes are absent on pre-prod.
- **Key Decisions**: Verified against real pre-prod pages; some diffs are account-state (Enterprise Tier, Teams ON) rather than DOM changes
- **Follow-ups**: Apply diffs in Intent 05; consider whether Services/Referral tests should be skipped or removed for pre-prod
