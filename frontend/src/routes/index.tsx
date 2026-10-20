import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Infinity as InfinityIcon, Palette, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PRICES, FREE_GENERATION_LIMIT } from "@/config/config";

const TITLE = "QRForge — QR Codes That Never Expire";
const DESC = "Make scannable QR codes for links, Wi-Fi, text and WhatsApp in seconds. Free to start, no sign-up needed.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const BENEFITS = [
  { icon: Zap, title: "Ready in seconds", text: "Paste a link, pick a style, download." },
  { icon: InfinityIcon, title: "Never expire", text: "Free codes hold your content directly." },
  { icon: Palette, title: "Your colors", text: "Match your brand with a live preview." },
  { icon: ShieldCheck, title: "Private", text: "No tracking redirects on free codes." },
];

const STEPS = ["Choose a type — link, text, Wi-Fi or WhatsApp", "Fill it in and customize the look", "Download and print or share"];

function MockQr() {
  // Decorative pattern, deterministic so server and browser match.
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 37) % 7 < 3 || i % 11 === 0 ? 1 : 0));
  return (
    <div className="grid aspect-square w-full max-w-xs grid-cols-11 gap-1 rounded-3xl border bg-card p-6 shadow-xl">
      {cells.map((c, i) => <span key={i} className={c ? "rounded-sm bg-foreground" : ""} />)}
    </div>
  );
}

function LandingPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Free QR code maker</p>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">QR codes that just work. Forever.</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Create {FREE_GENERATION_LIMIT} free codes with no sign-up. Links, Wi-Fi, text and WhatsApp — scannable on every phone.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/home">Start creating <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/pricing">See pricing</Link></Button>
          </div>
        </div>
        <div className="flex justify-center"><MockQr /></div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="space-y-2">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s} className="rounded-2xl border bg-card p-6">
              <span className="font-display text-4xl font-bold text-primary">{i + 1}</span>
              <p className="mt-3 font-medium">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Need more? Go Pro.</h2>
            <p className="mt-2 opacity-90">Unlimited codes, history and scan analytics from ${MOCK_PRICES.monthly}/month.</p>
          </div>
          <Button asChild size="lg" variant="secondary"><Link to="/home">Try it free</Link></Button>
        </div>
      </section>
    </div>
  );
}
