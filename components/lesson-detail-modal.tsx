"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, BookOpen, Clock, Youtube, Check, Copy, Save, ExternalLink, Play, Volume2, VolumeX } from "lucide-react"
import { ChannelAvatar } from "@/components/channel-avatar"

interface LessonDetailModalProps {
  open: boolean
  onClose: () => void
  lesson: {
    title: string
    videoId: string
    channelTitle: string
    thumbnail: string
    estimatedDuration: string
    summary?: { overview: string; takeaways: string[] } | null
    level: "beginner" | "intermediate" | "advanced"
  } | null
  lessonIndex: number
  initialTab?: "summary" | "notes" | "video"
}

export function LessonDetailModal({
  open,
  onClose,
  lesson,
  lessonIndex,
  initialTab = "summary",
}: LessonDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "notes" | "video">("summary")
  const [summary, setSummary] = useState<{ overview: string; takeaways: string[] } | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [userNote, setUserNote] = useState("")
  const [savedNote, setSavedNote] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab)
    }
  }, [open, initialTab])

  useEffect(() => {
    if (!open || !lesson) return

    // Stop speaking if closed or changed
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    // Load saved personal note
    const saved = typeof window !== "undefined" ? localStorage.getItem(`pathways:note:${lesson.videoId}`) : ""
    if (saved) setUserNote(saved)

    // Fetch summary
    setLoadingSummary(true)
    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: lesson.title, channel: lesson.channelTitle }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.summary) setSummary(d.summary)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingSummary(false))

    // Fetch notes
    setLoadingNotes(true)
    fetch("/api/lesson-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: lesson.title, channel: lesson.channelTitle, lessonIndex }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.notes) setNotes(d.notes)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingNotes(false))

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [open, lesson, lessonIndex])

  if (!open || !lesson) return null

  const isLikelyYouTubeId = typeof lesson.videoId === "string" && /^[a-zA-Z0-9_-]{11}$/.test(lesson.videoId)
  const youtubeUrl = !isLikelyYouTubeId
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} ${lesson.channelTitle}`)}`
    : `https://www.youtube.com/watch?v=${lesson.videoId}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSaveNote = () => {
    localStorage.setItem(`pathways:note:${lesson.videoId}`, userNote)
    setSavedNote(true)
    setTimeout(() => setSavedNote(false), 2000)
  }

  // Text-to-Speech audio narration using Web Speech API
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToRead = [
      `Lesson: ${lesson.title}`,
      `Overview: ${summary?.overview || ""}`,
      "Key Takeaways:",
      ...(summary?.takeaways || []),
    ].join(". ")

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.rate = 1.05
    utterance.pitch = 1.0

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel border border-white/20 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 3D Laser Beam */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Lesson 0{lessonIndex + 1}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ChannelAvatar channelTitle={lesson.channelTitle} size={16} />
                {lesson.channelTitle}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="size-3 text-indigo-400" />
                {lesson.estimatedDuration}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug break-words">
              {lesson.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-white/10 bg-neutral-950/30 overflow-x-auto gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "summary"
                  ? "border-indigo-400 text-white bg-indigo-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="size-3.5 text-indigo-400" />
              <span>AI Key Takeaways</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "notes"
                  ? "border-purple-400 text-white bg-purple-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="size-3.5 text-purple-400" />
              <span>Smart Notes & Scratchpad</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "video"
                  ? "border-red-400 text-white bg-red-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Youtube className="size-3.5 text-red-400" />
              <span>Watch Tutorial</span>
            </button>
          </div>

          {/* AI Voice Narration Button */}
          {activeTab === "summary" && (
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-indigo-600 text-white border-indigo-400 animate-pulse shadow-md shadow-indigo-500/40"
                  : "bg-white/5 hover:bg-white/10 text-indigo-300 border-indigo-500/30"
              }`}
            >
              {isSpeaking ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              <span>{isSpeaking ? "Pause Voice" : "Listen (AI Voice)"}</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* TAB 1: AI SUMMARY */}
          {activeTab === "summary" && (
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4 sm:p-5 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-indigo-400" /> Architectural Overview
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {summary?.overview || "Synthesizing deep conceptual overview and core workflows..."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Key Practical Takeaways (5 Bullet Breakdown)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy((summary?.takeaways || []).join("\n"))}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    {copied ? "Copied!" : "Copy Takeaways"}
                  </button>
                </div>

                <div className="grid gap-2.5">
                  {(summary?.takeaways || [
                    "Master the fundamental syntax and mental model behind this topic",
                    "Follow step-by-step code implementation with best practice patterns",
                    "Understand performance bottlenecks and memory considerations",
                    "Avoid common developer anti-patterns and debugging headaches",
                    "Build a functional module by applying the core techniques demonstrated"
                  ]).map((t, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="size-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                        0{i + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SMART NOTES & SCRATCHPAD */}
          {activeTab === "notes" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-purple-400" /> Lesson Cheat-Sheet Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(notes.join("\n"))}
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    {copied ? "Copied!" : "Copy All Notes"}
                  </button>
                </div>

                <div className="grid gap-2">
                  {(notes.length > 0 ? notes : [
                    "Focus on replicating every code snippet demonstrated in the video",
                    "Write questions in the margin; answer them after completing the lesson",
                    "The first 20% of core concepts drive 80% of production usage",
                    "Always verify edge cases and error boundaries in local testing",
                    "Version control your experimental branches with clean git commits"
                  ]).map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="size-5 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center shrink-0 border border-purple-500/30 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">{n}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Scratchpad */}
              <div className="rounded-2xl border border-white/15 bg-neutral-950/70 p-4 sm:p-5 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Sparkles className="size-3.5 text-purple-400" />
                  Your Personal Lesson Notebook
                </label>
                <textarea
                  rows={3}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Record custom timestamps, personal notes, code snippets, or ideas for this specific lesson..."
                  className="w-full text-xs rounded-xl border border-white/15 bg-neutral-900/90 text-white p-3.5 resize-none focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40 font-normal leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Saved locally in your browser cache</span>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      savedNote
                        ? "bg-emerald-500 text-white"
                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 hover:-translate-y-0.5"
                    }`}
                  >
                    {savedNote ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
                    {savedNote ? "Saved to Browser!" : "Save Note"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WATCH VIDEO */}
          {activeTab === "video" && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center">
                {isLikelyYouTubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?autoplay=1`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="p-8 space-y-4 text-center">
                    <p className="text-sm text-slate-300">Direct embedded player ready for this lesson.</p>
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-600/40 transition-all hover:scale-105"
                    >
                      <Play className="size-4 fill-white" />
                      Watch on YouTube Directly
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  Open in separate YouTube tab
                </a>

                <span className="text-xs text-slate-500">Video by {lesson.channelTitle}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <Youtube className="size-4" />
            Watch on YouTube
          </a>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
