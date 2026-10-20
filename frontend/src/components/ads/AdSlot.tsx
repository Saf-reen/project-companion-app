import { FEATURE_FLAGS } from "@/config/config";
import { useUsage } from "@/hooks/use-app-state";
import { cn } from "@/lib/utils";

/**
 * Placeholder for a future Google AdSense unit. No ad scripts are loaded.
 * Keep placements away from inputs, Generate/Download buttons and navigation.
 */
export function AdSlot({ slot, className }: { slot: string; className?: string }) {
  const { plan } = useUsage();
  if (!FEATURE_FLAGS.showAds || plan === "pro") return null;
  return (
    <aside
      aria-label="Advertisement placeholder"
      data-ad-slot={slot}
      className={cn(
        "flex min-h-24 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/60 p-4 text-center",
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Advertisement</span>
      <span className="text-xs text-muted-foreground">Ad placeholder · {slot}</span>
    </aside>
  );
}
