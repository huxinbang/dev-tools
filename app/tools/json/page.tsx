import Link from "next/link"
import { JsonTool } from "@/components/tools/json-tool"

export default function JsonToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <JsonTool />
    </div>
  )
}
