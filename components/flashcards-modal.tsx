"use client"

import { useState } from "react"
import { X, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Check, Brain, Trophy } from "lucide-react"
import { fireSuccessConfetti, fireMilestoneConfetti } from "@/lib/confetti"

interface FlashcardsModalProps {
  open: boolean
  onClose: () => void
  topic: string
  modules: Array<{
    title: string
    lessons: Array<{ title: string; channelTitle: string }>
  }>
}

interface Flashcard {
  question: string
  answer: string
  phase: string
}

function generateFlashcards(topic: string, modules: Array<{ title: string; lessons: Array<{ title: string }> }>): Flashcard[] {
  const cards: Flashcard[] = []

  modules.forEach((mod, idx) => {
    mod.lessons.forEach((l) => {
      cards.push({
        phase: `Phase 0${idx + 1}: ${mod.title}`,
        question: `What are the critical concepts and core workflows taught in "${l.title}"?`,
        answer: `This masterclass demonstrates idiomatic implementation, memory and performance trade-offs, step-by-step debugging patterns, and production-grade architecture principles.`,
      })
    })
  })

  // Add general high-depth domain cards
  cards.push(
    {
      phase: "Architecture Core",
      question: `Why is active recall and writing code by hand more effective than passive video watching in ${topic}?`,
      answer: `Passive video watching creates the 'illusion of competence'. Active code synthesis forces neural pathway creation, reveals edge case gaps, and builds muscle memory.`,
    },
    {
      phase: "Production Best Practices",
      question: `How do you transition a beginner ${topic} script into an enterprise-grade production module?`,
      answer: `Implement modular architecture, strict type checking, comprehensive test coverage (unit/integration), environment variable security, error boundaries, and CI/CD pipelines.`,
    }
  )

  return cards
}

export function FlashcardsModal({ open, onClose, topic, modules }: FlashcardsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCount, setMasteredCount] = useState(0)
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({})

  if (!open) return null

  const cards = generateFlashcards(topic, modules)
  const currentCard = cards[currentIndex] || cards[0]
  const isCardMastered = !!masteredCards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const handleMarkMastered = () => {
    if (!isCardMastered) {
      setMasteredCards((prev) => ({ ...prev, [currentIndex]: true }))
      setMasteredCount((c) => c + 1)
      fireSuccessConfetti()
    }
    handleNext()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl glass-panel border border-purple-500/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 3D Laser Beam */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="size-5 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                Active Recall & Spaced Repetition
              </span>
              <h3 className="font-extrabold text-lg text-white">Interactive 3D Flashcards</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {currentIndex + 1} / {cards.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* 3D Flip Flashcard Arena */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center space-y-6" style={{ perspective: 1200 }}>
          <div
            onClick={() => setIsFlipped((f) => !f)}
            style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[340px] rounded-3xl cursor-pointer select-none"
          >
            {/* FRONT OF CARD (Question) */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 rounded-3xl glass-panel border-2 border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-neutral-950/90 via-purple-950/20 to-neutral-950/90 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                  {currentCard.phase}
                </span>
                <span className="text-[11px] text-slate-400 italic">Click card to reveal answer ↻</span>
              </div>

              <div className="my-auto space-y-2">
                <p className="text-base sm:text-xl font-bold text-white leading-relaxed">
                  {currentCard.question}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                <span>Prompt Card #{currentIndex + 1}</span>
                <span className="text-purple-400 font-semibold">Tap to flip</span>
              </div>
            </div>

            {/* BACK OF CARD (Answer / Key Mechanics) */}
            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute inset-0 rounded-3xl glass-panel border-2 border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-neutral-950/90 via-emerald-950/20 to-neutral-950/90 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  Core Solution & Mental Model
                </span>
                <span className="text-[11px] text-slate-400 italic">Click to flip back ↻</span>
              </div>

              <div className="my-auto space-y-2">
                <p className="text-xs sm:text-base font-medium text-slate-200 leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                <span>Mastery Answer</span>
                <span className="text-emerald-400 font-semibold">Active Recall Verified ✓</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-md gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleMarkMastered}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                isCardMastered
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
              }`}
            >
              <Check className="size-4" />
              <span>{isCardMastered ? "Mastered!" : "Mark Mastered"}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-neutral-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{masteredCount} of {cards.length} cards mastered in this session</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
