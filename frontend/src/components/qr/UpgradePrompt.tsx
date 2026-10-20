import { Link } from "@tanstack/react-router";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_GENERATION_LIMIT, PRO_HIGHLIGHTS } from "@/config/config";

export function UpgradePrompt() {
  return (
    <div role="alert" className="rounded-xl border-2 border-pro bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-pro-foreground">
        <Sparkles className="h-4 w-4" /> Free limit reached
      </div>
      <h3 className="mt-2 text-xl font-bold">You've created {FREE_GENERATION_LIMIT} free QR codes.</h3>
      <p className="text-muted-foreground">Keep creating with QR Pro.</p>
      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {PRO_HIGHLIGHTS.map((h) => (
          <li key={h} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" /> {h}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild className="bg-pro text-pro-foreground hover:bg-pro/90">
          <Link to="/pricing">Upgrade to Pro</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/pricing">View Pricing</Link>
        </Button>
      </div>
      <p className="mt-4 flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-semibold">
        <ShieldCheck className="h-4 w-4 text-primary" /> Your existing QR codes remain active and never expire.
      </p>
    </div>
  );
}
