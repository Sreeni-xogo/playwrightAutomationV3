# 07. ValidateAndDocument

**Goal**: Run the full suite with `ACCOUNT_TIER=pro` to confirm all existing tests pass unchanged, then document the tier guard strategy in CONTEXT.md and update Memory.
**Est.**: 1 hour
**Dependencies**: 03-TierGuardBillingAndLicenses, 04-TierGuardReferralAndServices, 05-TierGuardFreePageAccess, 06-TierGuardFreeAssetLimits

## Steps
- [ ] Run full suite: `ACCOUNT_TIER=pro npx playwright test` — confirm all tests pass (expect same skip count as baseline or fewer, no new failures)
- [ ] Run `tsc --noEmit` — confirm clean compile across all modified files
- [ ] Update `Intents/TierAwareTestGuards/CONTEXT.md` — fill in any Refine gaps discovered during Iterate
- [ ] Update `Memory/_sessions.md` with session summary
- [ ] Commit all tier guard changes: `feat(e2e): add tier-aware test guards (Billing, Licenses, Referral, Services)`
- [ ] Update Status.md — mark all intents Done

## Definition of Done
- [ ] Zero new test failures on Pro path
- [ ] `tsc --noEmit` clean
- [ ] All intent files have Outcome sections filled
- [ ] Status.md fully up to date
- [ ] Memory updated

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
