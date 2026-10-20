export type PlanId = "free" | "pro";
export type QrType = "url" | "text" | "wifi" | "whatsapp";
export type ErrorCorrection = "L" | "M" | "Q" | "H";
export type WifiSecurity = "WPA" | "WEP" | "nopass";

export interface QrOptions {
  foreground: string;
  background: string;
  size: number;
  margin: number;
  errorCorrection: ErrorCorrection;
}

export interface QrFields {
  url: string;
  text: string;
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
  phone: string;
  message: string;
}

export type PayloadResult = { ok: true; payload: string; label: string } | { ok: false; error: string };

export interface GeneratedQr {
  id: string;
  type: QrType;
  payload: string;
  label: string;
  createdAt: string;
  options: QrOptions;
}

export interface DemoAccount {
  name: string;
  email: string;
  memberSince: string;
}
