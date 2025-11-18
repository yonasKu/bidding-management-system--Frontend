import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#009639]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[-10%] bottom-[-10%] h-64 w-64 rounded-full bg-[#FEDD00]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EF2B2D]/20 blur-3xl" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:text-emerald-300">Transparent Procurement for Ethiopia</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Ethiopian Bidding System
            </h1>
            <p className="max-w-prose text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Publish tenders, submit bids, and evaluate results with a modern, secure, and compliant platform.
              Built for Ethiopian institutions and vendors with local regulations, calendar, currency, and regions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/tenders">
                <Button className="bg-[#009639] hover:bg-[#0b7a33] text-white">Browse Tenders</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Create Vendor Account</Button>
              </Link>
              <Link href="/login" className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300">
                Sign in
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xl">✅ 30‑day minimum deadline</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Compliant with Procurement Directive No. 430/2018.</div>
              </div>
              <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xl">📅 Ethiopian calendar</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Dual date display with accurate conversion.</div>
              </div>
              <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xl">💰 Birr currency</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Precise ETB formatting and totals.</div>
              </div>
              <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xl">🔒 Secure & role‑based</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">JWT auth, vendor/admin roles, file validation.</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0F47AF]/15" />
                <div>
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Public Bid Opening</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Date, time, and location tracking</div>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Evaluation</span>
                  <span className="font-medium">70/30 split</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Bid Security</span>
                  <span className="font-medium">2–5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Regions</span>
                  <span className="font-medium">All 13 regions</span>
                </div>
              </div>
              <div className="mt-5">
                <Link href="/tenders">
                  <Button className="w-full">Explore Active Tenders</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
