# 07. ConfirmPipelineAndClose

**Goal**: Update pipeline trigger to `v3-pre-prod`, push branch, confirm pipeline-ready
**Est.**: 30 minutes
**Dependencies**: 06-RunTestsAndValidate

## Steps
- [x] Update `azure-pipelines.yml`: `trigger: [main]` → `trigger: [v3-pre-prod]`
- [x] Commit all changes on `v3-pre-prod` branch
- [x] Push `v3-pre-prod` to `origin` (playwrightAutomationV3 only — NOT qa-tools)
- [x] Verify `azure-pipelines.yml` pipeline variables needed: `URL`, `EMAIL`, `PASSWORD`
- [x] Update Status.md — all intents Done

## Notes
- The existing `azure-pipelines.yml` structure is already env-agnostic (URL/EMAIL/PASSWORD)
- Only the `trigger` branch name needs updating for this branch
- qa-tools push deferred — handled separately

## Definition of Done
- [x] `trigger: [v3-pre-prod]` in `azure-pipelines.yml`
- [x] All changes committed and pushed to `origin/v3-pre-prod`
- [x] Status.md shows all 7 intents Done

## Outcome (fill after Iterate)
- **Actual Time**: ~15m
- **Result**: Pipeline trigger updated; branch pushed to origin/v3-pre-prod. Pipeline variables needed: URL, EMAIL, PASSWORD.
- **Key Decisions**: azure-pipelines.yml already had env-agnostic structure — only trigger branch needed changing
- **Follow-ups**: Configure Azure DevOps pipeline for v3-pre-prod branch with correct URL/EMAIL/PASSWORD variables
