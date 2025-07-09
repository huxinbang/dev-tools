import Link from "next/link"
import { UrlTool } from "@/components/tools/url-tool"

export default function UrlToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <UrlTool />
    </div>
  )
}
