import { AlertCircle, Link2, MessageCircle, Type, Wifi } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { recordGenerationServer } from "@/lib/account.functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_QR_OPTIONS } from "@/config/config";
import { useUsage } from "@/hooks/use-app-state";
import { addHistory } from "@/services/historyService";
import { buildPayload, makeId, renderPngDataUrl, scanWarning } from "@/services/qrService";
import { canGenerate, recordGeneration } from "@/services/usageService";
import { getEntitlements } from "@/services/subscriptionService";
import type { ErrorCorrection, GeneratedQr, QrFields, QrOptions, QrType, WifiSecurity } from "@/types";
import { QrDownloads, QrEmpty, QrImage } from "./QrPreview";
import { UpgradePrompt } from "./UpgradePrompt";
import { UsageMeter } from "./UsageMeter";

const TYPES: { id: QrType; label: string; icon: typeof Link2 }[] = [
  { id: "url", label: "URL", icon: Link2 },
  { id: "text", label: "Text", icon: Type },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const EMPTY: QrFields = { url: "", text: "", ssid: "", password: "", security: "WPA", hidden: false, phone: "", message: "" };

export function QrGenerator() {
  const { count, plan, signedIn } = useUsage();
  const qc = useQueryClient();
  const recordRemote = useServerFn(recordGenerationServer);
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<QrFields>(EMPTY);
  const [options, setOptions] = useState<QrOptions>(DEFAULT_QR_OPTIONS);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<GeneratedQr | null>(null);
  const [session, setSession] = useState<GeneratedQr[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);

  const limitReached = !canGenerate(count, plan);
  const set = <K extends keyof QrFields>(k: K, v: QrFields[K]) => {
    setFields((f) => ({ ...f, [k]: v }));
    setError(null);
  };
  const opt = <K extends keyof QrOptions>(k: K, v: QrOptions[K]) => setOptions((o) => ({ ...o, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = buildPayload(type, fields);
    if (!result.ok) return setError(result.error);
    if (!canGenerate(count, plan)) return setBlocked(true);
    setBusy(true);
    try {
      await renderPngDataUrl(result.payload, options); // ensure it actually encodes
    } catch {
      setBusy(false);
      return setError("This content is too long to fit in a QR code. Try shortening it.");
    }
    if (signedIn) {
      try {
        const r = await recordRemote({ data: { kind: type, content: result.payload, label: result.label } });
        await qc.invalidateQueries({ queryKey: ["account"] });
        if (!r.ok) { setBusy(false); return setBlocked(true); }
      } catch (err) {
        setBusy(false);
        return setError(err instanceof Error ? err.message : "Could not save. Try again.");
      }
    } else {
      recordGeneration();
    }
    const item: GeneratedQr = {
      id: makeId(),
      type,
      payload: result.payload,
      label: result.label,
      createdAt: new Date().toISOString(),
      options,
    };
    if (getEntitlements(plan).history) addHistory(item);
    setCurrent(item);
    setSession((s) => [item, ...s].slice(0, 6));
    setBusy(false);
    toast.success("QR code generated");
  }

  const warning = scanWarning(options);
  const shown = current ? { ...current, options } : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6" noValidate>
        <Tabs value={type} onValueChange={(v) => { setType(v as QrType); setError(null); }}>
          <TabsList className="grid h-auto w-full grid-cols-4">
            {TYPES.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5 py-2">
                <t.icon className="h-4 w-4" /> <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden text-xs">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {type === "url" && (
            <Field id="url" label="Website URL">
              <Input id="url" inputMode="url" placeholder="example.com" value={fields.url} onChange={(e) => set("url", e.target.value)} />
            </Field>
          )}
          {type === "text" && (
            <Field id="text" label="Text">
              <Textarea id="text" rows={4} placeholder="Any text, notes or a short message…" value={fields.text} onChange={(e) => set("text", e.target.value)} />
            </Field>
          )}
          {type === "wifi" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="ssid" label="Network name (SSID)">
                <Input id="ssid" value={fields.ssid} onChange={(e) => set("ssid", e.target.value)} />
              </Field>
              <Field id="sec" label="Security">
                <Select value={fields.security} onValueChange={(v) => set("security", v as WifiSecurity)}>
                  <SelectTrigger id="sec"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No password</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {fields.security !== "nopass" && (
                <Field id="pw" label="Password">
                  <Input id="pw" type="text" autoComplete="off" value={fields.password} onChange={(e) => set("password", e.target.value)} />
                </Field>
              )}
              <div className="flex items-center gap-3 self-end pb-2">
                <Switch id="hidden" checked={fields.hidden} onCheckedChange={(v) => set("hidden", v)} />
                <Label htmlFor="hidden">Hidden network</Label>
              </div>
            </div>
          )}
          {type === "whatsapp" && (
            <>
              <Field id="phone" label="Phone number with country code">
                <Input id="phone" inputMode="tel" placeholder="+1 555 123 4567" value={fields.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field id="msg" label="Prefilled message (optional)">
                <Textarea id="msg" rows={3} value={fields.message} onChange={(e) => set("message", e.target.value)} />
              </Field>
            </>
          )}
          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
        </div>

        <details className="group rounded-lg border p-4" open>
          <summary className="cursor-pointer text-sm font-semibold">Customize</summary>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <ColorField id="fg" label="Foreground" value={options.foreground} onChange={(v) => opt("foreground", v)} />
            <ColorField id="bg" label="Background" value={options.background} onChange={(v) => opt("background", v)} />
            <div className="space-y-2">
              <Label>Size: {options.size}px</Label>
              <Slider min={128} max={1024} step={32} value={[options.size]} onValueChange={([v]) => opt("size", v ?? 512)} />
            </div>
            <div className="space-y-2">
              <Label>Margin: {options.margin} modules</Label>
              <Slider min={0} max={10} step={1} value={[options.margin]} onValueChange={([v]) => opt("margin", v ?? 4)} />
            </div>
            <Field id="ecl" label="Error correction">
              <Select value={options.errorCorrection} onValueChange={(v) => opt("errorCorrection", v as ErrorCorrection)}>
                <SelectTrigger id="ecl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOptions(DEFAULT_QR_OPTIONS)}>Reset style</Button>
            </div>
          </div>
          {warning && <p className="mt-3 text-sm text-destructive">{warning}</p>}
        </details>

        <UsageMeter />
        {(blocked || limitReached) && plan === "free" ? (
          <UpgradePrompt />
        ) : (
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Generating…" : "Generate QR Code"}
          </Button>
        )}
      </form>

      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Live preview</h3>
          {shown ? (
            <div className="space-y-4">
              <QrImage payload={shown.payload} options={options} className="aspect-square w-full rounded-lg border" />
              <p className="truncate text-xs text-muted-foreground" title={shown.payload}>Encodes: {shown.payload}</p>
              <QrDownloads payload={shown.payload} options={options} name={`qr-${shown.type}`} />
            </div>
          ) : (
            <QrEmpty />
          )}
        </div>
        {session.length > 1 && (
          <div className="rounded-2xl border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">This session</h3>
            <ul className="space-y-2">
              {session.map((s) => (
                <li key={s.id}>
                  <button className="flex w-full items-center gap-3 rounded-md p-1.5 text-left text-sm hover:bg-secondary" onClick={() => setCurrent(s)}>
                    <QrImage payload={s.payload} options={{ ...s.options, size: 96 }} className="h-10 w-10 rounded" />
                    <span className="truncate">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border bg-transparent" />
        <Input value={value} onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && e.target.value.length === 7 ? onChange(e.target.value) : undefined} aria-label={`${label} hex`} />
      </div>
    </div>
  );
}
