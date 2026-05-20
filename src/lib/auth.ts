import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authSecret } from "@/constants/auth";
import type { AppRole } from "@/types/auth";

const demoUsers = [
  { id: "admin_1", name: "PDP Admin", email: "admin@pdp.uz", password: "admin123", role: "ADMIN" as AppRole },
  { id: "student_1", name: "PDP Talaba", email: "student@pdp.uz", password: "student123", role: "STUDENT" as AppRole },
  { id: "mentor_1", name: "PDP Mentor", email: "mentor@pdp.uz", password: "mentor123", role: "MENTOR" as AppRole },
];

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/unauthorized",
  },
  providers: [
    CredentialsProvider({
      name: "PDP METRIC Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = demoUsers.find(
          (item) => item.email === credentials?.email && item.password === credentials?.password,
        );

        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as typeof user & { role: AppRole }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as AppRole;
      }
      return session;
    },
  },
};
