"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createEvaluation, listEvaluations, type Evaluation } from "@/lib/evaluations"
import { qk } from "@/lib/queryKeys"

export function useEvaluationsList() {
  return useQuery<Evaluation[]>({ queryKey: qk.evaluations.list, queryFn: listEvaluations })
}

export function useCreateEvaluation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createEvaluation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.evaluations.list })
    },
  })
}
