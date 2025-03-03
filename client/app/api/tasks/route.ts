import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { getAuthToken } from "@/lib/auth-utils"

// In a real app, this would be a database
const tasks = [];

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

    // Get user's tasks
    const userTasks = tasks.filter((task) => task.userId === decoded.userId)

    return NextResponse.json(userTasks)
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    let decoded
    try {
      decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
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
    tasks.push(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

