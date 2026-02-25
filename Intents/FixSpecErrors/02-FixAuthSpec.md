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
- **Actual Time**:
- **Result**:
- **Key Decisions**:
- **Follow-ups**:
