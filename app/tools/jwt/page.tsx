import Link from "next/link"
import JwtDecoderTool from "@/components/tools/jwt-token-tool"

export default function JwtTokenToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <JwtDecoderTool />
    </div>
  )
}
