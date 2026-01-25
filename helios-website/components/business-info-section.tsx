"use client"
import { submitBusinessInfo } from "@/lib/api"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Users, DollarSign, ArrowRight, FileCheck } from "lucide-react"

type BusinessData = {
  businessName: string
  industry: string
  employees: string
  revenue: string
  assets: string
  description: string
}

export function BusinessInfoSection({
  onSubmit,
  uploadedFilesCount,
}: {
  onSubmit?: (data: BusinessData) => void
  uploadedFilesCount: number
}) {
  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    industry: "",
    employees: "",
    revenue: "",
    assets: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Business info submitted:", formData)

    try {
      // Send business context to backend (risk engine later)
      await submitBusinessInfo(formData)

      if (onSubmit) {
        onSubmit(formData)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to submit business information. Please try again.")
    }
  }


  return (
    <section className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <FileCheck className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              {uploadedFilesCount} {uploadedFilesCount === 1 ? "Policy" : "Policies"} Uploaded
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-mono">Tell Us About Your Business</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us tailor the analysis to your specific business context and industry risks
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-card/50 to-card border border-border/60 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="businessName" className="text-base">
                  Business Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="Acme Corporation"
                    className="pl-10 h-11"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-base">
                  Industry
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., SaaS, Manufacturing, Retail"
                  className="h-11"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees" className="text-base">
                  Number of Employees
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="employees"
                    type="number"
                    placeholder="50"
                    className="pl-10 h-11"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="revenue" className="text-base">
                  Annual Revenue (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="1000000"
                    className="pl-10 h-11"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="assets" className="text-base">
                  Assets & Equipment
                </Label>
                <Textarea
                  id="assets"
                  placeholder="Describe your physical assets, machinery, vehicles, property..."
                  rows={3}
                  className="resize-none"
                  value={formData.assets}
                  onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description" className="text-base">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What does your business do? Any specific operations or risk factors..."
                  rows={4}
                  className="resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base">
              Generate Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
