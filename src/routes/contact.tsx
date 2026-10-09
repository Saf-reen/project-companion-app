import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const T = "Contact — QRForge";
const D = "Get in touch with the QRForge team about QR codes, Pro plans or partnerships.";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast("Demo form — messages are not sent yet.");
  };
  return (
    <Container>
      <PageHeader title="Contact us" subtitle="Questions about QR codes or Pro? Email hello@example.com (placeholder) or use the form." />
      {sent ? (
        <p className="max-w-lg rounded-xl border bg-card p-6">Thanks! This demo form doesn't send messages yet — please email us directly.</p>
      ) : (
        <form onSubmit={submit} className="max-w-lg space-y-4 rounded-2xl border bg-card p-6">
          <div className="space-y-1.5"><Label htmlFor="n">Name</Label><Input id="n" required /></div>
          <div className="space-y-1.5"><Label htmlFor="e">Email</Label><Input id="e" type="email" required /></div>
          <div className="space-y-1.5"><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} required /></div>
          <Button type="submit">Send message</Button>
        </form>
      )}
    </Container>
  );
}
