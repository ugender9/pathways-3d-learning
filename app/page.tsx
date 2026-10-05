"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from "swr"
import { CourseOutline } from "@/components/course-outline"
import { Canvas3D } from "@/components/canvas-3d"
import { QuizPanel } from "@/components/quiz-panel"
import { ExecutiveSummaryModal } from "@/components/executive-summary-modal"
import { Card3D } from "@/components/card-3d"
import { Sparkles, Youtube, Brain, ChevronRight, Loader2, Play, Flame, Compass, Cpu, Layers, Link as LinkIcon, ArrowRight, BookOpen, Clock, Award } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Params = { topic: string; level: "beginner" | "intermediate" | "advanced" }

export default function Page() {
  const [params, setParams] = useState<Params>({
    topic: "",
    level: "beginner",
  })
  const [submitted, setSubmitted] = useState(false)
  // Unique key per submission to prevent SWR from returning stale cached data for a different course
  const [submissionKey, setSubmissionKey] = useState(0)
  const [heroModalMode, setHeroModalMode] = useState<"takeaways" | "notes" | "masters" | null>(null)
  const [quizArenaOpen, setQuizArenaOpen] = useState(false)

  // Include submissionKey in the SWR cache key so each new submission gets a fresh fetch
  const query =
    submitted && params.topic
      ? `/api/curate?topic=${encodeURIComponent(params.topic)}&level=${params.level}&_k=${submissionKey}`
      : null

  const { data, error, isLoading } = useSWR(query, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 0,
  })

  const quickTopics = [
    "Next.js 15 & React 19",
    "Python AI & LLMs",
    "System Design & Microservices",
    "Three.js & 3D Web",
    "DevOps & Kubernetes",
    "Full-Stack TypeScript",
  ]

  const featuredCurriculums = [
    {
      title: "Python AI & LLMs Masterclass",
      category: "Artificial Intelligence",
      duration: "9 Lessons · ~4.5 Hours",
      color: "from-indigo-500 to-purple-600",
      borderColor: "border-indigo-500/30",
      tags: ["PyTorch", "RAG", "Transformers", "LangChain"],
      topic: "Python AI & LLMs",
    },
    {
      title: "Next.js 15 & React 19 Full-Stack",
      category: "Modern Web Engineering",
      duration: "9 Lessons · ~3.8 Hours",
      color: "from-blue-500 to-cyan-600",
      borderColor: "border-cyan-500/30",
      tags: ["Server Actions", "RSC", "App Router", "Tailwind"],
      topic: "Next.js 15 & React 19",
    },
    {
      title: "System Design & Distributed Systems",
      category: "Software Architecture",
      duration: "9 Lessons · ~5.0 Hours",
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      tags: ["Microservices", "Kafka", "Redis", "Sharding"],
      topic: "System Design & Microservices",
    },
    {
      title: "Three.js & WebGL 3D Spatial Web",
      category: "Creative Engineering",
      duration: "9 Lessons · ~3.2 Hours",
      color: "from-amber-500 to-rose-600",
      borderColor: "border-amber-500/30",
      tags: ["Shaders", "R3F", "Instancing", "PBR"],
      topic: "Three.js & 3D Web",
    },
  ]

  const handleHeroFeatureClick = (type: "masters" | "takeaways" | "notes" | "quiz") => {
    if (type === "quiz") {
      setQuizArenaOpen(true)
    } else {
      setHeroModalMode(type)
    }
  }

  const handleTopicSubmit = useCallback((topicString: string) => {
    let cleanTopic = topicString.trim()
    if (cleanTopic.includes("youtube.com") || cleanTopic.includes("youtu.be")) {
      try {
        const url = new URL(cleanTopic)
        const v = url.searchParams.get("v") || url.pathname.replace(/^\//, "")
        cleanTopic = v ? `YouTube Video: ${v}` : "YouTube Playlist Masterclass"
      } catch {
        cleanTopic = "Curated YouTube Tutorial"
      }
    }

    // Increment submission key to bust SWR cache — prevents showing old course data
    setSubmissionKey((k) => k + 1)
    setParams((p) => ({ ...p, topic: cleanTopic }))
    setSubmitted(true)
    setTimeout(() => {
      const el = document.getElementById("course-matrix")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, 300)
  }, [])

  return (
    <main className="relative min-h-screen bg-[#090d16] text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* ── 3D WebGL Background Canvas ── */}
      <Canvas3D />

      {/* ── 3D Isometric Grid Floor Layer ── */}
      <div className="pointer-events-none fixed inset-0 grid-floor-3d opacity-30 z-0" aria-hidden="true" />

      {/* ── Ambient Radial Glows ── */}
      <div className="pointer-events-none fixed top-0 left-1/4 size-[600px] rounded-full bg-indigo-600/10 blur-[140px] z-0 animate-pulse-glow" />
      <div className="pointer-events-none fixed top-1/3 right-10 size-[500px] rounded-full bg-purple-600/10 blur-[120px] z-0 animate-float-reverse" />
      <div className="pointer-events-none fixed bottom-10 left-10 size-[500px] rounded-full bg-pink-600/10 blur-[130px] z-0" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 glass-panel">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* 3D Animated Logo Sphere */}
            <div className="relative size-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 transform hover:rotate-12 transition-transform duration-300">
              <Youtube className="size-5 text-white drop-shadow" />
              <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-emerald-400 ring-2 ring-[#090d16] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white">Pathways</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Enterprise LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Spatial AI Learning Academy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuizArenaOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors cursor-pointer"
            >
              <Flame className="size-3.5 text-amber-400" />
              <span>Launch Quiz Arena</span>
            </button>

            <a
              className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              href="#course-matrix"
            >
              <span>Explore Curriculum</span>
              <ChevronRight className="size-3 text-indigo-400" />
            </a>
          </div>
        </div>
      </header>

      {/* ── 3D Hero Arena ── */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-14 px-5 sm:px-8">
        <div className="mx-auto w-full max-w-5xl text-center perspective-container">
          {/* Holographic Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-indigo-500/10 animate-float-slow">
            <Sparkles className="size-3.5 text-pink-400" />
            <span>Next-Gen Spatial Learning Matrix</span>
            <span className="size-1 rounded-full bg-indigo-400" />
            <span className="text-slate-400 font-normal normal-case">YouTube + GPT-4o + 3D WebGL</span>
          </div>

          {/* 3D Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Master Any Skill in a <br className="hidden sm:inline" />
            <span className="gradient-text-3d drop-shadow-2xl">3D Structured Course</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Stop drowning in random video playlists. Turn any YouTube topic or playlist into an interactive curriculum with AI key takeaways, active recall flashcards, and verified completion certificates.
          </p>

          {/* 3D Interactive Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-12">
            {[
              { type: "masters" as const, icon: Youtube, label: "Curated YouTube Masters", color: "text-red-400", border: "border-red-500/30 hover:border-red-500/60 bg-red-950/20" },
              { type: "takeaways" as const, icon: Brain, label: "AI Key Takeaways", color: "text-purple-400", border: "border-purple-500/30 hover:border-purple-500/60 bg-purple-950/20" },
              { type: "notes" as const, icon: Layers, label: "Contextual Smart Notes", color: "text-indigo-400", border: "border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/20" },
              { type: "quiz" as const, icon: Flame, label: "Interactive Quiz Arena", color: "text-amber-400", border: "border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20" },
            ].map(({ type, icon: Icon, label, color, border }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleHeroFeatureClick(type)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel ${border} text-xs font-bold text-slate-200 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}
              >
                <Icon className={`size-4 ${color}`} />
                <span>{label}</span>
                <span className="text-[10px] text-slate-500 font-normal ml-0.5">↗</span>
              </button>
            ))}
          </div>

          {/* ── 3D Holographic Course Generator Terminal ── */}
          <div className="max-w-3xl mx-auto border-beam rounded-3xl glass-panel p-6 sm:p-9 shadow-2xl border border-white/20 text-left">
            <form
              className="grid gap-6"
              onSubmit={(e) => {
                e.preventDefault()
                if (!params.topic.trim()) return
                handleTopicSubmit(params.topic)
              }}
            >
              <div className="grid sm:grid-cols-3 gap-5">
                {/* Topic / URL Input */}
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Compass className="size-3.5 text-indigo-400" />
                      Topic or YouTube Video / Playlist URL
                    </span>
                    <span className="text-[10px] text-slate-500 normal-case flex items-center gap-1">
                      <LinkIcon className="size-2.5" /> Direct URL supported
                    </span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g. Python AI & LLMs, Next.js 15, System Design, or paste YouTube link..."
                    value={params.topic}
                    onChange={(e) => setParams((p) => ({ ...p, topic: e.target.value }))}
                    className="h-12 rounded-2xl bg-neutral-950/70 border-white/15 text-white placeholder:text-slate-500 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  />
                </div>

                {/* Level Tabs */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Cpu className="size-3.5 text-purple-400" />
                    Target Depth
                  </Label>
                  <Tabs
                    value={params.level}
                    onValueChange={(v) => setParams((p) => ({ ...p, level: v as Params["level"] }))}
                  >
                    <TabsList className="grid grid-cols-3 h-12 rounded-2xl bg-neutral-950/70 border border-white/15 p-1">
                      <TabsTrigger className="text-xs rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold cursor-pointer" value="beginner">
                        Novice
                      </TabsTrigger>
                      <TabsTrigger className="text-xs rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold cursor-pointer" value="intermediate">
                        Adept
                      </TabsTrigger>
                      <TabsTrigger className="text-xs rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold cursor-pointer" value="advanced">
                        Master
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Popular Paths:</span>
                {quickTopics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTopicSubmit(t)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all duration-200 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Submit Button & Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/60 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-4 fill-white" />}
                  {isLoading ? "Synthesizing Path…" : "Generate 3D Course"}
                </button>

                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  ⚡ Curates verified YouTube masterclasses, builds 3 structured phases, active flashcards, and study packs.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── 3D Course Matrix Results Section ── */}
      <section id="course-matrix" className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 pb-28 scroll-mt-24">
        {error && (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 p-6 text-rose-200 text-sm flex items-start gap-4 glass-panel">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-base">Course Synthesis Error</p>
              <p className="text-xs opacity-80 mt-1">{String(error)}</p>
            </div>
          </div>
        )}

        {/* 3D Loading Shimmer HUD */}
        {isLoading && submitted && (
          <div className="rounded-3xl glass-panel p-12 border border-white/20 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="size-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Loader2 className="size-8 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Synthesizing 3D Curriculum…</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-8">
              Filtering top YouTube video tutorials, analyzing transcripts, and formulating intelligent takeaways.
            </p>

            <div className="space-y-3 max-w-sm mx-auto">
              <div className="h-3 rounded-full animate-shimmer-3d w-full" />
              <div className="h-3 rounded-full animate-shimmer-3d w-3/4 mx-auto" />
              <div className="h-3 rounded-full animate-shimmer-3d w-1/2 mx-auto" />
            </div>
          </div>
        )}

        {/* Course Roadmap Output */}
        {/* Only show course data when it's loaded AND not currently fetching a new one */}
        {submitted && data && !isLoading && (
          <div className="animate-fade-in">
            <CourseOutline topic={params.topic} modules={data.modules} />
          </div>
        )}

        {/* Featured Starter Showcases (Visible before submitting) */}
        {!submitted && !isLoading && (
          <div className="space-y-6 pt-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-indigo-400" /> Featured Starter Pathways
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Explore Curated Masterclasses with 1 Click
                </h3>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Verified by Industry Engineers</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCurriculums.map((c, i) => (
                <Card3D key={i} maxTilt={10} depth={20}>
                  <div
                    onClick={() => handleTopicSubmit(c.topic)}
                    className={`group relative flex flex-col justify-between h-full p-5 rounded-2xl glass-panel border ${c.borderColor} hover:border-white/40 shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {c.category}
                        </span>
                        <div className={`size-2.5 rounded-full bg-gradient-to-r ${c.color} animate-pulse`} />
                      </div>

                      <h4 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors leading-snug">
                        {c.title}
                      </h4>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="size-3 text-indigo-400" />
                        {c.duration}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.tags.map((t) => (
                          <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
                      <span>Launch Masterclass</span>
                      <ArrowRight className="size-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Modals ── */}
      <ExecutiveSummaryModal
        open={heroModalMode !== null}
        onClose={() => setHeroModalMode(null)}
        topic={params.topic || "Full-Stack Development"}
        mode={heroModalMode || "takeaways"}
      />

      <QuizPanel
        open={quizArenaOpen}
        onClose={() => setQuizArenaOpen(false)}
        topic={params.topic || "Core Foundations"}
        context={
          data?.modules?.flatMap((m: any) => m.lessons.map((l: any) => l.title)).join(" • ") ||
          "Full Course Foundations, Practical Implementation, Performance Tuning, Real-World Application"
        }
      />

      {/* ── Futuristic Footer ── */}
      <footer className="relative z-10 border-t border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Youtube className="size-4 text-white" />
            </div>
            <span className="font-bold text-white">Pathways 3D Enterprise LMS</span>
            <span>·</span>
            <span>YouTube & AI Structured Learning</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="size-2 rounded-full bg-emerald-400" />
              3D Spatial Active
            </span>
            <span>·</span>
            <span>Next.js 15 & Three.js</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
