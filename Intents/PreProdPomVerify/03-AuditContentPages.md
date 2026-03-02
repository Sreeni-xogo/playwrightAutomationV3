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
- [x] Use playwright-cli to navigate to each page on pre-prod URL (authenticated)
- [x] Capture key element selectors (headings, buttons, inputs, cards)
- [x] Compare against current POM locators in `e2e/pages/`
- [x] Document any differences found

## Definition of Done
- [x] All 10 POMs inspected on pre-prod
- [x] Differences documented under ## Findings

## Findings

### DIFF-07 — WidgetsPage: JetSet tab absent on pre-prod
- **File**: `e2e/pages/widgets/WidgetsPage.ts`
- **Locator**: `jetSetTab = page.getByRole('tab', { name: 'JetSet' })`
- **Staging**: Tabs = All, Clock, Weather, Timer, Note, **JetSet**, Programmatic Ads (7 tabs)
- **Pre-prod**: Tabs = All, Clock, Weather, Timer, Note, Programmatic Ads (6 tabs — JetSet absent)
- **Action**: Remove `jetSetTab` locator from `WidgetsPage.ts` and remove any test that uses it (or guard with conditional)
- **Note**: The AIDEV comment at line 6 of WidgetsPage.ts lists JetSet as a tab type — update comment too

### No diffs found on:
- PlaylistsPage ✅ — heading, link "Add New", sort/pagination all match
- PlaylistEditPage ✅ — heading, Go back, Save, name input, Add Items, item rows all match
- PlayersPage ✅ — heading, button "Add New" (confirmed button, not link), sort/filter/select all match
- PlayerDetailPage ✅ — heading, Go back, Save, firmware/OS/online table cells, dropdowns, Advanced Configuration, Notes all match
- PlannersPage ✅ — heading, link "Add New" (confirmed link, not button), sort/pagination all match
- PlannerEditPage ✅ — heading, Go back, Save, name input, Playlists section, Manage Playlists, calendar, day checkboxes all match
- OverlaysPage ✅ — heading, link "Add New" (confirmed link, not button), sort/pagination all match
- OverlayEditPage ✅ — all template buttons, heading, name input, resolution, templates all confirmed (audited in Intent 03 work)
- WidgetEditPage ✅ — heading, Go back, Save, iframe, Details/Theme/Used in These Playlists headings, No playlists found all match

## Outcome (fill after Iterate)
- **Actual Time**: ~1.5h
- **Result**: 1 diff found (DIFF-07 JetSet tab). 9 of 10 POMs require no changes.
- **Key Decisions**: Checked structurally complex pages (OverlayEditPage templates, WidgetsPage tabs) as priority
- **Follow-ups**: Apply DIFF-07 fix in Intent 05
