# Memory — Page Load Stability

> Auto-generated. Updated on each intent dissolution.
> Human-readable record of all dissolved intents for this project.

---

## Intent 1 — UpgradeBasePage
**Dissolved:** 2026-02-25
**Goal:** Add `waitForLoadAndElement(locator: Locator)` helper to `BasePage`. Foundation for all other intents.
**Outcome:** `waitForLoadAndElement(locator: Locator): Promise<void>` added to `BasePage.ts`. Method calls `waitForLoadState('domcontentloaded')` then `expect(locator).toBeVisible()`. `expect` and `Locator` imported from `@playwright/test`.
**Key Decisions:** Two-step guard (DOM stable + element visible) chosen over `networkidle` to avoid slow waits on pages with background polling. All existing methods left unchanged.
**Follow-ups:** None.

---

## Intent 2 — AuthPageWaits
**Dissolved:** 2026-02-25
**Goal:** Add load guards to all 3 auth POMs (SignInPage, SignUpPage, ForgotPasswordPage).
**Outcome:** All 3 auth POMs updated. `goto()` in each POM calls `waitForLoadAndElement` on a primary landmark (logo or heading). `waitForLoad()` added after every click-based navigation: login submit, forgot password link, sign up link, next/back step buttons, return to login.
**Key Decisions:** Anchor element chosen per page: `logoElmt` for SignInPage (always visible regardless of form state), `heading` for SignUpPage and ForgotPasswordPage.
**Follow-ups:** None.

---

## Intent 3 — DashboardAndLibraryWaits
**Dissolved:** 2026-02-25
**Goal:** Add load guards to DashboardPage, LibraryPage, UploadPage.
**Outcome:** All 3 POMs updated. DashboardPage `goto()` uses `waitForLoadAndElement(this.pageHeading)`; `waitForLoad()` added to all 7 `clickNav*()` and 3 `click*ViewAll()` methods. LibraryPage `goto()` updated; `waitForLoad()` added to `clickFirstItem()`, all 3 `clickAddNew*()` methods, and all 5 pagination methods. UploadPage `goto()` updated; `waitForLoad()` added to `goBack()`.
**Key Decisions:** `pageHeading` used as anchor for Dashboard and Library as it's the first stable element after navigation.
**Follow-ups:** None.

---

## Intent 4 — ContentPageWaits
**Dissolved:** 2026-02-25
**Goal:** Add load guards to Playlists, Players, Planners, Overlays, Widgets POMs (10 files).
**Outcome:** All 10 content POMs updated. Each list page `goto()` uses `waitForLoadAndElement(this.pageHeading)`. Each edit page `goto()` and `gotoAddNew()` uses `waitForLoadAndElement` on the relevant heading. `waitForLoad()` added to all click-based navigations: `goBack()`, `clickAddNew()`, `clickPlaylist/Player/Planner/Overlay/Widget()`, `clickScheduleLink()`, `clickViewPlaylist()`, `save()`.
**Key Decisions:** `addNewPageHeading` used as anchor in `PlannerEditPage.gotoAddNew()` and `OverlayEditPage.gotoAddNew()` since the add-new page has a distinct heading from the edit page.
**Follow-ups:** None.

---

## Intent 5 — TeamsAndSettingsWaits
**Dissolved:** 2026-02-25
**Goal:** Add load guards to Teams POMs (3 files) and all Settings POMs (10 files).
**Outcome:** All 13 POMs updated. Teams: `TeamsPage.goto()`, `TeamDetailPage.gotoById()`, `TeamsGroupingPage.goto()` all use `waitForLoadAndElement`. `waitForLoad()` added to `clickManageTeam()`, pagination, `goBack()`. Settings: all 10 pages (`ProfilePage`, `MembersPage`, `LicensesPage`, `BillingPage`, `BillingPlansPage`, `ReferralPage`, `HandoverDeletePage`, `IntegrationPage`, `ServicesPage`, `CompanyPlayersPage`) updated with `waitForLoadAndElement` in `goto()` and `waitForLoad()` on all navigation methods.
**Key Decisions:** Settings pages use `pageHeading` as the anchor element uniformly — all settings pages load a visible heading before any interactive elements.
**Follow-ups:** None.

---
