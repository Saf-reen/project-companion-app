import type { DemoAccount } from "@/types";

/** Mock account — no registration or passwords. Replace with GET /api/me later. */
export function getDemoAccount(): DemoAccount {
  return { name: "Demo Visitor", email: "demo@example.com", memberSince: "2026-01-01" };
}
