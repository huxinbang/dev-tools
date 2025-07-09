import Link from "next/link"
import { Base64Tool } from "@/components/tools/base64-tool"

export default function Base64ToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <Base64Tool />
    </div>
  )
}
