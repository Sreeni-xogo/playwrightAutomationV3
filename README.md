# XOGO Manager — Playwright E2E Automation

End-to-end test automation for the XOGO Manager web application using Playwright and TypeScript.

## Coverage

- Auth (sign in, sign up, forgot password, delete account)
- Library
- Playlists
- Players
- Planners
- Overlays
- Account & Settings
- Billing & Licenses
- Teams & Groupings

## Getting Started

```bash
npm install
npx playwright install
```

## Usage

```bash
npx playwright test                        # Run all tests
npx playwright test --project=chromium    # Chrome only
npx playwright test --project=firefox     # Firefox only
npx playwright test --project=webkit      # WebKit only
npx playwright test --ui                  # Interactive UI mode
npx playwright test --debug               # Debug mode
npx playwright show-report                # Open HTML report
```

## Environments

Set the target environment via env var or playwright config projects:

| Env | Key |
|---|---|
| Local | `local` |
| Staging | `staging` |
| Pre-release | `pre-release` |
| Production | `production` |

## Development

This project uses the [HelpIRL Claude Template](https://github.com/HelpIRL/ClaudeTemplateV1)
for AI-assisted development. See `ClaudeTemplate.md` for details.

### Commands

- `/brain` — Scaffold a new feature with intent breakdown
- `/commit` — Smart commit with conventional format
- `/review` — Code review
- `/status` — Project status overview

## License

ISC
