import type React from "react"
import AppSidebar from "@/components/app-sidebar"
import ArtifactRoot from "@/components/artifact/artifact-root"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/provider"
import { EndpointsContext } from "@/components/agent"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

const title = "Ibibio AI"
const description = "Ibibio Language AI App & Platform."

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Ibibio AI | Language AI Platform | by | Usem.ai",
  description:
    "The official Ibibio language AI platform by Usem.ai. Experience real-time translation, text-to-speech, and voice conversation in Ibibio. Preserving African languages through innovative AI technology.",
  keywords: [
    "ibibio dictionary",
    "ibibio",
    "ibibio talking dictionary",
    "ibibio",
    "usemibibio",
    "usem",
    "ibibio",
    "ibibio ai",
    "ibibio dictionary",
    "ibibio app",
    "ibibio language",
    "ibibio talking dictionary",
    "ibibio dictionary",
    "ibibio translation",
    "ibibio text to speech",
    "usem.ai",
    "voice ai ibibio",
    "ibibio language learning",
  ],
  authors: [{ name: "Usem.ai Team" }],
  creator: "Usem.AI",
  publisher: "Usem.AI",
  icons: {
    icon: "/usemicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usemibibioai.com",
    title: "Ibibio AI | First Ibibio Language AI Platform | Usem.ai",
    description:
      "The official Ibibio language AI platform by Usem.ai. Experience real-time translation, text-to-speech, and voice conversation in Ibibio.",
    siteName: "Ibibio AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ibibio AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibibio AI | First Ibibio Language AI Platform",
    description:
      "Experience real-time translation, text-to-speech, and voice conversation in Ibibio. Preserving African languages through innovative AI technology.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "www.usemibibioai.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className={cn("min-h-screen flex flex-col font-sans antialiased", geistSans.variable)}>
        <EndpointsContext>
          <Providers session={null}>
            <Suspense fallback={<div>Loading...</div>}>
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <Header />
                <main className="flex flex-1 min-h-0">
                  <ArtifactRoot>{children}</ArtifactRoot>
                </main>
              </div>
            </Suspense>
            <Toaster />
            <Analytics />
          </Providers>
        </EndpointsContext>
      </body>
    </html>
  )
}
