import { BarChart3, GraduationCap, LayoutDashboard, ShieldCheck, Trophy, Users } from "lucide-react";

export const dashboardNavigation = [
  { title: "Overview", href: "/dashboard/student", icon: LayoutDashboard, roles: ["STUDENT", "ADMIN"] },
  { title: "Analytics", href: "/dashboard/student#analytics", icon: BarChart3, roles: ["STUDENT", "ADMIN"] },
  { title: "Students", href: "/dashboard/admin", icon: Users, roles: ["ADMIN"] },
  { title: "Grant Control", href: "/dashboard/admin#grants", icon: ShieldCheck, roles: ["ADMIN"] },
  { title: "Leaderboard", href: "/dashboard/admin#leaderboard", icon: Trophy, roles: ["ADMIN", "MENTOR"] },
  { title: "Mentor", href: "/dashboard/mentor", icon: GraduationCap, roles: ["MENTOR", "TUTOR", "ADMIN"] },
] as const;
