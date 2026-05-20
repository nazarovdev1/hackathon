"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
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

export function AttendanceCalendar({ subjects }: { subjects: SubjectData[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filteredLogs = subjects
    .filter((s) => selectedSubject === "all" || s.subject_id === selectedSubject)
    .flatMap((s) => s.logs.map((log) => ({ ...log, subject_name: s.subject_name, subject_id: s.subject_id })))
    .sort((a, b) => b.date.localeCompare(a.date));

  const allDates = Array.from(new Set(filteredLogs.map((log) => log.date))).sort((a, b) => b.localeCompare(a)).slice(0, 30);

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Davomat taqvimi</CardTitle>
            <CardDescription>Oxirgi 30 kunlik qatnashuv holati</CardDescription>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex h-9 rounded-md border border-border bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">Barcha fanlar</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {["Du", "Se", "Chor", "Pay", "Ju", "Shan", "Yak"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {allDates.map((date) => {
            const dayLogs = filteredLogs.filter((log) => log.date === date);
            const hasAbsent = dayLogs.some((log) => log.status === "absent");
            const hasPresent = dayLogs.some((log) => log.status === "attended" || log.status === "late");

            let bgColor = "bg-secondary/20";
            let borderColor = "border-border/20";
            if (hasAbsent && !hasPresent) {
              bgColor = "bg-rose-500/20";
              borderColor = "border-rose-500/30";
            } else if (hasPresent) {
              bgColor = "bg-emerald-500/20";
              borderColor = "border-emerald-500/30";
            }

            return (
              <div
                key={date}
                className={`aspect-square rounded-md border ${borderColor} ${bgColor} flex flex-col items-center justify-center text-xs cursor-default transition-all hover:scale-105`}
                title={dayLogs.map((l) => `${l.subject_name}: ${l.status}`).join(", ")}
              >
                <span className="font-medium">{new Date(date).getDate()}</span>
                {hasPresent && !hasAbsent && <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5" />}
                {hasAbsent && <XCircle className="h-3 w-3 text-rose-500 mt-0.5" />}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
            <span>Qatnashgan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-rose-500/20 border border-rose-500/30" />
            <span>Qatnashmagan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-secondary/20 border border-border/20" />
            <span>Dars yo'q</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
