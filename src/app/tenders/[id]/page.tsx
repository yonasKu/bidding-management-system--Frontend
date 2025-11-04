"use client"

import { useState } from "react"
import Link from "next/link"
import { useTender } from "@/hooks/useTenders"
import { useSubmitBid } from "@/hooks/useBids"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuthMe } from "@/hooks/useAuth"
import { useCancelTender } from "@/hooks/useTenders"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { LoadingIcon } from "@/components/ui/loading"

interface Props {
  params: { id: string }
}

export default function Page({ params }: Props) {
  const { data: tender, isPending, isError, error } = useTender(params.id)
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const { mutateAsync, isPending: isSubmitting, error: submitError } = useSubmitBid(params.id)
  const { data: user } = useAuthMe()
  const { mutateAsync: cancelAsync, isPending: isCancelling, error: cancelError } = useCancelTender()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { toast } = useToast()

  async function onSubmit() {
    setLocalError(null)
    if (!file) {
      setLocalError("Please choose a PDF file")
      return
    }
    if (file.type !== "application/pdf") {
      setLocalError("File must be a PDF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError("File must be 10MB or less")
      return
    }
    await mutateAsync(file)
    toast({ title: "Success", description: "Bid submitted successfully" })
    setFile(null)
  }

  async function onCancelTender() {
    if (!tender) return
    await cancelAsync(tender.id)
    toast({ title: "Success", description: "Tender cancelled" })
    setConfirmOpen(false)
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tender {params.id}</h1>
        <Link href="/tenders" className="text-sm underline">
          Back to tenders
        </Link>
      </div>
      {isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-sm text-red-600">{(error as any)?.message ?? "Failed to load tender"}</p>
      )}
      {tender && (
        <Card>
          <CardHeader>
            <CardTitle>{tender.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Status: {tender.status}</p>
            {user?.role === "admin" && tender.status === "open" && (
              <div className="space-y-2">
                {cancelError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{(cancelError as any)?.message ?? "Failed to cancel tender"}</AlertDescription>
                  </Alert>
                )}
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                  Cancel Tender
                </Button>
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel this tender?</DialogTitle>
                      <DialogDescription>This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmOpen(false)}>Close</Button>
                      <Button variant="destructive" onClick={onCancelTender} disabled={isCancelling}>
                        {isCancelling && <LoadingIcon />}
                        {isCancelling ? "Cancelling…" : "Confirm"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Submit a bid (PDF, ≤10MB)</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {(localError || submitError) && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{localError ?? (submitError as any)?.message}</AlertDescription>
                </Alert>
              )}
              <Button onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting && <LoadingIcon />}
                {isSubmitting ? "Submitting…" : "Submit Bid"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
