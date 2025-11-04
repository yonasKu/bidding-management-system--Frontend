"use client"

import Link from "next/link"
import { useTendersList } from "@/hooks/useTenders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { formatEthiopianDate } from "@/lib/ethiopian-date"
import { formatETB } from "@/lib/currency"
import { getCategoryName, getRegionName } from "@/lib/ethiopian-terms"

export default function Page() {
  const [search, setSearch] = useState("")
  const [openOnly, setOpenOnly] = useState(false)
  const { data, isPending, isError, error } = useTendersList(
    search || openOnly ? { search, openOnly } : undefined
  )

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tenders</h1>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search tenders..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.currentTarget.checked)}
          />
          Open only
        </label>
      </div>
      {isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-sm text-red-600">{(error as any)?.message ?? "Failed to load tenders"}</p>
      )}
      <div className="grid gap-4">
        {data?.map((t) => (
          <Card key={t.id} className="border-l-4 border-ethiopia-green">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    <Link href={`/tenders/${t.id}`} className="underline">
                      {t.title}
                    </Link>
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    {(t as any).category && (
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName((t as any).category)}
                      </Badge>
                    )}
                    {(t as any).region && (
                      <Badge variant="outline" className="text-xs ethiopic-text">
                        {getRegionName((t as any).region)}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={t.status?.toUpperCase() === 'OPEN' ? 'default' : t.status?.toUpperCase() === 'CLOSED' ? 'secondary' : 'destructive'}
                  className={t.status?.toUpperCase() === 'OPEN' ? 'bg-ethiopia-green' : ''}
                >
                  {t.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {(t as any).estimatedValue && (
                <div>
                  <span className="text-sm font-medium">Estimated Value: </span>
                  <span className="text-sm font-semibold text-ethiopia-green">
                    {formatETB(Number((t as any).estimatedValue))}
                  </span>
                </div>
              )}
              {(t as any).deadline && (
                <div>
                  <span className="text-sm font-medium">Deadline: </span>
                  <span className="text-sm">
                    {new Date((t as any).deadline).toLocaleDateString('en-ET')}
                  </span>
                  <p className="text-xs text-muted-foreground ethiopic-text">
                    {formatEthiopianDate(new Date((t as any).deadline))}
                  </p>
                </div>
              )}
              {(t as any).openingDate && (
                <div>
                  <span className="text-sm font-medium">Bid Opening: </span>
                  <span className="text-sm">
                    {new Date((t as any).openingDate).toLocaleString('en-ET')}
                  </span>
                  {(t as any).openingLocation && (
                    <p className="text-xs text-muted-foreground">
                      📍 {(t as any).openingLocation}
                    </p>
                  )}
                </div>
              )}
              {(t as any).description && (
                <p className="text-sm text-muted-foreground">{(t as any).description}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {data && data.length === 0 && (
          <p className="text-sm text-muted-foreground">No tenders found.</p>
        )}
      </div>
    </main>
  )
}
