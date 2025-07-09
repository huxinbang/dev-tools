"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Copy, RotateCcw, CheckCircle, XCircle, Trash2, FileText, Binary } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { showErrorToast } from "@/lib/utils"

interface ProtobufToolState {
  input: string
  protoDefinition: string
  selectedMessage: string
  output: string
  mode: "with-proto" | "without-proto"
  isValid: boolean | null
  error: string
}

const initialState: ProtobufToolState = {
  input: "",
  protoDefinition: "",
  selectedMessage: "",
  output: "",
  mode: "without-proto",
  isValid: null,
  error: "",
}

export function ProtobufTool() {
  const [state, setState] = useLocalStorage<ProtobufToolState>("protobuf-tool-state", initialState)
  const { toast } = useToast()

  const updateState = (updates: Partial<ProtobufToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Basic protobuf wire type decoder (without schema)
  const decodeWithoutProto = (buffer: Uint8Array): any => {
    const result: any = {}
    let offset = 0

    while (offset < buffer.length) {
      try {
        // Read varint for field number and wire type
        const { value: tag, newOffset } = readVarint(buffer, offset)
        offset = newOffset

        const fieldNumber = tag >>> 3
        const wireType = tag & 0x7

        let fieldValue: any

        switch (wireType) {
          case 0: // Varint
            const { value: varintValue, newOffset: varintOffset } = readVarint(buffer, offset)
            fieldValue = varintValue
            offset = varintOffset
            break

          case 1: // 64-bit
            if (offset + 8 > buffer.length) throw new Error("Insufficient data for 64-bit field")
            fieldValue = `0x${Array.from(buffer.slice(offset, offset + 8))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")}`
            offset += 8
            break

          case 2: // Length-delimited
            const { value: length, newOffset: lengthOffset } = readVarint(buffer, offset)
            offset = lengthOffset
            if (offset + length > buffer.length) throw new Error("Insufficient data for length-delimited field")

            const data = buffer.slice(offset, offset + length)
            offset += length

            // Try to decode as string first
            try {
              const str = new TextDecoder("utf-8", { fatal: true }).decode(data)
              // Check if it's printable ASCII/UTF-8
              if (str.length > 0 && /^[\x20-\x7E\s]*$/.test(str)) {
                fieldValue = str
              } else {
                // Try to decode as nested message
                try {
                  fieldValue = decodeWithoutProto(data)
                } catch {
                  // If all else fails, show as hex
                  fieldValue = `[bytes: ${Array.from(data)
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join(" ")}]`
                }
              }
            } catch {
              // Try to decode as nested message
              try {
                fieldValue = decodeWithoutProto(data)
              } catch {
                // Show as hex
                fieldValue = `[bytes: ${Array.from(data)
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(" ")}]`
              }
            }
            break

          case 3: // Start group (deprecated)
          case 4: // End group (deprecated)
            throw new Error(`Deprecated wire type ${wireType} not supported`)

          case 5: // 32-bit
            if (offset + 4 > buffer.length) throw new Error("Insufficient data for 32-bit field")
            fieldValue = `0x${Array.from(buffer.slice(offset, offset + 4))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")}`
            offset += 4
            break

          default:
            throw new Error(`Unknown wire type: ${wireType}`)
        }

        // Handle repeated fields
        if (result[fieldNumber] !== undefined) {
          if (!Array.isArray(result[fieldNumber])) {
            result[fieldNumber] = [result[fieldNumber]]
          }
          result[fieldNumber].push(fieldValue)
        } else {
          result[fieldNumber] = fieldValue
        }
      } catch (error) {
        // If we can't parse further, break and show what we have
        break
      }
    }

    return result
  }

  // Read varint from buffer
  const readVarint = (buffer: Uint8Array, offset: number): { value: number; newOffset: number } => {
    let value = 0
    let shift = 0
    let newOffset = offset

    while (newOffset < buffer.length) {
      const byte = buffer[newOffset++]
      value |= (byte & 0x7f) << shift

      if ((byte & 0x80) === 0) {
        break
      }

      shift += 7
      if (shift >= 64) {
        throw new Error("Varint too long")
      }
    }

    return { value, newOffset }
  }

  // Enhanced proto file parser that extracts message types, their fields, and enums
  const parseProtoDefinition = (protoText: string) => {
    const messages: {
      [messageName: string]: { [fieldNumber: number]: { name: string; type: string; repeated: boolean } }
    } = {}
    const enums: {
      [enumName: string]: { [value: number]: string }
    } = {}

    const lines = protoText.split("\n")
    let currentMessage = ""
    let currentEnum = ""
    let braceCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith("//") || line === "") continue

      // Match enum definition
      const enumMatch = line.match(/^enum\s+(\w+)\s*\{/)
      if (enumMatch) {
        currentEnum = enumMatch[1]
        enums[currentEnum] = {}
        braceCount = 1
        continue
      }

      // Match message definition
      const messageMatch = line.match(/^message\s+(\w+)\s*\{/)
      if (messageMatch) {
        currentMessage = messageMatch[1]
        messages[currentMessage] = {}
        braceCount = 1
        continue
      }

      // Track braces to know when we're inside a message or enum
      braceCount += (line.match(/\{/g) || []).length
      braceCount -= (line.match(/\}/g) || []).length

      if (currentEnum && braceCount > 0) {
        // Match enum value definitions like: UNKNOWN = 0;
        const enumValueMatch = line.match(/^\s*(\w+)\s*=\s*(\d+)\s*;/)
        if (enumValueMatch) {
          const [, name, value] = enumValueMatch
          enums[currentEnum][Number.parseInt(value)] = name
        }
      }

      if (currentMessage && braceCount > 0) {
        // Match field definitions like: string name = 1;
        const fieldMatch = line.match(/^\s*(repeated\s+)?(\w+)\s+(\w+)\s*=\s*(\d+)\s*;/)
        if (fieldMatch) {
          const [, repeated, type, name, number] = fieldMatch
          messages[currentMessage][Number.parseInt(number)] = {
            name,
            type,
            repeated: !!repeated,
          }
        }
      }

      if (braceCount === 0) {
        currentMessage = ""
        currentEnum = ""
      }
    }

    return { messages, enums }
  }

  // Get available message types from proto definition
  const getAvailableMessages = (): string[] => {
    if (!state.protoDefinition.trim()) return []

    try {
      const { messages } = parseProtoDefinition(state.protoDefinition)
      return Object.keys(messages)
    } catch {
      return []
    }
  }

  // Decode with proto definition for specific message type
  const decodeWithProto = (buffer: Uint8Array, protoMessages: any, protoEnums: any, messageType: string): any => {
    const messageFields = protoMessages[messageType]
    if (!messageFields) {
      throw new Error(`Message type "${messageType}" not found in proto definition`)
    }

    const result: any = {}
    let offset = 0

    while (offset < buffer.length) {
      try {
        const { value: tag, newOffset } = readVarint(buffer, offset)
        offset = newOffset

        const fieldNumber = tag >>> 3
        const wireType = tag & 0x7

        const fieldInfo = messageFields[fieldNumber]
        const fieldName = fieldInfo ? fieldInfo.name : `unknown_field_${fieldNumber}`

        let fieldValue: any

        switch (wireType) {
          case 0: // Varint
            const { value: varintValue, newOffset: varintOffset } = readVarint(buffer, offset)

            if (fieldInfo && fieldInfo.type === "bool") {
              fieldValue = varintValue !== 0
            } else if (fieldInfo && protoEnums[fieldInfo.type]) {
              // Handle enum fields
              const enumName = protoEnums[fieldInfo.type][varintValue]
              if (enumName) {
                fieldValue = `${enumName} (${varintValue})`
              } else {
                fieldValue = `UNKNOWN_ENUM_VALUE (${varintValue})`
              }
            } else if (fieldInfo && (fieldInfo.type === "int32" || fieldInfo.type === "int64")) {
              fieldValue = varintValue
            } else if (fieldInfo && (fieldInfo.type === "uint32" || fieldInfo.type === "uint64")) {
              fieldValue = varintValue >>> 0 // Unsigned
            } else {
              fieldValue = varintValue
            }
            offset = varintOffset
            break

          case 1: // 64-bit (double, fixed64, sfixed64)
            if (offset + 8 > buffer.length) throw new Error("Insufficient data for 64-bit field")
            if (fieldInfo && fieldInfo.type === "double") {
              const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8)
              fieldValue = view.getFloat64(0, true) // little-endian
            } else {
              fieldValue = `0x${Array.from(buffer.slice(offset, offset + 8))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")}`
            }
            offset += 8
            break

          case 2: // Length-delimited
            const { value: length, newOffset: lengthOffset } = readVarint(buffer, offset)
            offset = lengthOffset
            if (offset + length > buffer.length) throw new Error("Insufficient data")

            const data = buffer.slice(offset, offset + length)
            offset += length

            if (fieldInfo && fieldInfo.type === "string") {
              fieldValue = new TextDecoder("utf-8").decode(data)
            } else if (fieldInfo && fieldInfo.type === "bytes") {
              fieldValue = `[bytes: ${Array.from(data)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join(" ")}]`
            } else if (fieldInfo && protoMessages[fieldInfo.type]) {
              // Nested message type
              fieldValue = decodeWithProto(data, protoMessages, protoEnums, fieldInfo.type)
            } else {
              // Try as string first, then as nested message
              try {
                const str = new TextDecoder("utf-8", { fatal: true }).decode(data)
                if (/^[\x20-\x7E\s]*$/.test(str)) {
                  fieldValue = str
                } else {
                  fieldValue = `[bytes: ${Array.from(data)
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join(" ")}]`
                }
              } catch {
                fieldValue = `[bytes: ${Array.from(data)
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(" ")}]`
              }
            }
            break

          case 5: // 32-bit (float, fixed32, sfixed32)
            if (offset + 4 > buffer.length) throw new Error("Insufficient data for 32-bit field")
            if (fieldInfo && fieldInfo.type === "float") {
              const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4)
              fieldValue = view.getFloat32(0, true) // little-endian
            } else {
              fieldValue = `0x${Array.from(buffer.slice(offset, offset + 4))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")}`
            }
            offset += 4
            break

          default:
            throw new Error(`Unknown wire type: ${wireType}`)
        }

        // Handle repeated fields
        if (fieldInfo && fieldInfo.repeated) {
          if (!result[fieldName]) {
            result[fieldName] = []
          }
          result[fieldName].push(fieldValue)
        } else if (result[fieldName] !== undefined) {
          if (!Array.isArray(result[fieldName])) {
            result[fieldName] = [result[fieldName]]
          }
          result[fieldName].push(fieldValue)
        } else {
          result[fieldName] = fieldValue
        }
      } catch (error) {
        break
      }
    }

    return result
  }

  const handleDecode = () => {
    try {
      // Decode base64 input
      const binaryData = atob(state.input)
      const buffer = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        buffer[i] = binaryData.charCodeAt(i)
      }

      let decoded: any

      if (state.mode === "with-proto" && state.protoDefinition.trim()) {
        if (!state.selectedMessage) {
          throw new Error("Please select a message type to decode")
        }

        // Parse proto definition and decode with schema
        const { messages, enums } = parseProtoDefinition(state.protoDefinition)
        decoded = decodeWithProto(buffer, messages, enums, state.selectedMessage)
      } else {
        // Decode without schema
        decoded = decodeWithoutProto(buffer)
      }

      const formatted = JSON.stringify(decoded, null, 2)
      updateState({ output: formatted, isValid: true, error: "" })

      toast({
        title: "Decode Successful!",
        description: "Protobuf message decoded successfully",
      })
    } catch (err) {
      updateState({
        isValid: false,
        error: err instanceof Error ? err.message : "Failed to decode protobuf",
        output: "",
      })
      showErrorToast(toast, err, "Failed to decode protobuf")
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.output)
      toast({
        title: "Copied!",
        description: "Decoded output copied to clipboard",
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
    // Sample protobuf message with enum (Person with name="John", id=123, email="john@example.com", status=ACTIVE)
    const sampleBase64 = "CgRKb2huEHsaEGpvaG5AZXhhbXBsZS5jb20gAQ=="
    updateState({ input: sampleBase64 })
  }

  const insertSampleProto = () => {
    const sampleProto = `syntax = "proto3";

enum Status {
  UNKNOWN = 0;
  ACTIVE = 1;
  INACTIVE = 2;
  PENDING = 3;
}

enum Priority {
  LOW = 0;
  MEDIUM = 1;
  HIGH = 2;
  CRITICAL = 3;
}

message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;
  repeated string phone = 4;
  bool active = 5;
  Status status = 6;
  Priority priority = 7;
}

message Company {
  string name = 1;
  repeated Person employees = 2;
  string address = 3;
  Status company_status = 4;
}

message Response {
  int32 status_code = 1;
  string message = 2;
  Person person = 3;
  Status result_status = 4;
}`
    updateState({ protoDefinition: sampleProto, selectedMessage: "Person" })
  }

  const availableMessages = getAvailableMessages()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Protobuf Decoder</h1>
          <p className="text-muted-foreground mt-2">
            Decode base64 encoded protobuf messages with or without proto definition
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <Tabs value={state.mode} onValueChange={(value) => updateState({ mode: value as any })}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="without-proto" className="flex items-center gap-2">
            <Binary className="h-4 w-4" />
            Without Proto
          </TabsTrigger>
          <TabsTrigger value="with-proto" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            With Proto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="without-proto" className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" onClick={insertSample}>
              Insert Sample
            </Button>

            {state.isValid !== null && (
              <div className={`flex items-center gap-2 ${state.isValid ? "text-green-600" : "text-red-600"}`}>
                {state.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span className="text-sm font-medium">{state.isValid ? "Decode Successful" : "Decode Failed"}</span>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Base64 Encoded Protobuf</CardTitle>
                <CardDescription>Paste your base64 encoded protobuf message here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="CgRKb2huEHsaEGpvaG5AZXhhbXBsZS5jb20gAQ=="
                  value={state.input}
                  onChange={(e) => updateState({ input: e.target.value })}
                  className="min-h-[200px] font-mono text-sm"
                />
                {state.error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{state.error}</div>}
                <div className="flex gap-2">
                  <Button onClick={handleDecode} disabled={!state.input.trim()} className="flex-1">
                    Decode
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decoded Output</CardTitle>
                <CardDescription>Decoded protobuf message (field numbers as keys)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={state.output}
                  readOnly
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Decoded protobuf will appear here..."
                />
                <Button variant="outline" onClick={handleCopy} disabled={!state.output} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Output
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="with-proto" className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" onClick={insertSample}>
              Insert Sample Message
            </Button>
            <Button variant="outline" onClick={insertSampleProto}>
              Insert Sample Proto
            </Button>

            {state.isValid !== null && (
              <div className={`flex items-center gap-2 ${state.isValid ? "text-green-600" : "text-red-600"}`}>
                {state.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span className="text-sm font-medium">{state.isValid ? "Decode Successful" : "Decode Failed"}</span>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proto Definition</CardTitle>
                <CardDescription>
                  Paste your .proto file content here for better field names and enum support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`syntax = "proto3";

enum Status {
  UNKNOWN = 0;
  ACTIVE = 1;
  INACTIVE = 2;
}

message Person {
  string name = 1;
  int32 id = 2;
  Status status = 3;
}`}
                  value={state.protoDefinition}
                  onChange={(e) => updateState({ protoDefinition: e.target.value })}
                  className="min-h-[150px] font-mono text-sm"
                />

                {availableMessages.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="message-type">Select Message Type to Decode:</Label>
                    <Select
                      value={state.selectedMessage}
                      onValueChange={(value) => updateState({ selectedMessage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a message type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMessages.map((messageName) => (
                          <SelectItem key={messageName} value={messageName}>
                            {messageName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Base64 Encoded Protobuf</CardTitle>
                  <CardDescription>Paste your base64 encoded protobuf message here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="CgRKb2huEHsaEGpvaG5AZXhhbXBsZS5jb20gAQ=="
                    value={state.input}
                    onChange={(e) => updateState({ input: e.target.value })}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  {state.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{state.error}</div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDecode}
                      disabled={!state.input.trim() || !state.selectedMessage}
                      className="flex-1"
                    >
                      Decode with Proto
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Decoded Output</CardTitle>
                  <CardDescription>
                    Decoded protobuf message with field names and enum values
                    {state.selectedMessage && ` (${state.selectedMessage})`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={state.output}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Decoded protobuf will appear here..."
                  />
                  <Button variant="outline" onClick={handleCopy} disabled={!state.output} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Output
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Binary className="h-5 w-5" />
            Protobuf Decoder Features
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <ul className="space-y-1">
            <li>
              • <strong>Without Proto:</strong> Decodes messages using field numbers as keys
            </li>
            <li>
              • <strong>With Proto:</strong> Uses proto definition for proper field names and types
            </li>
            <li>
              • <strong>Enum Support:</strong> Converts enum values to their names (e.g., "ACTIVE (1)" instead of just
              "1")
            </li>
            <li>
              • <strong>Message Type Selection:</strong> Choose which message type to decode when proto has multiple
              messages
            </li>
            <li>
              • <strong>Smart Detection:</strong> Automatically detects strings, nested messages, and binary data
            </li>
            <li>
              • <strong>Wire Type Support:</strong> Handles varint, length-delimited, and fixed-width fields
            </li>
            <li>
              • <strong>Repeated Fields:</strong> Properly handles repeated/array fields
            </li>
            <li>
              • <strong>Nested Messages:</strong> Recursively decodes nested protobuf messages with proper types
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
