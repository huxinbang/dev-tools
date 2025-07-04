"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, RotateCcw } from "lucide-react"

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) {
    if (pad === 1) throw new Error("InvalidLengthError: Input base64url string is the wrong length to decode");
    str += new Array(5 - pad).join("=");
  }
  return atob(str);
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function decodeJWT(jwt: string) {
    setError(null);
    setHeader(null);
    setPayload(null);
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) throw new Error("JWT 必须包含三部分");
      const headerJson = base64UrlDecode(parts[0]);
      const payloadJson = base64UrlDecode(parts[1]);
      setHeader(JSON.stringify(JSON.parse(headerJson), null, 2));
      setPayload(JSON.stringify(JSON.parse(payloadJson), null, 2));
    } catch (e: any) {
      setError(e.message || "解析失败");
    }
  }

  function handleCopy(text: string | null) {
    if (text) navigator.clipboard.writeText(text);
  }

  function handleClear() {
    setToken("");
    setHeader(null);
    setPayload(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">JWT Token Decoder</h1>
          <p className="text-muted-foreground mt-2">Decode and view JWT token header & payload data</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive">
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>JWT Token</CardTitle>
            <CardDescription>Paste your JWT token here to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your JWT token here..."
              value={token}
              onChange={e => setToken(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{error}</div>}
            <div className="flex gap-2">
              <Button onClick={() => decodeJWT(token)} disabled={!token.trim()} className="flex-1">
                Decode
              </Button>
              <Button variant="outline" onClick={handleClear} className="flex-1">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Header</CardTitle>
              <CardDescription>Decoded JWT header</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={header || ""}
                readOnly
                className="min-h-[80px] font-mono text-sm"
                placeholder="Header will appear here..."
              />
              <Button variant="outline" onClick={() => handleCopy(header)} disabled={!header} className="w-full mt-2">
                <Copy className="h-4 w-4 mr-2" />Copy Header
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payload</CardTitle>
              <CardDescription>Decoded JWT payload</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={payload || ""}
                readOnly
                className="min-h-[80px] font-mono text-sm"
                placeholder="Payload will appear here..."
              />
              <Button variant="outline" onClick={() => handleCopy(payload)} disabled={!payload} className="w-full mt-2">
                <Copy className="h-4 w-4 mr-2" />Copy Payload
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            JWT Token 说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <ul className="space-y-1">
            <li>• <strong>Header:</strong> 描述签名算法和类型</li>
            <li>• <strong>Payload:</strong> 主要数据内容（如用户信息、权限等）</li>
            <li>• <strong>Signature:</strong> 用于校验数据完整性（本工具不解码）</li>
            <li>• <strong>安全提示:</strong> 切勿在不可信环境下粘贴敏感 JWT Token</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
