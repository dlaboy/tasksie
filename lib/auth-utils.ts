import { verify } from "jsonwebtoken"

// Get auth token from request headers
export function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.split(" ")[1]
}

import jwt from "jsonwebtoken";

// Verify JWT token and return decoded payload
// export function verifyToken(token: string) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }
import { jwtVerify, JWTPayload } from "jose";

/**
 * Verifies a JWT token and returns the decoded payload.
 * Works in Edge Runtime.
 * @param token - The JWT token to verify.
 * @returns Decoded JWT payload if valid, otherwise null.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from environment variables.");
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        return payload; // Successfully verified token
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null;
    }
}


// Middleware to check if user is authenticated
export function isAuthenticated(handler: Function) {
  return async (request: Request) => {
    const token = getAuthToken(request)
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    // Add user to request
    ;(request as any).user = decoded

    return handler(request)
  }
}

