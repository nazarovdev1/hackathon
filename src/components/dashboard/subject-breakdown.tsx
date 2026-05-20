"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

type AttendanceLog = {
  date: string;
  time: string | null;
  status: string;
  reason: string | null;
};

type SubjectData = {
  subject_id: string;
  subject_name: string;
  teacher: string;
  subject_summary: {
    total: number;
    attended: number;
    absent: number;
    percentage: number;
  };
  logs: AttendanceLog[];
};

export function SubjectBreakdown({ subjects }: { subjects: SubjectData[] }) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Fanlar bo'yicha davomat</CardTitle>
        <CardDescription>Har bir fan uchun qatnashuv statistikasi va batafsil ma'lumotlar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => {
          const isExpanded = expandedSubject === subject.subject_id;
          const percentage = subject.subject_summary.percentage;

          return (
            <div
              key={subject.subject_id}
              className="rounded-lg border border-border/40 bg-secondary/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : subject.subject_id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{subject.subject_name}</p>
                    <p className="text-xs text-muted-foreground">{subject.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold ${getPercentageColor(percentage)}`}>{percentage}%</p>
                    <p className="text-xs text-muted-foreground">
                      {subject.subject_summary.attended}/{subject.subject_summary.total}
                    </p>
                  </div>
                  <div className="w-16 hidden sm:block">
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/40 p-4 space-y-2 bg-secondary/20">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{subject.subject_summary.attended} qatnashgan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-rose-500" />
                      <span>{subject.subject_summary.absent} qatnashmagan</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {subject.logs.slice(0, 10).map((log, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-background/40 p-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {log.status === "attended" || log.status === "late" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          )}
                          <div>
                            <p className="font-medium">{log.date}</p>
                            {log.time && <p className="text-xs text-muted-foreground">Soat {log.time}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.reason && (
                            <Badge variant="outline" className="text-xs max-w-[150px] truncate">
                              {log.reason}
                            </Badge>
                          )}
                          <Badge
                            className={`text-xs ${
                              log.status === "attended"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : log.status === "late"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {log.status === "attended" ? "Qatnashgan" : log.status === "late" ? "Kechikkan" : "Qatnashmagan"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  {subject.logs.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      ... va yana {subject.logs.length - 10} ta yozuv
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
