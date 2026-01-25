"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"


type PolicyAnalysis = {
  file_name: string
  summary: string
  recommendation: string
}

type BusinessRisk = {
  risks: Record<string, string[]>
  mandatory_coverages: string[]
  optional_coverages: string[]
}

type AnalysisResponse = {
  policies: PolicyAnalysis[]
  business_risk?: BusinessRisk | null
}





export function DashboardPreview({ analysis }: { analysis: AnalysisResponse | null }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const analysisResults = analysis?.policies ?? []
    if(!analysis || analysisResults.length == 0) {
    return (
      <section className="px-4 py-12 text-center">
        <p className= "text-muted-foreground">No analysis data available yet</p> 

      </section>
    )
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % analysisResults.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + analysisResults.length) % analysisResults.length)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Analysis Complete</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-mono">Policy Analysis Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Helios insights for each of your uploaded policies
          </p>
        </div>

        <div className="relative h-[650px] flex items-center justify-center mb-20">
          <div className="relative w-full max-w-3xl h-[600px]">
            {analysisResults.map((analysis, index) => {
              const offset = (index - currentIndex + analysisResults.length) % analysisResults.length
              const isActive = offset === 0
              const isNext = offset === 1
              const isPrevious = offset === analysisResults.length - 1

              return (
                <Card
                  key={index}
                  className={cn(
                    "absolute top-0 left-0 right-0 h-[600px] p-8 bg-gradient-to-br from-card to-card/80 border-2 transition-all duration-500 ease-out overflow-hidden",
                    isActive && "z-30 scale-100 opacity-100 rotate-0 shadow-2xl border-accent/40",
                    isNext &&
                      "z-20 scale-95 opacity-60 translate-y-4 translate-x-3 rotate-1 shadow-xl border-border/40",
                    isPrevious &&
                      "z-10 scale-90 opacity-40 -translate-y-4 -translate-x-3 -rotate-1 shadow-lg border-border/20",
                    !isActive && !isNext && !isPrevious && "z-0 scale-85 opacity-0 pointer-events-none",
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/40">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex-shrink-0">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold mb-1 font-mono truncate">{analysis.file_name}</h2>
                        <p className="text-sm text-muted-foreground">
                          Policy {index + 1} of {analysisResults.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Policy Summary
                          </h3>
                        </div>
                        <div className="p-5 rounded-xl bg-secondary/50 border border-border/40">
                          <p className="text-foreground leading-relaxed">{analysis.summary}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                            AI Recommendation
                          </h3>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 border border-accent/30 shadow-inner">
                          <p className="text-foreground leading-relaxed font-medium">{analysis.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-40">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-accent/40 bg-background/80 backdrop-blur-sm hover:bg-accent/10 hover:border-accent shadow-lg transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow-lg">
              {analysisResults.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60",
                  )}
                  aria-label={`Go to policy ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-accent/40 bg-background/80 backdrop-blur-sm hover:bg-accent/10 hover:border-accent shadow-lg transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {analysis.business_risk && (
          <div className="mt-12 p-6 rounded-xl border border-border bg-secondary/40">
            <h2 className="text-2xl font-bold mb-4 font-mono">
              Business Risk Analysis
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Mandatory Coverage</h3>
                <ul className="list-disc pl-5 text-sm">
                  {analysis.business_risk.mandatory_coverages.map((c) => (
                    <li key={c}>{c.replaceAll("_", " ")}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Optional Coverage</h3>
                <ul className="list-disc pl-5 text-sm">
                  {analysis.business_risk.optional_coverages.map((c) => (
                    <li key={c}>{c.replaceAll("_", " ")}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
