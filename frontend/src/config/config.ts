import type { PlanId, QrOptions } from "@/types";

/** Central plan rules, mock prices, limits and feature flags. */
export const FREE_GENERATION_LIMIT = 5;

export const MOCK_PRICES = {
  monthly: 7.99,
  yearly: 69, // per year
  currency: "USD",
} as const;

export const FEATURE_FLAGS = {
  showAds: true,
  showDevReset: true,
  demoCheckout: true,
} as const;

export interface Entitlements {
  unlimitedGenerations: boolean;
  generationLimit: number | null;
  dynamicQr: boolean;
  editableDestinations: boolean;
  history: boolean;
  analytics: boolean;
  svgDownload: boolean;
  logoBranding: boolean;
  bulkGeneration: boolean;
  adFree: boolean;
}

export const PLAN_ENTITLEMENTS: Record<PlanId, Entitlements> = {
  free: {
    unlimitedGenerations: false,
    generationLimit: FREE_GENERATION_LIMIT,
    dynamicQr: false,
    editableDestinations: false,
    history: false,
    analytics: false,
    svgDownload: false,
    logoBranding: false,
    bulkGeneration: false,
    adFree: false,
  },
  pro: {
    unlimitedGenerations: true,
    generationLimit: null,
    dynamicQr: true,
    editableDestinations: true,
    history: true,
    analytics: true,
    svgDownload: true,
    logoBranding: true,
    bulkGeneration: true,
    adFree: true,
  },
};

export const COMPARISON_ROWS: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "QR generations", free: "5 total", pro: "Unlimited" },
  { label: "URL, Text, Wi-Fi, WhatsApp", free: true, pro: true },
  { label: "Static codes that never expire", free: true, pro: true },
  { label: "PNG download", free: true, pro: true },
  { label: "Colors, size, margin, error correction", free: true, pro: true },
  { label: "SVG download", free: false, pro: true },
  { label: "Dynamic QR codes", free: false, pro: true },
  { label: "Editable destination URLs", free: false, pro: true },
  { label: "QR history", free: false, pro: true },
  { label: "Scan analytics", free: false, pro: true },
  { label: "Logo upload & branding", free: false, pro: true },
  { label: "Bulk generation", free: false, pro: true },
  { label: "Ad-free", free: false, pro: true },
];

export const PRO_HIGHLIGHTS = [
  "Unlimited QR generations",
  "Dynamic QR codes",
  "QR analytics",
  "Editable destinations",
  "Custom branding",
  "Bulk generation",
  "No advertisements",
];

export const DEFAULT_QR_OPTIONS: QrOptions = {
  foreground: "#0f172a",
  background: "#ffffff",
  size: 512,
  margin: 4,
  errorCorrection: "M",
};

export const STORAGE_KEYS = {
  usage: "qrforge.usage.count",
  plan: "qrforge.demo.plan",
  history: "qrforge.history",
  authToken: "qrforge.auth.token",
} as const;
