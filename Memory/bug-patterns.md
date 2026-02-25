# Bug Pattern Library — playwrightAutomationV3

> Format: each pattern has SYMPTOM (what you see), ROOT CAUSE (why), FIX (exact solution), ANTI-PATTERN (what to avoid)
> Update this file after fixing any new bug — see project CLAUDE.md for instructions.

---

## PATTERN-001: Vue v-model not updated — form submits empty fields

**Symptom:**
- `fill()` appears to succeed but the form submits empty/old values
- Vue reactive binding clears the field after a click (e.g., toggle button click)
- `page.evaluate(() => input.value)` shows value present, but Vue state is empty

**Root Cause:**
`fill()` sets the native DOM value but Vue's `v-model` reactive system requires `networkidle` to be fully initialized before its input event listeners are bound. Without networkidle, the Vue component ignores the fill.

**Fix:**
Add `await this.page.waitForLoadState('networkidle')` **inside** each `fillXxx()` method, BEFORE `fill()`:
```typescript
async fillEmail(email: string): Promise<void> {
  // AIDEV-NOTE: networkidle ensures Vue v-model bindings hydrated before fill()
  await this.page.waitForLoadState('networkidle');
  await this.emailInput.fill(email);
}
```

**Anti-Patterns:**
- ❌ `pressSequentially()` — dispatches key events but does NOT update Vue v-model
- ❌ `click() + keyboard.type()` — same problem as pressSequentially
- ❌ `waitForLoadState('networkidle')` inside `goto()` or `waitForLoadAndElement()` — breaks navigation tests (see PATTERN-003)
- ✅ Only add networkidle inside `fillXxx()` and `solveCaptcha()` methods

**Files affected:** Any POM with form inputs on Vue-rendered pages

---

## PATTERN-002: SPA navigation — URL not updated after sidebar/link click

**Symptom:**
- `expect(page.url()).toContain('/en/library')` fails — URL still shows `/en`
- Test passes the click but the URL assertion fires before the route change completes
- `waitForLoad()` returns immediately and the URL check runs too early

**Root Cause:**
SPA (Vue Router) navigation never re-fires `domcontentloaded`. `waitForLoad()` uses `domcontentloaded` which fires instantly on client-side routing. The synchronous `expect(page.url()).toContain(...)` has no retry — it checks the URL at the moment `waitForLoad()` returns, before Vue Router has completed the transition.

**Fix:**
Replace `waitForLoad()` in navigation click methods with `waitForURL()` predicate:
```typescript
async clickNavLibrary(): Promise<void> {
  await this.navLibraryLink.click();
  // AIDEV-NOTE: SPA nav — waitForLoad fires before route change; waitForURL polls until arrival
  await this.page.waitForURL((url) => url.pathname.includes('/en/library'), { timeout: 10000 });
}
```

**Anti-Patterns:**
- ❌ `await this.waitForLoad()` after SPA link clicks — returns before navigation completes
- ❌ `expect(page.url()).toContain(...)` — synchronous, no retry, always races
- ✅ `await this.page.waitForURL(predicate, { timeout: 10000 })` in the POM click method

**Files affected:** All POM click methods that navigate between pages (DashboardPage, LibraryPage, etc.)

---

## PATTERN-003: networkidle in goto() breaks navigation tests

**Symptom:**
- Adding `waitForLoadState('networkidle')` to `waitForLoadAndElement()` or `goto()` causes 4–6 navigation tests to fail
- `navigateToForgotPassword()`, `navigateToSignUp()` etc. stop working
- URL stays on the origin page after clicking a nav link

**Root Cause:**
When networkidle is added to `goto()`, Vue Router is fully initialized by the time the test clicks a navigation link. Vue Router then intercepts the click with an async `router.push()` but also triggers email field auto-focus + validation state, which prevents the navigation from completing. The problem only manifests after full Vue hydration.

**Fix:**
- Keep `waitForLoadAndElement()` and `goto()` using **only** `domcontentloaded` (no networkidle)
- ONLY add networkidle inside `fillXxx()` and `solveCaptcha()` methods (PATTERN-001)

```typescript
// BasePage — CORRECT: no networkidle here
async waitForLoadAndElement(locator: Locator): Promise<void> {
  await this.page.waitForLoadState('domcontentloaded');
  await expect(locator).toBeVisible();
}
```

**Anti-Patterns:**
- ❌ `await this.page.waitForLoadState('networkidle')` inside `goto()` or `waitForLoadAndElement()`
- ✅ networkidle only in `fillXxx()` and `solveCaptcha()`

---

## PATTERN-004: Tests show login page — unauthenticated test start

**Symptom:**
- ALL tests in a spec file fail
- Failure screenshot shows the XOGO login page instead of the expected page
- Error is `element(s) not found` on a post-login element (e.g., Dashboard heading)

**Root Cause:**
No `storageState` configured for the test. The browser starts fresh with no session cookies, navigates to `/en`, gets redirected to `/en/auth/login`.

**Fix:**
1. Ensure `staging-setup` project has run and `.auth/staging-state.json` exists
2. Add `test.use({ storageState: '.auth/staging-state.json' })` at the top of the spec file (outside describe blocks):
```typescript
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// AIDEV-NOTE: Requires authenticated session — staging-setup saves state, consumed here
test.use({ storageState: '.auth/staging-state.json' });

test.describe('Dashboard', () => {
```

**DO NOT add to:**
- `auth.spec.ts` — auth tests intentionally start unauthenticated to test login/signup flows

**Files:** All non-auth spec files: `dashboard.spec.ts`, `library.spec.ts`, `playlists.spec.ts`, `players.spec.ts`, `planners.spec.ts`, `overlays.spec.ts`, `widgets.spec.ts`, and all settings specs.

---

## PATTERN-005: Altcha captcha — waitForTimeout insufficient

**Symptom:**
- `waitForTimeout(4000)` fires before captcha proof-of-work completes
- Captcha appears unverified; form submission fails or is ignored
- Intermittent — sometimes works, sometimes fails depending on server load

**Root Cause:**
Altcha proof-of-work computation time varies (0.5s to 5s+) depending on server challenge difficulty and local CPU load. A fixed timeout is unreliable.

**Fix:**
Replace `waitForTimeout` with `waitForSelector` polling the `data-state` attribute:
```typescript
async solveCaptcha(): Promise<void> {
  const captchaLabel: Locator = this.page.locator('label.altcha-label');
  await captchaLabel.waitFor({ state: 'visible', timeout: 15000 });
  // AIDEV-NOTE: networkidle required — Vue event listeners for altcha must be bound before click
  await this.page.waitForLoadState('networkidle');
  await captchaLabel.click();
  // AIDEV-NOTE: data-state="verified" is reliable; 'attached' because element may hide post-verify
  await this.page.waitForSelector('.altcha[data-state="verified"]', { state: 'attached', timeout: 15000 });
}
```

**Anti-Patterns:**
- ❌ `await this.page.waitForTimeout(4000)` — unreliable fixed delay
- ❌ `{ state: 'visible' }` for the verified wait — element may be hidden after verification
- ✅ `{ state: 'attached' }` — element exists in DOM even if hidden

---

## PATTERN-006: Strict mode violation — locator matches multiple elements

**Symptom:**
- Error: `"strict mode violation: locator.click: Error: ... resolved to X elements"`
- Usually on `getByRole('button', { name: 'Login' })` or `getByRole('link', { name: 'Library' })`

**Root Cause:**
The locator is not specific enough and matches multiple DOM elements. Common causes:
- SSO buttons all have "Login" in their text — without `exact: true`, matches all 5
- Sidebar links for "Library", "Playlists" etc. appear in both nav and summary sections

**Fix:**
Add `exact: true` or chain `.first()`:
```typescript
// For buttons with multiple matches (SSO on login page):
this.loginButton = page.getByRole('button', { name: 'Login', exact: true });

// For nav links that also appear in content sections:
this.navLibraryLink = page.getByRole('link', { name: 'Library' }).first();
```

**Anti-Patterns:**
- ❌ `getByRole('button', { name: 'Login' })` — matches 5 buttons on login page
- ❌ `getByRole('link', { name: 'Library' })` — matches sidebar + summary section link

---

## PATTERN-007: Login redirect not awaited — URL still at /auth/login after login()

**Symptom:**
- `expect(page.url()).not.toContain('/auth/login')` fails immediately after `login()`
- Login appears to succeed (no error shown) but URL hasn't changed yet
- `waitForLoad()` returns instantly in SPA context

**Root Cause:**
SPA login submits via API call. After submission, Vue Router performs a client-side redirect. `waitForLoad()` (domcontentloaded) fires immediately and the URL check runs before the API response and redirect complete.

**Fix:**
In `login()` method, replace `waitForLoad()` with `waitForURL()` predicate:
```typescript
async login(email: string, password: string): Promise<void> {
  await this.fillEmail(email);
  await this.fillPassword(password);
  await this.solveCaptcha();
  await this.clickLoginButton();
  // AIDEV-NOTE: SPA login doesn't trigger domcontentloaded — wait for URL to leave auth/login
  await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15000 });
}
```

**Anti-Patterns:**
- ❌ `await this.waitForLoad()` after login submit — returns before redirect
- ❌ `expect(page.url()).not.toContain('/auth/login')` — synchronous, no retry

---

## PATTERN-008: Library card — invisible overlay link, h5 not inside anchor

**Symptom:**
- `page.getByText('Card Title').click()` is intercepted or does nothing (no navigation)
- `div.group locator('a')` times out — `div.group` is the TITLE wrapper, not the card container
- `click({ force: true })` on h5 fires but no navigation occurs

**Root Cause:**
XOGO library cards use an invisible `<a class="absolute inset-0 z-10">` overlay link inside `div.card`. The h5 title is in a SIBLING `div.card-footer` — NOT inside the anchor element. There is no way to reach the anchor from the h5 by going down; must go up via ancestor traversal then down.

**Fix (navigation/edit — click the card):**
Use XPath ancestor traversal from h5 to the card-footer, then up one level, then down to the overlay anchor:
```typescript
const editCardLink = page
  .locator('h5', { hasText: 'Card Title' })
  .locator('xpath=ancestor::div[contains(@class,"card-footer")]/..//a[contains(@href,"/en/library/")]');
await editCardLink.click();
```

**Fix (delete — click the trash icon button):**
The delete button (trash icon, `i-lucide:trash-2`) has **no aria-label**. Copy button has `aria-label="Copy"`. Both are inside `div.card-footer`. Use `.last()` to get the delete button:
```typescript
const footer = page.locator('div.card-footer', { has: page.locator('h5', { hasText: 'Card Title' }) });
await footer.getByRole('button').last().click();
```

**Fix (confirm delete dialog):**
The dialog ALWAYS appears. `isVisible()` is non-retrying — use `waitFor` before clicking:
```typescript
const confirmDeleteButton = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
await confirmDeleteButton.waitFor({ state: 'visible', timeout: 5000 });
await confirmDeleteButton.click();
```

**Fix (post-delete assertion):**
The dialog's `<p>` body also contains the asset name — `getByText()` causes a strict-mode violation. Use `locator('h5')` instead:
```typescript
await expect(page.locator('h5', { hasText: 'Card Title' })).not.toBeVisible({ timeout: 10000 });
```

**Anti-Patterns:**
- ❌ `page.getByText('Title').click()` — intercepted by overlay, not inside anchor
- ❌ `page.locator('div.group', { has: heading }).locator('a')` — div.group is the TITLE wrapper, not card container
- ❌ `card.getByRole('button', { name: 'Delete' })` — trash icon has no aria-label, this times out
- ❌ `if (await confirmButton.isVisible()) await confirmButton.click()` — non-retrying, races against dialog open animation

---

## PATTERN-009: Empty playlist — Save blocked by validation toast

**Symptom:**
- Clicking Save on the Create Playlist page does NOT make any API call
- Toast appears: "This playlist is empty. Add items before publishing."
- URL stays on `/en/playlists/add`; no playlist created
- Sentry POSTs are performance transactions, NOT error events (misleading)
- `page.waitForLoadState('networkidle')` + `fill()` sets DOM value correctly but save still blocked

**Root Cause:**
The XOGO Manager app enforces that playlists must have at least one media item before they can be saved. The Save handler checks the playlist's item count and short-circuits without making the API call if empty. This is intentional UX.

**Fix:**
Add at least one library item to the playlist BEFORE clicking Save. Use the "Add Items" modal:
```typescript
async addOneItemFromLibrary(): Promise<void> {
  await this.addItemsButton.click();
  const dialog = this.page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  // URLs tab has deterministic items, no file uploads
  await dialog.getByRole('tab', { name: 'URLs' }).click();
  await this.page.waitForLoadState('networkidle');
  // Stage first URL item
  await dialog.getByRole('heading', { level: 4 }).first().locator('../..').getByRole('button', { name: 'Add' }).click();
  // Confirm — top-level Add button (in dialog header) becomes enabled after staging
  const confirmBtn = dialog.getByRole('button', { name: 'Add' }).first();
  await expect(confirmBtn).toBeEnabled({ timeout: 5000 });
  await confirmBtn.click();
  await dialog.waitFor({ state: 'hidden', timeout: 10000 });
}
```

In create test: call `addOneItemFromLibrary()` BEFORE `save()`. After save with items, the app navigates to `/en/playlists/:id`. Use `waitForURL(url => !url.pathname.endsWith('/add'))`.

**Anti-Patterns:**
- ❌ `save()` on empty playlist — silently blocked, no API call, no error
- ❌ Interpreting Sentry POST as JS error — Sentry tracks performance transactions during navigation, not just errors
- ❌ `expect(page.url()).toContain('/en/playlists')` — passes trivially on `/en/playlists/add` even when save is blocked
- ✅ Always add at least one item before saving a new playlist

---

## PATTERN-010: Playlist card — h5 not inside a.card (same as library, tile structure)

**Symptom:**
- `getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('link')` times out
- `getByRole('heading', { name, level: 5 }).locator('../..').getByRole('button', { name: 'Delete' })` times out
- `verifyPlaylistVisible(name)` passes (h5 IS visible) but `clickPlaylist(name)` fails

**Root Cause:**
Playlist card DOM structure:
```
div.tile
  ├── a.card          ← clickable link (thumbnail/overlay)
  └── div.card-footer
        ├── div.group > div.pointer-events-none > h5  ← name
        └── div.flex > [Duplicate] [Delete] buttons
```
The `a.card` link is a SIBLING of `div.card-footer`, NOT an ancestor. h5 traversal levels:
- 1 up = div.pointer-events-none, 2 up = div.group, 3 up = div.card-footer, 4 up = div.tile

**Fix:**
```typescript
// Correct link locator — scope to .tile, then a.card sibling
getPlaylistLink(name: string): Locator {
  return this.page.locator('.tile').filter({
    has: this.page.locator('h5', { hasText: name })
  }).locator('a.card');
}

// Correct button locators — go 3 levels up to div.card-footer
getDuplicateButtonForPlaylist(name: string): Locator {
  return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('button', { name: 'Duplicate Playlist' });
}

getDeleteButtonForPlaylist(name: string): Locator {
  return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('button', { name: 'Delete' });
}
```

---

## ANTI-PATTERNS — Never Do These

| Anti-Pattern | Why | Use Instead |
|---|---|---|
| Regex `/pattern/` in assertions | Project rule + global rule | String literals: `toContain('text')` |
| `pressSequentially()` for Vue form inputs | Doesn't update v-model reactive state | `waitForLoadState('networkidle')` + `fill()` |
| `waitForLoad()` after SPA link clicks | domcontentloaded fires before route change | `waitForURL(predicate, { timeout })` |
| Synchronous `expect(page.url())` for SPA nav | No retry, always races | `await expect(page).toHaveURL(...)` |
| `waitForTimeout(N)` for async operations | Fixed delays are flaky | Wait for DOM state change |
| Double quotes in TS/JS | Project + global rule | Single quotes always |
| `getByRole` without `exact: true` on ambiguous roles | Strict mode violation | Add `exact: true` or `.first()` |
| `networkidle` in `goto()` / `waitForLoadAndElement()` | Breaks Vue Router link clicks | Only in `fillXxx()` and `solveCaptcha()` |
| `getByText(name)` after delete (dialog still open) | Strict mode — dialog `<p>` also contains name | `locator('h5', { hasText: name })` |
| `if (await btn.isVisible()) await btn.click()` for dialogs | Non-retrying, races animation | `waitFor({ state: 'visible' })` then click |
| `getByRole('button', { name: 'Delete' })` for icon buttons | Trash icon has no aria-label | `footer.getByRole('button').last()` |
