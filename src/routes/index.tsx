import { createFileRoute, Link } from "@tanstack/react-router";
import { Infinity as InfinityIcon, Lock, Palette, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { ComparisonTable } from "@/components/pricing/Pricing";
import { QrGenerator } from "@/components/qr/QrGenerator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const TITLE = "QRForge — Free QR Code Generator, No Sign-up";
const DESC = "Create scannable URL, text, Wi-Fi and WhatsApp QR codes in seconds. Five free static codes that never expire.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: Zap, title: "Instant & private", text: "Codes are generated in your browser. Nothing you type is uploaded." },
  { icon: InfinityIcon, title: "Never expire", text: "Static codes encode your content directly — no redirects that can break." },
  { icon: Palette, title: "Make it yours", text: "Pick colors, size, margin and error correction with a live preview." },
  { icon: Smartphone, title: "Scans everywhere", text: "Standard formats for Wi-Fi joining and WhatsApp chats on iOS and Android." },
];

const FAQ = [
  ["Do free QR codes expire?", "No. Free codes are static: your link or text is encoded directly into the image, so they keep working forever — even after you reach the free limit."],
  ["How many codes can I make for free?", "Five QR generations in total per browser. Changing colors, previewing and downloading don't count."],
  ["Do I need an account?", "No registration is required to generate and download codes."],
  ["What does Pro add?", "Unlimited generations, dynamic codes with editable destinations, history, scan analytics, SVG export, branding and bulk creation. Pro is currently a demo."],
  ["Is the free limit enforced on a server?", "Not yet. The counter is stored in your browser, so clearing site data resets it. Server-side enforcement will come with accounts."],
];

function HomePage() {
  return (
    <main>
      <section className="border-b bg-surface">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
          <div className="mb-8 max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> No sign-up · Static codes never expire
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">QR codes that just work. Made in seconds.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Turn links, text, Wi-Fi details or a WhatsApp chat into a scannable code. Your first five are free.
            </p>
          </div>
          <QrGenerator />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot slot="home-below-generator" className="my-10" />

        <section className="py-10">
          <h2 className="text-3xl font-bold">Why QRForge</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-5">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Free vs Pro</h2>
              <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
            </div>
            <Button asChild variant="outline"><Link to="/pricing"><Lock /> See Pro pricing</Link></Button>
          </div>
          <ComparisonTable />
        </section>

        <section className="grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-4">
              {FAQ.map(([q, a]) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <AdSlot slot="home-faq-sidebar" className="min-h-64" />
        </section>
      </div>
    </main>
  );
}
