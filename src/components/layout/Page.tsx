import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: ReactNode }) {
  return (
    <div className="mb-8 space-y-2">
      {badge}
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>;
}

export function ProLocked({ feature, description }: { feature: string; description: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
        <Lock className="h-5 w-5 text-primary" />
      </span>
      <h2 className="mt-4 text-xl font-bold">{feature} is a Pro feature</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild><Link to="/pricing">View Pro plans</Link></Button>
        <Button asChild variant="outline"><Link to="/account">Try Pro demo</Link></Button>
      </div>
    </div>
  );
}

export function LegalDraftNotice() {
  return (
    <p className="mb-6 rounded-md border border-pro bg-pro/10 px-3 py-2 text-sm">
      Draft content — must be reviewed by a qualified professional before production publication.
    </p>
  );
}
