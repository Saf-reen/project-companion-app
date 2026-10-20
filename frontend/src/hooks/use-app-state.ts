import { useSyncExternalStore, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { STORAGE_KEYS } from "@/config/config";
import { readKey, subscribe } from "@/lib/storage";
import { parseCount } from "@/services/usageService";
import { parsePlan } from "@/services/subscriptionService";
import { parseHistory } from "@/services/historyService";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

function useKey(key: string) {
  return useSyncExternalStore(subscribe, () => readKey(key), () => null);
}

export function useAccount() {
  const { user } = useAuth();
  return useQuery({ queryKey: ["account", user?.id], queryFn: () => api.getAccount(), enabled: !!user });
}

/** Signed-in: server count/plan. Guest: browser-stored count/plan. */
export function useUsage() {
  const localCount = parseCount(useKey(STORAGE_KEYS.usage));
  const localPlan = parsePlan(useKey(STORAGE_KEYS.plan));
  const { user } = useAuth();
  const account = useAccount();
  if (user && account.data) {
    const plan = account.data.plan === "pro" || localPlan === "pro" ? "pro" : "free";
    return { count: account.data.count, plan, signedIn: true } as const;
  }
  return { count: localCount, plan: localPlan, signedIn: false } as const;
}

export function useHistory() {
  const raw = useKey(STORAGE_KEYS.history);
  return useMemo(() => parseHistory(raw), [raw]);
}
