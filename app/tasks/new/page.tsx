"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskForm } from "@/components/task-form"
import { createTask } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function NewTaskPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (formData: { title: string; description: string; status: string }) => {
    setIsSubmitting(true)
    try {
      await createTask(formData)
      toast({
        title: "Success",
        description: "Task created successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4 flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Task" />
        </CardContent>
      </Card>
    </div>
  )
}

