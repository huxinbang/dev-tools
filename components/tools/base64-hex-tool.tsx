"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Copy, RotateCcw } from "lucide-react"
import { useState } from "react"

export function Base64HexTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"base64-to-hex" | "hex-to-base64">("base64-to-hex")
  const { toast } = useToast()

  const base64ToHex = (base64: string) => {
    try {
      const binary = atob(base64)
      let hex = ""
      for (let i = 0; i < binary.length; i++) {
        const hexByte = binary.charCodeAt(i).toString(16).padStart(2, "0")
        hex += hexByte
      }
      return hex.toUpperCase()
    } catch (error) {
      throw new Error("Invalid Base64 string")
    }
  }

  const hexToBase64 = (hex: string) => {
    try {
      // Remove any spaces or non-hex characters
      const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "")
      if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid hex string length")
      }

      let binary = ""
      for (let i = 0; i < cleanHex.length; i += 2) {
        const hexByte = cleanHex.substr(i, 2)
        const byte = Number.parseInt(hexByte, 16)
        binary += String.fromCharCode(byte)
      }
      return btoa(binary)
    } catch (error) {
      throw new Error("Invalid hex string")
    }
  }

  // 格式化 hex 输出为三列：地址、hex、ascii
  function formatHexView(hex: string): string {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "")
    let result = ""
    for (let offset = 0; offset < cleanHex.length; offset += 32) {
      const hexSlice = cleanHex.slice(offset, offset + 32)
      const bytes = hexSlice.match(/.{1,2}/g) || []
      const address = `0x${(offset / 2).toString(16).padStart(6, "0")}:`
      const hexPart = bytes.map(b => b.padEnd(2, " ")).join(" ")
      const asciiPart = bytes
        .map(b => {
          const code = parseInt(b, 16)
          return code >= 32 && code <= 126 ? String.fromCharCode(code) : "."
        })
        .join("")
      result += `${address} ${hexPart.padEnd(48, " ")} ${asciiPart}\n`
    }
    return result.trimEnd()
  }

  const handleConvert = () => {
    try {
      if (mode === "base64-to-hex") {
        const hex = base64ToHex(input)
        setOutput(formatHexView(hex))
      } else {
        const result = hexToBase64(input)
        setOutput(result)
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
