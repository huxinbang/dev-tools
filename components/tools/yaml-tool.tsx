"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as yaml from "js-yaml"
import { showErrorToast } from "@/lib/utils"

export function YamlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const validateYaml = () => {
    try {
      yaml.load(input)
      setIsValid(true)
      setError("")
      setOutput("✅ YAML is valid!")
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid YAML")
      setOutput("")
    }
  }

  const formatYaml = () => {
    try {
      const parsed = yaml.load(input)
      const formatted = yaml.dump(parsed, {
        indent: 2,
        lineWidth: 80,
        noRefs: true,
        sortKeys: false,
      })
      setOutput(formatted)
      setIsValid(true)
      setError("")
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid YAML")
      setOutput("")
    }
  }

  const convertToJson = () => {
    try {
      const parsed = yaml.load(input)
      const json = JSON.stringify(parsed, null, 2)
      setOutput(json)
      setIsValid(true)
      setError("")
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid YAML")
      setOutput("")
    }
  }

  const convertFromJson = () => {
    try {
      const parsed = JSON.parse(input)
      const yamlOutput = yaml.dump(parsed, {
        indent: 2,
        lineWidth: 80,
        noRefs: true,
        sortKeys: false,
      })
      setOutput(yamlOutput)
      setIsValid(true)
      setError("")
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
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
    setIsValid(null)
    setError("")
  }

  const insertSample = () => {
    const sample = `# Sample YAML Configuration
name: John Doe
age: 30
email: john@example.com
address:
  street: 123 Main St
  city: New York
  zipCode: "10001"
hobbies:
  - reading
  - swimming
  - coding
isActive: true
settings:
  theme: dark
  notifications: true
  features:
    - name: feature1
      enabled: true
    - name: feature2
      enabled: false
metadata:
  created: 2024-01-01
  updated: 2024-01-15
  tags: [important, config, sample]`
    setInput(sample)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">YAML Validator & Formatter</h1>
        <p className="text-muted-foreground mt-2">Validate, format YAML data and convert to/from JSON</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button variant="outline" onClick={insertSample}>
          Insert Sample
        </Button>

        {isValid !== null && (
          <div className={`flex items-center gap-2 ${isValid ? "text-green-600" : "text-red-600"}`}>
            {isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{isValid ? "Valid YAML" : "Invalid YAML"}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Paste your YAML or JSON data here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="name: John Doe&#10;age: 30&#10;hobbies:&#10;  - reading&#10;  - coding"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{error}</div>}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={validateYaml} disabled={!input.trim()} variant="outline">
                Validate
              </Button>
              <Button onClick={formatYaml} disabled={!input.trim()}>
                Format YAML
              </Button>
              <Button onClick={convertToJson} disabled={!input.trim()} variant="outline">
                YAML → JSON
              </Button>
              <Button onClick={convertFromJson} disabled={!input.trim()} variant="outline">
                JSON → YAML
              </Button>
            </div>
            <Button variant="outline" onClick={handleClear} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Formatted YAML, JSON result, or validation status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Result will appear here..."
            />
            <Button variant="outline" onClick={handleCopy} disabled={!output} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Output
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
