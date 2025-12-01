"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useTender } from "@/hooks/useTenders"
import { useSubmitBid, useBidsByTender } from "@/hooks/useBids"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuthMe } from "@/hooks/useAuth"
import { useCancelTender, useCloseTender, useAwardTender } from "@/hooks/useTenders"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { LoadingIcon } from "@/components/ui/loading"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCreateEvaluation } from "@/hooks/useEvaluations"

interface Props {
  params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
  const id = (use(params as any) as { id: string }).id
  const { data: tender, isPending, isError, error } = useTender(id)
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const { mutateAsync, isPending: isSubmitting, error: submitError } = useSubmitBid(id)
  const { data: user } = useAuthMe()
  const { mutateAsync: cancelAsync, isPending: isCancelling, error: cancelError } = useCancelTender()
  const { mutateAsync: closeAsync, isPending: isClosing, error: closeError } = useCloseTender()
  const { mutateAsync: awardAsync, isPending: isAwarding } = useAwardTender()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)
  const { toast } = useToast()
  const { data: bids } = useBidsByTender(id)
  const { mutateAsync: createEvalAsync, isPending: isSavingEval } = useCreateEvaluation()
  const [evalOpen, setEvalOpen] = useState(false)
  const [evalBidId, setEvalBidId] = useState<string>("")
  const [evalTechScore, setEvalTechScore] = useState<number>(0)
  const [evalFinScore, setEvalFinScore] = useState<number>(0)
  const [evalRemarks, setEvalRemarks] = useState<string>("")

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

  async function onCloseTender() {
    if (!tender) return
    await closeAsync(tender.id)
    toast({ title: "Success", description: "Tender closed" })
    setCloseConfirmOpen(false)
  }

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
              <h1 className="text-2xl font-semibold">Tender {id}</h1>
              <Link href="/tenders" className="text-sm underline">
                Back to tenders
              </Link>
            </div>
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
                    {closeError && (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{(closeError as any)?.message ?? "Failed to close tender"}</AlertDescription>
                      </Alert>
                    )}
                    <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                      Cancel Tender
                    </Button>
                    <Button variant="outline" onClick={() => setCloseConfirmOpen(true)} disabled={isClosing}>
                      {isClosing && <LoadingIcon />}
                      {isClosing ? "Closing…" : "Close Tender"}
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
                    <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Close this tender?</DialogTitle>
                          <DialogDescription>No new bids will be accepted.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCloseConfirmOpen(false)}>Close</Button>
                          <Button onClick={onCloseTender} disabled={isClosing}>
                            {isClosing && <LoadingIcon />}
                            {isClosing ? "Closing…" : "Confirm"}
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

          {user?.role === "admin" && (
            <Card className="border-l-4 border-ethiopia-green">
              <CardHeader>
                <CardTitle className="text-base">Bids for this tender</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bid ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Evaluation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids?.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.id}</TableCell>
                        <TableCell>{b.vendorId}</TableCell>
                        <TableCell>{b.createdAt ? new Date(b.createdAt).toLocaleString() : '-'}</TableCell>
                        <TableCell>
                          {(b as any).evaluation ? `Score ${(b as any).evaluation.score}` : 'Pending'}
                          {tender?.winningBidId && tender.winningBidId === b.id && (
                            <span className="ml-2 inline-flex items-center rounded bg-ethiopia-green px-2 py-0.5 text-xs text-white">Winner</span>
                          )}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => { setEvalBidId(b.id); setEvalTechScore(0); setEvalFinScore(0); setEvalRemarks(""); setEvalOpen(true) }}>Evaluate</Button>
                          <Button
                            size="sm"
                            className="bg-ethiopia-green hover:bg-ethiopia-green/90"
                            disabled={tender?.status !== "closed" || !!tender?.winningBidId || isAwarding}
                            onClick={async () => {
                              await awardAsync({ id, bidId: b.id })
                              toast({ title: 'Success', description: 'Bid awarded' })
                            }}
                          >
                            {isAwarding ? 'Awarding…' : 'Award'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bids && bids.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-sm text-muted-foreground">No bids yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Evaluate Bid</DialogTitle>
                      <DialogDescription>Bid ID: {evalBidId}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Technical Score (0-70)</label>
                        <Input type="number" min={0} max={70} value={evalTechScore} onChange={(e) => setEvalTechScore(e.currentTarget.valueAsNumber || 0)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Financial Score (0-30)</label>
                        <Input type="number" min={0} max={30} value={evalFinScore} onChange={(e) => setEvalFinScore(e.currentTarget.valueAsNumber || 0)} />
                      </div>
                      <p className="text-xs text-muted-foreground">Total preview: {Math.round((evalTechScore || 0) + (evalFinScore || 0))} / 100</p>
                      <div>
                        <label className="text-sm font-medium">Remarks</label>
                        <Input value={evalRemarks} onChange={(e) => setEvalRemarks(e.currentTarget.value)} placeholder="Optional" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEvalOpen(false)}>Close</Button>
                      <Button
                        onClick={async () => {
                          await createEvalAsync({ bidId: evalBidId, technicalScore: evalTechScore, financialScore: evalFinScore, remarks: evalRemarks })
                          setEvalOpen(false)
                          toast({ title: 'Success', description: 'Evaluation saved' })
                        }}
                        disabled={isSavingEval || !evalBidId}
                      >
                        {isSavingEval && <LoadingIcon />}
                        {isSavingEval ? 'Saving…' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </main>
      </section>
    </div>
  )
}
