import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth-utils"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/tasks"]

// List of paths that are accessible only to non-authenticated users
const authPaths = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthenticated = token && verifyToken(token)
  const path = request.nextUrl.pathname

  // Check if the path is protected and user is not authenticated
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Check if the path is for non-authenticated users and user is authenticated
  const isAuthPath = authPaths.some((authPath) => path === authPath)
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/login", "/register"],
}

