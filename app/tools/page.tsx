import Link from "next/link"
import { ToolType } from "./ToolPage"

const toolList: { type: ToolType; title: string; description: string }[] = [
  {
    type: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings, supports binary and text.",
  },
  {
    type: "url",
    title: "URL Encoder/Decoder",
    description: "Encode special characters for URLs and decode URL-encoded strings.",
  },
  {
    type: "timestamp",
    title: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
  },
  {
    type: "base64-hex",
    title: "Base64 to Hex Converter",
    description: "Convert between Base64 and hexadecimal representations.",
  },
  {
    type: "json",
    title: "JSON Formatter & Validator",
    description: "Format, validate, and manipulate JSON data.",
  },
  {
    type: "yaml",
    title: "YAML Validator & Formatter",
    description: "Validate YAML syntax and convert between YAML and JSON.",
  },
  {
    type: "protobuf",
    title: "Protobuf Decoder",
    description: "Decode base64 encoded protobuf messages.",
  },
  {
    type: "uuid",
    title: "UUID Generator",
    description: "Generate various types of UUIDs.",
  },
  {
    type: "hex-string",
    title: "Hex <-> String Converter",
    description: "Convert between hexadecimal and string representations.",
  },
  {
    type: "jwt-token",
    title: "JWT Token Decoder",
    description: "Decode and verify JWT tokens, view payload data.",
  },
]

export default function ToolsDashboard() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background px-4">
      <div className="max-w-3xl w-full text-center py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">All Developer Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toolList.map((tool) => (
            <Link
              key={tool.type}
              href={`/tools/${tool.type}`}
              className="block bg-card rounded-lg shadow hover:shadow-lg transition p-6 text-left border border-border hover:border-primary"
            >
              <div className="font-semibold text-lg mb-2">{tool.title}</div>
              <div className="text-muted-foreground text-sm">{tool.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
