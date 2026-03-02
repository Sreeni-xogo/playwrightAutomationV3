# 07. ConfirmPipelineAndClose

**Goal**: Update pipeline trigger to `v3-pre-prod`, push branch, confirm pipeline-ready
**Est.**: 30 minutes
**Dependencies**: 06-RunTestsAndValidate

## Steps
- [ ] Update `azure-pipelines.yml`: `trigger: [main]` → `trigger: [v3-pre-prod]`
- [ ] Commit all changes on `v3-pre-prod` branch
- [ ] Push `v3-pre-prod` to `origin` (playwrightAutomationV3 only — NOT qa-tools)
- [ ] Verify `azure-pipelines.yml` pipeline variables needed: `URL`, `EMAIL`, `PASSWORD`
- [ ] Update Status.md — all intents Done

## Notes
- The existing `azure-pipelines.yml` structure is already env-agnostic (URL/EMAIL/PASSWORD)
- Only the `trigger` branch name needs updating for this branch
- qa-tools push deferred — handled separately

## Definition of Done
- [ ] `trigger: [v3-pre-prod]` in `azure-pipelines.yml`
- [ ] All changes committed and pushed to `origin/v3-pre-prod`
- [ ] Status.md shows all 7 intents Done

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
