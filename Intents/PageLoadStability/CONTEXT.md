# Feature Upgrade — Page Load Stability

> Owner: TBD  ·  Created: 2026-02-25

## Begin (raw)
<!-- 3-minute brain dump. Do not edit or reinterpret. -->
All test cases needs to have the wait for domcontentload before login and after login.
The tests are breaking because the content is not fully loaded but playwright has already
begun testing and elements are not stable... until dom content is loaded.
Or wait for page load should be added.

## Refine (scope)

- **Goal**: Add consistent `waitForLoadState('domcontentloaded')` + specific element visibility
  guards to every navigation point across all POMs. Fix flaky tests caused by Playwright
  racing ahead before the DOM is stable.

- **In scope**:
  - Add `waitForLoadAndElement(locator)` helper to `BasePage`
  - Update all `goto()` methods to use `waitForLoadAndElement(this.pageHeading)` (or primary element)
  - Add `await this.waitForLoad()` after every click-based navigation method across all POMs
  - Add `await this.waitForLoad()` after `clickLoginButton()` inside `SignInPage.login()`
  - Covers: `BasePage`, all 3 auth POMs, `DashboardPage`, `LibraryPage`, `UploadPage`,
    `PlaylistsPage`, `PlaylistEditPage`, `PlayersPage`, `PlayerDetailPage`,
    `PlannersPage`, `PlannerEditPage`, `OverlaysPage`, `OverlayEditPage`,
    `WidgetsPage`, `WidgetEditPage`, `TeamsPage`, `TeamDetailPage`, `TeamsGroupingPage`,
    `ProfilePage`, `MembersPage`, `LicensesPage`, `BillingPage`, `BillingPlansPage`,
    `ReferralPage`, `HandoverDeletePage`, `IntegrationPage`, `ServicesPage`, `CompanyPlayersPage`

- **Out of scope**:
  - Spec files (`.spec.ts`) — no changes there; all fixes are POM-layer only
  - Adding new test cases
  - Changing load state level from `domcontentloaded` to `load` or `networkidle`

- **Definition of Done**:
  - [ ] `BasePage` has `waitForLoadAndElement(locator: Locator)` method
  - [ ] Every `goto()` uses `waitForLoadAndElement` on the page's primary heading/element
  - [ ] Every click-based navigation method has `await this.waitForLoad()` after the click
  - [ ] `SignInPage.login()` has `waitForLoad()` after `clickLoginButton()`
  - [ ] All 28 POM files updated
  - [ ] No spec files modified

- **Constraints**:
  - Single quotes only — no double quotes in TypeScript
  - No regex anywhere
  - Do not modify `.spec.ts` files
  - Do not add `console.log`

- **Risks**:
  - Pagination clicks (next/prev page) — adds `waitForLoad()`, but content reload
    may need `networkidle` for heavy data. Start with `domcontentloaded`; escalate if still flaky.

- **Dependencies**: None — BasePage upgrade (Intent 01) must complete before all others
