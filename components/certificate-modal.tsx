"use client"

import { useState, useRef } from "react"
import { X, Trophy, Download, Sparkles, Check, Share2, Award, Calendar } from "lucide-react"
import { fireMilestoneConfetti } from "@/lib/confetti"

interface CertificateModalProps {
  open: boolean
  onClose: () => void
  topic: string
  completedCount: number
  totalCount: number
  xpPoints: number
}

export function CertificateModal({
  open,
  onClose,
  topic,
  completedCount,
  totalCount,
  xpPoints,
}: CertificateModalProps) {
  const [userName, setUserName] = useState("Alex Developer")
  const [downloaded, setDownloaded] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  if (!open) return null

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const certId = `PW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  const handleDownload = () => {
    fireMilestoneConfetti()
    setDownloaded(true)
    setTimeout(() => {
      window.print()
      setDownloaded(false)
    }, 500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel border border-amber-500/30 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Laser Beam */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="size-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                Verified Achievement
              </span>
              <h3 className="font-extrabold text-lg text-white">Certificate of Curriculum Mastery</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Certificate Preview Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Name Customizer Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-400" />
              Recipient Name on Certificate:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Full Name"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Certificate Canvas / Card */}
          <div
            ref={certRef}
            className="relative rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#090d16] to-[#1e1b4b] p-8 sm:p-10 border-2 border-amber-500/40 shadow-2xl text-center space-y-6 overflow-hidden"
          >
            {/* Ambient Watermark Seal */}
            <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-amber-500/5 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-indigo-500/5 blur-2xl" />

            {/* Corner Holographic Borders */}
            <div className="absolute top-3 left-3 size-6 border-t-2 border-l-2 border-amber-400/60" />
            <div className="absolute top-3 right-3 size-6 border-t-2 border-r-2 border-amber-400/60" />
            <div className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-amber-400/60" />
            <div className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-amber-400/60" />

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400 drop-shadow">
                Pathways Spatial Learning Academy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs text-slate-400 italic">This is proudly awarded to</p>
            </div>

            <div className="py-2 border-b border-amber-500/30 max-w-md mx-auto">
              <h1 className="text-2xl sm:text-3xl font-black text-amber-300 font-serif tracking-wider">
                {userName || "Student Developer"}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              for successfully mastering the comprehensive 3D curriculum and AI evaluations in{" "}
              <strong className="text-white font-bold">{topic}</strong> comprising {totalCount} curated masterclass modules and earning{" "}
              <strong className="text-amber-400 font-bold">{xpPoints} Experience Points</strong>.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-amber-400" />
                <span>Date: <strong>{today}</strong></span>
              </div>

              {/* Holographic Verification Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300">
                <Award className="size-3.5 text-amber-400" />
                <span>ID: {certId}</span>
              </div>

              <div className="text-right">
                <p className="font-bold text-white">Pathways 3D AI Engine</p>
                <p className="text-[10px] text-slate-500">Verified Curriculum Protocol</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-neutral-950/60 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Print as PDF or share to LinkedIn & Twitter
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              {downloaded ? <Check className="size-4" /> : <Download className="size-4" />}
              {downloaded ? "Opening Print PDF…" : "Download Certificate (PDF)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
