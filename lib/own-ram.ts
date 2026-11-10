/**
 * Memory, in GB, for a bot's own computer made fresh from the Bops template, when the main bot's computer
 * is Orgo's free Bops one: Orgo keeps those on hosts that run nothing else and refuses to fork or clone
 * them (409 "Bops computers can't be cloned"). 8 GB when the plan has room for it, so a Startup plan's
 * memory holds more than one such bot; else the largest of Orgo's sizes that fits; undefined when none
 * does, or when Orgo didn't say what's in use.
 */
export function freshOwnRam(memory: { total: number; used: number; newMax: number } | undefined): number | undefined {
  if (!memory) return undefined;
  const cap = Math.min(8, memory.newMax, memory.total - memory.used);
  return [8, 4].find((gb) => gb <= cap);
}
