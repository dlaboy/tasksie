import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { getAuthToken } from "@/lib/auth-utils"

// In a real app, this would be a database query
let users: any[] = [];
let URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchUsersFromDB() {
  try {
    const response = await fetch(`${URL}/user`,{ cache: "no-store"}); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch users from the database");
    }
    users = await response.json();
    // console.log("fetch method",users)
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


export async function GET(request: Request) {

  
  try {

    const userss = await getUsers(); // Fetches if needed
    
    // Get token from request
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("TOKEN",token)

    // Verify token
    let decoded
    try {
      decoded = verify(token,process.env.JWT_SECRET||'d0cvn28bmd41ueiqd8a#023n9da89&')
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    console.log("decoded in me",decoded)

    const response = await fetch(`${URL}/auth/me`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.JWT_SECRET}` // Ensure token is included

      },
    }); 

    console.log("respuesta de me",response)


    // Find user
    const user = userss.find((user) => user.id === decoded.userId)
    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    // console.log(userss)
    // Return user data (without password)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

