"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listBidsByTender, listMyBids, submitBid, type Bid } from "@/lib/bids"
import { qk } from "@/lib/queryKeys"

export function useMyBids() {
  return useQuery<Bid[]>({ queryKey: qk.bids.mine, queryFn: listMyBids })
}

export function useBidsByTender(tenderId: string) {
  return useQuery<Bid[]>({ queryKey: qk.bids.byTender(tenderId), queryFn: () => listBidsByTender(tenderId), enabled: !!tenderId })
}

export function useSubmitBid(tenderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => submitBid(tenderId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.bids.mine })
      qc.invalidateQueries({ queryKey: qk.bids.byTender(tenderId) })
    },
  })
}
