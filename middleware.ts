import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth-utils"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/tasks"]

// List of paths that are accessible only to non-authenticated users
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value
  const userId = request.cookies.get("userId")?.value
  // console.log("Middleware",token)
  // const token =  localStorage.getItem("token")
  let isAuthenticated = null
  if (token) {
    const decoded = await verifyToken(token); // Ensure `verifyToken()` is async
    console.log("decoded",decoded)
    isAuthenticated = decoded; // Converts `null` to `false`
}
else{
  isAuthenticated = false; // Converts `null` to `false`

}
if (typeof(isAuthenticated) === 'object'){
  isAuthenticated = true;
}
  // const isAuthenticated = token

  const path = request.nextUrl.pathname

  // Check if the path is protected and user is not authenticated
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  console.log("URL",path)

  if (isProtectedPath && isAuthenticated === false) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  else{
    console.log("Path protegido y usuario no autenticado",isAuthenticated, isProtectedPath)
  }

  // Check if the path is for non-authenticated users and user is authenticated
  const isAuthPath = authPaths.some((authPath) => path === authPath)
  if (isAuthPath && isAuthenticated) {
    
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  else{
    console.log("Path no protegido y usuario autenticado",isAuthenticated, isAuthPath)

  }
 
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/login", "/register"],
}

