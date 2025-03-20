import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { getAuthToken, verifyToken } from "@/lib/auth-utils"

// In a real app, this would be a database
let tasks: any[] = [];
let URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchUsersFromDB(token:any,uId:any) {
  try {
    if (!URL) throw new Error("API base URL is not set");
    const response = await fetch(`${URL}/tasks?userId=${uId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ensure token is included

      },
      cache: "no-store"
    });

    // Log response headers and status
    // console.log("Response Status:", response.status);
    // console.log("Response Headers:", response.headers);

    // Read the raw response as text to check if it's valid JSON
    const rawResponse = await response.text();
    // console.log("Raw Response:", rawResponse); // Debugging purpose

    // Attempt to parse JSON
    tasks = JSON.parse(rawResponse);
    // console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


// Ensure users are fetched before handling requests

// Fetch users only when necessary (not automatically)
export async function getTasks(token:any, uId:any) {
  if (tasks.length === 0) {
    await fetchUsersFromDB(token,uId);
  }
  return tasks;
}

// GET all tasks for the authenticated user
export async function GET(request: Request) {
  try {
    // Get token from request
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("DECODED",decoded.userId);

    const tasks = await getTasks(token,decoded.userId)
    // Get user's tasks
    const userTasks =  tasks.filter((task: { userId: any; }) => String(task.userId) === decoded.userId)

    return NextResponse.json(await tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create a new task
export async function POST(request: Request) {
  try {
    // Get token from request
    const token = getAuthToken(request)
    if (!token) {
      console.log("Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    

    // Verify token
    let decoded
    
    try {
      decoded = verify(token,process.env.JWT_SECRET||'d0cvn28bmd41ueiqd8a#023n9da89&')
    } catch (error) {
      console.log("Invalid Token")
      
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get task data from request
    const { title, description, status } = await request.json()



    // Validate input
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }


    // Create new task
    const now = new Date().toISOString()
    const newTask = {
      id: uuidv4(),
      title,
      description: description || "",
      status: status || "open",
      createdAt: now,
      updatedAt: now,
      userId: decoded.userId,
    }

    // Save task (in a real app, this would be saved to a database)
    const response = await fetch(`${URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.JWT_SECRET}` // Ensure token is included

      },
      body: JSON.stringify(newTask),
    });

    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to save task in the database");
    }


    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

