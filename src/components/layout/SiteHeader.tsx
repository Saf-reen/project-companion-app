import { Link } from "@tanstack/react-router";
import { Menu, QrCode, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useUsage } from "@/hooks/use-app-state";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/generate", label: "Generator" },
  { to: "/pricing", label: "Pricing" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/account", label: "Account" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <QrCode className="h-5 w-5" />
      </span>
      QRForge
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { plan } = useUsage();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo />
          {plan === "pro" && <Badge className="bg-pro text-pro-foreground hover:bg-pro">Pro demo</Badge>}
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium"
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
