import { apiFetch } from './api'

export type User = { id: string; email: string; role?: 'admin' | 'vendor' }

export async function me(): Promise<User> {
  return apiFetch('/auth/me')
}

export async function login(payload: { email: string; password: string }): Promise<User> {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export async function register(payload: { email: string; password: string; name: string }): Promise<User> {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export async function logout(): Promise<{ success: boolean }> {
  return apiFetch('/auth/logout', { method: 'POST' })
}
