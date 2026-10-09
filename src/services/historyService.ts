import { STORAGE_KEYS } from "@/config/config";
import { readKey, writeKey } from "@/lib/storage";
import type { GeneratedQr } from "@/types";

const MAX_ITEMS = 100;

export function parseHistory(raw: string | null): GeneratedQr[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as GeneratedQr[]) : [];
  } catch {
    return [];
  }
}
export function getHistory() {
  return parseHistory(readKey(STORAGE_KEYS.history));
}
export function addHistory(item: GeneratedQr) {
  writeKey(STORAGE_KEYS.history, JSON.stringify([item, ...getHistory()].slice(0, MAX_ITEMS)));
}
export function removeHistory(id: string) {
  writeKey(STORAGE_KEYS.history, JSON.stringify(getHistory().filter((h) => h.id !== id)));
}
export function clearHistory() {
  writeKey(STORAGE_KEYS.history, null);
}
