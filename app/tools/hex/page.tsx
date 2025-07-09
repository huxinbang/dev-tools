import Link from "next/link"
import { HexStringTool } from "@/components/tools/hex-string-tool"

export default function HexStringToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <HexStringTool />
    </div>
  )
}
