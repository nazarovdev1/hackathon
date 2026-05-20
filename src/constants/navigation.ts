import { BarChart3, GraduationCap, LayoutDashboard, ShieldCheck, Trophy, Users, Award, MessageSquare } from "lucide-react";

export const dashboardNavigation = [
  { title: "Umumiy ko'rinish", href: "/dashboard/student", icon: LayoutDashboard, roles: ["STUDENT", "ADMIN"] },
  { title: "Tahlil", href: "/dashboard/student#analytics", icon: BarChart3, roles: ["STUDENT", "ADMIN"] },
  { title: "Reyting", href: "/dashboard/student/rating", icon: Trophy, roles: ["STUDENT", "ADMIN"] },
  { title: "Sertifikatlar", href: "/dashboard/student/certificates", icon: Award, roles: ["STUDENT", "ADMIN"] },
  { title: "Mentor Feedback", href: "/dashboard/student/feedback", icon: MessageSquare, roles: ["STUDENT", "ADMIN"] },
  { title: "Talabalar", href: "/dashboard/admin", icon: Users, roles: ["ADMIN"] },
  { title: "Grant nazorati", href: "/dashboard/admin#grants", icon: ShieldCheck, roles: ["ADMIN"] },
  { title: "Reyting jadvali", href: "/dashboard/admin#leaderboard", icon: Trophy, roles: ["ADMIN", "MENTOR"] },
  { title: "Mentor", href: "/dashboard/mentor", icon: GraduationCap, roles: ["MENTOR", "TUTOR", "ADMIN"] },
] as const;
