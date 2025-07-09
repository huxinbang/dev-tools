"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function HomePage() {
  // 首页跳转入口
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-8">Dev Tools Toolbox</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link href="/tools/base64" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          Base64 Encode/Decode
        </Link>
        <Link href="/tools/url" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          URL Encode/Decode
        </Link>
        <Link href="/tools/timestamp" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          Unix Timestamp Converter
        </Link>
        <Link href="/tools/base64-hex" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          Base64 {'<->'} Hex Converter
        </Link>
        <Link href="/tools/json" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          JSON Formatter / Validator
        </Link>
        <Link href="/tools/yaml" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          YAML Validator / Formatter
        </Link>
        <Link href="/tools/protobuf" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          Protobuf Decoder
        </Link>
        <Link href="/tools/uuid" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          UUID Generator
        </Link>
        <Link href="/tools/hex" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          Hex {'<->'} String Converter
        </Link>
        <Link href="/tools/jwt" className="block p-6 rounded-lg border shadow hover:bg-accent transition">
          JWT Token Decoder
        </Link>
      </div>
    </div>
  )
}
