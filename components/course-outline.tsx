"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { LessonCard } from "@/components/lesson-card"
import { QuizPanel } from "@/components/quiz-panel"
import { CertificateModal } from "@/components/certificate-modal"
import { FlashcardsModal } from "@/components/flashcards-modal"
import { exportStudyPackToMarkdown } from "@/lib/export-study-pack"
import { Trophy, Zap, CheckCircle2, ChevronDown, ChevronUp, Sparkles, BookOpen, Clock, Target, Flame, Download, Brain, Award, Layers } from "lucide-react"
import { fireMilestoneConfetti } from "@/lib/confetti"

type Lesson = {
  title: string
  videoId: string
  channelTitle: string
  thumbnail: string
  estimatedDuration: string
  summary?: { overview: string; takeaways: string[] } | null
  level: "beginner" | "intermediate" | "advanced"
}

type Module = {
  title: string
  description: string
  lessons: Lesson[]
}

export function CourseOutline({
  topic,
  modules,
}: {
  topic: string
  modules: Module[]
}) {
  const [quizOpen, setQuizOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [flashcardsOpen, setFlashcardsOpen] = useState(false)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [hasCelebrated, setHasCelebrated] = useState(false)
  const [exporting, setExporting] = useState(false)

  const allLessons = modules.flatMap((m) => m.lessons)
  const completedCount = Object.values(completed).filter(Boolean).length
  const progress = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0
  const xpPoints = completedCount * 120

  useEffect(() => {
    if (completedCount === allLessons.length && allLessons.length > 0 && !hasCelebrated) {
      fireMilestoneConfetti()
      setHasCelebrated(true)
      setCertOpen(true)
    }
  }, [completedCount, allLessons.length, hasCelebrated])

  const handleExport = () => {
    setExporting(true)
    exportStudyPackToMarkdown({ topic, modules })
    setTimeout(() => setExporting(false), 1200)
  }

  const handleToggleExpandAll = () => {
    const areAllCollapsed = modules.every((_, i) => collapsed[i])
    const nextState: Record<number, boolean> = {}
    modules.forEach((_, i) => {
      nextState[i] = !areAllCollapsed
    })
    setCollapsed(nextState)
  }

  return (
    <div className="grid gap-8">
      {/* ── 3D Holographic Course HUD & Matrix ── */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 overflow-hidden shadow-2xl">
        {/* Top 3D Laser Beam */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Cyber Grid Ambient */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-pink-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Sparkles className="size-3 text-indigo-400" />
                Curated Learning Matrix
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Flame className="size-3 text-emerald-400" />
                {xpPoints} XP Earned
              </span>
              {completedCount === allLessons.length && allLessons.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  <Award className="size-3 text-amber-400" />
                  Mastery Achieved!
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-words">
              {topic}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              A high-precision curriculum transformed from YouTube into masterclasses with AI key takeaways, personalized smart notes, and interactive quizzes.
            </p>

            {/* Expert Power Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* Quiz Arena Button */}
              <button
                type="button"
                onClick={() => setQuizOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Zap className="size-4 text-amber-300" />
                Launch Quiz Arena
              </button>

              {/* Spaced Repetition Flashcards */}
              <button
                type="button"
                onClick={() => setFlashcardsOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Brain className="size-4 text-purple-400" />
                Flashcards Mode
              </button>

              {/* Export Markdown Study Pack */}
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="size-4 text-cyan-400" />
                {exporting ? "Exporting..." : "Export Study Pack (.md)"}
              </button>

              {/* Verified Certificate Button */}
              <button
                type="button"
                onClick={() => setCertOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Award className="size-4 text-amber-400" />
                Certificate
              </button>
            </div>
          </div>

          {/* 3D Circular Progress HUD Gauge */}
          <div className="flex items-center gap-5 sm:shrink-0 bg-neutral-950/40 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Progress</p>
              <p className="text-3xl font-black text-white">
                {completedCount}
                <span className="text-lg text-slate-500 font-normal">/{allLessons.length}</span>
              </p>
              <p className="text-xs text-indigo-400 font-medium">
                {Math.round(progress)}% Completed
              </p>
            </div>

            {/* 3D Conic Progress Orb */}
            <div
              className="size-16 sm:size-20 rounded-full flex items-center justify-center shrink-0 p-1.5 shadow-xl cursor-pointer"
              onClick={() => setCertOpen(true)}
              title="Click to view Certificate"
              style={{
                background: `conic-gradient(#6366f1 ${progress}%, #ec4899 ${progress}%, rgba(255,255,255,0.08) ${progress}% 100%)`,
              }}
            >
              <div className="size-full rounded-full bg-neutral-900 flex items-center justify-center border border-white/10">
                {completedCount === allLessons.length && allLessons.length > 0 ? (
                  <Trophy className="size-7 text-amber-400 animate-bounce" />
                ) : (
                  <Target className="size-6 text-indigo-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Holographic Glowing Progress Bar */}
        <div className="mt-6 h-2 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 shadow-md shadow-indigo-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── 3D Module Roadmap Sections ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Curriculum Breakdown (3 Phases · {allLessons.length} Lessons)
          </span>
          <button
            type="button"
            onClick={handleToggleExpandAll}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            Toggle Expand All
          </button>
        </div>

        <div className="grid gap-6">
          {modules.map((mod, idx) => {
            const isCollapsed = collapsed[idx]
            const moduleCompleted = mod.lessons.filter((l) => completed[l.videoId]).length
            const isAllDone = moduleCompleted === mod.lessons.length && mod.lessons.length > 0

            return (
              <div
                key={idx}
                className={`relative rounded-3xl glass-panel border transition-all duration-300 overflow-hidden ${
                  isAllDone
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Module Header Strip */}
                <button
                  type="button"
                  className="w-full text-left p-6 flex items-start justify-between gap-4 group cursor-pointer"
                  onClick={() => setCollapsed((c) => ({ ...c, [idx]: !c[idx] }))}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* 3D Holographic Stage Node */}
                    <div
                      className={`size-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm border shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                        isAllDone
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20"
                      }`}
                    >
                      {isAllDone ? <CheckCircle2 className="size-5" /> : `0${idx + 1}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                          Phase 0{idx + 1}
                        </span>
                        {isAllDone && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Complete
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-xl text-white mt-1 group-hover:text-indigo-300 transition-colors break-words">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-slate-300 mt-1 break-words">{mod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      {moduleCompleted}/{mod.lessons.length} lessons
                    </span>
                    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white border border-white/10 transition-colors">
                      {isCollapsed ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
                    </div>
                  </div>
                </button>

                {/* 3D Lessons Grid */}
                {!isCollapsed && (
                  <div className="px-6 pb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mod.lessons.map((lesson, lessonIdx) => (
                      <LessonCard
                        key={lesson.videoId}
                        lesson={lesson}
                        lessonIndex={idx * 3 + lessonIdx}
                        onComplete={(checked) =>
                          setCompleted((c) => ({ ...c, [lesson.videoId]: checked }))
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quiz Arena Modal */}
      <QuizPanel
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        topic={topic}
        context={allLessons.map((l) => l.title).join(" • ")}
      />

      {/* Verified Certificate Modal */}
      <CertificateModal
        open={certOpen}
        onClose={() => setCertOpen(false)}
        topic={topic}
        completedCount={completedCount}
        totalCount={allLessons.length}
        xpPoints={xpPoints}
      />

      {/* Active Recall Flashcards Modal */}
      <FlashcardsModal
        open={flashcardsOpen}
        onClose={() => setFlashcardsOpen(false)}
        topic={topic}
        modules={modules}
      />
    </div>
  )
}
