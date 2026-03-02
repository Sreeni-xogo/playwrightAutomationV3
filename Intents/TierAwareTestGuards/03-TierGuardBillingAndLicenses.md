# 03. TierGuardBillingAndLicenses

**Goal**: Replace `test.describe.skip` in `billing.spec.ts` with proper tier-conditional assertions. Update `BillingPage.ts` POM with Enterprise/Free locators. Apply tier guards to credit/reseller code assertions in `licenses.spec.ts`.
**Est.**: 2 hours
**Dependencies**: 02-ScaffoldTierHelper

## Tier behaviour to assert

### BillingPage
| Tier       | What to assert |
|------------|----------------|
| Pro        | Billing Info, Card Details, Update Billing button, Credit Codes table, Reseller Code button, Recent Invoices, Transaction History — all visible (current behaviour, unchanged) |
| Enterprise | `heading "Enterprise Tier" [level=4]` visible + `button "Contact Support"` visible; all standard billing sections absent |
| Free       | Upgrade button visible; no standard billing sections (scaffolded, marked needs-Free-account) |

### LicensesPage — Credit / Reseller codes
| Tier       | Field | Button state | Purpose |
|------------|-------|--------------|---------|
| Free       | Visible | Enabled | Upgrade to Pro only |
| Pro        | Visible | Enabled | Unlimited codes |
| Enterprise | Visible | Disabled | Cannot add codes |

## Steps
- [ ] Add Enterprise-tier locators to `BillingPage.ts`:
  - `enterpriseTierHeading = page.getByRole('heading', { name: 'Enterprise Tier', level: 4 })`
  - `contactSupportButton = page.getByRole('button', { name: 'Contact Support' })`
  - `verifyEnterpriseTierUI()` method
- [ ] Update `billing.spec.ts`:
  - Remove `test.describe.skip`
  - Wrap each test body with `if (isPro()) { ...existing... } else if (isEnterprise()) { ...enterprise assertions... } else { test.skip(true, 'Free billing UI — needs Free account') }`
- [ ] Update `licenses.spec.ts` for credit/reseller code button state:
  - Pro: `enterResellerCodeButton` enabled (unchanged)
  - Enterprise: `enterResellerCodeButton` disabled
  - Free: `enterResellerCodeButton` visible + enabled (upgrade-only context noted in AIDEV comment)
- [ ] Run `npx playwright test e2e/settings/billing.spec.ts e2e/settings/licenses.spec.ts` with `ACCOUNT_TIER=pro` — all pass
- [ ] Confirm `tsc --noEmit` clean

## Definition of Done
- [ ] No `test.describe.skip` in `billing.spec.ts`
- [ ] Enterprise billing assertions in place (scaffolded — validated on pre-prod)
- [ ] Credit/reseller code tier guards in `licenses.spec.ts`
- [ ] Pro path passing unchanged

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
