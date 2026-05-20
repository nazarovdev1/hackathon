import type { GrantKpiInput } from "@/types/grant";

export type StudentAnalytics = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  group: string;
  kpi: GrantKpiInput;
  attendanceTrend: { month: string; value: number }[];
  academicTrend: { month: string; gpa: number; credits: number }[];
  penalties: { date: string; reason: string; score: number }[];
  achievements: { title: string; score: number; category: string }[];
  recoveryStatus: number;
};

export const students: StudentAnalytics[] = [
  {
    id: "stu_001",
    name: "Madina Karimova",
    email: "madina.k@edumetric.uz",
    faculty: "Computer Science",
    group: "CS-21A",
    kpi: {
      academic: 34,
      attendance: 17,
      assignment: 15,
      activity: 9,
      tutor: 8,
      discipline: 8,
      penalty: 3,
      recovery: 4,
      employmentBonus: 2,
      academicPercent: 91,
    },
    attendanceTrend: [
      { month: "Jan", value: 94 },
      { month: "Feb", value: 92 },
      { month: "Mar", value: 90 },
      { month: "Apr", value: 93 },
      { month: "May", value: 95 },
    ],
    academicTrend: [
      { month: "Jan", gpa: 86, credits: 18 },
      { month: "Feb", gpa: 88, credits: 21 },
      { month: "Mar", gpa: 91, credits: 24 },
      { month: "Apr", gpa: 90, credits: 25 },
      { month: "May", gpa: 92, credits: 27 },
    ],
    penalties: [{ date: "2026-04-11", reason: "Late lab submission", score: 3 }],
    achievements: [
      { title: "AI Hackathon finalist", score: 5, category: "Innovation" },
      { title: "Research assistant", score: 4, category: "Academic" },
    ],
    recoveryStatus: 68,
  },
  {
    id: "stu_002",
    name: "Azizbek Rahmonov",
    email: "azizbek.r@edumetric.uz",
    faculty: "Economics",
    group: "EC-20B",
    kpi: {
      academic: 28,
      attendance: 11,
      assignment: 10,
      activity: 7,
      tutor: 6,
      discipline: 7,
      penalty: 8,
      recovery: 2,
      employmentBonus: 0,
      academicPercent: 78,
    },
    attendanceTrend: [
      { month: "Jan", value: 86 },
      { month: "Feb", value: 82 },
      { month: "Mar", value: 77 },
      { month: "Apr", value: 74 },
      { month: "May", value: 72 },
    ],
    academicTrend: [
      { month: "Jan", gpa: 80, credits: 16 },
      { month: "Feb", gpa: 79, credits: 17 },
      { month: "Mar", gpa: 76, credits: 18 },
      { month: "Apr", gpa: 78, credits: 20 },
      { month: "May", gpa: 77, credits: 21 },
    ],
    penalties: [
      { date: "2026-03-20", reason: "Attendance violation", score: 5 },
      { date: "2026-04-28", reason: "Missed assignment", score: 3 },
    ],
    achievements: [{ title: "Case study speaker", score: 2, category: "Activity" }],
    recoveryStatus: 24,
  },
  {
    id: "stu_003",
    name: "Sevara Olimova",
    email: "sevara.o@edumetric.uz",
    faculty: "Data Science",
    group: "DS-22C",
    kpi: {
      academic: 36,
      attendance: 18,
      assignment: 16,
      activity: 10,
      tutor: 9,
      discipline: 9,
      penalty: 0,
      recovery: 1,
      employmentBonus: 3,
      academicPercent: 96,
    },
    attendanceTrend: [
      { month: "Jan", value: 97 },
      { month: "Feb", value: 98 },
      { month: "Mar", value: 96 },
      { month: "Apr", value: 97 },
      { month: "May", value: 99 },
    ],
    academicTrend: [
      { month: "Jan", gpa: 93, credits: 22 },
      { month: "Feb", gpa: 94, credits: 23 },
      { month: "Mar", gpa: 96, credits: 25 },
      { month: "Apr", gpa: 95, credits: 27 },
      { month: "May", gpa: 97, credits: 29 },
    ],
    penalties: [],
    achievements: [
      { title: "Dean list", score: 5, category: "Academic" },
      { title: "Open data project lead", score: 5, category: "Leadership" },
    ],
    recoveryStatus: 92,
  },
];
