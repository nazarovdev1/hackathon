import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/constants/auth";
import type { AppRole } from "@/types/auth";

const routeRoles: Record<string, AppRole[]> = {
  "/dashboard/student": ["STUDENT", "ADMIN"],
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/mentor": ["MENTOR", "TUTOR", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedEntry = Object.entries(routeRoles).find(([route]) => pathname.startsWith(route));

  if (!protectedEntry) return NextResponse.next();

  const token = await getToken({ req: request, secret: authSecret });
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  const [, roles] = protectedEntry;
  if (!roles.includes(token.role as AppRole)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
