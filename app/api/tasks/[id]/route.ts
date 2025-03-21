import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { getAuthToken } from "@/lib/auth-utils"

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

// GET a specific task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

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
    const tasks = getTasks(token,decoded.userId)

    // Find task
    const task = (await tasks).find((task) => task.id === taskId)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    // if (task.userId !== decoded.userId) {
    //   console.log("Task doesnt belong to user", task)
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH update a task
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  
  try {

    
    const taskId = params.id
    
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
    const tasks:any = await getTasks(token,decoded.userId)

    // Find task
    const taskIndex = tasks.findIndex((task:any) => task.id === taskId)
    console.log("Task Index",tasks)
    if (taskIndex === -1) {
      console.log("Task not found")
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    // if (tasks[taskIndex].userId !== decoded.userId) {
    //   console.log("Task doesnt belong to user")
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    // Get update data
    const { title, description, status } = await request.json()

    // Update task
    const updatedTask = {
      ...tasks[taskIndex],
      title: title !== undefined ? title : tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status !== undefined ? status : tasks[taskIndex].status,
      updatedAt: new Date().toISOString()    }

    // Save updated task
    const updateRequest = await fetch(`${URL}/tasks/${taskId}/user/${decoded.userId}`,{
      method:'PATCH',
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ensure token is included

      },
      body: JSON.stringify(updatedTask)
      

    })    

    console.log("Response",await updateRequest.json())

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

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

    const tasks:any = await getTasks(token,decoded.userId)


    // Find task
    const taskIndex = tasks.findIndex((task: { id: string; }) => task.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    // if (tasks[taskIndex].userId !== decoded.userId) {
    //   console.log("Task doesnt belong to user")
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    // Remove task
    tasks.splice(taskIndex, 1)

    const deleteTask = await fetch(`${URL}/tasks/${taskId}/user/${decoded.userId}`,{
      method:"DELETE",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ensure token is included

      },
    })





    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

