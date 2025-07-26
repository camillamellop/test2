"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context-prisma"

interface Project {
  id: number
  title: string
  description?: string
  category: "branding" | "dj-music" | "instagram" | "other"
  status: "active" | "completed" | "paused"
  progress: number
  deadline?: Date
  userId: number
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
  documents?: Document[]
}

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: Date
  projectId: number
  createdAt: Date
  updatedAt: Date
}

interface Document {
  id: number
  title: string
  description?: string
  fileName: string
  fileUrl: string
  fileType: "pdf" | "doc" | "docx" | "image"
  fileSize: number
  category: "contract" | "proposal" | "invoice" | "other"
  projectId?: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

interface ProjectContextType {
  projects: Project[]
  tasks: Task[]
  addProject: (project: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt" | "tasks" | "documents">) => Promise<void>
  updateProject: (id: number, project: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateTask: (id: number, task: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  getTasksForProject: (projectId: number) => Task[]
  isLoading: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar projetos do usuário
  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/projects?userId=${user.id}`)
      
      if (response.ok) {
        const projectsData = await response.json()
        setProjects(projectsData)
        
        // Extrair tarefas de todos os projetos
        const allTasks = projectsData.flatMap((project: Project) => project.tasks || [])
        setTasks(allTasks)
      } else {
        console.error('Erro ao carregar projetos')
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addProject = async (projectData: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt" | "tasks" | "documents">) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          userId: user.id
        }),
      })

      if (response.ok) {
        const newProject = await response.json()
        setProjects((prev) => [newProject, ...prev])
      } else {
        console.error('Erro ao criar projeto')
      }
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error)
    }
  }

  const updateProject = async (id: number, projectData: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProjects((prev) => 
          prev.map((project) => 
            project.id === id ? updatedProject : project
          )
        )
      } else {
        console.error('Erro ao atualizar projeto')
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
    }
  }

  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== id))
        setTasks((prev) => prev.filter((task) => task.projectId !== id))
      } else {
        console.error('Erro ao deletar projeto')
      }
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
    }
  }

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Por enquanto, vamos simular a criação de tarefa
      // Em uma implementação completa, teríamos uma API específica para tarefas
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setTasks((prev) => [...prev, newTask])
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
    }
  }

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      setTasks((prev) => 
        prev.map((task) => 
          task.id === id 
            ? { ...task, ...taskData, updatedAt: new Date() } 
            : task
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
    }
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