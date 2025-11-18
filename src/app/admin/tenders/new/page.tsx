"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTenderSchema } from "@/lib/validators"
import { useCreateTender } from "@/hooks/useTenders"
import { useToast } from "@/components/ui/toast"
import { LoadingIcon } from "@/components/ui/loading"

export default function Page() {
  const router = useRouter()
  const form = useForm<z.infer<typeof createTenderSchema>>({
    resolver: zodResolver(createTenderSchema),
    defaultValues: { title: "", description: "", deadline: "" },
    mode: "onChange",
  })
  const { mutateAsync, isPending, error } = useCreateTender()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof createTenderSchema>) {
    await mutateAsync(values)
    toast({ title: "Success", description: "Tender created" })
    router.replace("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto max-w-2xl space-y-4">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h1 className="text-2xl font-semibold">New Tender</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <p className="mb-3 text-sm text-red-600">{(error as any)?.message ?? "Failed to create tender"}</p>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Tender title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          Must be at least 30 days from now (Ethiopian Procurement Law)
                        </p>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={!form.formState.isValid || isPending}>
                    {isPending && <LoadingIcon />}
                    {isPending ? "Creating..." : "Create"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </section>
    </div>
  )
}
