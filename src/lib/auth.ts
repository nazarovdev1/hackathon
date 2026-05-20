import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authSecret } from "@/constants/auth";
import { prisma } from "@/lib/prisma";
import type { AppRole } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours session lifetime
    updateAge: 2 * 60 * 60, // Update token session every 2 hours
  },
  pages: {
    signIn: "/",
    error: "/unauthorized",
  },
  cookies: process.env.NODE_ENV === "production" ? {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  } : undefined,
  providers: [
    CredentialsProvider({
      name: "PDP METRIC",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            studentProfile: { select: { id: true } },
            mentorProfile: { select: { id: true } },
            tutorProfile: { select: { id: true } },
          },
        });

        if (!user?.isActive) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          image: user.avatarUrl,
          role: user.role as AppRole,
          studentProfileId: user.studentProfile?.id,
          mentorProfileId: user.mentorProfile?.id,
          tutorProfileId: user.tutorProfile?.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const appUser = user as typeof user & {
          role: AppRole;
          studentProfileId?: string;
          mentorProfileId?: string;
          tutorProfileId?: string;
        };

        token.role = appUser.role;
        token.studentProfileId = appUser.studentProfileId;
        token.mentorProfileId = appUser.mentorProfileId;
        token.tutorProfileId = appUser.tutorProfileId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as AppRole;
        session.user.studentProfileId = token.studentProfileId;
        session.user.mentorProfileId = token.mentorProfileId;
        session.user.tutorProfileId = token.tutorProfileId;
      }

      return session;
    },
  },
};
