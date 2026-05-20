export type AppRole = "STUDENT" | "MENTOR" | "TUTOR" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  studentProfileId?: string;
  mentorProfileId?: string;
  tutorProfileId?: string;
};
