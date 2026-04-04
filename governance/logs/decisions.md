# Decision Log

*Last updated: 2026-04-04*

> All project decisions: architecture, process, tooling, scope changes.

**Order:** Newest first.

| Datum | Beslissing | Rationale |
|-------|------------|-----------|

<!-- entries below -->
| 2026-04-04 | **DMARC policy: p=reject** — Maximum enforcement for email authentication. SPF updated with `include:amazonses.com` for Resend deliverability. | Rejected p=quarantine (Yahoo still penalizes) and p=none (no protection). p=reject gives best deliverability with verified DKIM+SPF. user="lexicode" |
| 2026-04-04 | **Newsletter: list-only audience (no course/location/level)** — Ported cubania newsletter with only GENERAL and LIST audience types. | Rejected full cubania model (COURSE/LOCATION/LEVEL): virtualy-yours has no course system. Kept list management + double opt-in for leads. user="lexicode" |
| 2026-04-03 | **Deploy strategy: GitHub Actions + SSH to Hetzner** — Standalone Next.js build via CI, SCP to server, systemd restart. | Rejected GHCR+Watchtower (added infra complexity) and webhook (requires endpoint on server). SSH deploy is direct, uses existing tooling, no new infra. user="lexicode" |
| 2026-04-03 | **Dedicated deploy key for CI** — Separate ed25519 key (`deploy_virtually_yours`) for GitHub Actions deploy, not personal SSH key. | Rejected reusing personal key: dedicated key is independently revocable, limited scope, better security hygiene. user="lexicode" |
<!-- clawguard-managed: decisions-log v1 -->
