import type { DefaultSession } from "next-auth";
import type { AppRole } from "@/types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      studentProfileId?: string;
      mentorProfileId?: string;
      tutorProfileId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
    studentProfileId?: string;
    mentorProfileId?: string;
    tutorProfileId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AppRole;
    studentProfileId?: string;
    mentorProfileId?: string;
    tutorProfileId?: string;
  }
}
