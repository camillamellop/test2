"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

// Inicializa o cliente SQL
const sql = neon(process.env.DATABASE_URL!)

// Tipos
export type User = {
  id: number
  email: string
  name: string
  avatar_url?: string
  bio?: string
  location?: string
  mission?: string
  vision?: string
}

export type Event = {
  id: number
  user_id: number
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  fee?: number
  status: string
}

export type Transaction = {
  id: number
  user_id: number
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export type Project = {
  id: number
  user_id: number
  title: string
  description?: string
  category: string
  status: string
  progress: number
  deadline?: string
}

export type Task = {
  id: number
  user_id: number
  project_id: number
  title: string
  description?: string
  completed: boolean
  priority: string
  due_date?: string
}

export type Note = {
  id: number
  user_id: number
  title?: string
  content: string
  type: string
  pinned: boolean
}

// Ações de Usuário
export async function getCurrentUser(userId: number): Promise<User | null> {
  try {
    const users = await sql<User[]>`
      SELECT * FROM users WHERE id = ${userId} LIMIT 1
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

export async function updateUserProfile(userId: number, data: Partial<User>) {
  try {
    const { name, avatar_url, bio, location, mission, vision } = data

    await sql`
      UPDATE users 
      SET 
        name = COALESCE(${name}, name),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        bio = COALESCE(${bio}, bio),
        location = COALESCE(${location}, location),
        mission = COALESCE(${mission}, mission),
        vision = COALESCE(${vision}, vision),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    revalidatePath("/dashboard/branding")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { success: false, error }
  }
}

// Ações de Eventos
export async function getEvents(userId: number): Promise<Event[]> {
  try {
    return await sql<Event[]>`
      SELECT * FROM events 
      WHERE user_id = ${userId}
      ORDER BY date DESC, time ASC
    `
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }
}

export async function getEventsByDate(userId: number, date: string): Promise<Event[]> {
  try {
    return await sql<Event[]>`
      SELECT * FROM events 
      WHERE user_id = ${userId} AND date = ${date}
      ORDER BY time ASC
    `
  } catch (error) {
    console.error("Erro ao buscar eventos por data:", error)
    return []
  }
}

export async function createEvent(userId: number, eventData: Omit<Event, "id" | "user_id">) {
  try {
    const { title, description, date, time, location, fee, status } = eventData

    await sql`
      INSERT INTO events (user_id, title, description, date, time, location, fee, status)
      VALUES (${userId}, ${title}, ${description}, ${date}, ${time}, ${location}, ${fee}, ${status})
    `

    revalidatePath("/dashboard/calendar")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return { success: false, error }
  }
}

export async function updateEvent(userId: number, eventId: number, eventData: Partial<Event>) {
  try {
    const { title, description, date, time, location, fee, status } = eventData

    await sql`
      UPDATE events 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        location = COALESCE(${location}, location),
        fee = COALESCE(${fee}, fee),
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${eventId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/calendar")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    return { success: false, error }
  }
}

export async function deleteEvent(userId: number, eventId: number) {
  try {
    await sql`
      DELETE FROM events 
      WHERE id = ${eventId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/calendar")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir evento:", error)
    return { success: false, error }
  }
}

// Ações de Transações Financeiras
export async function getTransactions(userId: number): Promise<Transaction[]> {
  try {
    return await sql<Transaction[]>`
      SELECT * FROM transactions 
      WHERE user_id = ${userId}
      ORDER BY date DESC, created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return []
  }
}

export async function createTransaction(userId: number, transactionData: Omit<Transaction, "id" | "user_id">) {
  try {
    const { type, amount, description, category, date } = transactionData

    await sql`
      INSERT INTO transactions (user_id, type, amount, description, category, date)
      VALUES (${userId}, ${type}, ${amount}, ${description}, ${category}, ${date})
    `

    revalidatePath("/dashboard/finance")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return { success: false, error }
  }
}

export async function deleteTransaction(userId: number, transactionId: number) {
  try {
    await sql`
      DELETE FROM transactions 
      WHERE id = ${transactionId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/finance")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir transação:", error)
    return { success: false, error }
  }
}

export async function getFinanceSummary(userId: number) {
  try {
    const income = await sql<{ total: number }[]>`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE user_id = ${userId} AND type = 'income'
    `

    const expenses = await sql<{ total: number }[]>`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE user_id = ${userId} AND type = 'expense'
    `

    const totalIncome = income[0]?.total || 0
    const totalExpenses = expenses[0]?.total || 0
    const balance = totalIncome - totalExpenses

    return { totalIncome, totalExpenses, balance }
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error)
    return { totalIncome: 0, totalExpenses: 0, balance: 0 }
  }
}

// Ações de Projetos
export async function getProjects(userId: number): Promise<Project[]> {
  try {
    return await sql<Project[]>`
      SELECT * FROM projects 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    return []
  }
}

export async function getProjectsByCategory(userId: number, category: string): Promise<Project[]> {
  try {
    return await sql<Project[]>`
      SELECT * FROM projects 
      WHERE user_id = ${userId} AND category = ${category}
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar projetos por categoria:", error)
    return []
  }
}

export async function createProject(userId: number, projectData: Omit<Project, "id" | "user_id">) {
  try {
    const { title, description, category, status, progress, deadline } = projectData

    await sql`
      INSERT INTO projects (user_id, title, description, category, status, progress, deadline)
      VALUES (${userId}, ${title}, ${description}, ${category}, ${status}, ${progress}, ${deadline})
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return { success: false, error }
  }
}

export async function updateProject(userId: number, projectId: number, projectData: Partial<Project>) {
  try {
    const { title, description, category, status, progress, deadline } = projectData

    await sql`
      UPDATE projects 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        status = COALESCE(${status}, status),
        progress = COALESCE(${progress}, progress),
        deadline = COALESCE(${deadline}, deadline),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    return { success: false, error }
  }
}

export async function deleteProject(userId: number, projectId: number) {
  try {
    // Primeiro exclui todas as tarefas associadas ao projeto
    await sql`
      DELETE FROM tasks 
      WHERE project_id = ${projectId} AND user_id = ${userId}
    `

    // Depois exclui o projeto
    await sql`
      DELETE FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir projeto:", error)
    return { success: false, error }
  }
}

// Ações de Tarefas
export async function getTasks(userId: number, projectId: number): Promise<Task[]> {
  try {
    return await sql<Task[]>`
      SELECT * FROM tasks 
      WHERE user_id = ${userId} AND project_id = ${projectId}
      ORDER BY due_date ASC, priority DESC
    `
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return []
  }
}

export async function createTask(userId: number, taskData: Omit<Task, "id" | "user_id">) {
  try {
    const { project_id, title, description, completed, priority, due_date } = taskData

    await sql`
      INSERT INTO tasks (user_id, project_id, title, description, completed, priority, due_date)
      VALUES (${userId}, ${project_id}, ${title}, ${description}, ${completed}, ${priority}, ${due_date})
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    return { success: false, error }
  }
}

export async function updateTask(userId: number, taskId: number, taskData: Partial<Task>) {
  try {
    const { title, description, completed, priority, due_date } = taskData

    await sql`
      UPDATE tasks 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        completed = COALESCE(${completed}, completed),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    return { success: false, error }
  }
}

export async function deleteTask(userId: number, taskId: number) {
  try {
    await sql`
      DELETE FROM tasks 
      WHERE id = ${taskId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error)
    return { success: false, error }
  }
}

// Ações de Notas
export async function getNotes(userId: number, type = "general"): Promise<Note[]> {
  try {
    return await sql<Note[]>`
      SELECT * FROM notes 
      WHERE user_id = ${userId} AND type = ${type}
      ORDER BY pinned DESC, created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar notas:", error)
    return []
  }
}

export async function getPinnedNotes(userId: number): Promise<Note[]> {
  try {
    return await sql<Note[]>`
      SELECT * FROM notes 
      WHERE user_id = ${userId} AND pinned = true
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar notas fixadas:", error)
    return []
  }
}

export async function createNote(userId: number, noteData: Omit<Note, "id" | "user_id">) {
  try {
    const { title, content, type, pinned } = noteData

    await sql`
      INSERT INTO notes (user_id, title, content, type, pinned)
      VALUES (${userId}, ${title}, ${content}, ${type}, ${pinned})
    `

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar nota:", error)
    return { success: false, error }
  }
}

export async function updateNote(userId: number, noteId: number, noteData: Partial<Note>) {
  try {
    const { title, content, pinned } = noteData

    await sql`
      UPDATE notes 
      SET 
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        pinned = COALESCE(${pinned}, pinned),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${noteId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar nota:", error)
    return { success: false, error }
  }
}

export async function deleteNote(userId: number, noteId: number) {
  try {
    await sql`
      DELETE FROM notes 
      WHERE id = ${noteId} AND user_id = ${userId}
    `

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir nota:", error)
    return { success: false, error }
  }
}

// Ações de Diário
export async function getDiaryEntries(userId: number): Promise<Note[]> {
  try {
    return await sql<Note[]>`
      SELECT * FROM diary_entries 
      WHERE user_id = ${userId}
      ORDER BY date DESC, created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar entradas do diário:", error)
    return []
  }
}

export async function createDiaryEntry(userId: number, content: string, date: string) {
  try {
    await sql`
      INSERT INTO diary_entries (user_id, content, date)
      VALUES (${userId}, ${content}, ${date})
    `

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar entrada do diário:", error)
    return { success: false, error }
  }
}

// Ações de Gratidão
export async function getGratitudeEntries(userId: number): Promise<Note[]> {
  try {
    return await sql<Note[]>`
      SELECT * FROM gratitude_entries 
      WHERE user_id = ${userId}
      ORDER BY date DESC, created_at DESC
    `
  } catch (error) {
    console.error("Erro ao buscar entradas de gratidão:", error)
    return []
  }
}

export async function createGratitudeEntry(userId: number, content: string, date: string) {
  try {
    await sql`
      INSERT INTO gratitude_entries (user_id, content, date)
      VALUES (${userId}, ${content}, ${date})
    `

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar entrada de gratidão:", error)
    return { success: false, error }
  }
}

// Ações de AutoCuidado
export async function getSelfCareEntries(userId: number, type: string): Promise<any[]> {
  try {
    return await sql`
      SELECT * FROM self_care_entries 
      WHERE user_id = ${userId} AND type = ${type}
      ORDER BY date DESC
    `
  } catch (error) {
    console.error("Erro ao buscar registros de autocuidado:", error)
    return []
  }
}

export async function createSelfCareEntry(userId: number, type: string, value: string, date: string) {
  try {
    await sql`
      INSERT INTO self_care_entries (user_id, type, value, date)
      VALUES (${userId}, ${type}, ${value}, ${date})
    `

    revalidatePath("/dashboard/self-care")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar registro de autocuidado:", error)
    return { success: false, error }
  }
}

// Estatísticas e Métricas
export async function getUserStats(userId: number) {
  try {
    // Total de eventos
    const eventsCount = await sql<{ count: number }[]>`
      SELECT COUNT(*) as count FROM events WHERE user_id = ${userId}
    `

    // Total de projetos
    const projectsCount = await sql<{ count: number }[]>`
      SELECT COUNT(*) as count FROM projects WHERE user_id = ${userId}
    `

    // Total de tarefas concluídas
    const completedTasksCount = await sql<{ count: number }[]>`
      SELECT COUNT(*) as count FROM tasks WHERE user_id = ${userId} AND completed = true
    `

    // Total de notas
    const notesCount = await sql<{ count: number }[]>`
      SELECT COUNT(*) as count FROM notes WHERE user_id = ${userId}
    `

    // Balanço financeiro
    const financeSummary = await getFinanceSummary(userId)

    return {
      eventsCount: eventsCount[0]?.count || 0,
      projectsCount: projectsCount[0]?.count || 0,
      completedTasksCount: completedTasksCount[0]?.count || 0,
      notesCount: notesCount[0]?.count || 0,
      financeSummary,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error)
    return {
      eventsCount: 0,
      projectsCount: 0,
      completedTasksCount: 0,
      notesCount: 0,
      financeSummary: { totalIncome: 0, totalExpenses: 0, balance: 0 },
    }
  }
}
