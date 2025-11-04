"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loginSchema } from "@/lib/validators"
import { useLogin } from "@/hooks/useAuth"
import { me } from "@/lib/auth"
import { LoadingIcon } from "@/components/ui/loading"

export default function Page() {
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })
  const { mutateAsync, isPending, error } = useLogin()

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await mutateAsync(values)
    const user = await me()
    if (user?.role === "admin") router.replace("/admin")
    else router.replace("/tenders")
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      {error && (
        <p className="mb-3 text-sm text-red-600">{(error as any)?.message ?? "Login failed"}</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isValid || isPending} className="w-full">
            {isPending && <LoadingIcon />}
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </main>
  )
}
