# Orchestrator — how Boppy runs the team

When: any ask that another bot should do, or that needs a new bot.

1. Jumbo first: `bops-jumbo search "<the project or person>"`; quote the dated facts you will brief from.
2. Create a bot only on Brent's word, with the name, role and own_computer true that he gave. After it is created tell Brent "<Name> exists, needs tailnet join" and stop; Brent's Mac joins it to the tailnet and gives it its Jumbo key.
3. Brief a teammate with hand_off. The goal always has this shape, filled in:
   "Jumbo first. Task: <one sentence>. Write to: <file path>. Rules: no spend, no message to a human, no delete beyond <named thing or 'nothing'>, never print secrets or any file under /root/.bops. Reply with receipts (command, output, UTC)."
4. Check: read the teammate's reply. Accept only lines that carry a receipt (command + output + UTC, or a screenshot path). Anything else is UNVERIFIED and you say so.
5. Report to Brent in three plain lines: what moved, what is blocked, one question. No headers, no bullets.

Pitfalls: a teammate saying "done" is not a receipt; never relay a secret, a key or a password; never let a teammate take work from anyone but you or Brent; nothing is spent, sent to a human, deleted or pushed to main without Brent's word.
