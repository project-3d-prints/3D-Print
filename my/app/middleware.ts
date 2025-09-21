import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rolePermissions = {
  "глава лаборатории": [
    "/dashboard",
    "/printers",
    "/printers/create",
    "/materials",
    "/materials/create",
    "/jobs",
    "/jobs/create",
    "/jobs/queue",
  ],
  учитель: ["/dashboard", "/jobs/create", "/jobs/queue"],
  студент: ["/dashboard", "/jobs/create", "/jobs/queue"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/users/auth")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session_id");
  const userRole = request.cookies.get("user_role")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/users/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (userRole && rolePermissions[userRole as keyof typeof rolePermissions]) {
    const allowedPaths =
      rolePermissions[userRole as keyof typeof rolePermissions];
    const hasAccess = allowedPaths.some((path) => pathname.startsWith(path));

    if (!hasAccess) {
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "Недостаточно прав");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/printers/:path*",
    "/materials/:path*",
    "/jobs/:path*",
  ],
};
