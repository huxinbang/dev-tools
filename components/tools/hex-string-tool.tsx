"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function HexStringTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"hex-to-string" | "string-to-hex">("hex-to-string")
  const { toast } = useToast()

  // Format hex for human readability: group by 2 chars, space every 2 bytes
  const formatHex = (hex: string) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "").toUpperCase()
    return cleanHex.replace(/(.{2})/g, "$1 ").trim()
  }

  const hexToString = (hex: string) => {
    try {
      const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "")
      if (cleanHex.length % 2 !== 0) {
        throw new Error("Hex string length must be even")
      }
      let str = ""
      for (let i = 0; i < cleanHex.length; i += 2) {
        str += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16))
      }
      return str
    } catch {
      throw new Error("Invalid hex string")
    }
  }

  const stringToHex = (str: string) => {
    const hex = Array.from(str)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
    return formatHex(hex)
  }

  const handleConvert = () => {
    try {
      if (mode === "hex-to-string") {
        setOutput(hexToString(input))
      } else {
        setOutput(stringToHex(input))
      }
    } catch (error: any) {
      setOutput("")
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
        <h1 className="text-3xl font-bold">Hex ↔ String Converter</h1>
        <p className="text-muted-foreground mt-2">Convert between hexadecimal and string representations. Human-friendly hex formatting for easy editing and viewing.</p>
      </div>

      <div className="flex gap-4">
        <Button variant={mode === "hex-to-string" ? "default" : "outline"} onClick={() => setMode("hex-to-string")}>Hex → String</Button>
        <Button variant={mode === "string-to-hex" ? "default" : "outline"} onClick={() => setMode("string-to-hex")}>String → Hex</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              {mode === "hex-to-string" ? "Enter hexadecimal string" : "Enter plain string"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === "hex-to-string" ? "48656C6C6F20576F726C64" : "Hello World"}
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
            <CardDescription>{mode === "hex-to-string" ? "String result" : "Hexadecimal result"}</CardDescription>
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
