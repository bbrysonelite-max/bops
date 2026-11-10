import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Bot } from "@/lib/types";
import { orgo } from "./orgo";
import { bot, update } from "./store";

/**
 * Puts a bot's Orgo computer on the user's tailnet (vm/bin/bops-tailnet), so Bops can reach its
 * screens' Chrome directly: the mirror, Jev's screen reads and precise take-over all need that.
 * The auth key goes over for one use and is deleted on the computer right after.
 */

const joining = new Map<string, Promise<string | null>>();

/** The bot's own Jumbo client key: env BOPS_JUMBO_KEY_<BOTID> (id upper-cased, non [A-Z0-9] → _), else BOPS_JUMBO_KEY. */
export function jumboKeyFor(botId: string): string | undefined {
  const name = "BOPS_JUMBO_KEY_" + botId.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  return process.env[name] ?? process.env.BOPS_JUMBO_KEY;
}

/** True when this Mac can reach the computer's Chrome over the tailnet right now. */
export async function tailnetUp(b: Bot) {
  if (!b.tailnet) return false;
  try {
    return (await fetch(`http://${b.tailnet.ip}:9299/json/version`, { signal: AbortSignal.timeout(2500) })).ok;
  } catch {
    return false;
  }
}

/** Make sure the computer is on the tailnet, re-joining if it restarted (state lives in memory). */
export async function ensureTailnet(b: Bot, fresh = false): Promise<string | null> {
  if (!process.env.TAILSCALE_AUTH_KEY || !b.computerId) return null;
  if (b.tailnet && !fresh && (await tailnetUp(b))) return b.tailnet.ip;
  return joinOnce(b, fresh);
}

function joinOnce(b: Bot, fresh: boolean): Promise<string | null> {
  let p = joining.get(b.id);
  if (!p) {
    p = join_(b, fresh).finally(() => joining.delete(b.id));
    joining.set(b.id, p);
  }
  return p;
}

async function join_(b: Bot, fresh: boolean) {
  const script = readFileSync(join(process.cwd(), "vm/bin/bops-tailnet")).toString("base64");
  const jumboCli = readFileSync(join(process.cwd(), "vm/bin/bops-jumbo")).toString("base64");
  const key = Buffer.from(process.env.TAILSCALE_AUTH_KEY!).toString("base64");
  const name = `bops-${b.id}`;
  // Jumbo (Brent's memory layer on the tailnet): this bot's own client key (jumboKeyFor) goes along, to stay on
  // its computer at /root/.bops/jumbo-key for `curl -x localhost:1055 -H "Authorization: Bearer $(cat /root/.bops/jumbo-key)"`.
  const jumboKey = jumboKeyFor(b.id);
  const jumbo = jumboKey ? Buffer.from(jumboKey).toString("base64") : "";
  // A computer without our record of it is new or forked: restart tailscaled so it gets its own identity.
  const res = await orgo.bash(
    b.computerId!,
    [
      `echo ${script} | base64 -d > /usr/local/bin/bops-tailnet && chmod 755 /usr/local/bin/bops-tailnet`,
      "mkdir -p /root/.bops && chmod 700 /root/.bops",
      `echo ${key} | base64 -d > /root/.bops/ts-authkey && chmod 600 /root/.bops/ts-authkey`,
      ...(jumbo ? [`echo ${jumbo} | base64 -d > /root/.bops/jumbo-key && chmod 600 /root/.bops/jumbo-key`] : []),
      `echo ${jumboCli} | base64 -d > /usr/local/bin/bops-jumbo && chmod 755 /usr/local/bin/bops-jumbo`,
      `bops-tailnet ${name} ${fresh || !b.tailnet ? "--fresh" : ""} 2>&1; rm -f /root/.bops/ts-authkey`,
    ].join("\n"),
    120,
  );
  const ip = res.output.trim().split("\n").at(-1)?.trim() ?? "";
  if (!/^100\.\d+\.\d+\.\d+$/.test(ip)) {
    console.warn(`[tailnet] ${name} didn't join: ${res.output.slice(-300)}`);
    return null;
  }
  update(() => {
    const x = bot(b.id);
    if (x) x.tailnet = { ip, name };
  });
  return ip;
}
