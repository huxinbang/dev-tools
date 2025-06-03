"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Base64Tool } from "@/components/tools/base64-tool"
import { UrlTool } from "@/components/tools/url-tool"
import { TimestampTool } from "@/components/tools/timestamp-tool"
import { Base64HexTool } from "@/components/tools/base64-hex-tool"
import { JsonTool } from "@/components/tools/json-tool"
import { YamlTool } from "@/components/tools/yaml-tool"
import { ProtobufTool } from "@/components/tools/protobuf-tool"
import { UuidTool } from "@/components/tools/uuid-tool"
import { HexStringTool } from "@/components/tools/hex-string-tool"
import { useEffect } from "react"

export type ToolType = "base64" | "url" | "timestamp" | "base64-hex" | "json" | "yaml" | "protobuf" | "uuid" | "hex-string"

const toolTitles: Record<ToolType, string> = {
  base64: "Base64 Encoder/Decoder",
  url: "URL Encoder/Decoder",
  timestamp: "Unix Timestamp Converter",
  "base64-hex": "Base64 to Hex Converter",
  json: "JSON Formatter & Validator",
  yaml: "YAML Validator & Formatter",
  protobuf: "Protobuf Decoder",
  uuid: "UUID Generator",
  "hex-string": "Hex <-> String Converter",
}

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ToolType>("base64")

  // Update page title when tool changes
  useEffect(() => {
    const toolTitle = toolTitles[activeTool]
    document.title = `${toolTitle} | Dev Tools`

    // Update meta description based on active tool
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      const descriptions: Record<ToolType, string> = {
        base64:
          "Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 strings. Supports binary data and hex input.",
        url: "Free online URL encoder and decoder. Encode special characters for URLs and decode URL-encoded strings safely.",
        timestamp:
          "Free Unix timestamp converter. Convert between Unix timestamps and human-readable dates with timezone support.",
        "base64-hex": "Free Base64 to Hex converter. Convert between Base64 and hexadecimal representations easily.",
        json: "Free JSON formatter and validator. Format, validate, and manipulate JSON data with smart decode features.",
        yaml: "Free YAML validator and formatter. Validate YAML syntax and convert between YAML and JSON formats.",
        protobuf:
          "Free Protobuf decoder. Decode base64 encoded protobuf messages with or without proto definition files.",
        uuid: "Free UUID generator. Generate various types of UUIDs including v1, v3, v4, v5, NIL, and Max UUIDs.",
        "hex-string": "Free Hex <-> String converter. Convert between hexadecimal and string representations, easy editing and viewing.",
      }
      metaDescription.setAttribute("content", descriptions[activeTool])
    }
  }, [activeTool])

  const renderTool = () => {
    switch (activeTool) {
      case "base64":
        return <Base64Tool />
      case "url":
        return <UrlTool />
      case "timestamp":
        return <TimestampTool />
      case "base64-hex":
        return <Base64HexTool />
      case "json":
        return <JsonTool />
      case "yaml":
        return <YamlTool />
      case "protobuf":
        return <ProtobufTool />
      case "uuid":
        return <UuidTool />
      case "hex-string":
        return <HexStringTool />
      default:
        return <Base64Tool />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTool={activeTool} onToolChange={setActiveTool} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{renderTool()}</div>
      </main>
    </div>
  )
}
