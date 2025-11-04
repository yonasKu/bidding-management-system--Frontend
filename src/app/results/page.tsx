"use client"

import Link from "next/link"
import { useMyBids } from "@/hooks/useBids"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

export default function Page() {
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
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Bid Results</h1>
      {isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-sm text-red-600">{(error as any)?.message ?? "Failed to load bids"}</p>
      )}
      <Card>
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
  )
}
