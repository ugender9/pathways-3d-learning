import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Pathways — AI YouTube Course Builder",
  description: "Turn the best YouTube videos into a structured, personalized learning path with AI summaries and quizzes.",
  applicationName: "Pathways",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
