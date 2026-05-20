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
    <Card className={cn(
      "glass-panel overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)]", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-secondary/30 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{helper}</p>
      </CardContent>
    </Card>
  );
}
