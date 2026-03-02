# 01. DocumentTierMatrix

**Goal**: Audit all current spec files and catalogue every assertion that needs a tier guard. Produce a definitive reference used by all subsequent intents.
**Est.**: 1 hour
**Dependencies**: none

## Steps
- [x] Grep all spec files for assertions touching: billing, licenses, referral, services, planners, overlays, widgets, integration, teams, players, library limits
- [x] For each affected test, record: file + describe block + test name + what it asserts
- [x] Map each assertion to the tier matrix in CONTEXT.md (Pro ✅ / Free ⚠️ / Enterprise ⚠️)
- [x] Flag Free-tier page restriction UX as unknown — needs live investigation (no Free account yet)
- [x] Document credit/reseller code behaviour per tier:
  - Free: field visible + button enabled (upgrade-only use)
  - Pro: field visible + button enabled (unlimited use)
  - Enterprise: field visible + button DISABLED (cannot add codes)
- [x] Record findings under ## Findings below

## Definition of Done
- [x] Every spec line that needs a guard is listed by file + line
- [x] Tier matrix confirmed against findings
- [x] Free-tier UX unknowns explicitly listed as "needs investigation"

## Findings

### Master Tier × Feature Matrix

| Feature / Route | Free | Pro | Enterprise |
|---|---|---|---|
| Billing page `/en/billing` | Upgrade button only (UI unknown) | Full billing UI | "Enterprise Tier" heading + Contact Support |
| Referral `/en/account/referral` | Absent (404 or redirect) | Page accessible | 404 |
| Services `/en/company/services` | Assumed same as Pro (TBC) | Page accessible | 404 |
| Integration `/en/integrations` | **Inaccessible** | Page accessible | Page accessible |
| Planners `/en/planners` | **Inaccessible** | Page accessible | Page accessible |
| Overlays `/en/overlays` | **Inaccessible** | Page accessible | Page accessible |
| Widgets `/en/widgets` | **Inaccessible** | Page accessible | Page accessible |
| Teams & Grouping `/en/company/teams-grouping` | **Inaccessible** | Page accessible | Page accessible |
| Library assets | Cap: 15 (Add New disabled at cap) | Unlimited | Unlimited |
| Players | Cap: 1 (Add New disabled at cap) | Unlimited | Unlimited |
| Credit/Reseller codes | Visible + button **enabled** (upgrade-only) | Visible + button **enabled** (unlimited) | Visible + button **DISABLED** |
| License Plans `/en/billing/plans` | Assumed accessible | Accessible | May differ (TBC) |

---

### File-by-File Guard Map

#### `billing.spec.ts` — 7 tests, ALL need tier branching (line 9–56)

| Test | Line | Pro | Enterprise | Free |
|------|------|-----|-----------|------|
| should display page heading and description | 10 | ✅ run | ⚠️ Enterprise UI | ⚠️ unknown |
| should display Billing Info section | 16 | ✅ run | ⚠️ absent | ⚠️ unknown |
| should display Card Details + Update Billing | 22 | ✅ run | ⚠️ absent | ⚠️ unknown |
| should display Credit Codes + Enter Reseller Code | 29 | ✅ run | ⚠️ absent | ⚠️ unknown |
| should display Recent Invoices section | 36 | ✅ run | ⚠️ absent | ⚠️ unknown |
| should display Transaction History section | 42 | ✅ run | ⚠️ absent | ⚠️ unknown |
| should open Update Billing dialog / Stripe flow | 48 | ✅ run | ⚠️ absent | ⚠️ unknown |

**Guard pattern**: `if (isPro()) { ...existing... } else if (isEnterprise()) { enterpriseBillingAssertions } else { test.skip(true, 'Free billing UI unconfirmed') }`

---

#### `licenses.spec.ts` — 1 test partially needs guard, 1 navigation test needs guard (lines 23–70)

| Test | Line | Guard needed | Detail |
|------|------|-------------|--------|
| should display Buy More link and Enter Credit Code button | 23 | Partial | `enterCreditCodeButton`: Pro=enabled, Free=enabled(upgrade), Enterprise=**disabled** |
| should navigate to License Plans page via Buy More link | 65 | Enterprise | `buyMoreLink` may not navigate to plans on Enterprise |

**License Plans describe** (lines 77–104): 4 tests — need Enterprise guard (TBC if plans page 404s on Enterprise)

**Guard pattern for `enterCreditCodeButton`**:
- Pro/Free: `toBeVisible()` + `toBeEnabled()`
- Enterprise: `toBeVisible()` + `toBeDisabled()`

---

#### `account-settings.spec.ts` — 15 tests, partial guards needed

| Describe | Lines | Tests | Guard needed | Tiers affected |
|----------|-------|-------|-------------|----------------|
| Referral | 15–33 | 3 | Yes — route 404 | Enterprise + Free |
| Integration | 39–57 | 3 | Yes — page inaccessible | Free only |
| Services | 64–103 | 6 | Yes — route 404 | Enterprise only |
| Company Players | 109–136 | 4 | No | None |
| Handover & Delete | 139–168 | 4 | No | None |

**Guard patterns**:
- Referral: `test.skip(isEnterprise() \|\| isFree(), 'Referral absent on Enterprise/Free tier')`
- Integration: `test.skip(isFree(), 'Integration page inaccessible on Free tier')`
- Services: `test.skip(isEnterprise(), 'Services route 404 on Enterprise tier')`

---

#### `planners.spec.ts` — 9 tests, ALL need Free tier guard

Route `/en/planners` — inaccessible on Free tier. Enterprise has access.

**Guard pattern**: `test.skip(isFree(), 'Planners page inaccessible on Free tier')` on each test.

---

#### `overlays.spec.ts` — 9 tests, ALL need Free tier guard

Route `/en/overlays` — inaccessible on Free tier. Enterprise has access.

**Guard pattern**: `test.skip(isFree(), 'Overlays page inaccessible on Free tier')` on each test.

---

#### `widgets.spec.ts` — 12 tests, ALL need Free tier guard

Route `/en/widgets` — inaccessible on Free tier. Enterprise has access.

**Guard pattern**: `test.skip(isFree(), 'Widgets page inaccessible on Free tier')` on each test.

---

#### `library.spec.ts` — partial guard on Add New + CRUD

| Test | Line | Guard needed | Detail |
|------|------|-------------|--------|
| should display Add New menu with Media, URL, Widget options | 33 | Free — cap awareness | At 15-asset cap, Add New may be hidden/disabled |
| URL CRUD: create | 121 | Free — cap awareness | CRUD may fail if at 15-asset cap |

**AIDEV-NOTE**: Free tier limit UI (counter or upgrade banner) is unknown — needs Free account investigation. Scaffold with `AIDEV-TODO` marker.

---

#### `players.spec.ts` — partial guard on Add New

| Test | Line | Guard needed | Detail |
|------|------|-------------|--------|
| should display Add New button | 19 | Free — cap awareness | At 1-player cap, Add New may be hidden/disabled |
| Players — Add New page (all tests) | 64–77 | Free — cap awareness | Navigate to Add New may fail if cap reached |

**AIDEV-NOTE**: Free tier 1-player limit UI is unknown — needs Free account investigation.

---

### Free-Tier UX Unknowns (must investigate before asserting)

The following Free-tier behaviours are **unconfirmed** — no Free account available:

1. **Restricted pages** (Planners, Overlays, Widgets, Integration, Teams & Grouping):
   - UX unknown: nav links absent? redirect to upgrade page? inline upgrade banner?
   - **Action**: scaffold `test.skip(isFree(), 'page access UX unconfirmed')` — validate later

2. **Billing page on Free**:
   - Upgrade button visible? What sections appear?
   - **Action**: `test.skip(true, 'Free billing UI unconfirmed — needs Free account')`

3. **Library asset cap UI**:
   - Counter "X of 15 used"? Upgrade banner? Add New button disabled?
   - **Action**: scaffold locator as `AIDEV-TODO`

4. **Player cap UI**:
   - "1 of 1 players used" indicator? Add New disabled?
   - **Action**: scaffold locator as `AIDEV-TODO`

5. **Services page on Free**:
   - Assumed same as Pro (no restriction) but unconfirmed
   - **Action**: no skip for now; add `AIDEV-NOTE: assumed accessible on Free — confirm`

---

### Credit/Reseller Code Behaviour (confirmed — user-specified)

| Tier | Field visible | Button state | Use case |
|------|--------------|-------------|---------|
| Free | Yes | Enabled | Upgrade to Pro only |
| Pro | Yes | Enabled | Unlimited codes |
| Enterprise | Yes | **Disabled** | Cannot add codes |

Field name in UI: "Enter Credit Code" / "Enter Reseller Code" — same field, both terms used interchangeably.
Locator in `licenses.spec.ts`: `licensesPage.enterCreditCodeButton`
Locator in `billing.spec.ts`: `billingPage.enterResellerCodeButton`

## Outcome (fill after Iterate)
- **Actual Time**: ~30 min
- **Result**: Full tier guard map produced. 13 spec files audited. Identified 7 billing tests, 15 account-settings tests (partial), 9 planners, 9 overlays, 12 widgets, partial library + players guards needed.
- **Key Decisions**: Scaffold Free-tier page access guards as `test.skip(isFree(), ...)` — UX unknown; validate with Free account later. Credit/reseller code button disabled on Enterprise, enabled on Free/Pro.
- **Follow-ups**: Confirm Free-tier restricted page UX (redirect? banner? nav hidden?). Confirm billing UI on Free. Confirm library/player cap UI indicators.
