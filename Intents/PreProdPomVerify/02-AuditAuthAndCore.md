# 02. AuditAuthAndCore

**Goal**: Use playwright-cli to inspect 6 POMs against pre-prod URL and document any locator differences
**Est.**: 2 hours
**Dependencies**: 01-CreateBranchScaffold

## Pages to audit
- `SignInPage` → `/en/auth/login`
- `SignUpPage` → `/en/auth/signup`
- `ForgotPasswordPage` → `/en/auth/forgot-password`
- `DashboardPage` → `/en` (post-login)
- `LibraryPage` → `/en/library`
- `UploadPage` → `/en/library/upload`

## Steps
- [x] Use playwright-cli to navigate to each page on pre-prod URL
- [x] Capture key element selectors (inputs, buttons, headings, nav links)
- [x] Compare against current POM locators in `e2e/pages/`
- [x] Document any differences found

## Definition of Done
- [x] All 6 pages inspected on pre-prod
- [x] Differences documented under ## Findings

## Findings

### SignInPage (`e2e/pages/auth/SignInPage.ts`)
**DIFF 1** — `microsoftSignInButton` locator name wrong:
- POM: `getByRole('button', { name: 'Login with Microsoft' })`
- Pre-prod: `button "Sign in with Microsoft"` (accessible name changed)
- Fix: change name to `'Sign in with Microsoft'`

**DIFF 2** — Google / Facebook / Apple SSO buttons **removed** on pre-prod:
- POM: `googleSignInButton`, `facebookSignInButton`, `appleSignInButton` all defined
- Pre-prod: only "Sign in with Microsoft" SSO exists; no Google/Facebook/Apple buttons
- Fix: remove those 3 locators (or conditionally guard tests using them)

All other SignInPage locators confirmed ✅:
`img[alt="XOGO"]`, `input[type="email"]`, `input[name="password"]`, `span[data-slot="trailing"] button`, `button "Login"` (exact), `link "Forgot password"`, `link "Sign Up for Free"`, `button "Show popup"` (language), `label.altcha-label`

---

### SignUpPage (`e2e/pages/auth/SignUpPage.ts`)
**DIFF 3** — `confirmPasswordToggle` filter text changed:
- POM: `page.locator('div').filter({ hasText: 'Confirm password' }).getByRole('button')`
- Pre-prod: label text is **"Reenter your password"** (not "Confirm password")
- Fix: change filter to `{ hasText: 'Reenter your password' }`

**DIFF 4** — `eulaToggle` accessible name longer on pre-prod:
- POM: `getByRole('switch', { name: 'I have read and accept the End User License Agreement' })`
- Pre-prod: `switch "I have read and accept the Read End User License Agreement (opens in new window)"`
- Fix: update name to match pre-prod (or use partial — test first)

All other SignUpPage locators confirmed ✅:
`heading "Sign Up" h1`, `input[name="email"]`, `input[name="password"]`, `input[name="confirmPassword"]`, `switch "I have a reseller code"`, `switch "I have a referral code"`, `eulaLink`, `button "Next"`, `link "Return to log in"`, `link "Log In"` (side panel)

---

### ForgotPasswordPage (`e2e/pages/auth/ForgotPasswordPage.ts`)
✅ **No changes needed** — all locators confirmed identical:
`heading "Forgot Password" h1`, `textbox "Enter your email"`, `button "Reset Password"`, `label.altcha-label`, `link "Log In"`

---

### DashboardPage (`e2e/pages/dashboard/DashboardPage.ts`)
**DIFF 5** — `playersViewAllLink` does not exist on pre-prod:
- POM: `page.locator('a[href="/en/players"]').filter({ hasText: 'View All' })`
- Pre-prod: Players section shows heading `h2 "Players"` but **no "View All" link** — only Library and Playlists have View All
- Fix: remove or guard `playersViewAllLink` locator; update `verifyPlayersSectionVisible` to not assert it

All other DashboardPage locators confirmed ✅:
`heading "Dashboard" h1`, `button "Add New"`, all 8 nav links (case-insensitive match OK), `h2 "Library"`, `h2 "Playlists"`, `h2 "Players"`, `a[href="/en/library"] View All`, `a[href="/en/playlists"] View All`

---

### LibraryPage (`e2e/pages/library/LibraryPage.ts`)
✅ **No changes needed** — all locators confirmed identical:
`heading "Library" h1`, `button "Add New"`, tabs All/Images/Videos/URLs/Widgets, `button "Date Added: Newest"`, `button "Filter"`, `button "Select"`, pagination info, all menu items

---

### UploadPage (`e2e/pages/library/UploadPage.ts`)
**DIFF 6** — `chooseFileButton` not present on pre-prod:
- POM: `page.getByRole('button', { name: 'Choose File' })`
- Pre-prod: No "Choose File" button — only "or click to browse" exists
- Fix: remove `chooseFileButton` locator and all methods/verify calls using it

`goBackButton` ✅ — POM uses `getByRole('button', { name: 'Go back' })` which matches the `aria-label="Go back"` on pre-prod (no visible text, but aria-label gives accessible name "Go back")

All other UploadPage locators confirmed ✅:
`heading "Media Upload" h1`, `button "Go back"` (via aria-label), `button "or click to browse"`, `button "Upload"` (disabled), `input[type="file"]`

## Outcome (fill after Iterate)
- **Actual Time**: ~1.5h
- **Result**: 6 diffs found across 4 pages; 2 pages unchanged (ForgotPassword, Library)
- **Key Decisions**: Used playwright-cli snapshots for auth pages + audit script for authenticated pages; staging auth state doesn't carry over to pre-prod
- **Follow-ups**: Intents 03+04 need pre-prod URL in .env for playwright-cli authenticated navigation
