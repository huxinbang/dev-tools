"use client"

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
import JwtDecoderTool from "@/components/tools/jwt-token-tool"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { JSX } from "react/jsx-runtime"

export type ToolType = "base64" | "url" | "timestamp" | "base64-hex" | "json" | "yaml" | "protobuf" | "uuid" | "hex-string" | "jwt-token"

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
  "jwt-token": "JWT Token Decoder",
}

const toolComponents: Record<ToolType, JSX.Element> = {
  base64: <Base64Tool />,
  url: <UrlTool />,
  timestamp: <TimestampTool />,
  "base64-hex": <Base64HexTool />,
  json: <JsonTool />,
  yaml: <YamlTool />,
  protobuf: <ProtobufTool />,
  uuid: <UuidTool />,
  "hex-string": <HexStringTool />,
  "jwt-token": <JwtDecoderTool />,
}

export default function ToolPage({ tool }: { tool: ToolType }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (tool in toolTitles) {
      document.title = `${toolTitles[tool]} | Dev Tools`
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
          "jwt-token": "Free JWT Token decoder. Decode and verify JWT tokens, view payload data, and check signatures.",
        }
        metaDescription.setAttribute("content", descriptions[tool])
      }
    }
  }, [tool])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTool={tool} onToolChange={(t) => router.push(`/tools/${t}`)} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{toolComponents[tool]}</div>
      </main>
    </div>
  )
}
