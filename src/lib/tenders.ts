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
  const list = await apiFetch(`/tenders${params}`)
  return (list as any[]).map((t) => ({
    ...t,
    status: (t?.status as string | undefined)?.toLowerCase?.() ?? t?.status,
  }))
}

export async function getTender(id: string): Promise<Tender> {
  const t = await apiFetch(`/tenders/${id}`)
  return {
    ...t,
    status: (t?.status as string | undefined)?.toLowerCase?.() ?? t?.status,
  }
}

export async function createTender(payload: { title: string; description?: string }): Promise<Tender> {
  return apiFetch('/tenders', { method: 'POST', body: JSON.stringify(payload) })
}

export async function cancelTender(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/tenders/${id}/cancel`, { method: 'POST' })
}
