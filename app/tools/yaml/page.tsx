import Link from "next/link"
import { YamlTool } from "@/components/tools/yaml-tool"

export default function YamlToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <YamlTool />
    </div>
  )
}
