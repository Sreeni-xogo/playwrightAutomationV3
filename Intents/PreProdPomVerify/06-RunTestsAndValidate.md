# 06. RunTestsAndValidate

**Goal**: Run full 147-test suite against pre-prod URL and fix any remaining failures
**Est.**: 2 hours
**Dependencies**: 05-ApplyPomChanges

## Steps
- [ ] Set `URL` in `.env` to pre-prod URL temporarily (or pass as env var)
- [ ] Run `npx playwright test` (headless)
- [ ] Review any failures — apply fixes
- [ ] Re-run until 147/147 passing
- [ ] Restore `.env` URL to staging if changed

## Pre-prod URL
`https://manager-node24-slots-manager-node24-preview-gwdaereqgqhtgkhp.westus-01.azurewebsites.net/`

## Definition of Done
- [ ] 147/147 tests passing with pre-prod URL
- [ ] No test failures specific to pre-prod environment

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
