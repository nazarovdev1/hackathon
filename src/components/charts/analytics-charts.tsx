"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrendPoint = { month: string; value?: number; gpa?: number; credits?: number };

export function AttendanceChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "rgba(8,13,28,0.92)", border: "1px solid rgba(255,255,255,0.12)" }} />
        <Area type="monotone" dataKey="value" stroke="var(--chart-1)" fill="url(#attendance)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AcademicChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "rgba(8,13,28,0.92)", border: "1px solid rgba(255,255,255,0.12)" }} />
        <Line type="monotone" dataKey="gpa" stroke="var(--chart-2)" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="credits" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function GrantDistributionChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="status" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "rgba(8,13,28,0.92)", border: "1px solid rgba(255,255,255,0.12)" }} />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
