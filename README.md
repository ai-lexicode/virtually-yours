# virtualy-yours

> Project with [ClawGuard](https://github.com/LexicodeAI/clawguard) governance (profile: `controlled`).

## Getting Started

1. Open in VS Code / Cursor
2. Start a Claude Code session
3. Run `/status` to see the governance dashboard

## Structure

| Folder | Purpose |
|--------|---------|
| `governance/` | Logs, QMS, specs (writable) |
| `project/` | Production files, backlog, specs |
| `.clawguard/` | Framework (read-only symlink) |
| `.claude/` | Skills, hooks, rules (symlinks) |

## Update Framework

```bash
cd ../clawguard && git pull
```
