import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Container, PageHeader, ProLocked } from "@/components/layout/Page";
import { QrDownloads, QrImage } from "@/components/qr/QrPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHistory, useUsage } from "@/hooks/use-app-state";
import { clearHistory, removeHistory } from "@/services/historyService";
import type { GeneratedQr } from "@/types";

const T = "QR History — QRForge Pro";
const D = "Review, preview and re-download the QR codes you've created with QRForge Pro.";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { plan } = useUsage();
  const items = useHistory();
  const [open, setOpen] = useState<GeneratedQr | null>(null);
  return (
    <Container>
      <PageHeader title="QR history" subtitle="History is stored only in this browser and is not synced across devices." badge={<Badge variant="secondary">Pro</Badge>} />
      {plan === "free" ? (
        <ProLocked feature="QR history" description="Keep every code you create, preview it again and re-download any time. Available with Pro." />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No codes yet. <Link to="/generate" className="font-medium text-primary underline">Create your first one</Link>.
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearHistory}>Clear history</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((h) => (
              <div key={h.id} className="flex gap-4 rounded-xl border bg-card p-4">
                <button onClick={() => setOpen(h)} aria-label="Preview">
                  <QrImage payload={h.payload} options={{ ...h.options, size: 160 }} className="h-20 w-20 rounded border" />
                </button>
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="uppercase">{h.type}</Badge>
                  <p className="mt-1 truncate text-sm font-medium">{h.label}</p>
                  <p className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString()}</p>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setOpen(h)}>Open</Button>
                    <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => removeHistory(h.id)}><Trash2 /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="truncate">{open?.label}</DialogTitle></DialogHeader>
          {open && (
            <div className="space-y-4">
              <QrImage payload={open.payload} options={open.options} className="mx-auto aspect-square w-full max-w-xs rounded border" />
              <QrDownloads payload={open.payload} options={open.options} name={`qr-${open.type}`} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
