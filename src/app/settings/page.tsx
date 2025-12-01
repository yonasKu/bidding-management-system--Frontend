"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile, changePassword, uploadLicense } from "@/lib/account"
import { qk } from "@/lib/queryKeys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/toast"
import { LoadingIcon } from "@/components/ui/loading"

export default function SettingsPage() {
  const qc = useQueryClient()
  const { data: profile } = useQuery({ queryKey: qk.account.me, queryFn: getProfile })
  const { toast } = useToast()

  const profileForm = useForm<{ name: string; businessLicenseNumber: string; tinNumber: string }>({
    values: {
      name: profile?.name ?? "",
      businessLicenseNumber: (profile?.businessLicenseNumber as string) ?? "",
      tinNumber: (profile?.tinNumber as string) ?? "",
    },
    mode: "onChange",
  })

  const pwdForm = useForm<{ currentPassword: string; newPassword: string }>({
    defaultValues: { currentPassword: "", newPassword: "" },
    mode: "onChange",
  })
  const [file, setFile] = useState<File | null>(null)

  const mUpdate = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.account.me as any })
      qc.invalidateQueries({ queryKey: qk.auth.me as any })
      toast({ title: "Saved", description: "Profile updated" })
    },
  })
  const mPwd = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      pwdForm.reset({ currentPassword: "", newPassword: "" })
      toast({ title: "Password changed", description: "Use your new password next login" })
    },
  })
  const mUpload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file first")
      const res = await uploadLicense(file)
      await updateProfile({ licenseFilePath: res.path })
      return res
    },
    onSuccess: () => {
      setFile(null)
      qc.invalidateQueries({ queryKey: qk.account.me as any })
      toast({ title: "Uploaded", description: "License uploaded" })
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <main className="mx-auto space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile, password and license document</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={profileForm.handleSubmit(async (v) => {
                    await mUpdate.mutateAsync({
                      name: v.name,
                      businessLicenseNumber: v.businessLicenseNumber || null,
                      tinNumber: v.tinNumber || null,
                    })
                  })}
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="businessLicenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License No.</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. BLN-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="tinNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax Identification Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={mUpdate.isPending}>
                      {mUpdate.isPending && <LoadingIcon />}
                      {mUpdate.isPending ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...pwdForm}>
                <form
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={pwdForm.handleSubmit(async (v) => {
                    await mPwd.mutateAsync(v)
                  })}
                >
                  <FormField
                    control={pwdForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pwdForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={mPwd.isPending || !pwdForm.formState.isValid}>
                      {mPwd.isPending && <LoadingIcon />}
                      {mPwd.isPending ? "Changing…" : "Change Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business License Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)} />
                <Button onClick={() => mUpload.mutate()} disabled={mUpload.isPending || !file}>
                  {mUpload.isPending && <LoadingIcon />}
                  {mUpload.isPending ? "Uploading…" : "Upload"}
                </Button>
                {profile?.licenseFilePath && (
                  <a className="text-sm underline" href={profile.licenseFilePath} target="_blank" rel="noreferrer">View current</a>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </section>
    </div>
  )
}
