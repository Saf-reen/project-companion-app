import { STORAGE_KEYS } from "@/config/config";
import { readKey, writeKey } from "@/lib/storage";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

export function getToken(): string | null {
  return readKey(STORAGE_KEYS.authToken);
}

export function setToken(token: string) {
  writeKey(STORAGE_KEYS.authToken, token);
}

export function clearToken() {
  writeKey(STORAGE_KEYS.authToken, null);
}

/** Decodes the user id from a locally-stored JWT without verifying it (verification happens server-side). */
export function decodeUserId(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((body && typeof body.error === "string" && body.error) || "Request failed");
  }
  return body as T;
}

export interface Account {
  email: string;
  plan: "free" | "pro";
  count: number;
  memberSince: string;
}

export interface GenerationResult {
  ok: boolean;
  count: number;
  plan: string;
}

export interface SavedCode {
  id: string;
  kind: string;
  content: string;
  label: string | null;
  createdAt: string;
}

export const api = {
  async signup(email: string, password: string) {
    return request<{ token: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string) {
    return request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getAccount() {
    return request<Account>("/api/account");
  },

  async recordGeneration(kind: string, content: string, label: string) {
    return request<GenerationResult>("/api/generate", {
      method: "POST",
      body: JSON.stringify({ kind, content, label }),
    });
  },

  async listCodes() {
    return request<SavedCode[]>("/api/codes");
  },

  async deleteCode(id: string) {
    return request<{ ok: true }>(`/api/codes/${id}`, { method: "DELETE" });
  },

  async submitContact(name: string, email: string, message: string) {
    return request<{ ok: true }>("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    });
  },
};
