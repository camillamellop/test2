"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Project {
  id: number
  title: string
  description?: string
  category: "branding" | "dj-music" | "instagram" | "other"
  status: "active" | "completed" | "paused"
  progress: number
  deadline?: string
}

interface Task {
  id: number
  projectId: number
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
}

interface ProjectContextType {
  projects: Project[]
  tasks: Task[]
  addProject: (project: Omit<Project, "id">) => Promise<void>
  updateProject: (id: number, project: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  addTask: (task: Omit<Task, "id">) => Promise<void>
  updateTask: (id: number, task: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  getTasksForProject: (projectId: number) => Task[]
  isLoading: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addProject = async (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
    }
    setProjects((prev) => [...prev, newProject])
  }

  const updateProject = async (id: number, projectData: Partial<Project>) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...projectData } : project)))
  }

  const deleteProject = async (id: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
    setTasks((prev) => prev.filter((task) => task.projectId !== id))
  }

  const addTask = async (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...taskData } : task)))
  }

  const deleteTask = async (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTasksForProject = (projectId: number) => {
    return tasks.filter((task) => task.projectId === projectId)
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        getTasksForProject,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}
