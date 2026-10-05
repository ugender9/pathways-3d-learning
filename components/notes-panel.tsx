"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, Sparkles, BookOpen, RefreshCw, Copy, Check, Save } from "lucide-react"

interface NotesPanelProps {
  lessonId: string
  lessonTitle: string
  channelTitle: string
  lessonIndex: number
}

export function NotesPanel({ lessonId, lessonTitle, channelTitle, lessonIndex }: NotesPanelProps) {
  const [notes, setNotes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userNote, setUserNote] = useState("")
  const [savedNote, setSavedNote] = useState(false)
  const hasFetched = useRef(false)

  // Load persisted user note
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(`pathways:note:${lessonId}`) : ""
    if (saved) setUserNote(saved)
  }, [lessonId])

  // Auto-fetch contextual notes on mount
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setLoading(true)
    try {
      const res = await fetch("/api/lesson-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lessonTitle, channel: channelTitle, lessonIndex }),
      })
      const data = await res.json()
      setNotes(data.notes ?? [])
    } catch {
      setNotes(["Could not load notes. Try refreshing."])
    } finally {
      setLoading(false)
    }
  }

  function copyAll() {
    const text = notes.map((n, i) => `${i + 1}. ${n}`).join("\n")
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function saveUserNote() {
    localStorage.setItem(`pathways:note:${lessonId}`, userNote)
    setSavedNote(true)
    setTimeout(() => setSavedNote(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md overflow-hidden shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <BookOpen className="size-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-white">Smart Study Notes</span>
          <span className="text-[10px] text-slate-400">— core concepts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copyAll}
            disabled={loading || notes.length === 0}
            title="Copy all notes"
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={fetchNotes}
            disabled={loading}
            title="Refresh notes"
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* AI-generated bullet notes */}
      <div className="p-3.5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2.5 py-3">
            <Loader2 className="size-4 text-indigo-400 animate-spin shrink-0" />
            <span className="text-xs text-slate-400">Synthesizing smart cheat-sheet notes…</span>
          </div>
        ) : (
          <ul className="grid gap-2">
            {notes.map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-200 group"
              >
                <span className="mt-0.5 size-4 shrink-0 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px] font-black text-indigo-300">
                  {i + 1}
                </span>
                <span className="font-normal">{note}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* User's personal scratchpad note */}
        <div className="grid gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className="size-3 text-purple-400" />
            Personal Note & Insights
          </label>
          <textarea
            rows={2}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Write personal timestamps, code snippets, or key ideas…"
            className="w-full text-xs rounded-xl border border-white/15 bg-neutral-900/90 text-white px-3 py-2 resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition-all placeholder:text-slate-500 font-normal"
          />
          <button
            type="button"
            onClick={saveUserNote}
            className={`self-start inline-flex items-center gap-1.5 text-xs h-7 px-3.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
              savedNote
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/40"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {savedNote ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
            {savedNote ? "Saved to Browser!" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  )
}
