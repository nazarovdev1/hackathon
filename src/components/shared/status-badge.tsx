import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tone = {
  ELIGIBLE: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  RISK: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  DENIED: "border-rose-400/40 bg-rose-400/10 text-rose-100",
  LOW: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  MEDIUM: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  HIGH: "border-rose-400/40 bg-rose-400/10 text-rose-100",
} as const;

export function StatusBadge({ value }: { value: keyof typeof tone }) {
  return <Badge className={cn("border font-medium", tone[value])}>{value}</Badge>;
}
