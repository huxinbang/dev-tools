"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RotateCcw, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface JsonToolState {
  input: string
  output: string
  indentSize: string
  isValid: boolean | null
  error: string
}

const initialState: JsonToolState = {
  input: "",
  output: "",
  indentSize: "2",
  isValid: null,
  error: "",
}

export function JsonTool() {
  const [state, setState] = useLocalStorage<JsonToolState>("json-tool-state", initialState)
  const { toast } = useToast()

  const updateState = (updates: Partial<JsonToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const validateAndFormat = () => {
    try {
      const parsed = JSON.parse(state.input)
      const formatted = JSON.stringify(parsed, null, Number.parseInt(state.indentSize))
      updateState({ output: formatted, isValid: true, error: "" })
    } catch (err) {
      updateState({
        isValid: false,
        error: err instanceof Error ? err.message : "Invalid JSON",
        output: "",
      })
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(state.input)
      const minified = JSON.stringify(parsed)
      updateState({ output: minified, isValid: true, error: "" })
    } catch (err) {
      updateState({
        isValid: false,
        error: err instanceof Error ? err.message : "Invalid JSON",
        output: "",
      })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.output)
      toast({
        title: "Copied!",
        description: "Formatted JSON copied to clipboard",
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
    updateState({ input: "", output: "", isValid: null, error: "" })
  }

  const handleClearHistory = () => {
    setState(initialState)
    toast({
      title: "History Cleared",
      description: "All saved data has been cleared",
    })
  }

  const insertSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
      hobbies: ["reading", "swimming", "coding"],
      isActive: true,
    }
    updateState({ input: JSON.stringify(sample) })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
          <p className="text-muted-foreground mt-2">
            Format, validate, and manipulate JSON data with syntax highlighting
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="indent">Indent Size:</Label>
          <Select value={state.indentSize} onValueChange={(value) => updateState({ indentSize: value })}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={insertSample}>
          Insert Sample
        </Button>

        {state.isValid !== null && (
          <div className={`flex items-center gap-2 ${state.isValid ? "text-green-600" : "text-red-600"}`}>
            {state.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{state.isValid ? "Valid JSON" : "Invalid JSON"}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
            <CardDescription>Paste your JSON data here to format and validate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='{"name": "John", "age": 30}'
              value={state.input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="min-h-[300px] font-mono text-sm"
            />
            {state.error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{state.error}</div>}
            <div className="flex gap-2">
              <Button onClick={validateAndFormat} disabled={!state.input.trim()} className="flex-1">
                Format
              </Button>
              <Button variant="outline" onClick={minifyJson} disabled={!state.input.trim()}>
                Minify
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formatted Output</CardTitle>
            <CardDescription>Formatted and validated JSON result</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={state.output}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Formatted JSON will appear here..."
            />
            <Button variant="outline" onClick={handleCopy} disabled={!state.output} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Formatted JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
