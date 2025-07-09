import Link from "next/link"
import { UuidTool } from "@/components/tools/uuid-tool"

export default function UuidToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <UuidTool />
    </div>
  )
}
