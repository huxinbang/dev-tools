"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RefreshCw, Trash2, Key, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface UuidToolState {
  uuidVersion: string
  quantity: number
  generatedUuids: string[]
  customNamespace: string
  customName: string
  history: string[]
}

const initialState: UuidToolState = {
  uuidVersion: "4",
  quantity: 1,
  generatedUuids: [],
  customNamespace: "",
  customName: "",
  history: [],
}

export function UuidTool() {
  const [state, setState] = useLocalStorage<UuidToolState>("uuid-tool-state", initialState)
  const { toast } = useToast()

  const updateState = (updates: Partial<UuidToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Generate UUID v4 (random)
  const generateUuidV4 = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Generate UUID v1 (timestamp-based) - simplified version
  const generateUuidV1 = (): string => {
    const timestamp = Date.now()
    const timestampHex = timestamp.toString(16).padStart(12, "0")
    const randomPart = Math.random().toString(16).substring(2, 14)
    const clockSeq = Math.floor(Math.random() * 16384)
      .toString(16)
      .padStart(4, "0")
    const node = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    ).join("")

    return `${timestampHex.substring(0, 8)}-${timestampHex.substring(8, 12)}-1${randomPart.substring(0, 3)}-${clockSeq.substring(0, 1)}${randomPart.substring(3, 6)}-${node}`
  }

  // Generate UUID v3 (MD5 hash-based) - simplified version
  const generateUuidV3 = async (namespace: string, name: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(namespace + name)
    const hashBuffer = await crypto.subtle.digest("MD5", data).catch(() => {
      // Fallback if MD5 is not available
      return crypto.subtle.digest("SHA-1", data)
    })
    const hashArray = new Uint8Array(hashBuffer)
    const hex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 32)

    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-3${hex.substring(13, 16)}-${((Number.parseInt(hex.substring(16, 18), 16) & 0x3f) | 0x80).toString(16)}${hex.substring(18, 20)}-${hex.substring(20, 32)}`
  }

  // Generate UUID v5 (SHA-1 hash-based) - simplified version
  const generateUuidV5 = async (namespace: string, name: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(namespace + name)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = new Uint8Array(hashBuffer)
    const hex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 32)

    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-5${hex.substring(13, 16)}-${((Number.parseInt(hex.substring(16, 18), 16) & 0x3f) | 0x80).toString(16)}${hex.substring(18, 20)}-${hex.substring(20, 32)}`
  }

  // Generate NIL UUID
  const generateNilUuid = (): string => {
    return "00000000-0000-0000-0000-000000000000"
  }

  // Generate Max UUID
  const generateMaxUuid = (): string => {
    return "ffffffff-ffff-ffff-ffff-ffffffffffff"
  }

  const generateUuids = async () => {
    try {
      const newUuids: string[] = []

      for (let i = 0; i < state.quantity; i++) {
        let uuid: string

        switch (state.uuidVersion) {
          case "1":
            uuid = generateUuidV1()
            break
          case "3":
            if (!state.customNamespace || !state.customName) {
              toast({
                title: "Missing Input",
                description: "UUID v3 requires both namespace and name",
                variant: "destructive",
              })
              return
            }
            uuid = await generateUuidV3(state.customNamespace, state.customName)
            break
          case "4":
            uuid = generateUuidV4()
            break
          case "5":
            if (!state.customNamespace || !state.customName) {
              toast({
                title: "Missing Input",
                description: "UUID v5 requires both namespace and name",
                variant: "destructive",
              })
              return
            }
            uuid = await generateUuidV5(state.customNamespace, state.customName)
            break
          case "nil":
            uuid = generateNilUuid()
            break
          case "max":
            uuid = generateMaxUuid()
            break
          default:
            uuid = generateUuidV4()
        }

        newUuids.push(uuid)
      }

      // Add to history (keep last 50)
      const newHistory = [...newUuids, ...state.history].slice(0, 50)

      updateState({
        generatedUuids: newUuids,
        history: newHistory,
      })

      toast({
        title: "UUIDs Generated!",
        description: `Generated ${newUuids.length} UUID${newUuids.length > 1 ? "s" : ""}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate UUIDs",
        variant: "destructive",
      })
    }
  }

  const copyUuid = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid)
      toast({
        title: "Copied!",
        description: "UUID copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyAllUuids = async () => {
    try {
      const allUuids = state.generatedUuids.join("\n")
      await navigator.clipboard.writeText(allUuids)
      toast({
        title: "Copied!",
        description: "All UUIDs copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const clearHistory = () => {
    setState(initialState)
    toast({
      title: "History Cleared",
      description: "All generated UUIDs have been cleared",
    })
  }

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(100, state.quantity + delta))
    updateState({ quantity: newQuantity })
  }

  const needsCustomInput = state.uuidVersion === "3" || state.uuidVersion === "5"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">UUID Generator</h1>
          <p className="text-muted-foreground mt-2">Generate various types of Universally Unique Identifiers (UUIDs)</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              UUID Configuration
            </CardTitle>
            <CardDescription>Configure the type and parameters for UUID generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uuid-version">UUID Version</Label>
              <Select value={state.uuidVersion} onValueChange={(value) => updateState({ uuidVersion: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Version 1 (Timestamp-based)</SelectItem>
                  <SelectItem value="3">Version 3 (MD5 hash-based)</SelectItem>
                  <SelectItem value="4">Version 4 (Random)</SelectItem>
                  <SelectItem value="5">Version 5 (SHA-1 hash-based)</SelectItem>
                  <SelectItem value="nil">NIL UUID (All zeros)</SelectItem>
                  <SelectItem value="max">Max UUID (All ones)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => adjustQuantity(-1)} disabled={state.quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={state.quantity}
                  onChange={(e) =>
                    updateState({ quantity: Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)) })
                  }
                  className="text-center"
                />
                <Button variant="outline" size="sm" onClick={() => adjustQuantity(1)} disabled={state.quantity >= 100}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {needsCustomInput && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="namespace">Namespace</Label>
                  <Input
                    id="namespace"
                    placeholder="Enter namespace (e.g., example.com)"
                    value={state.customNamespace}
                    onChange={(e) => updateState({ customNamespace: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter name (e.g., user123)"
                    value={state.customName}
                    onChange={(e) => updateState({ customName: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button
              onClick={generateUuids}
              className="w-full"
              disabled={needsCustomInput && (!state.customNamespace || !state.customName)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate UUID{state.quantity > 1 ? "s" : ""}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated UUIDs</CardTitle>
            <CardDescription>
              {state.generatedUuids.length > 0
                ? `${state.generatedUuids.length} UUID${state.generatedUuids.length > 1 ? "s" : ""} generated`
                : "Generated UUIDs will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.generatedUuids.length > 0 ? (
              <>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {state.generatedUuids.map((uuid, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <code className="flex-1 text-sm font-mono">{uuid}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyUuid(uuid)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {state.generatedUuids.length > 1 && (
                  <Button variant="outline" onClick={copyAllUuids} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All UUIDs
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No UUIDs generated yet</p>
                <p className="text-xs mt-1">Configure settings and click generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {state.history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation History</CardTitle>
            <CardDescription>Recently generated UUIDs (last 50)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={state.history.join("\n")}
              readOnly
              className="min-h-[150px] font-mono text-sm"
              placeholder="Generation history will appear here..."
            />
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(state.history.join("\n"))}
              className="w-full mt-4"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy History
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Key className="h-5 w-5" />
            UUID Types & Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <ul className="space-y-1">
            <li>
              • <strong>Version 1:</strong> Timestamp-based, includes MAC address (less privacy)
            </li>
            <li>
              • <strong>Version 3:</strong> MD5 hash-based, deterministic from namespace + name
            </li>
            <li>
              • <strong>Version 4:</strong> Random/pseudo-random, most commonly used
            </li>
            <li>
              • <strong>Version 5:</strong> SHA-1 hash-based, deterministic from namespace + name
            </li>
            <li>
              • <strong>NIL UUID:</strong> All zeros, represents "no value"
            </li>
            <li>
              • <strong>Max UUID:</strong> All ones, used for testing and special cases
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
