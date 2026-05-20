"use server";

import { calculateGrantScore } from "@/services/grant-engine";
import { students } from "@/services/mock-data";

export async function getStudentGrantSnapshot(studentId: string) {
  const student = students.find((item) => item.id === studentId);
  if (!student) return null;

  return {
    student,
    grant: calculateGrantScore(student.kpi),
  };
}
