"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTender, getTender, listTenders, cancelTender, type Tender } from "@/lib/tenders"
import { qk } from "@/lib/queryKeys"

export function useTendersList(filters?: Record<string, any>) {
  return useQuery<Tender[]>({ queryKey: qk.tenders.list(filters), queryFn: () => listTenders(filters) })
}

export function useTender(id: string) {
  return useQuery<Tender>({ queryKey: qk.tenders.detail(id), queryFn: () => getTender(id), enabled: !!id })
}

export function useCreateTender() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTender,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.tenders.list({}) })
    },
  })
}

export function useCancelTender() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelTender(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.tenders.list({}) })
    },
  })
}
