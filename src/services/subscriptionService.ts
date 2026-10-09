import { PLAN_ENTITLEMENTS, STORAGE_KEYS } from "@/config/config";
import { readKey, writeKey } from "@/lib/storage";
import type { PlanId } from "@/types";

/** Mock subscription: Pro is a clearly labeled demo mode stored locally. */
export function parsePlan(raw: string | null): PlanId {
  return raw === "pro" ? "pro" : "free";
}
export function getPlan(): PlanId {
  return parsePlan(readKey(STORAGE_KEYS.plan));
}
export function setDemoPlan(plan: PlanId) {
  writeKey(STORAGE_KEYS.plan, plan === "pro" ? "pro" : null);
}
export function getEntitlements(plan: PlanId) {
  return PLAN_ENTITLEMENTS[plan];
}
