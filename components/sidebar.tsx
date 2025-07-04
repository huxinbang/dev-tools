"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code2, Link, Clock, Hash, Braces, FileText, Wrench, Binary, Search, X, Key } from "lucide-react"
import type { ToolType } from "@/app/page"

interface SidebarProps {
  activeTool: ToolType
  onToolChange: (tool: ToolType) => void
}

const tools = [
  {
    id: "base64" as ToolType,
    name: "Base64 Encoder/Decoder",
    icon: Code2,
    description: "Encode and decode Base64 strings",
    keywords: ["base64", "encode", "decode", "encoding", "decoding", "binary", "text"],
  },
  {
    id: "url" as ToolType,
    name: "URL Encoder/Decoder",
    icon: Link,
    description: "Encode and decode URL components",
    keywords: ["url", "encode", "decode", "uri", "percent", "encoding", "web", "link"],
  },
  {
    id: "timestamp" as ToolType,
    name: "Unix Timestamp",
    icon: Clock,
    description: "Convert Unix timestamps",
    keywords: ["timestamp", "unix", "time", "date", "epoch", "convert", "timezone"],
  },
  {
    id: "base64-hex" as ToolType,
    name: "Base64 to Hex",
    icon: Hash,
    description: "Convert between Base64 and Hex",
    keywords: ["base64", "hex", "hexadecimal", "convert", "binary", "encoding"],
  },
  {
    id: "json" as ToolType,
    name: "JSON Formatter",
    icon: Braces,
    description: "Format and manipulate JSON",
    keywords: ["json", "format", "validate", "pretty", "minify", "parse", "smart", "decode"],
  },
  {
    id: "yaml" as ToolType,
    name: "YAML Validator",
    icon: FileText,
    description: "Validate and format YAML",
    keywords: ["yaml", "yml", "validate", "format", "parse", "config", "configuration"],
  },
  {
    id: "protobuf" as ToolType,
    name: "Protobuf Decoder",
    icon: Binary,
    description: "Decode protobuf messages",
    keywords: ["protobuf", "proto", "decode", "binary", "message", "grpc", "protocol", "buffer"],
  },
  {
    id: "uuid" as ToolType,
    name: "UUID Generator",
    icon: Key,
    description: "Generate unique identifiers",
    keywords: ["uuid", "guid", "unique", "identifier", "generate", "random", "id", "key"],
  },
  {
    id: "hex-string" as ToolType,
    name: "Hex <-> String",
    icon: Hash,
    description: "Convert between Hex and String, easy editing and viewing.",
    keywords: ["hex", "string", "hexadecimal", "convert", "edit", "view", "text"],
  },
  {
    id: "jwt-token" as ToolType,
    name: "JWT Token Decoder",
    icon: Key,
    description: "Decode and view JWT token data",
    keywords: ["jwt", "token", "decode", "json", "auth", "jwt decoder", "jwt viewer"],
  },
]

export function Sidebar({ activeTool, onToolChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on search query
  const filteredTools = tools.filter((tool) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    )
  })

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wrench className="h-6 w-6" />
          <h1 className="text-xl font-bold">Dev Tools</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-xs text-muted-foreground mb-3">
            {filteredTools.length === 0
              ? "No tools found"
              : `${filteredTools.length} tool${filteredTools.length === 1 ? "" : "s"} found`}
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {filteredTools.length === 0 && searchQuery ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tools match your search</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            ) : (
              filteredTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-4 text-left",
                      activeTool === tool.id && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            activeTool === tool.id ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Quick shortcuts info */}
        {!searchQuery && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p className="mb-1">💡 Quick search tips:</p>
            <p>• Type "json" for JSON tools</p>
            <p>• Type "encode" for encoding tools</p>
            <p>• Type "uuid" for ID generation</p>
          </div>
        )}
      </div>
    </div>
  )
}
