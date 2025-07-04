import ToolPage, { ToolType } from "../ToolPage"
import { notFound } from "next/navigation"

const validTools: ToolType[] = [
  "base64",
  "url",
  "timestamp",
  "base64-hex",
  "json",
  "yaml",
  "protobuf",
  "uuid",
  "hex-string",
  "jwt-token",
]

export default function ToolDynamicPage({ params }: { params: { tool: string } }) {
  const tool = params.tool as ToolType
  if (!validTools.includes(tool)) return notFound()
  return <ToolPage tool={tool} />
}
