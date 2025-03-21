"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token")
    // console.log("User did something")
    if (token) {
      fetchUserProfile(token)

    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      console.log("response inside fetch",response)

      if (response.ok) {
        console.log("Response ok")
        const userData = await response.json()
        setUser(userData)
      } else {
        console.log("Response not ok")

        // Token is invalid or expired
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        
      },
      body: JSON.stringify({ email, password }),


    })

    if (!response.ok) {

      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }
  
   

    
    const data = await response.json()
    console.log("Data",data.user)
    // console.log("User auth",data.user)
    localStorage.setItem("token", data.token)
    setUser(data.user)
    window.location.reload()
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    setUser(data.user)
  }

  const logout = async () => {

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }
    localStorage.removeItem("token")
    setUser(null)
    window.location.reload()

  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

