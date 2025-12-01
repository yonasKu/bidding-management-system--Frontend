import { apiFetch } from '@/lib/api'

export type Evaluation = {
  id: string
  bidId: string
  score: number
  remarks?: string
  createdAt?: string
  technicalScore?: number
  financialScore?: number
}

export async function listEvaluations(): Promise<Evaluation[]> {
  return apiFetch('/evaluations')
}

export async function createEvaluation(payload: { bidId: string; technicalScore: number; financialScore: number; remarks?: string }): Promise<Evaluation> {
  return apiFetch('/evaluations', { method: 'POST', body: JSON.stringify(payload) })
}
