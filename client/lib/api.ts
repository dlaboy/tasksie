import type { Task } from "@/types"

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks", {
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch tasks")
  }

  return response.json()
}

// Fetch a single task by ID
export async function fetchTask(id: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch task")
  }

  return response.json()
}

// Create a new task
export async function createTask(data: { title: string; description: string; status: string }): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create task")
  }

  return response.json()
}

// Update an existing task
export async function updateTask(
  id: string,
  data: { title: string; description: string; status: string },
): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update task")
  }

  return response.json()
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete task")
  }
}

