"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, RotateCcw, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { hexToBytes, bytesToBase64, base64ToBytes } from "@/lib/utils"

interface Base64ToolState {
  input: string
  output: string
  mode: "encode" | "decode"
  hexMode: boolean
  outputType: "text" | "binary"
}

const initialState: Base64ToolState = {
  input: "",
  output: "",
  mode: "encode",
  hexMode: false,
  outputType: "text",
}

export function Base64Tool() {
  const [state, setState] = useLocalStorage<Base64ToolState>("base64-tool-state", initialState)
  const { toast } = useToast()

  const updateState = (updates: Partial<Base64ToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const isTextData = (bytes: Uint8Array): boolean => {
    // Check if data contains mostly printable ASCII characters
    let printableCount = 0
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i]
      // Consider printable: space (32) to tilde (126), plus common whitespace
      if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
        printableCount++
      }
    }
    // If more than 80% are printable, consider it text
    return printableCount / bytes.length > 0.8
  }

  const formatHexDump = (bytes: Uint8Array): string => {
    let result = ""
    const bytesPerLine = 16

    for (let i = 0; i < bytes.length; i += bytesPerLine) {
      // Offset
      const offset = i.toString(16).padStart(8, "0").toUpperCase()
      result += `${offset}  `

      // Hex bytes
      let hexPart = ""
      let asciiPart = ""

      for (let j = 0; j < bytesPerLine; j++) {
        if (i + j < bytes.length) {
          const byte = bytes[i + j]
          hexPart += byte.toString(16).padStart(2, "0").toUpperCase() + " "

          // ASCII representation
          if (byte >= 32 && byte <= 126) {
            asciiPart += String.fromCharCode(byte)
          } else {
            asciiPart += "."
          }
        } else {
          hexPart += "   "
          asciiPart += " "
        }

        // Add extra space after 8 bytes for readability
        if (j === 7) {
          hexPart += " "
        }
      }

      result += hexPart + " |" + asciiPart + "|\n"
    }

    return result.trim()
  }

  const handleEncode = () => {
    try {
      let output: string
      if (state.hexMode) {
        // Convert hex string to bytes, then to base64
        const bytes = hexToBytes(state.input)
        output = bytesToBase64(bytes)
      } else {
        // Regular text to base64
        output = btoa(state.input)
      }
      updateState({ output })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to encode",
        variant: "destructive",
      })
    }
  }

  const handleDecode = () => {
    try {
      const bytes = base64ToBytes(state.input)

      if (isTextData(bytes)) {
        // Output as text
        const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes)
        updateState({ output: text, outputType: "text" })
      } else {
        // Output as hex dump
        const hexDump = formatHexDump(bytes)
        updateState({ output: hexDump, outputType: "binary" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Base64 string. Please check your input.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.output)
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
    updateState({ input: "", output: "", outputType: "text" })
  }

  const handleClearHistory = () => {
    setState(initialState)
    toast({
      title: "History Cleared",
      description: "All saved data has been cleared",
    })
  }

  const insertHexSample = () => {
    updateState({ input: "48656C6C6F20576F726C6421", hexMode: true })
  }

  const insertBinarySample = () => {
    // This represents a small binary file (PNG header + some data)
    updateState({
      input: "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A49444154789C6300010000050001",
      hexMode: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Base64 Encoder/Decoder</h1>
          <p className="text-muted-foreground mt-2">
            Encode text or binary data to Base64, or decode Base64 strings back to text/binary
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Button
          variant={state.mode === "encode" ? "default" : "outline"}
          onClick={() => updateState({ mode: "encode" })}
        >
          Encode
        </Button>
        <Button
          variant={state.mode === "decode" ? "default" : "outline"}
          onClick={() => updateState({ mode: "decode" })}
        >
          Decode
        </Button>

        {state.mode === "encode" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hex-mode"
              checked={state.hexMode}
              onCheckedChange={(checked) => updateState({ hexMode: !!checked })}
            />
            <Label htmlFor="hex-mode">Input is hex string</Label>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={insertHexSample}>
            Insert Hex Sample
          </Button>
          <Button variant="outline" size="sm" onClick={insertBinarySample}>
            Insert Binary Sample
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${state.mode === "decode" && state.outputType === "binary" ? "lg:grid-cols-1" : "lg:grid-cols-2"}`}
      >
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              {state.mode === "encode"
                ? state.hexMode
                  ? "Enter hex string to encode"
                  : "Enter text to encode"
                : "Enter Base64 string to decode"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={
                state.mode === "encode"
                  ? state.hexMode
                    ? "48656C6C6F20576F726C6421"
                    : "Hello World!"
                  : "SGVsbG8gV29ybGQh"
              }
              value={state.input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={state.mode === "encode" ? handleEncode : handleDecode}
                disabled={!state.input.trim()}
                className="flex-1"
              >
                {state.mode === "encode" ? "Encode" : "Decode"}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={state.mode === "decode" && state.outputType === "binary" ? "lg:col-span-1" : ""}>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              {state.mode === "encode"
                ? "Base64 encoded result"
                : state.outputType === "text"
                  ? "Decoded text result"
                  : "Binary data (hex dump with ASCII)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={state.output}
              readOnly
              className={`text-sm font-mono ${
                state.mode === "decode" && state.outputType === "binary" ? "min-h-[400px] text-xs" : "min-h-[200px]"
              }`}
              placeholder="Result will appear here..."
            />
            <Button variant="outline" onClick={handleCopy} disabled={!state.output} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            {state.mode === "decode" && state.outputType === "binary" && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <strong>Binary data detected:</strong> Showing hex dump with offsets and ASCII representation.
                Non-printable characters are shown as dots (.).
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
