export default function Footer() {
  return (
    <footer className="border-t bg-white/70 backdrop-blur dark:bg-zinc-900/60 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Ethiopian Bidding System
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
        </nav>
      </div>
    </footer>
  )
}
