# 05. TierGuardFreePageAccess

**Goal**: Add tier-conditional guards for the 5 pages inaccessible on Free tier: Planners, Overlays, Widgets, Integration, Teams & Grouping. Investigate what the app actually shows a Free user on these routes before writing assertions.
**Est.**: 2 hours
**Dependencies**: 02-ScaffoldTierHelper

## Pages restricted on Free tier
| Page              | Route                        |
|-------------------|------------------------------|
| Planners          | `/en/planners`               |
| Overlays          | `/en/overlays`               |
| Widgets           | `/en/widgets`                |
| Integration       | `/en/integrations`           |
| Teams & Grouping  | `/en/company/teams-grouping` |

## Free tier UX — UNKNOWN (must investigate before asserting)
Three likely behaviours — confirm with a Free account or UI screenshot:
1. Nav links absent from sidebar entirely
2. Nav links present but clicking redirects to an upgrade/pricing page
3. Page loads but shows an inline upgrade banner with the content locked

**Until confirmed**: scaffold guards with `test.skip(isFree(), 'Free tier page access UX unconfirmed — needs Free account')`.

## Steps
- [ ] Investigate Free-tier UX for restricted pages (use playwright-cli with a Free account, or ask team for screenshot)
- [ ] For each of the 5 spec files (`planners.spec.ts`, `overlays.spec.ts`, `widgets.spec.ts`, `account-settings.spec.ts` Integration section, `account-settings.spec.ts` Teams section — or separate teams spec if it exists):
  - Add `test.skip(isFree(), '...')` guard at the top of each test in the restricted describes
  - AIDEV-NOTE: mark as "scaffolded — validate when Free account available"
- [ ] Pro/Enterprise path: no change to existing assertions
- [ ] Run `npx playwright test` subset with `ACCOUNT_TIER=pro` — all affected tests still pass
- [ ] `tsc --noEmit` clean

## Definition of Done
- [ ] All 5 restricted page spec blocks have `isFree()` guards
- [ ] Each skip has a descriptive reason string
- [ ] Pro path unaffected
- [ ] Free UX unknowns documented in AIDEV-NOTEs

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
