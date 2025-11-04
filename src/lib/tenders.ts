import { apiFetch } from '@/lib/api'

export type Tender = {
  id: string
  title: string
  description?: string
  status: 'open' | 'closed' | 'cancelled'
  createdAt?: string
}

export async function listTenders(filters?: Record<string, any>): Promise<Tender[]> {
  const params = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
  return apiFetch(`/tenders${params}`)
}

export async function getTender(id: string): Promise<Tender> {
  return apiFetch(`/tenders/${id}`)
}

export async function createTender(payload: { title: string; description?: string }): Promise<Tender> {
  return apiFetch('/tenders', { method: 'POST', body: JSON.stringify(payload) })
}

export async function cancelTender(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/tenders/${id}/cancel`, { method: 'POST' })
}
