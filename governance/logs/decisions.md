# Decision Log

*Last updated: 2026-04-03*

> All project decisions: architecture, process, tooling, scope changes.

**Order:** Newest first.

| Datum | Beslissing | Rationale |
|-------|------------|-----------|

<!-- entries below -->
| 2026-04-03 | **Deploy strategy: GitHub Actions + SSH to Hetzner** — Standalone Next.js build via CI, SCP to server, systemd restart. | Rejected GHCR+Watchtower (added infra complexity) and webhook (requires endpoint on server). SSH deploy is direct, uses existing tooling, no new infra. user="lexicode" |
| 2026-04-03 | **Dedicated deploy key for CI** — Separate ed25519 key (`deploy_virtually_yours`) for GitHub Actions deploy, not personal SSH key. | Rejected reusing personal key: dedicated key is independently revocable, limited scope, better security hygiene. user="lexicode" |
<!-- clawguard-managed: decisions-log v1 -->
