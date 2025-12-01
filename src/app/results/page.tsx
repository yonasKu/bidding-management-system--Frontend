"use client"

import Link from "next/link"
import { useMyBids } from "@/hooks/useBids"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { useAuthMe } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const { data: user } = useAuthMe()
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin')
    }
  }, [user, router])
  const { data, isPending, isError, error } = useMyBids()
  const { toast } = useToast()

  async function downloadBid(bidId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bids/${bidId}/download`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bid-${bidId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to download bid' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto max-w-5xl space-y-4">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h1 className="text-2xl font-semibold">📈 My Bid Results</h1>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
            {isPending && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
            {isError && (
              <p className="mt-3 text-sm text-red-600">{(error as any)?.message ?? "Failed to load bids"}</p>
            )}
          </div>

          <Card className="border-l-4 border-ethiopia-green">
            <CardHeader>
              <CardTitle className="text-base">Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Evaluation</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Link href={`/tenders/${b.tenderId}`} className="underline">
                      {b.tenderId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.status?.toUpperCase() === 'EVALUATED' ? 'default' : 'secondary'}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(b as any).evaluation ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Score: {(b as any).evaluation.score}/100
                        </p>
                        {(b as any).evaluation.remarks && (
                          <p className="text-sm text-muted-foreground">
                            {(b as any).evaluation.remarks}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => downloadBid(b.id)}>
                      Download PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">
                    You have not submitted any bids yet.
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
