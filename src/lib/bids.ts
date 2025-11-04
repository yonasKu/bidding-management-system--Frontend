import { apiFetch, apiUpload } from '@/lib/api'

export type Bid = {
  id: string
  tenderId: string
  vendorId: string
  fileUrl?: string
  createdAt?: string
  status?: 'submitted' | 'evaluated' | 'rejected'
}

export async function listMyBids(): Promise<Bid[]> {
  return apiFetch('/bids/mine')
}

export async function listBidsByTender(tenderId: string): Promise<Bid[]> {
  return apiFetch(`/tenders/${tenderId}/bids`)
}

export async function submitBid(tenderId: string, file: File): Promise<Bid> {
  const form = new FormData()
  form.append('file', file)
  return apiUpload(`/tenders/${tenderId}/bids`, form)
}
