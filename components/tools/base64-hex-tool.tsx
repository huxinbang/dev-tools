"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { base64ToHex, hexToBase64 } from "@/lib/utils"

export function Base64HexTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"base64-to-hex" | "hex-to-base64">("base64-to-hex")
  const { toast } = useToast()

  const handleConvert = () => {
    try {
      if (mode === "base64-to-hex") {
        setOutput(base64ToHex(input))
      } else {
        setOutput(hexToBase64(input))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Conversion failed",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "Output copied to clipboard",
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
    setInput("")
    setOutput("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Base64 ↔ Hex Converter</h1>
        <p className="text-muted-foreground mt-2">Convert between Base64 and hexadecimal representations</p>
      </div>

      <div className="flex gap-4">
        <Button variant={mode === "base64-to-hex" ? "default" : "outline"} onClick={() => setMode("base64-to-hex")}>
          Base64 → Hex
        </Button>
        <Button variant={mode === "hex-to-base64" ? "default" : "outline"} onClick={() => setMode("hex-to-base64")}>
          Hex → Base64
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              {mode === "base64-to-hex" ? "Enter Base64 string" : "Enter hexadecimal string"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === "base64-to-hex" ? "SGVsbG8gV29ybGQ=" : "48656C6C6F20576F726C64"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleConvert} disabled={!input.trim()} className="flex-1">
                Convert
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>{mode === "base64-to-hex" ? "Hexadecimal result" : "Base64 result"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              className="min-h-[200px] font-mono"
              placeholder="Result will appear here..."
            />
            <Button variant="outline" onClick={handleCopy} disabled={!output} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
