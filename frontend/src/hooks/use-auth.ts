import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/config/config";
import { readKey, subscribe } from "@/lib/storage";
import { clearToken, decodeUserId } from "@/lib/api";

export function useAuth() {
  const token = useSyncExternalStore(
    subscribe,
    () => readKey(STORAGE_KEYS.authToken),
    () => null,
  );
  const userId = token ? decodeUserId(token) : null;
  const user = userId ? { id: userId } : null;
  return { user, ready: true, signOut: clearToken };
}
