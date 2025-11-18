"use client"

import { ReactNode, useEffect } from "react"
import { useAuthMe } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: user, isPending, isError } = useAuthMe()
  console.log('AdminGuard state', { user, isPending, isError })

  useEffect(() => {
    console.log('AdminGuard effect', { user, isPending, isError })
    if (isError || (!user && !isPending)) {
      router.replace("/login")
    } else if (user && user.role !== "admin") {
      router.replace("/tenders")
    }
  }, [isPending, isError, user, router])

  if (isPending) {
    return <div className="p-6 text-sm text-muted-foreground">Checking access…</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
