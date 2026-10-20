import { Infinity as InfinityIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FREE_GENERATION_LIMIT } from "@/config/config";
import { useUsage } from "@/hooks/use-app-state";

export function UsageMeter() {
  const { count, plan } = useUsage();
  if (plan === "pro")
    return (
      <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
        <InfinityIcon className="h-4 w-4 text-primary" /> Pro demo — unlimited generations ({count} created)
      </div>
    );
  const used = Math.min(count, FREE_GENERATION_LIMIT);
  return (
    <div className="space-y-1.5 rounded-lg bg-secondary px-3 py-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">
          {used} of {FREE_GENERATION_LIMIT} free QR codes used
        </span>
        <span className="text-muted-foreground">{FREE_GENERATION_LIMIT - used} left</span>
      </div>
      <Progress value={(used / FREE_GENERATION_LIMIT) * 100} className="h-1.5" />
    </div>
  );
}
