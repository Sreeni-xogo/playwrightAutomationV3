# 02. ScaffoldTierHelper

**Goal**: Create a typed tier helper that all specs import to gate assertions. Add `ACCOUNT_TIER` to `.env.example`.
**Est.**: 1 hour
**Dependencies**: 01-DocumentTierMatrix

## Steps
- [ ] Add `ACCOUNT_TIER=pro` to `.env.example` with comment explaining valid values: `free | pro | enterprise`
- [ ] Create `e2e/utils/tierGuard.ts`:
  - Type: `export type AccountTier = 'free' | 'pro' | 'enterprise'`
  - `getTier(): AccountTier` — reads `process.env['ACCOUNT_TIER']`, defaults to `'pro'` if unset
  - `isFree(): boolean`
  - `isPro(): boolean`
  - `isEnterprise(): boolean`
- [ ] Confirm `tsc --noEmit` clean after adding the file
- [ ] Smoke-test import in one spec (read-only, no logic change yet)

## Definition of Done
- [ ] `e2e/utils/tierGuard.ts` exists and exports 4 helpers
- [ ] `.env.example` updated with `ACCOUNT_TIER`
- [ ] `tsc --noEmit` passes
- [ ] Default `getTier()` returns `'pro'` when env var is unset (staging unchanged)

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
