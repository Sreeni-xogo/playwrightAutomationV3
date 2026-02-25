# 02. FixAuthSpec

**Goal**: Fix all broken locators and wrong assertions found in Intent 01; re-run auth.spec.ts to confirm clean
**Est.**: ≤2 hours
**Dependencies**: 01-RunAuthSpec complete

## Steps
- [ ] For each failure from 01: use playwright-cli to inspect live element on staging if locator is broken
- [ ] Update POM (SignInPage / SignUpPage / ForgotPasswordPage) as needed
- [ ] Update assertion in spec file if assertion is wrong
- [ ] Re-run auth.spec.ts — repeat fix loop until zero outright failures
- [ ] List any remaining flaky/skipped tests

## Definition of Done
- [ ] auth.spec.ts passes with zero outright failures on staging/Chrome
- [ ] Flaky/skipped tests listed separately for manual review

## Outcome (fill after Iterate)
- **Actual Time**: ~4 hours (multiple rounds across sessions)
- **Result**: 21/21 auth.spec.ts tests passing — zero outright failures
- **Key Decisions**:
  - `fill()` + `waitForLoadState('networkidle')` is required before form interactions — Vue v-model is NOT updated by `pressSequentially` or `fill()` until Vue's reactive system is fully hydrated (networkidle state). Adding networkidle ONLY inside fill methods (not in goto/waitForLoadAndElement) avoids breaking navigation tests.
  - Altcha captcha: click label then wait for `.altcha[data-state="verified"]` (state: 'attached') — more reliable than fixed 4000ms timeout. Also requires networkidle before the click.
  - `login()` uses `page.waitForURL()` predicate instead of `waitForLoad()` — SPA navigation doesn't trigger domcontentloaded again.
  - Direct DOM selectors (`input[type="email"]`, `input[name="password"]`, `input[name="confirmPassword"]`) over `getByRole('textbox')` — required for Vue-reactive inputs.
  - `loginButton` needs `exact: true` — 5 buttons match "Login with X" names without it.
  - `loginLink` on SignUpPage needs `exact: true` — "Return to log in" also contains "log in" as partial match.
  - `toBeDisabled()` assertions instead of `clickNext()` for disabled-button tests — Playwright waits for the button to enable before clicking, causing timeout.
- **Follow-ups**: Extend same pilot approach to next spec file
