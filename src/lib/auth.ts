import { apiFetch } from './api'

export type User = { id: string; email: string; role?: 'admin' | 'vendor' }

function normalizeUser(u: any): User {
  if (!u) return u
  const role = typeof u.role === 'string' ? (u.role.toLowerCase?.() as 'admin' | 'vendor') : undefined
  return { ...u, role }
}

export async function me(): Promise<User> {
  const u = await apiFetch('/auth/me')
  return normalizeUser(u)
}

export async function login(payload: { email: string; password: string }): Promise<User> {
  const u = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  return normalizeUser(u)
}

export async function register(payload: { email: string; password: string; name: string }): Promise<User> {
  const u = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  return normalizeUser(u)
}

export async function logout(): Promise<{ success: boolean }> {
  return apiFetch('/auth/logout', { method: 'POST' })
}
