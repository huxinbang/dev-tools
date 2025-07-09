import Link from "next/link"
import { Base64HexTool } from "@/components/tools/base64-hex-tool"

export default function Base64HexToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <Base64HexTool />
    </div>
  )
}
