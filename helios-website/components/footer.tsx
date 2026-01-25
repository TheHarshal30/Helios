import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-bold text-background">H</span>
            </div>
            <span className="text-lg font-semibold tracking-tight font-mono">Helios</span>
          </Link>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            AI-powered insurance analysis platform helping businesses understand their coverage and identify risks.
          </p>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Helios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
