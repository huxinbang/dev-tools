import Link from "next/link"
import { TimestampTool } from "@/components/tools/timestamp-tool"

export default function TimestampToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <TimestampTool />
    </div>
  )
}
