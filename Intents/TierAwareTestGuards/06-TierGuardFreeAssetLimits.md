# 06. TierGuardFreeAssetLimits

**Goal**: Add Free-tier assertions for the two known hard caps — library (15 assets) and players (1 player). Scaffold the assertions with AIDEV-NOTEs since no Free account is available yet to validate.
**Est.**: 1 hour
**Dependencies**: 02-ScaffoldTierHelper

## Asset limits on Free tier
| Resource | Free cap | Pro / Enterprise cap |
|----------|----------|----------------------|
| Library assets | 15 | Unlimited |
| Players | 1 | Unlimited |

## Expected UI indicators (to confirm with Free account)
- Library: likely an upgrade banner or "X of 15 assets used" counter near Add New button
- Players: likely an upgrade banner or "1 of 1 players used" indicator
- Add New button may be disabled or hidden when cap is reached

## Steps
- [ ] `library.spec.ts`: add Free-tier guard block
  - `if (isFree())`: assert limit indicator visible (locator TBD — needs Free account investigation), assert Add New button state when limit reached
  - `if (!isFree())`: existing tests run unchanged
  - Mark unresolved locators with `AIDEV-TODO: confirm selector with Free account`
- [ ] `players.spec.ts`: add Free-tier guard block
  - `if (isFree())`: assert 1-player limit indicator visible
  - `if (!isFree())`: existing tests run unchanged
  - Mark unresolved locators with `AIDEV-TODO: confirm selector with Free account`
- [ ] Run `npx playwright test e2e/library/library.spec.ts e2e/players/players.spec.ts` with `ACCOUNT_TIER=pro` — all pass unchanged
- [ ] `tsc --noEmit` clean

## Definition of Done
- [ ] `library.spec.ts` and `players.spec.ts` have `isFree()` guard blocks
- [ ] Pro path completely unaffected
- [ ] All unresolved Free selectors marked `AIDEV-TODO`

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
