---
name: terminal-limitations
description: Use before running any interactive or TTY-dependent command to check against known terminal limitations
---

# Terminal Limitations Check

## Overview

Claude Code runs in a non-interactive terminal without TTY support. Some commands will fail silently or hang. This skill prevents wasted time by checking against the known limitations registry before execution.

## When to Use

Use BEFORE running any command that might require:
- Interactive input (stdin prompts)
- TTY allocation
- GUI or browser windows
- User confirmation prompts

## Process

### Step 1: Check the Registry

Before executing a command, check `.claude/CLAUDE.md` Section 7 (Terminal Limitations Registry) for known limitations.

### Step 2: Match Against Known Limitations

Compare the command against registered entries:

| If command matches... | Then... |
|---|---|
| Known limitation with workaround | Alert user with the workaround. Do NOT run the command. |
| Known limitation without workaround | Alert user that this command cannot run in Claude Code terminal. |
| No match | Proceed with execution. |

### Step 3: Handle New Failures

If a command fails due to terminal constraints (no TTY, no stdin, no interactive mode):

1. **Do NOT retry** the same command
2. **Alert the user**: explain why it failed
3. **Suggest adding to registry**: propose a new entry for `.claude/CLAUDE.md` Section 7
4. **Provide workaround**: suggest running in an external terminal

### Alert Format

```
TERMINAL LIMITATION: `[command]` cannot run in Claude Code terminal.
Reason: [why it fails]
Workaround: [alternative approach]
Registry: .claude/CLAUDE.md Section 7
```

## Known Limitation Patterns

These command patterns are likely to fail:

- `playwright codegen` — requires interactive browser
- `inquirer` / `prompts` — requires stdin
- Any command with `--interactive` or `-i` flag
- Commands that open editors (`vim`, `nano`, `code --wait`)
- Commands requiring password input without `--password-stdin`

## Adding to Registry

When suggesting a new registry entry, format it as:

```markdown
| `[command]` | [limitation description] | [workaround] |
```

This goes in `.claude/CLAUDE.md` Section 7 table.
