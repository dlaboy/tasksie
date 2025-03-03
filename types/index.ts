export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  createdAt?: string
  updatedAt?: string
  userId?: string
}

export interface AuthResponse {
  user: User
  token: string
}

