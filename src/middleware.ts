import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/constants/auth";
import type { AppRole } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Force authentication for any path under /dashboard
  const token = await getToken({ req: request, secret: authSecret });
  if (!token) {
    // Redirect to home/login page if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = token.role as AppRole;

  // 2. Enforce Role-Based Access Control (RBAC)
  if (pathname.startsWith("/dashboard/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } else if (pathname.startsWith("/dashboard/mentor")) {
    if (role !== "MENTOR" && role !== "TUTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } else if (pathname.startsWith("/dashboard/student")) {
    if (role !== "STUDENT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } else if (pathname.startsWith("/dashboard/settings") || pathname.startsWith("/dashboard/profile")) {
    // Settings and Profile accessible to all authenticated users
  } else {
    // Generic paths like /dashboard or any unmapped /dashboard/* routes
    // Redirect the user to their default dashboard homepage based on their role
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else if (role === "MENTOR" || role === "TUTOR") {
      return NextResponse.redirect(new URL("/dashboard/mentor", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }
  }

  // Add full pathname (including query string) to headers for server components
  const requestHeaders = new Headers(request.headers);
  const fullPath = pathname + (request.nextUrl.search || "");
  requestHeaders.set("x-pathname", fullPath);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
