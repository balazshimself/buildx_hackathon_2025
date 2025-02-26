'use client';

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { FileUp, Plus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Quiz from "@/components/quiz"
import { Link } from "@/components/ui/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatePresence, motion } from "framer-motion"

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [questions, setQuestions] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [mainTopic, setMainTopic] = useState("")
  const [userInput, setUserInput] = useState("")
  const [activeTab, setActiveTab] = useState("topics")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isSafari && isDragging) {
      toast.error("Safari does not support drag & drop. Please use the file picker.")
      return
    }

    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      const isValidType = [
        "application/pdf",
        "text/plain",
        "text/html",
        "text/css",
        "text/javascript",
        "application/json",
        "application/xml",
        "text/xml",
        "text/markdown",
      ].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      return isValidType && isValidSize
    })

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only files under 5MB are allowed.")
    }
    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const text = await file.text()
        const json = JSON.parse(text)
        if (json.mainTopic && json.subTopics) {
          setMainTopic(json.mainTopic)
          setUserInput(json.subTopics.join(", "))
        }
      } catch (error) {
        toast.error("Invalid JSON file format")
      }
    }
  }

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async () => {
    setError(null)
    setIsLoading(true)

    if (!mainTopic || !userInput) {
      setActiveTab("topics")
      setError("No topics uploaded yet!")
      setIsLoading(false)
      return
    }

    if (files.length === 0) {
      setActiveTab("pdf")
      setError("No files uploaded yet!")
      setIsLoading(false)
      return
    }

    try {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        })),
      )

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: encodedFiles,
          mainTopic,
          subTopics: userInput.split(",").map(s => s.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error("API error")
      }

      const result = await response.json()
      console.log("API response:", result)
      setQuestions(result)
      // setTitle(result.title || "Generated Quiz")
    } catch (error) {
      console.error("Error in submit:", error)
      toast.error("Failed to generate quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearFiles = () => {
    setFiles([])
    setQuestions([])
  }

  const jsonExample = {
    mainTopic: "Respiratory System",
    subTopics: ["Anatomy of the Respiratory System", "Mechanics of Breathing"],
  }
  mainTopic

  if (questions.length > 0) {
    return <Quiz questions={questions} mainTopic={mainTopic} subTopics={userInput.split(",").map(s => s.trim())} clearFiles={clearFiles} />
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center flex-col items-center"
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>)
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">{"(PDFs only)"}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="rounded-full bg-primary/10 p-2">
              <FileUp className="h-6 w-6" />
            </div>
            <Plus className="h-4 w-4" />
            <div className="rounded-full bg-primary/10 p-2">
              <Loader2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Revision Quiz Generator AI</CardTitle>
            <CardDescription className="text-base">
              Upload files and specify topics to generate an interactive quiz using the{" "}
              <Link href="https://sdk.vercel.ai">AI SDK</Link> and{" "}
              <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                Google&apos;s Gemini Pro
              </Link>
              .
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="topics" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Give the topics in the text fields or upload a{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="underline">.json</TooltipTrigger>
                    <TooltipContent>
                      <pre className="p-2">{JSON.stringify(jsonExample, null, 2)}</pre>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>{" "}
                file
              </div>
              <Input
                placeholder={`Main topic (e.g. ${jsonExample.mainTopic})`}
                value={mainTopic}
                onChange={(e) => setMainTopic(e.target.value)}
              />
              <Input
                placeholder={`Comma-separated subtopics (e.g. ${jsonExample.subTopics})`}
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value)
                }}
              />
              <div className="flex justify-center">
                <label className="cursor-pointer w-full">
                  <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
                  <Button variant="outline" className="w-full" asChild>
                    <span>Upload JSON File</span>
                  </Button>
                </label>
              </div>
            </TabsContent>
            <TabsContent value="pdf" className="space-y-4">
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50">
              <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.html,.css,.js,.json,.xml,.md"
                  className="absolute inset-0 opacity-0 cursorhandleFil-pointer"
                  multiple
                />
                <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-foreground">{`${files.length} file(s) ready. Click or drag to upload more!`}</span>
                  ) : (
                    <span>Drop your file(s) here or click to browse.</span>
                  )}
                </p>
              </div>
              {files.length > 0 && (
                // REMOVE FILE
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          <Button onClick={handleSubmit} className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Quiz...</span>
              </span>) : ("Generate Quiz")}
          </Button>
        </CardContent>
      </Card>
      {error && <div className="mt-4 p-4 text-sm text-red-500 bg-red-500/10 rounded">{error}</div>}
    </div>
  )
}