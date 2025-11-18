"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEvaluationsList, useCreateEvaluation } from "@/hooks/useEvaluations"
import { evaluationSchema } from "@/lib/validators"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { LoadingIcon } from "@/components/ui/loading"

export default function Page() {
  const { data, isPending, isError, error } = useEvaluationsList()
  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { bidId: "", score: 0, remarks: "" },
    mode: "onChange",
  })
  const { mutateAsync, isPending: isSubmitting, error: submitError } = useCreateEvaluation()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof evaluationSchema>) {
    await mutateAsync(values)
    form.reset({ bidId: "", score: 0, remarks: "" })
    toast({ title: "Success", description: "Evaluation created" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto max-w-5xl space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h1 className="text-2xl font-semibold">Evaluations</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              {(submitError as any) && (
                <p className="mb-3 text-sm text-red-600">{(submitError as any)?.message ?? "Failed to create"}</p>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="bidId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bid ID</FormLabel>
                        <FormControl>
                          <Input placeholder="bid_xxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score (0-100)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={field.value ?? 0}
                            onChange={(e) => {
                              const v = e.currentTarget.valueAsNumber
                              field.onChange(Number.isNaN(v) ? 0 : v)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional comments" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-3">
                    <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                      {isSubmitting && <LoadingIcon />}
                      {isSubmitting ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
              {isError && (
                <p className="text-sm text-red-600">{(error as any)?.message ?? "Failed to load evaluations"}</p>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Bid</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.id}</TableCell>
                      <TableCell>{e.bidId}</TableCell>
                      <TableCell>{e.score}</TableCell>
                      <TableCell>{e.remarks ?? "-"}</TableCell>
                      <TableCell>{e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}</TableCell>
                    </TableRow>
                  ))}
                  {data && data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        No evaluations yet.
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
