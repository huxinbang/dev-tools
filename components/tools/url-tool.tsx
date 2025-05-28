"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UrlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const { toast } = useToast()

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode URL component",
        variant: "destructive",
      })
    }
  }

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid URL encoded string",
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
        <h1 className="text-3xl font-bold">URL Component Encoder/Decoder</h1>
        <p className="text-muted-foreground mt-2">Encode or decode URL components for safe transmission in URLs</p>
      </div>

      <div className="flex gap-4">
        <Button variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>
          Encode
        </Button>
        <Button variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>
          Decode
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              {mode === "encode" ? "Enter text to URL encode" : "Enter URL encoded string to decode"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === "encode" ? "Hello World! @#$%" : "Hello%20World%21%20%40%23%24%25"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            <div className="flex gap-2">
              <Button
                onClick={mode === "encode" ? handleEncode : handleDecode}
                disabled={!input.trim()}
                className="flex-1"
              >
                {mode === "encode" ? "Encode" : "Decode"}
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
            <CardDescription>{mode === "encode" ? "URL encoded result" : "Decoded text result"}</CardDescription>
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
