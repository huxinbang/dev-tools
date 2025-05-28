"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Base64Tool } from "@/components/tools/base64-tool"
import { UrlTool } from "@/components/tools/url-tool"
import { TimestampTool } from "@/components/tools/timestamp-tool"
import { Base64HexTool } from "@/components/tools/base64-hex-tool"
import { JsonTool } from "@/components/tools/json-tool"
import { YamlTool } from "@/components/tools/yaml-tool"

export type ToolType = "base64" | "url" | "timestamp" | "base64-hex" | "json" | "yaml"

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ToolType>("base64")

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
