"use client"

import { use } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { qk } from "@/lib/queryKeys"
import { getResultsByTender, type PublicResult } from "@/lib/results"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTender } from "@/hooks/useTenders"

interface Props {
  params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
  const id = (use(params as any) as { id: string }).id
  const { data: tender } = useTender(id)
  const { data, isPending, isError, error } = useQuery<PublicResult[]>({
    queryKey: qk.results.byTender(id),
    queryFn: () => getResultsByTender(id),
    enabled: !!id,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto max-w-3xl space-y-4">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-4 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Results for {tender?.title ?? id}</h1>
              <Link href={`/tenders/${id}`} className="text-sm underline">Back to tender</Link>
            </div>
          </div>
          <Card className="border-l-4 border-ethiopia-green">
            <CardHeader>
              <CardTitle className="text-base">Evaluated Bids</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
              {isError && (
                <p className="text-sm text-red-600">{(error as any)?.message ?? "Failed to load results"}</p>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bid</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Winner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((r) => (
                    <TableRow key={r.bidId}>
                      <TableCell>{r.bidId}</TableCell>
                      <TableCell>{r.score}</TableCell>
                      <TableCell>{r.remarks ?? "-"}</TableCell>
                      <TableCell>{r.isWinner ? "Yes" : "-"}</TableCell>
                    </TableRow>
                  ))}
                  {data && data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-sm text-muted-foreground">
                        No evaluated bids yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </section>
    </div>
  )
}
