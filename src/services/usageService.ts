import { FREE_GENERATION_LIMIT, PLAN_ENTITLEMENTS, STORAGE_KEYS } from "@/config/config";
import { readKey, writeKey } from "@/lib/storage";
import type { PlanId } from "@/types";

/**
 * Free-generation counter. NOTE: this is client-side only and can be bypassed
 * by clearing browser storage or switching browsers. Real enforcement needs a backend.
 */
export function parseCount(raw: string | null): number {
  const n = Number.parseInt(raw ?? "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function getUsageCount(): number {
  return parseCount(readKey(STORAGE_KEYS.usage));
}

/** Pure rule: may a user on `plan` with `used` generations create another? */
export function canGenerate(used: number, plan: PlanId): boolean {
  const limit = PLAN_ENTITLEMENTS[plan].generationLimit;
  return limit === null || used < limit;
}

export function remaining(used: number, plan: PlanId): number | null {
  const limit = PLAN_ENTITLEMENTS[plan].generationLimit;
  return limit === null ? null : Math.max(0, limit - used);
}

/** Call only after a QR was successfully generated. */
export function recordGeneration(): number {
  const next = getUsageCount() + 1;
  writeKey(STORAGE_KEYS.usage, String(next));
  return next;
}

export function resetUsage() {
  writeKey(STORAGE_KEYS.usage, null);
}

export { FREE_GENERATION_LIMIT };
