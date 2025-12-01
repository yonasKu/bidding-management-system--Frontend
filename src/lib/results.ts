import { apiFetch } from '@/lib/api'

export type PublicResult = {
  bidId: string
  score: number
  remarks?: string
  isWinner: boolean
}

export async function getResultsByTender(tenderId: string): Promise<PublicResult[]> {
  return apiFetch(`/tenders/${tenderId}/results`)
}
