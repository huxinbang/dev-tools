"use client"

import Link from "next/link"

export default function HomePage() {
  // Only landing page content remains here
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-2xl w-full text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Dev Tools: Free, Private, Powerful</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Dev Tools is a comprehensive suite of open-source developer utilities including Base64, URL, JSON, YAML, Protobuf, UUID, Hex, JWT, and more. <span className="font-semibold">All tools run entirely in your browser</span>—<span className="font-semibold text-green-600">no data is ever sent to any server</span>. Your input, processing, and results stay private and local, always.
        </p>
        <ul className="text-left text-base md:text-lg mb-8 mx-auto max-w-lg list-disc list-inside">
          <li>✔️ <span className="font-semibold">100% privacy:</span> We never collect or store your data</li>
          <li>✔️ All processing and storage happens in your browser</li>
          <li>✔️ No sign-up, no tracking, no ads</li>
          <li>✔️ Open source, fast, and free for everyone</li>
        </ul>
        <Link
          href="/tools/base64"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
        >
          Start Using Tools
        </Link>
        <div className="mt-10 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold">Your privacy is our priority.</span> All features work offline after loading. No information is ever uploaded or shared. Explore the source code or contribute on {" "}
            <a href="https://github.com/huxinbang/dev-tools" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">GitHub</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
