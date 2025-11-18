"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminStats {
  activeTenders: number
  closedTenders: number
  cancelledTenders: number
  totalBids: number
  pendingEvaluations: number
  completedEvaluations: number
}

export default function Page() {
  const { data: stats, isPending } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      return apiFetch('/admin/stats')
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto max-w-6xl space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h1 className="text-2xl font-semibold">📊 Admin Dashboard</h1>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
            <div className="mt-4">
              <Link href="/admin/tenders/new">
                <Button className="bg-ethiopia-green hover:bg-ethiopia-green/90">➕ Create Tender</Button>
              </Link>
            </div>
            {isPending && <p className="mt-3 text-sm text-muted-foreground">Loading statistics...</p>}
          </div>

          {stats && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Tenders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.activeTenders}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Closed Tenders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.closedTenders}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Cancelled Tenders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.cancelledTenders}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Bids
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalBids}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending Evaluations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingEvaluations}</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ethiopia-green">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completed Evaluations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{stats.completedEvaluations}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  )
}
