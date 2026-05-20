import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MentorDashboardPage() {
  return (
    <DashboardShell title="Mentor Dashboard" eyebrow="Intervention Center">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Mentor Queue</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          High-risk students, feedback workflows and recovery plans are ready for mentor-level expansion.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
