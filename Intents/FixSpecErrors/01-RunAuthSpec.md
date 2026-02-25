# 01. RunAuthSpec

**Goal**: Run auth.spec.ts against staging/Chrome, capture full output, categorise every failure by type
**Est.**: ≤1 hour
**Dependencies**: valid .env, npm dependencies installed

## Steps
- [ ] Run `npm run test:staging -- --project=staging e2e/auth/auth.spec.ts`
- [ ] Capture full stdout/stderr output
- [ ] Categorise each failure: broken locator / wrong assertion / auth failure / nav failure / timeout
- [ ] List any skipped or flaky tests separately

## Definition of Done
- [ ] All test results captured
- [ ] Every failure has a type label and line reference
- [ ] Flaky/skipped listed separately

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
