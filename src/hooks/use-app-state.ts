import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/config/config";
import { readKey, subscribe } from "@/lib/storage";
import { parseCount } from "@/services/usageService";
import { parsePlan } from "@/services/subscriptionService";
import { parseHistory } from "@/services/historyService";
import { useMemo } from "react";

function useKey(key: string) {
  return useSyncExternalStore(subscribe, () => readKey(key), () => null);
}

export function useUsage() {
  const count = parseCount(useKey(STORAGE_KEYS.usage));
  const plan = parsePlan(useKey(STORAGE_KEYS.plan));
  return { count, plan };
}

export function useHistory() {
  const raw = useKey(STORAGE_KEYS.history);
  return useMemo(() => parseHistory(raw), [raw]);
}
