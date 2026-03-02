# 04. TierGuardReferralAndServices

**Goal**: Replace `test.describe.skip` in `account-settings.spec.ts` for Referral and Services with explicit tier-conditional guards.
**Est.**: 1 hour
**Dependencies**: 02-ScaffoldTierHelper

## Tier behaviour to assert

### ReferralPage
| Tier       | Behaviour |
|------------|-----------|
| Pro        | `/en/account/referral` exists — assert page elements, copy buttons |
| Free       | Absent (same as Enterprise — no referral) |
| Enterprise | `/en/account/referral` returns 404 — assert page shows Not Found or skip with tier note |

### ServicesPage
| Tier       | Behaviour |
|------------|-----------|
| Pro        | `/en/company/services` exists — assert Media + Screenshot Processor, Refresh button |
| Free       | TBD — assumed same as Pro (no restriction known) |
| Enterprise | `/en/company/services` returns 404 — skip with explicit tier note |

## Steps
- [ ] Update Referral describe block in `account-settings.spec.ts`:
  - Remove `test.describe.skip`
  - Add `test.skip(isEnterprise() || isFree(), 'Referral page absent on Enterprise/Free tier')` at top of each test
- [ ] Update Services describe block:
  - Remove `test.describe.skip`
  - Add `test.skip(isEnterprise(), 'Services page absent on Enterprise tier')` at top of each test
- [ ] Run `npx playwright test e2e/settings/account-settings.spec.ts` with `ACCOUNT_TIER=pro` — referral + services pass; Integration / Company Players / Handover unchanged
- [ ] Confirm `tsc --noEmit` clean

## Definition of Done
- [ ] No bare `test.describe.skip` in `account-settings.spec.ts`
- [ ] Every skip has an explicit `isTier()` condition and a descriptive reason string
- [ ] Pro path passing (referral + services tests run and pass)

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
