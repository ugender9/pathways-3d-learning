"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Zap, Loader2, CheckCircle2, XCircle, Trophy, Sparkles, RefreshCw, Award, Check } from "lucide-react"
import { fireSuccessConfetti, fireMilestoneConfetti } from "@/lib/confetti"

type Q = {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export function QuizPanel({
  open,
  onClose,
  topic,
  context,
}: {
  open: boolean
  onClose: () => void
  topic: string
  context: string
}) {
  const [questions, setQuestions] = useState<Q[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fetchQuiz = async () => {
    setLoading(true)
    setScore(null)
    setSubmitted(false)
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, context }),
      })
      const data = await res.json()
      const qList = data.questions ?? []
      setQuestions(qList)
      setAnswers(new Array(qList.length).fill(-1))
    } catch (e) {
      console.log("[quiz error]", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchQuiz()
    }
  }, [open, topic])

  function submit() {
    const s = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
    setScore(s)
    setSubmitted(true)

    const pct = questions.length > 0 ? (s / questions.length) * 100 : 0
    if (pct >= 70) {
      fireMilestoneConfetti()
    } else {
      fireSuccessConfetti()
    }
  }

  if (!open) return null

  const answeredCount = answers.filter((a) => a !== -1).length
  const pct = questions.length > 0 && score !== null ? Math.round((score / questions.length) * 100) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel border border-white/20 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 3D Laser Beam */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="size-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Adaptive Technical Evaluation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  10 Questions
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-white">Quiz Arena: {topic}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchQuiz}
              disabled={loading}
              title="Generate 10 New Random Questions"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
              <span className="hidden sm:inline">Reroll Questions</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
              aria-label="Close quiz"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Question Progress Dots Navigation */}
        {!loading && questions.length > 0 && (
          <div className="px-6 py-2.5 border-b border-white/10 bg-neutral-950/30 flex items-center justify-between overflow-x-auto gap-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">
              Progress ({answeredCount}/10):
            </span>
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => {
                const isAnswered = answers[i] !== -1
                const isCorrect = submitted && answers[i] === questions[i].correctIndex
                const isWrong = submitted && isAnswered && !isCorrect

                return (
                  <div
                    key={i}
                    className={`size-6 rounded-lg text-[10px] font-extrabold flex items-center justify-center transition-all ${
                      submitted
                        ? isCorrect
                          ? "bg-emerald-500 text-white shadow-emerald-500/40 shadow-sm"
                          : isWrong
                          ? "bg-rose-500 text-white shadow-rose-500/40 shadow-sm"
                          : "bg-white/5 text-slate-500"
                        : isAnswered
                        ? "bg-indigo-600 text-white shadow-indigo-600/30 shadow-sm"
                        : "bg-white/5 text-slate-400 border border-white/10"
                    }`}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Score Triumph Banner */}
        {submitted && score !== null && (
          <div
            className={`px-6 py-4 flex items-center justify-between gap-4 border-b border-white/10 ${
              pct! >= 80
                ? "bg-gradient-to-r from-emerald-950/70 to-teal-950/70 text-emerald-200"
                : pct! >= 60
                ? "bg-gradient-to-r from-indigo-950/70 to-purple-950/70 text-indigo-200"
                : "bg-gradient-to-r from-amber-950/70 to-orange-950/70 text-amber-200"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`size-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${
                  pct! >= 80
                    ? "bg-emerald-500 text-white shadow-emerald-500/40"
                    : pct! >= 60
                    ? "bg-indigo-500 text-white shadow-indigo-500/40"
                    : "bg-amber-500 text-white shadow-amber-500/40"
                }`}
              >
                {pct! >= 80 ? <Trophy className="size-6 text-white animate-bounce" /> : <Award className="size-6" />}
              </div>
              <div>
                <p className="font-extrabold text-base text-white">
                  Score: {score}/{questions.length} ({pct}%) ·{" "}
                  {pct! >= 80 ? "Master Tier 🏆" : pct! >= 60 ? "Proficient Tier ⚡" : "Apprentice Tier 📚"}
                </p>
                <p className="text-xs text-slate-300">
                  {pct! >= 80
                    ? "Exceptional technical comprehension! You have mastered these architectural concepts."
                    : "Great practice! Review the explanations below or reroll a new 10-question set."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchQuiz}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Try 10 New Questions ↻
            </button>
          </div>
        )}

        {/* Questions Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 grid gap-6">
          {loading && (
            <div className="text-center py-20 space-y-4">
              <div className="size-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto animate-pulse-glow">
                <Loader2 className="size-7 text-indigo-400 animate-spin" />
              </div>
              <p className="text-base font-bold text-white">Synthesizing 10 Technical Scenarios…</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Randomly selecting fresh conceptual challenges and shuffling answers for {topic}.
              </p>
            </div>
          )}

          {!loading &&
            questions.map((q, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-neutral-950/50 p-5 grid gap-3.5 shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-extrabold border border-indigo-500/40 shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[idx] === i
                    const isCorrect = i === q.correctIndex
                    const showResult = submitted

                    let optStyle =
                      "flex items-start gap-3 text-xs font-medium rounded-xl border p-3.5 cursor-pointer transition-all duration-200 "

                    if (showResult) {
                      if (isCorrect) {
                        optStyle += "border-emerald-400 bg-emerald-950/50 text-emerald-200 shadow-md shadow-emerald-500/20"
                      } else if (isSelected && !isCorrect) {
                        optStyle += "border-rose-400 bg-rose-950/50 text-rose-200 shadow-md shadow-rose-500/20"
                      } else {
                        optStyle += "border-white/5 text-slate-500 opacity-50"
                      }
                    } else {
                      optStyle += isSelected
                        ? "border-indigo-400 bg-indigo-950/70 text-white shadow-lg shadow-indigo-500/30 scale-[1.01]"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400/50 hover:bg-white/10 hover:text-white"
                    }

                    return (
                      <label key={i} className={optStyle}>
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          className="sr-only"
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() => {
                            if (submitted) return
                            setAnswers((a) => {
                              const c = [...a]
                              c[idx] = i
                              return c
                            })
                          }}
                        />
                        <div
                          className={`size-4 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                            isSelected && !showResult
                              ? "border-indigo-400 bg-indigo-500"
                              : showResult && isCorrect
                              ? "border-emerald-400 bg-emerald-500"
                              : showResult && isSelected
                              ? "border-rose-400 bg-rose-500"
                              : "border-white/30"
                          }`}
                        >
                          {isSelected && !showResult && <div className="size-1.5 rounded-full bg-white" />}
                          {showResult && isCorrect && <CheckCircle2 className="size-3 text-white" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="size-3 text-white" />}
                        </div>
                        <span className="leading-relaxed flex-1">{opt}</span>
                      </label>
                    )
                  })}
                </div>

                {/* Explanation Reveal After Submit */}
                {submitted && q.explanation && (
                  <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-indigo-400 font-bold">💡 Technical Explanation:</strong>{" "}
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Footer Bar */}
        {!loading && questions.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-neutral-950/60 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400">
              {answeredCount}/{questions.length} Answered
            </span>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-slate-300 hover:text-white cursor-pointer">
                Close
              </Button>

              {!submitted && (
                <button
                  type="button"
                  onClick={submit}
                  disabled={answers.some((a) => a === -1)}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
                >
                  <Zap className="size-4 text-amber-300" />
                  Evaluate 10 Answers
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
