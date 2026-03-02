# 03. AuditContentPages

**Goal**: Use playwright-cli to inspect 10 content POMs against pre-prod URL
**Est.**: 2 hours
**Dependencies**: 01-CreateBranchScaffold

## Pages to audit
- `PlaylistsPage` → `/en/playlists`
- `PlaylistEditPage` → `/en/playlists/add` + `/en/playlists/:id`
- `PlayersPage` → `/en/players`
- `PlayerDetailPage` → `/en/players/:id`
- `PlannersPage` → `/en/planners`
- `PlannerEditPage` → `/en/planners/add` + `/en/planners/:id`
- `OverlaysPage` → `/en/overlays`
- `OverlayEditPage` → `/en/overlays/add` + `/en/overlays/:id`
- `WidgetsPage` → `/en/widgets`
- `WidgetEditPage` → `/en/widgets/add?type=WidgetClock`

## Steps
- [ ] Use playwright-cli to navigate to each page on pre-prod URL (authenticated)
- [ ] Capture key element selectors (headings, buttons, inputs, cards)
- [ ] Compare against current POM locators in `e2e/pages/`
- [ ] Document any differences found

## Definition of Done
- [ ] All 10 POMs inspected on pre-prod
- [ ] Differences documented under ## Findings

## Findings
<!-- Fill during Iterate -->

## Outcome (fill after Iterate)
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
