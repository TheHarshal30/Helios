"use client"

import { Upload, FileSearch, Brain, BarChart3 } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Policies",
      description:
        "Upload one or more insurance policy PDFs. Our system supports all major commercial insurance formats.",
      step: "01",
    },
    {
      icon: FileSearch,
      title: "Describe Your Business",
      description: "Tell us about your business, assets, employees, and operations to help identify relevant risks.",
      step: "02",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Knowledge graph-based RAG extracts policy details and compares them against your business profile.",
      step: "03",
    },
    {
      icon: BarChart3,
      title: "Get Insights",
      description: "Receive a comprehensive dashboard showing coverage status, gaps, risks, and recommendations.",
      step: "04",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-mono">How Helios Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get comprehensive insurance insights in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -top-2 -right-2 text-6xl font-bold font-mono text-accent/10">
                    {step.step}
                  </div>
                  <div className="relative z-10 p-4 rounded-2xl bg-card border border-border/60">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold font-mono mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
