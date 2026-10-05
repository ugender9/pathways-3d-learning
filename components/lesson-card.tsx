"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, BookOpen, Play } from "lucide-react"
import { ChannelAvatar } from "@/components/channel-avatar"
import { Card3D } from "@/components/card-3d"
import { LessonDetailModal } from "@/components/lesson-detail-modal"
import { getTopicThumbnail } from "@/lib/topic-thumbnails"
import { fireSuccessConfetti } from "@/lib/confetti"

type Lesson = {
  title: string
  videoId: string
  channelTitle: string
  thumbnail: string
  estimatedDuration: string
  summary?: { overview: string; takeaways: string[] } | null
  level: "beginner" | "intermediate" | "advanced"
}

const levelStyles: Record<Lesson["level"], string> = {
  beginner: "bg-emerald-500/90 text-white shadow-emerald-500/40 shadow-sm",
  intermediate: "bg-amber-500/90 text-white shadow-amber-500/40 shadow-sm",
  advanced: "bg-rose-500/90 text-white shadow-rose-500/40 shadow-sm",
}

export function LessonCard({
  lesson,
  lessonIndex,
  onComplete,
}: {
  lesson: Lesson
  lessonIndex: number
  onComplete: (checked: boolean) => void
}) {
  const [done, setDone] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<"summary" | "notes" | "video">("summary")

  const isLikelyYouTubeId = (id?: string) =>
    typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id)
  const isFallback = !isLikelyYouTubeId(lesson.videoId)
  const youtubeUrl = isFallback
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} ${lesson.channelTitle}`)}`
    : `https://www.youtube.com/watch?v=${lesson.videoId}`

  const thumbnailSrc =
    lesson.thumbnail && !lesson.thumbnail.includes("placeholder") && !lesson.thumbnail.includes("/images/topics")
      ? lesson.thumbnail
      : isLikelyYouTubeId(lesson.videoId)
        ? `https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`
        : getTopicThumbnail(`${lesson.title} ${lesson.channelTitle}`) || "/course-thumbnail.png"

  const handleToggleComplete = () => {
    const next = !done
    setDone(next)
    onComplete(next)
    if (next) {
      fireSuccessConfetti()
    }
  }

  const handleOpenSummary = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalTab("summary")
    setModalOpen(true)
  }

  const handleOpenNotes = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalTab("notes")
    setModalOpen(true)
  }

  const handleOpenVideoModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalTab("video")
    setModalOpen(true)
  }

  return (
    <>
      <Card3D maxTilt={8} depth={15} className="h-full">
        <article
          className={`group relative flex flex-col h-full rounded-2xl glass-panel overflow-hidden transition-all duration-300 border ${
            done
              ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
              : "border-white/10 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/20"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Glowing 3D Laser Border Beam when hovered */}
          {hovered && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-pink-500/15 to-cyan-500/15 opacity-100 transition-opacity duration-300 z-0" />
          )}

          {/* Top Status Gradient */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 z-20 transition-all duration-500 ${
              done
                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-100"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* ── 3D Thumbnail Area ── */}
          <div
            className="relative aspect-video bg-neutral-950 overflow-hidden z-10 cursor-pointer"
            onClick={handleOpenVideoModal}
          >
            {/* Thumbnail image */}
            <Image
              src={thumbnailSrc || "/placeholder.svg"}
              alt={`Thumbnail for ${lesson.title}`}
              fill
              className={`object-cover transition-transform duration-700 ${
                hovered ? "scale-108 brightness-95" : "scale-100 brightness-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Dynamic Lighting Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

            {/* ── 3D Floating Cinema Play Button ── */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
                hovered ? "opacity-100 scale-105" : "opacity-0 scale-90"
              }`}
            >
              <div className="flex items-center gap-2.5 bg-neutral-900/95 backdrop-blur-md border border-white/25 rounded-full pl-2 pr-4 py-1.5 shadow-2xl shadow-red-500/40">
                <ChannelAvatar channelTitle={lesson.channelTitle} size={28} />
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 90 63" className="h-4 w-auto drop-shadow" fill="none">
                    <path
                      d="M88.15 9.83A11.3 11.3 0 0 0 80.3 1.92C73.27 0 45.06 0 45.06 0S16.85 0 9.82 1.92A11.3 11.3 0 0 0 1.97 9.83C0 16.88 0 31.55 0 31.55s0 14.67 1.97 21.72a11.3 11.3 0 0 0 7.85 7.91C16.85 63.1 45.06 63.1 45.06 63.1s28.21 0 35.24-1.92a11.3 11.3 0 0 0 7.85-7.91C90.2 46.22 90.2 31.55 90.2 31.55S90.2 16.88 88.15 9.83Z"
                      fill="#FF0000"
                    />
                    <path d="M36.04 44.86 59.47 31.55 36.04 18.24v26.62Z" fill="#fff" />
                  </svg>
                  <span className="text-xs font-bold text-white tracking-wide">
                    Watch Video
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Channel Strip */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3 pb-2.5 pt-6 pointer-events-none z-10">
              <div className="flex items-center gap-2 min-w-0">
                <ChannelAvatar channelTitle={lesson.channelTitle} size={22} />
                <span className="text-white text-xs font-semibold truncate drop-shadow-md">
                  {lesson.channelTitle}
                </span>
              </div>

              {/* Level Pill */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${levelStyles[lesson.level]}`}
              >
                {lesson.level}
              </span>
            </div>

            {/* Top Duration Pill */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/15 text-white/95 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-lg z-10">
              <Clock className="size-3 text-indigo-400" />
              {lesson.estimatedDuration}
            </div>

            {/* Done Glow Badge */}
            {done && (
              <div className="absolute top-2.5 left-2.5 size-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 z-20">
                <CheckCircle2 className="size-4 text-white" />
              </div>
            )}
          </div>

          {/* ── Card Content Area ── */}
          <div className="flex flex-col flex-1 p-4 gap-3 z-20">
            {/* Title Row */}
            <div className="flex items-start gap-2.5">
              <h4
                onClick={handleOpenVideoModal}
                className={`flex-1 font-bold text-sm leading-snug break-words transition-colors cursor-pointer ${
                  done ? "line-through text-muted-foreground" : "text-foreground group-hover:text-indigo-300"
                }`}
              >
                {lesson.title}
              </h4>

              {/* 3D Checkbox Button */}
              <button
                type="button"
                aria-label={done ? "Mark as incomplete" : "Mark as complete"}
                onClick={handleToggleComplete}
                className={`shrink-0 mt-0.5 size-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/40 scale-110"
                    : "border-white/20 hover:border-emerald-400 bg-white/5 hover:scale-105"
                }`}
              >
                {done && <CheckCircle2 className="size-4 text-white" />}
              </button>
            </div>

            {/* 3D Action Pills with guaranteed modal triggers */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {/* AI Summary Button */}
              <button
                type="button"
                onClick={handleOpenSummary}
                className="inline-flex items-center gap-1.5 text-xs font-bold h-7 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                <Sparkles className="size-3.5 text-indigo-400" />
                <span>AI Summary</span>
              </button>

              {/* Smart Notes Button */}
              <button
                type="button"
                onClick={handleOpenNotes}
                className="inline-flex items-center gap-1.5 text-xs font-bold h-7 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 text-purple-300 border border-purple-500/40 hover:border-purple-400 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                <BookOpen className="size-3.5 text-purple-400" />
                <span>Smart Notes</span>
              </button>

              {/* YouTube Link */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors font-medium hover:underline underline-offset-4"
              >
                <ExternalLink className="size-3" />
                YouTube
              </a>
            </div>
          </div>
        </article>
      </Card3D>

      {/* Full Lesson Intelligence Modal */}
      <LessonDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lesson={lesson}
        lessonIndex={lessonIndex}
        initialTab={modalTab}
      />
    </>
  )
}
