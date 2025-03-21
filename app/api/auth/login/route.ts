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

    const response = await fetch(`${URL}/user`); // Ensure this endpoint returns JSON

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
    const { email, password } = await request.json()

    const users = await getUsers(); // Fetches if needed
    

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
   

    // Find user
    const user = users.find((user) => user.email === email)

    // console.log("User",user)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
   

   
    if (isPasswordValid === false) {

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

       // Save user (in a real app, this would be saved to a database)
          // Save user in the database using fetch

             // Create JWT token
    const token = sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    })
          
          const content = { user: JSON.stringify(user)}
          const loginUser = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Ensure token is included

            },
            body: JSON.stringify(content),
            cache: "no-store"
          });
          console.log("USER",JSON.stringify(content))
          
      if (!loginUser.ok) {
        throw new Error("Failed to save user in the database");
      }

      
      const userInDB = await loginUser.json(); // Parse response
      
      console.log("AHHH",await userInDB)
     

 

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    })
    response.cookies.set("token",token,{
      httpOnly: true,  // Secure, prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
      sameSite: "lax",
      path: "/"
  });
  response.cookies.set("userId",user.id,{
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

