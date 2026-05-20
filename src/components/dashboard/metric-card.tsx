import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  className,
}: {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("glass-panel overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-cyan-300" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-normal">{value}</div>
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
