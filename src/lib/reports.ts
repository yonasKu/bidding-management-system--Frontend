import { apiFetch } from '@/lib/api'

export type ReportsSummary = {
  open: number
  closed: number
  cancelled: number
  bids: number
  evaluations: number
  from?: string
}

export async function getReportsSummary(range?: string): Promise<ReportsSummary> {
  const q = range ? `?range=${encodeURIComponent(range)}` : ''
  return apiFetch(`/reports/summary${q}`)
}
