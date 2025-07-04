import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Dev Tools",
    template: "%s | Dev Tools",
  },
  description:
    "A comprehensive collection of developer tools including Base64 encoding/decoding, URL encoding, JSON formatting, UUID generation, timestamp conversion, YAML validation, and Protobuf decoding. Free online tools for developers.",
  keywords: [
    "developer tools",
    "base64 encoder",
    "base64 decoder",
    "url encoder",
    "json formatter",
    "uuid generator",
    "timestamp converter",
    "yaml validator",
    "protobuf decoder",
    "hex converter",
    "online tools",
    "free tools",
    "web developer",
    "programming tools",
    "encoding tools",
    "decoding tools",
  ],
  authors: [{ name: "Dev Tools" }],
  creator: "Dev Tools",
  publisher: "Dev Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devtools.example.com",
    title: "Dev Tools - All-in-One Developer Utilities",
    description:
      "Free online developer tools for encoding, decoding, formatting, and generating. Base64, URL, JSON, UUID, timestamps, YAML, and more.",
    siteName: "Dev Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dev Tools - Developer Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Tools - All-in-One Developer Utilities",
    description:
      "Free online developer tools for encoding, decoding, formatting, and generating. Base64, URL, JSON, UUID, timestamps, YAML, and more.",
    images: ["/og-image.png"],
    creator: "@devtools",
  },
  alternates: {
    canonical: "https://devtools.example.com",
  },
  category: "technology",
  classification: "Developer Tools",
  other: {
    "google-site-verification": "your-google-verification-code",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
          {children}
          <Toaster />
      </body>
    </html>
  )
}
