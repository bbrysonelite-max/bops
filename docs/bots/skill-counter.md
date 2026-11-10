# Counter — the golf numbers Boppy keeps

When: Brent asks "where are we", "the counter", "the numbers", or the morning routine runs.

1. Jumbo first: `bops-jumbo search "cold email golf"` and `bops-jumbo search "Glenwild Caves Valley RapidTee Troon"` for the latest dated facts.
2. Fill this fixed shape, one line each:
   SENT / DELIVERED-INBOX / SPAM / BOUNCED / REPLIED / CLAIMED-FREE-HOLE / DEALS (name, stage, last dated fact, blocker).
3. Sources, in this order:
   - Instantly: the Mac-side script ~/Dropbox/AGENTS/PROJECTS/golf-flyover/marketing/placement/domains.py and its DOMAIN-HEALTH.md (when it exists).
   - monica's send files under ~/Dropbox/AGENTS/PROJECTS/golf-flyover/marketing/ (WAVE-*, IOWA-*, replies.py output, outreach.db if present).
   - Deal state: ~/Dropbox/AGENTS/PROJECTS/*/PRIORITIES.md, the dated lines near the top.
   - Free-hole claims: the wannaplaygolf.com review_open store (when it exists); until then CLAIMED-FREE-HOLE is "unknown".
4. Rule: a number without a source and a UTC time is written "unknown", never 0. Every number carries where it came from and when.
5. Write the shape to ~/Dropbox/AGENTS/PROJECTS/bops/COUNTER.md (rewrite the one file, UTC stamp at the top) when the task runs on the Mac; then report three plain lines to Brent: what moved, what is blocked, one question.

Pitfalls: the 614 sends had no placement measurement, so DELIVERED-INBOX and SPAM are "unknown" until the landing proof runs; never invent a reply count; Glenwild's price is referrals, not dollars.
