import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/layout/Page";
import { UsageMeter } from "@/components/qr/UsageMeter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEATURE_FLAGS } from "@/config/config";
import { useUsage } from "@/hooks/use-app-state";
import { getDemoAccount } from "@/services/accountService";
import { setDemoPlan } from "@/services/subscriptionService";
import { resetUsage } from "@/services/usageService";

const T = "Your Account — QRForge";
const D = "View your QRForge plan, remaining free generations and switch between Free and Pro demo modes.";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: AccountPage,
});

function AccountPage() {
  const { plan } = useUsage();
  const acc = getDemoAccount();
  return (
    <Container>
      <PageHeader title="Account" subtitle="This is a demo account — no registration or password is needed." />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-bold">Profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Name" v={acc.name} />
            <Row k="Email" v={acc.email} />
            <Row k="Member since" v={acc.memberSince} />
          </dl>
        </section>
        <section className="space-y-4 rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-bold">Plan</h2>
          <dl className="space-y-2 text-sm">
            <Row k="Current plan" v={plan === "pro" ? <Badge className="bg-pro text-pro-foreground hover:bg-pro">Pro (demo)</Badge> : <Badge variant="secondary">Free</Badge>} />
            <Row k="Subscription status" v={plan === "pro" ? "Simulated — no billing" : "No subscription"} />
          </dl>
          <UsageMeter />
          {plan === "free" && <Button asChild className="w-full"><Link to="/pricing">Upgrade to Pro</Link></Button>}
        </section>
        <section className="rounded-2xl border bg-card p-6 md:col-span-2">
          <h2 className="text-lg font-bold">Demo mode controls</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch experiences for testing. Limits are stored in this browser only and can be bypassed by clearing site data or switching browsers.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant={plan === "free" ? "default" : "outline"} onClick={() => { setDemoPlan("free"); toast("Switched to Free"); }}>Use Free plan</Button>
            <Button variant={plan === "pro" ? "default" : "outline"} onClick={() => { setDemoPlan("pro"); toast("Pro demo enabled — no payment taken"); }}>Use Pro demo</Button>
            {FEATURE_FLAGS.showDevReset && (
              <Button variant="ghost" onClick={() => { resetUsage(); toast("Free counter reset"); }}>Reset free counter (dev)</Button>
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
