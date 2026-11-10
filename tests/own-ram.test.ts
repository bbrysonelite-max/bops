// A bot's own computer, made fresh from the Bops template when the main bot's computer is Orgo's free Bops
// one (which Orgo won't copy): how much memory it gets. Run: bun test tests/own-ram.test.ts
import { expect, test } from "bun:test";
import { freshOwnRam } from "../lib/own-ram";

test("8 GB when the plan has 8 or more left and allows it per computer", () => {
  expect(freshOwnRam({ total: 32, used: 16, newMax: 16 })).toBe(8);
});
test("the largest size that fits when less than 8 is left", () => {
  expect(freshOwnRam({ total: 32, used: 28, newMax: 16 })).toBe(4);
});
test("capped by the per-computer maximum", () => {
  expect(freshOwnRam({ total: 32, used: 0, newMax: 4 })).toBe(4);
});
test("undefined when nothing fits, so the caller says the plan is short", () => {
  expect(freshOwnRam({ total: 32, used: 30, newMax: 16 })).toBeUndefined();
});
test("undefined when Orgo gave no memory numbers (Orgo decides)", () => {
  expect(freshOwnRam(undefined)).toBeUndefined();
});
