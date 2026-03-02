# 05. ApplyPomChanges

**Goal**: Apply all locator differences found in audits 02–04 to the POM files
**Est.**: 2 hours
**Dependencies**: 02-AuditAuthAndCore, 03-AuditContentPages, 04-AuditSettingsPages

## Steps
- [ ] Collect all findings from intent 02, 03, 04
- [ ] For each difference: update the relevant POM locator
- [ ] Ensure no broken imports or TypeScript errors
- [ ] Run `npx playwright test --list` to confirm test discovery still works

## Definition of Done
- [ ] All POM differences from audits applied
- [ ] No TypeScript compilation errors
- [ ] Test list shows 147 tests

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
