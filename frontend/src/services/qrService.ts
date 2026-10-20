import QRCode from "qrcode";
import type { PayloadResult, QrFields, QrOptions, QrType } from "@/types";

const BLOCKED_SCHEME = /^(javascript|data|vbscript|file|mailto|tel|sms|ftp):/i;

export function normalizeUrl(input: string): PayloadResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Please enter a URL." };
  if (/\s/.test(raw)) return { ok: false, error: "URLs cannot contain spaces." };
  if (BLOCKED_SCHEME.test(raw)) return { ok: false, error: "Only http and https links are supported." };
  let candidate = raw;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) candidate = `https://${raw}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    return { ok: false, error: "Only http and https links are supported." };
  const host = url.hostname;
  if (host !== "localhost" && !/^[^.]+(\.[^.]+)+$/.test(host))
    return { ok: false, error: "Please enter a full domain, like example.com." };
  if (!/^[a-z0-9.-]+$/i.test(host) && !host.startsWith("xn--"))
    return { ok: false, error: "The domain contains invalid characters." };
  return { ok: true, payload: url.toString(), label: url.toString() };
}

/** Escape \ ; , : " per the Wi-Fi QR (MECARD-like) format. */
export function escapeWifi(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function buildPayload(type: QrType, f: QrFields): PayloadResult {
  switch (type) {
    case "url":
      return normalizeUrl(f.url);
    case "text": {
      if (!f.text.trim()) return { ok: false, error: "Please enter some text." };
      if (f.text.length > 2000) return { ok: false, error: "Text is too long (max 2000 characters)." };
      return { ok: true, payload: f.text, label: f.text.slice(0, 60) };
    }
    case "wifi": {
      if (!f.ssid.trim()) return { ok: false, error: "Please enter the network name (SSID)." };
      if (f.security !== "nopass" && !f.password)
        return { ok: false, error: "Please enter the Wi-Fi password, or choose 'No password'." };
      if (f.security === "WPA" && f.password.length < 8)
        return { ok: false, error: "WPA passwords must be at least 8 characters." };
      let p = `WIFI:T:${f.security};S:${escapeWifi(f.ssid)};`;
      if (f.security !== "nopass") p += `P:${escapeWifi(f.password)};`;
      if (f.hidden) p += "H:true;";
      p += ";";
      return { ok: true, payload: p, label: `Wi-Fi: ${f.ssid}` };
    }
    case "whatsapp": {
      const digits = f.phone.replace(/[\s()+.-]/g, "");
      if (!digits) return { ok: false, error: "Please enter a phone number with country code." };
      if (!/^\d{8,15}$/.test(digits))
        return { ok: false, error: "Use 8–15 digits including country code, e.g. +1 555 123 4567." };
      const msg = f.message.trim();
      const payload = `https://wa.me/${digits}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
      return { ok: true, payload, label: `WhatsApp: +${digits}` };
    }
  }
}

function qrOpts(o: QrOptions) {
  return {
    width: o.size,
    margin: o.margin,
    errorCorrectionLevel: o.errorCorrection,
    color: { dark: o.foreground, light: o.background },
  };
}

export function renderPngDataUrl(payload: string, o: QrOptions) {
  return QRCode.toDataURL(payload, qrOpts(o));
}
export function renderSvg(payload: string, o: QrOptions) {
  return QRCode.toString(payload, { ...qrOpts(o), type: "svg" });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
export function downloadSvg(svg: string, filename: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function luminance(hex: string) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}
/** Scanners expect a dark module on a lighter background with decent contrast. */
export function scanWarning(o: QrOptions): string | null {
  if (contrastRatio(o.foreground, o.background) < 3) return "Low contrast — this code may not scan reliably.";
  if (luminance(o.foreground) > luminance(o.background))
    return "Inverted colors (light on dark) are not supported by every scanner.";
  if (o.margin < 2) return "A margin of at least 2 keeps a quiet zone for reliable scanning.";
  return null;
}

export function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}
