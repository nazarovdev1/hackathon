"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrendPoint = { month: string; value?: number; gpa?: number; credits?: number };

export function AttendanceChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.4} vertical={false} />
        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} domain={[50, 100]} />
        <Tooltip 
          contentStyle={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--foreground)",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }} 
          formatter={(value: any) => [`${value}%`, "Davomat"]}
        />
        <Area type="monotone" name="Davomat" dataKey="value" stroke="var(--chart-1)" fill="url(#attendance)" strokeWidth={2.5} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AcademicChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: -5, left: -15, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.4} vertical={false} />
        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
        <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
        <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--foreground)",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }} 
          formatter={(value: any, name?: any) => [value, name === "gpa" ? "O'zlashtirish (GPA)" : "Kreditlar"]}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)" }} />
        <Line yAxisId="left" type="monotone" name="gpa" dataKey="gpa" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
        <Line yAxisId="right" type="monotone" name="credits" dataKey="credits" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function GrantDistributionChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.4} vertical={false} />
        <XAxis dataKey="status" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--foreground)",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
          formatter={(value: any) => [value, "Talabalar soni"]}
        />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
