import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sign } from "jsonwebtoken"

// In a real app, this would be a database query
// For demo purposes, we'll use the users array from the register route
// In a real implementation, you would import from a database module
// Define a global users array
let users: any[] = [];
let URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchUsersFromDB() {
  try {
    if (!URL) throw new Error("API base URL is not set");

    const response = await fetch(`${URL}/user`,{cache: "no-store"}); // Ensure this endpoint returns JSON

    // Log response headers and status
    // console.log("Response Status:", response.status);
    // console.log("Response Headers:", response.headers);

    // Read the raw response as text to check if it's valid JSON
    const rawResponse = await response.text();
    // console.log("Raw Response:", rawResponse); // Debugging purpose

    // Attempt to parse JSON
    users = JSON.parse(rawResponse);
    // console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


// Ensure users are fetched before handling requests

// Fetch users only when necessary (not automatically)
export async function getUsers() {
  if (users.length === 0) {
    await fetchUsersFromDB();
  }
  return users;
}

export async function POST(request: Request) {
  try {

    const token = ""


    const response = NextResponse.json({
   
      token
    })
    response.cookies.set("token","",{
      httpOnly: true,  // Secure, prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
      sameSite: "lax",
      path: "/"
  });
    // Return user data (without password) and token
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

