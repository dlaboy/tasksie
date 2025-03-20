import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { sign } from "jsonwebtoken"

// In a real app, this would be a database
let users: any[] = [];
let URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Function to fetch users from a database API and store them in an array
async function fetchUsersFromDB() {
  try {
    const response = await fetch(`${URL}/user`,{cache: "no-store"}); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch users from the database");
    }
    users = await response.json();
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
    const { name, email, password } = await request.json()

    const users = await getUsers(); // Fetches if needed
    

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password 
    // UPDATED: password is already being hashed in the backend
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)


   
    

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: password,
      createdAt: new Date().toISOString(),
    }

    // Save user (in a real app, this would be saved to a database)
      // Save user in the database using fetch
      const response = await fetch(`${URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.JWT_SECRET}` // Ensure token is included

        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to save user in the database");
      }
  
      const savedUser = await response.json(); // Parse response

    // Create JWT token
    const token = sign({ userId: savedUser.id, email: savedUser.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    })

    // Return user data (without password) and token
    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

