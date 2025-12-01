"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { qk } from "@/lib/queryKeys"
import { getReportsSummary } from "@/lib/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ranges = [
  { label: "All time", value: "" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 12 months", value: "12m" },
]

export default function AdminReportsPage() {
  const [range, setRange] = useState<string>("")
  const { data, isPending, isError, error } = useQuery({
    queryKey: qk.reports.summary(range || undefined),
    queryFn: () => getReportsSummary(range || undefined),
  })

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || ""
  const q = range ? `?range=${encodeURIComponent(range)}` : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold">Reports</h1>
              <div className="flex items-center gap-2">
                <label className="text-sm">Range</label>
                <select
                  className="rounded border bg-white px-2 py-1 text-sm dark:bg-zinc-900"
                  value={range}
                  onChange={(e) => setRange(e.currentTarget.value)}
                >
                  {ranges.map(r => (
                    <option key={r.label} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Open Tenders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {isPending ? "…" : isError ? "-" : data?.open ?? 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Closed Tenders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {isPending ? "…" : isError ? "-" : data?.closed ?? 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cancelled Tenders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {isPending ? "…" : isError ? "-" : data?.cancelled ?? 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Evaluations</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {isPending ? "…" : isError ? "-" : data?.evaluations ?? 0}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">CSV Exports</CardTitle>
            </CardHeader>
            <CardContent>
              {isError && (
                <p className="mb-3 text-sm text-red-600">{(error as any)?.message ?? "Failed to load summary"}</p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href={`${apiBase}/reports/tenders.csv${q}`} target="_blank" rel="noreferrer">
                  <Button variant="outline">Download Tenders CSV</Button>
                </Link>
                <Link href={`${apiBase}/reports/bids.csv${q}`} target="_blank" rel="noreferrer">
                  <Button variant="outline">Download Bids CSV</Button>
                </Link>
                <Link href={`${apiBase}/reports/evaluations.csv${q}`} target="_blank" rel="noreferrer">
                  <Button variant="outline">Download Evaluations CSV</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </section>
    </div>
  )
}
