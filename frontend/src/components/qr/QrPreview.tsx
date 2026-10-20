import { Download, FileCode, Lock, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUsage } from "@/hooks/use-app-state";
import { downloadDataUrl, downloadSvg, renderPngDataUrl, renderSvg } from "@/services/qrService";
import { getEntitlements } from "@/services/subscriptionService";
import type { QrOptions } from "@/types";

export function QrImage({ payload, options, className }: { payload: string; options: QrOptions; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    renderPngDataUrl(payload, options)
      .then((u) => alive && setSrc(u))
      .catch(() => alive && setSrc(null));
    return () => {
      alive = false;
    };
  }, [payload, options]);
  return src ? (
    <img src={src} alt="Generated QR code" className={className} />
  ) : (
    <div className={`animate-pulse bg-muted ${className ?? ""}`} />
  );
}

export function QrDownloads({ payload, options, name }: { payload: string; options: QrOptions; name: string }) {
  const { plan } = useUsage();
  const canSvg = getEntitlements(plan).svgDownload;
  const png = async () => {
    try {
      downloadDataUrl(await renderPngDataUrl(payload, options), `${name}.png`);
    } catch {
      toast.error("Could not export PNG.");
    }
  };
  const svg = async () => {
    if (!canSvg) {
      toast("SVG download is a Pro feature.");
      return;
    }
    downloadSvg(await renderSvg(payload, options), `${name}.svg`);
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={png}>
        <Download /> Download PNG
      </Button>
      <Button variant="outline" onClick={svg}>
        {canSvg ? <FileCode /> : <Lock />} SVG {canSvg ? "" : "(Pro)"}
      </Button>
    </div>
  );
}

export function QrEmpty() {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-xl border-2 border-dashed bg-muted/40 text-center text-muted-foreground">
      <div className="space-y-2 p-6">
        <QrCode className="mx-auto h-12 w-12 opacity-40" />
        <p className="text-sm">Fill in the details and press Generate to create your QR code.</p>
      </div>
    </div>
  );
}
