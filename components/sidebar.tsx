"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code2, Link, Clock, Hash, Braces, FileText, Wrench } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/lib/i18n"
import type { ToolType } from "@/app/page"

interface SidebarProps {
  activeTool: ToolType
  onToolChange: (tool: ToolType) => void
}

export function Sidebar({ activeTool, onToolChange }: SidebarProps) {
  const { t } = useTranslation()

  const tools = [
    {
      id: "base64" as ToolType,
      name: t.sidebar.base64.name,
      icon: Code2,
      description: t.sidebar.base64.description,
    },
    {
      id: "url" as ToolType,
      name: t.sidebar.url.name,
      icon: Link,
      description: t.sidebar.url.description,
    },
    {
      id: "timestamp" as ToolType,
      name: t.sidebar.timestamp.name,
      icon: Clock,
      description: t.sidebar.timestamp.description,
    },
    {
      id: "base64-hex" as ToolType,
      name: t.sidebar.base64Hex.name,
      icon: Hash,
      description: t.sidebar.base64Hex.description,
    },
    {
      id: "json" as ToolType,
      name: t.sidebar.json.name,
      icon: Braces,
      description: t.sidebar.json.description,
    },
    {
      id: "yaml" as ToolType,
      name: t.sidebar.yaml.name,
      icon: FileText,
      description: t.sidebar.yaml.description,
    },
  ]

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wrench className="h-6 w-6" />
          <h1 className="text-xl font-bold">{t.sidebar.title}</h1>
        </div>

        <div className="mb-4">
          <LanguageSelector />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
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
