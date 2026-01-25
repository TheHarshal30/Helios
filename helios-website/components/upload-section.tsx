"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Sparkles } from "lucide-react"

export function UploadSection({ onFilesUploaded }: { onFilesUploaded?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleProcessFiles = () => {
    if (onFilesUploaded && files.length > 0) {
      onFilesUploaded(files)
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-mono">
            Upload Your Insurance Policies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drop your policy documents and let our AI extract insights, identify gaps, and provide recommendations
          </p>
        </div>

        <div className="relative">
          <div
            className={
              isDragging
                ? "relative rounded-2xl border-2 border-dashed transition-all duration-300 border-accent bg-accent/5 scale-[1.02]"
                : "relative rounded-2xl border-2 border-dashed transition-all duration-300 border-border/60 bg-gradient-to-br from-card/50 to-card"
            }
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input type="file" id="file-upload" className="hidden" accept=".pdf" multiple onChange={handleFileChange} />
            <label htmlFor="file-upload" className="cursor-pointer block p-12 sm:p-16">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <Upload className="h-10 w-10 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Drop your policy files here</h3>
                <p className="text-muted-foreground mb-1">
                  or <span className="text-accent font-medium hover:underline">browse</span> to choose files
                </p>
                <p className="text-xs text-muted-foreground mt-2">Supports: PDF • Max 10MB per file</p>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {files.length} {files.length === 1 ? "file" : "files"} ready
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                  Clear all
                </Button>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/60 hover:border-accent/40 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full h-12 text-base" onClick={handleProcessFiles}>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze {files.length} {files.length === 1 ? "Policy" : "Policies"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
