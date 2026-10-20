import { describe, expect, it, beforeEach } from "vitest";
import { canGenerate, getUsageCount, recordGeneration, resetUsage } from "@/services/usageService";
import { buildPayload, normalizeUrl } from "@/services/qrService";
import type { QrFields } from "@/types";

const base: QrFields = { url: "", text: "", ssid: "", password: "", security: "WPA", hidden: false, phone: "", message: "" };

describe("free generation limit", () => {
  beforeEach(() => resetUsage());
  it("allows generations 1 through 5 on Free", () => {
    for (let i = 0; i < 5; i++) {
      expect(canGenerate(getUsageCount(), "free")).toBe(true);
      recordGeneration();
    }
    expect(getUsageCount()).toBe(5);
  });
  it("blocks the sixth generation on Free", () => {
    expect(canGenerate(5, "free")).toBe(false);
  });
  it("never blocks Pro", () => {
    expect(canGenerate(500, "pro")).toBe(true);
  });
});

describe("payloads", () => {
  it("normalizes bare domains to https", () => {
    expect(normalizeUrl("example.com")).toMatchObject({ ok: true, payload: "https://example.com/" });
  });
  it("rejects unsupported schemes", () => {
    expect(normalizeUrl("javascript:alert(1)").ok).toBe(false);
  });
  it("escapes Wi-Fi special characters", () => {
    const r = buildPayload("wifi", { ...base, ssid: "My;Net", password: 'pa:ss,w"d\\x' });
    expect(r).toMatchObject({ ok: true, payload: 'WIFI:T:WPA;S:My\\;Net;P:pa\\:ss\\,w\\"d\\\\x;;' });
  });
  it("builds WhatsApp links with encoded message", () => {
    const r = buildPayload("whatsapp", { ...base, phone: "+1 555 123 4567", message: "Hi & bye" });
    expect(r).toMatchObject({ ok: true, payload: "https://wa.me/15551234567?text=Hi%20%26%20bye" });
  });
});
