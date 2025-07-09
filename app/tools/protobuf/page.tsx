import Link from "next/link"
import { ProtobufTool } from "@/components/tools/protobuf-tool"

export default function ProtobufToolPage() {
  return (
    <div>
      <Link href="/" className="inline-block mb-4 text-blue-600 hover:underline">← Back to Home</Link>
      <ProtobufTool />
    </div>
  )
}
