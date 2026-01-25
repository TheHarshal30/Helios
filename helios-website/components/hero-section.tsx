"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { isAuthenticated } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [displayedText1, setDisplayedText1] = useState("")
  const [displayedText2, setDisplayedText2] = useState("")
  const [isTypingDone, setIsTypingDone] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const text1 = "Understand your"
  const text2 = "insurance coverage."

  const codeLines = [
    "import { createClient } from '@devflow/sdk'",
    "import { cache } from 'react'",
    "",
    "const client = createClient({",
    "  project: 'my-app',",
    "  region: 'auto'",
    "})",
    "",
    "export const getUser = cache(async (id) => {",
    "  return client.users.get(id)",
    "})",
    "",
    "export async function Dashboard() {",
    "  const user = await getUser('1')",
    "  const analytics = await client.analytics()",
    "  return <DashboardView data={analytics} />",
    "}",
    "",
    "// API Route Handler",
    "export async function GET(request: Request) {",
    "  const data = await client.query({",
    "    metrics: ['pageviews', 'sessions'],",
    "    period: '7d'",
    "  })",
    "  return Response.json(data)",
    "}",
    "",
    "// Edge Middleware",
    "export function middleware(req: Request) {",
    "  const geo = req.headers.get('x-geo')",
    "  return client.route(geo)",
    "}",
  ]

  useEffect(() => {
    let currentIndex = 0
    const fullText = text1 + "|" + text2

    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        const currentChar = fullText.substring(0, currentIndex)
        const parts = currentChar.split("|")
        setDisplayedText1(parts[0] || "")
        setDisplayedText2(parts[1] || "")
        currentIndex++
      } else {
        clearInterval(typeInterval)
        setIsTypingDone(true)
      }
    }, 80)

    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    interface GridDot {
      x: number
      y: number
      direction: "horizontal" | "vertical"
      speed: number
      size: number
      opacity: number
      color: string
      targetX: number
      targetY: number
      trail: { x: number; y: number }[]
    }

    const colors = ["rgba(255, 255, 255, 0.5)"]
    const gridSize = 64
    const dotCount = 30

    const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize

    const gridDots: GridDot[] = []

    for (let i = 0; i < dotCount; i++) {
      const isHorizontal = Math.random() > 0.5
      const x = snapToGrid(Math.random() * canvas.offsetWidth)
      const y = snapToGrid(Math.random() * canvas.offsetHeight)

      gridDots.push({
        x,
        y,
        direction: isHorizontal ? "horizontal" : "vertical",
        speed: Math.random() * 9 + 7.5,
        size: Math.random() * 2 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        targetX: x,
        targetY: y,
        trail: [],
      })
    }

    let animationId: number
    let lastTime = 0
    const frameInterval = 1000 / 30

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate)

      const deltaTime = currentTime - lastTime
      if (deltaTime < frameInterval) return
      lastTime = currentTime - (deltaTime % frameInterval)

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      gridDots.forEach((dot) => {
        dot.trail.unshift({ x: dot.x, y: dot.y })
        if (dot.trail.length > 10) dot.trail.pop()

        if (dot.direction === "horizontal") {
          if (Math.abs(dot.x - dot.targetX) < dot.speed) {
            dot.x = dot.targetX
            if (Math.random() > 0.7) {
              dot.direction = "vertical"
              const steps = Math.floor(Math.random() * 5) + 1
              dot.targetY = dot.y + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize
            } else {
              const steps = Math.floor(Math.random() * 8) + 2
              dot.targetX = dot.x + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize
            }
          } else {
            dot.x += dot.x < dot.targetX ? dot.speed : -dot.speed
          }
        } else {
          if (Math.abs(dot.y - dot.targetY) < dot.speed) {
            dot.y = dot.targetY
            if (Math.random() > 0.7) {
              dot.direction = "horizontal"
              const steps = Math.floor(Math.random() * 8) + 2
              dot.targetX = dot.x + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize
            } else {
              const steps = Math.floor(Math.random() * 5) + 1
              dot.targetY = dot.y + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize
            }
          } else {
            dot.y += dot.y < dot.targetY ? dot.speed : -dot.speed
          }
        }

        if (dot.x < -gridSize) {
          dot.x = canvas.offsetWidth + gridSize
          dot.targetX = dot.x
          dot.trail = []
        }
        if (dot.x > canvas.offsetWidth + gridSize) {
          dot.x = -gridSize
          dot.targetX = dot.x
          dot.trail = []
        }
        if (dot.y < -gridSize) {
          dot.y = canvas.offsetHeight + gridSize
          dot.targetY = dot.y
          dot.trail = []
        }
        if (dot.y > canvas.offsetHeight + gridSize) {
          dot.y = -gridSize
          dot.targetY = dot.y
          dot.trail = []
        }

        if (dot.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(dot.x, dot.y)
          for (let i = 0; i < dot.trail.length; i++) {
            ctx.lineTo(dot.trail[i].x, dot.trail[i].y)
          }
          ctx.strokeStyle = dot.color
          ctx.globalAlpha = dot.opacity * 0.4
          ctx.lineWidth = dot.size
          ctx.lineCap = "round"
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.globalAlpha = dot.opacity * 0.15
        ctx.fill()

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.globalAlpha = dot.opacity
        ctx.fill()
      })

      ctx.globalAlpha = 1
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleStartAnalysis = () => {
    if (isAuthenticated()) {
      router.push("/analyze")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-28 sm:pb-16 lg:pt-36">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            AI-Powered Insurance Analysis
          </div>

          <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl relative">
            <span className="invisible" aria-hidden="true">
              <span className="text-balance">Understand your</span>
              <br />
              <span className="text-balance">insurance coverage.</span>
            </span>

            <span className="absolute inset-0 flex flex-col items-center">
              <span className="text-balance bg-gradient-to-r from-[#FFEFBA] to-[#FFFFFF] bg-clip-text text-transparent">
                {displayedText1}
                {displayedText2 === "" && (
                  <span className="inline-block w-[3px] h-[0.9em] bg-accent ml-1 animate-pulse" />
                )}
              </span>
              <span className="text-balance bg-gradient-to-r from-[#E44D26] to-[#F16529] bg-clip-text text-transparent">
                {displayedText2}
                {displayedText2 !== "" && (
                  <span
                    className={`inline-block w-[3px] h-[0.9em] bg-accent ml-1 ${
                      isTypingDone ? "animate-blink" : "animate-pulse"
                    }`}
                  />
                )}
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            Upload your insurance policies, describe your business, and get AI-powered insights on coverage gaps, risks,
            and recommendations.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleStartAnalysis}>
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              See How It Works
            </Button>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 blur-3xl opacity-50" />

          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-2xl">
            <div className="aspect-video w-full">
              <img
                src="/modern-insurance-dashboard-analytics-interface-wit.jpg"
                alt="Helios Insurance Analysis Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
