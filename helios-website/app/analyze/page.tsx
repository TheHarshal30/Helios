"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { isAuthenticated } from "@/lib/auth"
import { UploadSection } from "@/components/upload-section"
import { BusinessInfoSection } from "@/components/business-info-section"
import { DashboardPreview } from "@/components/dashboard-preview"
import { analyzeAfterUpload } from "@/lib/api"
import { fileURLToPath } from "url"

type UploadedFile = {
  name: string
  file: File
}

type BusinessData = {
  businessName: string
  industry: string
  employees: string
  revenue: string
  assets: string
  description: string
}

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"upload" | "business-info" | "dashboard">("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/sign-in")
    }
  }, [router])

  const handleFilesUploaded = (files: File []) => {
    const fileData = files.map(file => ({name: file.name, file}))
    setUploadedFiles(fileData)
    setStep("business-info")
  }
  const handleBusinessInfoSubmitted = async (data: BusinessData) => {
    setBusinessData(data)
    try{
      setLoading(true)

      const response = await analyzeAfterUpload(
        uploadedFiles.map(f => f.file),
        data
      )

      setAnalysisResult(response)
      setStep("dashboard")
    } catch(err){
      alert("Analysis failed")
    } finally {
      setLoading(false)
    }

  }


  if (!isAuthenticated()) {
    return null
  }

  const stepIndex = step === "upload" ? 0 : step === "business-info" ? 1 : 2

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out min-h-[calc(100vh-80px)]"
          style={{ transform: `translateX(-${stepIndex * 100}vw)` }}
        >
          {/* Upload Section - Full viewport width */}
          <div className="min-w-[100vw] flex items-center justify-center">
            <UploadSection onFilesUploaded={handleFilesUploaded} />
          </div>

          {/* Business Info Section - Full viewport width */}
          <div className="min-w-[100vw] flex items-center justify-center">
            <BusinessInfoSection onSubmit={handleBusinessInfoSubmitted} uploadedFilesCount={uploadedFiles.length} />
          </div>

          {/* Dashboard Section - Full viewport width */}
          <div className="min-w-[100vw] flex items-center justify-center">
            <DashboardPreview analysis={analysisResult} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
