"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { isAuthenticated, signOut } from "@/lib/auth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isAnalyzePage = pathname === "/analyze"

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    setIsOpen(false)
  }

  const handleSignOut = () => {
    signOut()
    setIsAuth(false)
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight font-mono">Helios</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              How It Works
            </a>
          </nav>
        </div>
        {!isAnalyzePage && (
          <div className="hidden items-center gap-4 md:flex">
            {isAuth ? (
              <>
                <Button size="sm" asChild>
                  <Link href="/analyze">Start Analysis</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-in">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-6">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              How It Works
            </a>
            {!isAnalyzePage && (
              <div className="flex flex-col gap-2 pt-4">
                {isAuth ? (
                  <>
                    <Button size="sm" asChild>
                      <Link href="/analyze">Start Analysis</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/sign-in">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
