# Tier-Aware Test Guards

> Owner: Sreenivasan  ·  Created: 2026-03-02

## Begin (raw)
<!-- 3-minute brain dump. Do not edit or reinterpret. -->
Tests currently assume Pro tier account behaviour. Pre-prod account is Enterprise Tier —
billing UI, referral, services pages differ or are absent. Free tier has further restrictions.
Need conditional assertions so the same test suite runs correctly across all tiers without
hard-coding skips per environment.

## Refine (scope)
- **Goal**: Add a single `ACCOUNT_TIER` env var (`free | pro | enterprise`) so every spec file can branch its assertions by tier — no more hard-coded skips, no silent failures.

- **Account model**:
  - Account TYPES: Store, Reseller, Enterprise
  - Account TIERS: Free, Pro
  - For test purposes these collapse into 3 test-personas: `free`, `pro`, `enterprise`

- **Tier behaviour matrix**:
  | Feature / Page              | Free          | Pro (default) | Enterprise       |
  |-----------------------------|---------------|---------------|------------------|
  | Library assets              | max 15        | unlimited     | unlimited        |
  | Players                     | max 1         | unlimited     | unlimited        |
  | Planners page               | ❌ (upgrade)  | ✅            | ✅               |
  | Overlays page               | ❌ (upgrade)  | ✅            | ✅               |
  | Widgets page                | ❌ (upgrade)  | ✅            | ✅               |
  | Integration page            | ❌ (upgrade)  | ✅            | ✅               |
  | Teams & Grouping            | ❌ (upgrade)  | ✅            | ✅               |
  | Referral page               | ❌ (absent)   | ✅            | ❌ (404)         |
  | Services page               | TBD           | ✅            | ❌ (404)         |
  | Billing — full UI           | ❌ (upgrade)  | ✅            | ❌ (Enterprise Tier + Contact Support) |
  | License purchases           | ❌ (upgrade only) | ✅        | ❌ (disabled)    |
  | Credit / Reseller codes     | ✅ visible + enabled (upgrade to Pro only) | ✅ enabled, unlimited | ❌ disabled, cannot add |
  | Upgrade button              | ✅ visible    | ❌            | ❌               |
  | Reseller code               | ✅ (upgrades to Pro) | ✅   | TBD              |

- **In scope**:
  - `ACCOUNT_TIER` env var (free / pro / enterprise), default `pro`
  - TypeScript tier helper (`e2e/utils/tierGuard.ts`)
  - Tier-conditional assertions in billing, licenses, referral, services, planners, overlays, widgets, integration, teams specs
  - BillingPage POM additions for Enterprise Tier locators
  - Remove all `test.describe.skip` added on v3-pre-prod (replaced with proper guards)

- **Out of scope**:
  - Reseller account-type-specific tests
  - Store account-type-specific tests
  - Free tier functional flows (CRUD) — read-only/UI assertion only (no Free account yet)
  - Modifying staging pipeline (staging stays ACCOUNT_TIER=pro by default)

- **Definition of Done**:
  - `npx playwright test` with ACCOUNT_TIER=pro passes 131+ tests (staging unchanged)
  - All tier-guarded tests assert the correct UI per tier instead of blindly skipping
  - `ACCOUNT_TIER` documented in `.env.example` and azure-pipelines.yml comments

- **Constraints**:
  - No Free tier test account available yet — Free tier tests must be scaffolded but cannot be validated until an account is provisioned
  - Do NOT touch `.env` files directly — only `.env.example`

- **Risks**:
  - Free tier page restriction UX unknown (redirect? inline upgrade banner? nav links hidden?) — needs investigation before writing assertions
  - Enterprise Services/Referral routes may exist on some environments and not others

- **Dependencies**: main branch, env-agnostic config (already done — URL/EMAIL/PASSWORD)
