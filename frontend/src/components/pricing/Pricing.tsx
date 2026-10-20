import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMPARISON_ROWS, FREE_GENERATION_LIMIT, MOCK_PRICES, PRO_HIGHLIGHTS } from "@/config/config";
import { useUsage } from "@/hooks/use-app-state";
import { setDemoPlan } from "@/services/subscriptionService";

export function PlanCards() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const { plan } = useUsage();
  const price = cycle === "monthly" ? MOCK_PRICES.monthly : +(MOCK_PRICES.yearly / 12).toFixed(2);
  return (
    <div className="space-y-6">
      <div className="mx-auto flex w-fit rounded-full border bg-card p-1">
        {(["monthly", "yearly"] as const).map((c) => (
          <button key={c} onClick={() => setCycle(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${cycle === c ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {c}{c === "yearly" && " · save 28%"}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-xl font-bold">Free</h3>
          <p className="mt-1 text-sm text-muted-foreground">For quick, one-off codes.</p>
          <p className="mt-4 font-display text-4xl font-bold">$0</p>
          <p className="mt-2 text-sm font-semibold">{FREE_GENERATION_LIMIT} QR generations in total</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["URL, Text, Wi-Fi & WhatsApp", "PNG download", "Basic customization", "Static codes that never expire", "No sign-up"].map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-6 w-full"><Link to="/generate">Start free</Link></Button>
        </div>
        <div className="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-md">
          <Badge className="absolute -top-3 right-6 bg-pro text-pro-foreground hover:bg-pro">Most popular</Badge>
          <h3 className="text-xl font-bold">Pro</h3>
          <p className="mt-1 text-sm text-muted-foreground">For businesses and campaigns.</p>
          <p className="mt-4 font-display text-4xl font-bold">${price}<span className="text-base font-medium text-muted-foreground">/mo</span></p>
          <p className="mt-2 text-sm font-semibold">
            Unlimited QR generations{cycle === "yearly" && ` · billed $${MOCK_PRICES.yearly}/year`}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {PRO_HIGHLIGHTS.concat("SVG downloads", "QR history").map((f) => (
              <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            disabled={plan === "pro"}
            onClick={() => {
              setDemoPlan("pro");
              toast.success("Pro demo mode enabled", { description: "This is a demonstration — no payment was taken and no subscription was purchased." });
            }}
          >
            {plan === "pro" ? "Pro demo active" : "Try Pro (demo checkout)"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">Demo only — payments are not yet available.</p>
        </div>
      </div>
    </div>
  );
}

export function ComparisonTable() {
  const cell = (v: string | boolean) =>
    typeof v === "string" ? v : v ? <Check className="mx-auto h-4 w-4 text-primary" aria-label="Included" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground" aria-label="Not included" />;
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead className="text-center">Free</TableHead>
            <TableHead className="text-center">Pro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {COMPARISON_ROWS.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="font-medium">{r.label}</TableCell>
              <TableCell className="text-center">{cell(r.free)}</TableCell>
              <TableCell className="text-center">{cell(r.pro)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
