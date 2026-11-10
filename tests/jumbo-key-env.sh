#!/bin/bash
set -e
cd "$(dirname "$0")/.."
grep -q 'BOPS_JUMBO_KEY_' lib/server/tailnet.ts
grep -q 'jumboKeyFor' lib/server/tailnet.ts
! grep -q '"source\\":\\"bops-boppy\\"' vm/bin/bops-jumbo
echo ok
# the env-name convention, run on the exact expression the code uses (Review Focus 2: hyphens and digits)
expr=$(grep -o '"BOPS_JUMBO_KEY_" + botId[^;]*' lib/server/tailnet.ts)
[ "$(node -e "const botId='ta-tana2'; console.log($expr)")" = "BOPS_JUMBO_KEY_TA_TANA2" ]
BOPS_BOT=tatana bash -c 'eval "$(grep ^SRC= vm/bin/bops-jumbo)"; [ "$SRC" = bops-tatana ]'
bash -c 'hostname(){ echo bops-boppy; }; eval "$(grep ^SRC= vm/bin/bops-jumbo)"; [ "$SRC" = bops-boppy ]'
echo ok2
