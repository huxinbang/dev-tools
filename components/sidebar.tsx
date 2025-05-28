"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code2, Link, Clock, Hash, Braces, FileText, Wrench, Binary } from "lucide-react"
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
  },
  {
    id: "url" as ToolType,
    name: "URL Encoder/Decoder",
    icon: Link,
    description: "Encode and decode URL components",
  },
  {
    id: "timestamp" as ToolType,
    name: "Unix Timestamp",
    icon: Clock,
    description: "Convert Unix timestamps",
  },
  {
    id: "base64-hex" as ToolType,
    name: "Base64 to Hex",
    icon: Hash,
    description: "Convert between Base64 and Hex",
  },
  {
    id: "json" as ToolType,
    name: "JSON Formatter",
    icon: Braces,
    description: "Format and manipulate JSON",
  },
  {
    id: "yaml" as ToolType,
    name: "YAML Validator",
    icon: FileText,
    description: "Validate and format YAML",
  },
  {
    id: "protobuf" as ToolType,
    name: "Protobuf Decoder",
    icon: Binary,
    description: "Decode protobuf messages",
  },
]

export function Sidebar({ activeTool, onToolChange }: SidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wrench className="h-6 w-6" />
          <h1 className="text-xl font-bold">Dev Tools</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {tools.map((tool) => {
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
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
