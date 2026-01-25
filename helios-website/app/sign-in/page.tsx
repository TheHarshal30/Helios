"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { setAuthenticated } from "@/lib/auth"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement authentication logic
    console.log("[v0] Sign in attempt with:", { email })

    // Simulate API call
    setTimeout(() => {
      setAuthenticated(true)
      setIsLoading(false)
      // Redirect to analyze page after successful sign in
      router.push("/analyze")
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-card border-border/60">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight font-mono">Sign In</h1>
              <p className="mt-2 text-muted-foreground">Access your insurance analysis dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
