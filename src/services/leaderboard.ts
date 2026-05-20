import { calculateGrantScore } from "@/services/grant-engine";
import { students } from "@/services/mock-data";

export function getLeaderboard() {
  return students
    .map((student) => ({
      id: student.id,
      name: student.name,
      faculty: student.faculty,
      score: calculateGrantScore(student.kpi).finalScore,
    }))
    .sort((a, b) => b.score - a.score)
    .map((student, index) => ({ ...student, position: index + 1 }));
}
