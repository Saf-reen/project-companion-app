import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const T = "Sign in — QRForge";
const D = "Sign in or create a free QRForge account to save your QR codes.";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/home` } });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) { toast.success("Check your email to confirm your account."); return; }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
    }
    nav({ to: "/home" });
    return;
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { toast.error("Google sign-in failed"); return; }
    if (r.redirected) return;
    nav({ to: "/home" });
    return;
  }

  return (
    <Container>
      <PageHeader title={mode === "in" ? "Sign in" : "Create your account"} subtitle="Your free codes and history are saved to your account." />
      <div className="max-w-sm space-y-4 rounded-2xl border bg-card p-6">
        <Button variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5"><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Sign up"}</Button>
        </form>
        <button className="text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </Container>
  );
}
