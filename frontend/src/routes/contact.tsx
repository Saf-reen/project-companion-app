import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const T = "Contact — QRForge";
const D = "Get in touch with the QRForge team about QR codes, Pro plans or partnerships.";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const r = await api.submitContact(String(f.get("name")), String(f.get("email")), String(f.get("message")));
      if (!r.ok) { toast.error("Could not send. Please try again."); return; }
      setSent(true);
      return;
    } catch {
      toast.error("Please check your details and try again.");
    }
  };
  return (
    <Container>
      <PageHeader title="Contact us" subtitle="Questions about QR codes or Pro? Email hello@example.com (placeholder) or use the form." />
      {sent ? (
        <p className="max-w-lg rounded-xl border bg-card p-6">Thanks! Your message was received — we'll get back to you soon.</p>
      ) : (
        <form onSubmit={submit} className="max-w-lg space-y-4 rounded-2xl border bg-card p-6">
          <div className="space-y-1.5"><Label htmlFor="n">Name</Label><Input id="n" name="name" maxLength={100} required /></div>
          <div className="space-y-1.5"><Label htmlFor="e">Email</Label><Input id="e" name="email" type="email" maxLength={255} required /></div>
          <div className="space-y-1.5"><Label htmlFor="m">Message</Label><Textarea id="m" name="message" rows={5} maxLength={2000} required /></div>
          <Button type="submit">Send message</Button>
        </form>
      )}
    </Container>
  );
}
