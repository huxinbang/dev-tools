"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Copy, RotateCcw, Trash2, XCircle, Zap } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false })

interface JsonToolState {
  input: string
  output: string
  indentSize: string
  isValid: boolean | null
  error: string
  preserveOriginal: boolean
}

const initialState: JsonToolState = {
  input: "",
  output: "",
  indentSize: "2",
  isValid: null,
  error: "",
  preserveOriginal: false, // Changed from true to false
}

export function JsonTool() {
  const [state, setState] = useLocalStorage<JsonToolState>("json-tool-state", initialState)
  const { toast } = useToast()

  const updateState = (updates: Partial<JsonToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Check if a string is valid JSON
  const isJsonString = (str: string): boolean => {
    if (typeof str !== "string") return false
    try {
      const parsed = JSON.parse(str)
      return typeof parsed === "object" && parsed !== null
    } catch {
      return false
    }
  }

  // Check if a field name suggests it contains a timestamp
  const isTimestampField = (fieldName: string): boolean => {
    const timestampKeywords = [
      "time",
      "timestamp",
      "created",
      "updated",
      "modified",
      "date",
      "expires",
      "expiry",
      "last",
      "first",
      "start",
      "end",
      "at",
      "when",
      "moment",
      "epoch",
      "unix",
    ]
    const lowerFieldName = fieldName.toLowerCase()
    return timestampKeywords.some((keyword) => lowerFieldName.includes(keyword))
  }

  // Convert timestamp to ISO string format in local timezone
  const convertTimestamp = (value: number): string => {
    try {
      // Handle both seconds and milliseconds
      // If the number is too large for seconds (> year 2100), assume milliseconds
      // If the number is reasonable for seconds (between 1970 and 2100), use as seconds
      let date: Date

      if (value > 4102444800) {
        // Year 2100 in seconds
        // Assume milliseconds
        date = new Date(value)
      } else if (value > 946684800) {
        // Year 2000 in seconds
        // Assume seconds
        date = new Date(value * 1000)
      } else {
        // Too small, might be invalid or very old
        return value.toString()
      }

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return value.toString()
      }

      // Get timezone offset in minutes
      const timezoneOffset = date.getTimezoneOffset()

      // Create a new date adjusted for local timezone
      const localDate = new Date(date.getTime() - timezoneOffset * 60000)

      // Get the ISO string and replace 'Z' with timezone offset
      const isoString = localDate.toISOString()

      // Format timezone offset as +/-HH:MM
      const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
      const offsetMinutes = Math.abs(timezoneOffset) % 60
      const offsetSign = timezoneOffset <= 0 ? "+" : "-"
      const timezoneString = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`

      // Replace 'Z' with the actual timezone offset
      return isoString.replace("Z", timezoneString)
    } catch {
      return value.toString()
    }
  }

  // Smart decode function that processes JSON recursively
  const smartDecode = (obj: any, parentKey = ""): any => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => smartDecode(item, `${parentKey}[${index}]`))
    }

    if (obj !== null && typeof obj === "object") {
      const result: any = {}

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key

        if (typeof value === "string") {
          // Try to decode JSON strings
          if (isJsonString(value)) {
            try {
              const parsed = JSON.parse(value)
              if (state.preserveOriginal) {
                result[key] = {
                  _smartDecoded: "JSON string decoded",
                  _original: value,
                  ...smartDecode(parsed, fullKey),
                }
              } else {
                result[key] = smartDecode(parsed, fullKey)
              }
            } catch {
              result[key] = value
            }
          } else {
            result[key] = value
          }
        } else if (typeof value === "number" && isTimestampField(key)) {
          // Convert timestamp fields
          if (state.preserveOriginal) {
            result[key] = {
              _smartDecoded: "Timestamp converted",
              _original: value,
              _converted: convertTimestamp(value),
            }
          } else {
            result[key] = convertTimestamp(value)
          }
        } else if (value !== null && typeof value === "object") {
          // Recursively process nested objects
          result[key] = smartDecode(value, fullKey)
        } else {
          result[key] = value
        }
      }

      return result
    }

    return obj
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

  const smartDecodeAndFormat = () => {
    try {
      const parsed = JSON.parse(state.input)
      const smartDecoded = smartDecode(parsed)
      const formatted = JSON.stringify(smartDecoded, null, Number.parseInt(state.indentSize))
      updateState({ output: formatted, isValid: true, error: "" })

      toast({
        title: "Smart Decode Complete!",
        description: "JSON strings decoded and timestamps converted",
      })
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
      created_time: 1640995200,
      updated_timestamp: 1640995200000,
      last_login: 1703980800,
      metadata: '{"theme": "dark", "notifications": true}',
      config: '{"api_key": "abc123", "timeout": 5000}',
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

  const insertComplexSample = () => {
    const complexSample = {
      user: {
        id: 12345,
        profile: '{"firstName": "Jane", "lastName": "Smith", "preferences": {"theme": "light", "language": "en"}}',
        timestamps: {
          created_at: 1640995200,
          last_modified_time: 1703980800000,
          expires_timestamp: 1735516800,
        },
      },
      events: [
        {
          event_time: 1703980800,
          data: '{"action": "login", "ip": "192.168.1.1", "user_agent": "Mozilla/5.0"}',
          metadata: '{"session_id": "sess_123", "duration": 3600}',
        },
        {
          event_time: 1703984400000,
          data: '{"action": "logout", "reason": "timeout"}',
          metadata: '{"session_duration": 7200}',
        },
      ],
      settings: '{"notifications": {"email": true, "push": false}, "privacy": {"analytics": false}}',
    }
    updateState({ input: JSON.stringify(complexSample) })
  }

  const [collapseAll, setCollapseAll] = useState(false);

  const handleExpandAll = () => setCollapseAll(false);
  const handleCollapseAll = () => setCollapseAll(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
          <p className="text-muted-foreground mt-2">
            Format, validate, and manipulate JSON data with Smart Decode for nested JSON and timestamps
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

        <div className="flex items-center gap-2">
          <Label htmlFor="preserve-original" className="cursor-pointer">
            <input
              type="checkbox"
              id="preserve-original"
              className="mr-2"
              checked={state.preserveOriginal}
              onChange={(e) => updateState({ preserveOriginal: e.target.checked })}
            />
            Preserve Original Values
          </Label>
        </div>

        <Button variant="outline" onClick={insertSample}>
          Insert Sample
        </Button>

        <Button variant="outline" onClick={insertComplexSample}>
          Insert Complex Sample
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
              <Button
                onClick={smartDecodeAndFormat}
                disabled={!state.input.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Smart Decode
              </Button>
            </div>
            <div className="flex gap-2">
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
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExpandAll}>
                Expand All
              </Button>
              <Button variant="outline" onClick={handleCollapseAll}>
                Collapse All
              </Button>
            </div>
            <ReactJson
              src={state.output ? JSON.parse(state.output) : {}}
              name={false}
              shouldCollapse={(field) => collapseAll}
              displayDataTypes={false}
              enableClipboard={false}
              style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}
            />
            <Button variant="outline" onClick={handleCopy} disabled={!state.output} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Formatted JSON
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Zap className="h-5 w-5" />
            Smart Decode Features
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <ul className="space-y-1">
            <li>
              • <strong>JSON String Detection:</strong> Automatically detects and decodes JSON strings within fields
            </li>
            <li>
              • <strong>Timestamp Conversion:</strong> Converts numeric fields with time-related names to ISO format in
              local timezone
            </li>
            <li>
              • <strong>Smart Detection:</strong> Handles both seconds and milliseconds timestamps automatically
            </li>
            <li>
              • <strong>Nested Processing:</strong> Recursively processes all nested objects and arrays
            </li>
            <li>
              • <strong>Original Preservation (Optional):</strong> Option to keep original values alongside decoded
              versions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
