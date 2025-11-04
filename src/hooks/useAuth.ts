"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { login, logout, me, register, type User } from "@/lib/auth"
import { qk } from "@/lib/queryKeys"

export function useAuthMe() {
  return useQuery<User>({ queryKey: qk.auth.me, queryFn: me, retry: false })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.auth.me })
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.auth.me })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.auth.me })
    },
  })
}
