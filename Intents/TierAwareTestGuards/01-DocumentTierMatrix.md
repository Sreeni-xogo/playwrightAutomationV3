# 01. DocumentTierMatrix

**Goal**: Audit all current spec files and catalogue every assertion that needs a tier guard. Produce a definitive reference used by all subsequent intents.
**Est.**: 1 hour
**Dependencies**: none

## Steps
- [ ] Grep all spec files for assertions touching: billing, licenses, referral, services, planners, overlays, widgets, integration, teams, players, library limits
- [ ] For each affected test, record: file + describe block + test name + what it asserts
- [ ] Map each assertion to the tier matrix in CONTEXT.md (Pro ✅ / Free ⚠️ / Enterprise ⚠️)
- [ ] Flag Free-tier page restriction UX as unknown — needs live investigation (no Free account yet)
- [ ] Document credit/reseller code behaviour per tier:
  - Free: field visible + button enabled (upgrade-only use)
  - Pro: field visible + button enabled (unlimited use)
  - Enterprise: field visible + button DISABLED (cannot add codes)
- [ ] Record findings under ## Findings below

## Definition of Done
- [ ] Every spec line that needs a guard is listed by file + line
- [ ] Tier matrix confirmed against findings
- [ ] Free-tier UX unknowns explicitly listed as "needs investigation"

## Findings
<!-- Fill during Iterate -->

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
