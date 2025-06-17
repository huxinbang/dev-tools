"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import MD5 from "crypto-js/md5"
import { Copy, RotateCcw } from "lucide-react"
import { useState } from "react"

interface TextHashToolState {
  input: string
  md5: string
  sha1: string
  sha256: string
}

const initialState: TextHashToolState = {
  input: "",
  md5: "",
  sha1: "",
  sha256: "",
}

const calculateMD5 = (text: string): string => {
  return MD5(text).toString()
}

const calculateSHA1 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-1", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

const calculateSHA256 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function TextHashTool() {
  const [state, setState] = useLocalStorage<TextHashToolState>("text-hash-tool-state", initialState)
  const [isCalculating, setIsCalculating] = useState(false)
  const { toast } = useToast()

  const updateState = (updates: Partial<TextHashToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const handleCalculate = async () => {
    if (!state.input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to calculate hashes.",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)
    try {
      const [md5, sha1, sha256] = await Promise.all([
        Promise.resolve(calculateMD5(state.input)),
        calculateSHA1(state.input),
        calculateSHA256(state.input),
      ])
      updateState({ md5, sha1, sha256 })
    } catch (error) {
      let errorMessage = "Failed to calculate hashes. Please try again."
      if (error instanceof Error) {
        errorMessage = `Failed to calculate hashes: ${error.message}`
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleCopy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      toast({
        title: "Copied!",
        description: "Hash copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    updateState(initialState)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Text Hash Generator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate MD5, SHA-1, and SHA-256 hashes for text input
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Enter text to calculate hashes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text here..."
            value={state.input}
            onChange={(e) => updateState({ input: e.target.value })}
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleCalculate} disabled={!state.input.trim() || isCalculating} className="flex-1">
              {isCalculating ? "Calculating..." : "Calculate Hashes"}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>MD5</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={state.md5} readOnly className="min-h-[100px] font-mono text-sm" />
            <Button variant="outline" onClick={() => handleCopy(state.md5)} disabled={!state.md5} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SHA-1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={state.sha1} readOnly className="min-h-[100px] font-mono text-sm" />
            <Button variant="outline" onClick={() => handleCopy(state.sha1)} disabled={!state.sha1} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SHA-256</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={state.sha256} readOnly className="min-h-[100px] font-mono text-sm" />
            <Button variant="outline" onClick={() => handleCopy(state.sha256)} disabled={!state.sha256} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
