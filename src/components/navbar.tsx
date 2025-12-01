"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthMe, useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { LoadingIcon } from "@/components/ui/loading"
import { LanguageToggle } from "@/components/LanguageToggle"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: user } = useAuthMe()
  const { mutateAsync: doLogout, isPending } = useLogout()

  async function onLogout() {
    await doLogout()
    router.replace("/login")
  }

  const linkClass = (href: string) =>
    `text-sm ${pathname?.startsWith(href) ? "underline" : "hover:underline"}`

  return (
    <header className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            App
          </Link>
          <Link href="/tenders" className={linkClass("/tenders")}>
            Tenders
          </Link>
          {user && user.role !== "admin" && (
            <Link href="/results" className={linkClass("/results")}>
              Results
            </Link>
          )}
          {user?.role === "admin" && (
            <>
              <Link href="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
              <Link href="/admin/reports" className={linkClass("/admin/reports")}>
                Reports
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Link href="/settings" className={linkClass("/settings")}>
                Settings
              </Link>
              <Button size="sm" variant="outline" onClick={onLogout} disabled={isPending}>
                {isPending && <LoadingIcon />}
                {isPending ? "Signing out…" : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
