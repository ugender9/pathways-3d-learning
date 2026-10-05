"use client"

import { useState } from "react"
import { X, Sparkles, BookOpen, Layers, Check, Copy, ExternalLink, Plus, CheckCircle2, Youtube, Flame } from "lucide-react"
import { fireSuccessConfetti } from "@/lib/confetti"

interface ExecutiveSummaryModalProps {
  open: boolean
  onClose: () => void
  topic: string
  mode: "takeaways" | "notes" | "masters"
}

const DOMAIN_INTELLIGENCE: Record<string, { takeaways: string[]; notes: string[]; masters: Array<{ name: string; channel: string; role: string }> }> = {
  python: {
    masters: [
      { name: "Programming with Mosh", channel: "ProgrammingWithMosh", role: "Complete Beginner to Pro Bootcamp" },
      { name: "Corey Schafer", channel: "CoreyMSchafer", role: "OOP, Decorators & Python Deep Dives" },
      { name: "freeCodeCamp.org", channel: "freecodecamp", role: "10+ Hour Comprehensive Tutorials" },
      { name: "Tech With Tim", channel: "TechWithTim", role: "Automation, AsyncIO & Python Projects" },
      { name: "ArjanCodes", channel: "ArjanCodes", role: "Software Architecture & Clean Code in Python" },
    ],
    takeaways: [
      "Master the LEGB scoping rule (Local, Enclosing, Global, Builtin) and dynamic memory allocation",
      "Leverage list & dictionary comprehensions to write concise, vectorized transformations",
      "Utilize context managers (`with` statements) to prevent file descriptor and socket leaks",
      "Structure object-oriented code with `@dataclass`, inheritance, and special dunder methods",
      "Employ modern type hinting with `mypy` and defensive exception handling"
    ],
    notes: [
      "Variables are dynamically typed — no declaration needed",
      "Use f-strings for clean string interpolation: `f\"Hello {name}\"`",
      "Lists are mutable; tuples are immutable — prefer tuples for constants",
      "The `enumerate()` and `zip()` builtins save you from manual indexing",
      "Always use `if __name__ == '__main__':` to guard entry points",
      "`*args` collects positional extras; `**kwargs` collects keyword extras",
      "Use `with open(...)` — context managers auto-close file handles",
      "The GIL limits CPU-bound threading — use `multiprocessing` instead"
    ]
  },
  javascript: {
    masters: [
      { name: "Programming with Mosh", channel: "ProgrammingWithMosh", role: "Modern JavaScript Fundamentals" },
      { name: "Traversy Media", channel: "TraversyMedia", role: "Crash Courses & Full-Stack Projects" },
      { name: "Web Dev Simplified", channel: "WebDevSimplified", role: "Closures, Event Loop & Async JavaScript" },
      { name: "Fireship", channel: "Fireship", role: "100+ Concepts in 100 Seconds" },
      { name: "Dev Ed", channel: "developedbyed", role: "Promises, Fetch API & DOM Manipulation" },
    ],
    takeaways: [
      "Understand the V8 Event Loop, Microtask Queue vs Macrotask Queue, and call stack execution",
      "Master closures, lexical scoping, and functional array paradigms (`map`, `filter`, `reduce`)",
      "Write clean asynchronous code with Promises, `async/await`, and comprehensive error boundaries",
      "Utilize modern ESNext features: optional chaining `?.`, nullish coalescing `??`, and destructuring",
      "Prevent memory leaks by managing event listeners and avoiding circular references"
    ],
    notes: [
      "`const` for references, `let` for rebinding — avoid `var` entirely",
      "Arrow functions don't bind their own `this` — use for callbacks",
      "Destructuring reduces noise: `const { name, age } = user`",
      "Spread operator clones arrays/objects shallowly: `[...arr]`",
      "Optional chaining `?.` prevents null-reference explosions",
      "Promises chain with `.then()` / `.catch()`; `async/await` flattens them",
      "Event loop: microtasks (Promises) run before macrotasks (setTimeout)",
      "Prototypal inheritance: every object has a `[[Prototype]]` chain"
    ]
  },
  react: {
    masters: [
      { name: "Programming with Mosh", channel: "ProgrammingWithMosh", role: "React 19 & Next.js Masterclass" },
      { name: "JavaScript Mastery", channel: "javascriptmastery", role: "Full-Stack Production Applications" },
      { name: "Jack Herrington", channel: "jherr", role: "Advanced State, RSC & React Architecture" },
      { name: "Web Dev Simplified", channel: "WebDevSimplified", role: "React Hooks, Custom Hooks & Optimization" },
      { name: "freeCodeCamp.org", channel: "freecodecamp", role: "12-Hour Complete React Bootcamp" },
    ],
    takeaways: [
      "Model unidirectional data flow and isolate component state with `useState` and `useReducer`",
      "Master effect synchronization and cleanup logic in `useEffect` without stale closure bugs",
      "Optimize rendering pipelines using `useMemo`, `useCallback`, and React Compiler primitives",
      "Architect scalable global state using modern lightweight stores (Zustand) and Context",
      "Embrace Server Components (RSC) to minimize client bundle overhead and stream dynamic data"
    ],
    notes: [
      "Components are pure functions of props — same props, same output",
      "`useState` triggers re-render; derived values need no state at all",
      "Keys in lists must be stable & unique — never use array indices",
      "Lifting state up is the core pattern for sibling component communication",
      "`useEffect` runs after paint — never during the render phase",
      "`useCallback` memoizes functions; `useMemo` memoizes expensive computations",
      "Custom hooks encapsulate reusable stateful logic — always prefix with `use`"
    ]
  },
  nextjs: {
    masters: [
      { name: "JavaScript Mastery", channel: "javascriptmastery", role: "Next.js 15 Full-Stack SaaS Builds" },
      { name: "Lee Robinson", channel: "leerob", role: "App Router, Caching & Performance" },
      { name: "Traversy Media", channel: "TraversyMedia", role: "Next.js Crash Course & Server Actions" },
      { name: "ByteGrad", channel: "ByteGrad", role: "Auth.js, Prisma & Production Next.js" },
      { name: "Jack Herrington", channel: "jherr", role: "Server Actions Deep Dive & Micro-Frontends" },
    ],
    takeaways: [
      "Leverage the App Router hierarchy: layouts, templates, error boundaries, and loading skeletons",
      "Implement zero-API data mutations with Server Actions and optimistic UI updates",
      "Configure granular caching: dynamic rendering, ISR (Incremental Static Regeneration), and tags",
      "Integrate secure authentication pipelines and middleware route protection",
      "Maximize Core Web Vitals with automatic image optimization, font preloading, and script management"
    ],
    notes: [
      "Server Components (default) render on server and ship zero JS bundle to the browser",
      "Add `'use client'` only when utilizing state, effects, or browser event listeners",
      "Server Actions execute directly on the server without writing manual REST boilerplate",
      "Use `revalidatePath` and `revalidateTag` to purge cached data on demand",
      "`next/image` prevents layout shift and automatically serves WebP/AVIF formats"
    ]
  },
  database: {
    masters: [
      { name: "NIC IT ACADEMY", channel: "NICITACADEMY", role: "Complete Oracle SQL & PL/SQL Masterclasses" },
      { name: "Manish Sharma", channel: "RebellionRider", role: "In-Depth Oracle DBA & PL/SQL Guides" },
      { name: "Great Learning", channel: "GreatLearningOfficial", role: "Enterprise Database Administration & SQL" },
      { name: "edureka!", channel: "edurekaIN", role: "SQL & Data Warehousing Masterclasses" },
      { name: "Hussein Nasser", channel: "hnasr", role: "Database Engineering & Database Internals" },
    ],
    takeaways: [
      "Master relational data modeling, entity-relationship schemas, and 3NF normalization",
      "Write high-performance SQL queries using window functions, CTEs, and index-optimized joins",
      "Understand ACID transaction boundaries, lock contention, and concurrency isolation levels",
      "Optimize query performance by interpreting EXPLAIN PLAN and table statistics",
      "Implement stored procedures, triggers, and secure database access controls"
    ],
    notes: [
      "B-Tree indexes speed up equality and range filters from O(N) full table scans to O(log N)",
      "Always inspect EXPLAIN PLAN before creating speculative secondary indexes",
      "Foreign keys enforce referential integrity across related parent-child tables",
      "Avoid `SELECT *` in production — project only required columns to reduce disk I/O and network transfer",
      "Use prepared parameterized queries to permanently neutralize SQL Injection risks",
      "Read Committed is default isolation in Oracle; Serializable prevents phantom reads",
      "Row-level locking (`SELECT ... FOR UPDATE`) prevents concurrent write race conditions"
    ]
  }
}

function getInsights(topic: string) {
  const key = topic.toLowerCase()
  if (/\b(oracle|sql|database|postgres|mysql|sqlite|plsql|dba)\b/i.test(key)) return DOMAIN_INTELLIGENCE.database
  if (/\bpython\b/i.test(key)) return DOMAIN_INTELLIGENCE.python
  if (/\bjavascript\b/i.test(key) && !/\bjava\b/i.test(key)) return DOMAIN_INTELLIGENCE.javascript
  if (/\breact\b/i.test(key) && !/\breact native\b/i.test(key)) return DOMAIN_INTELLIGENCE.react
  if (/\bnext\.?js\b/i.test(key)) return DOMAIN_INTELLIGENCE.nextjs

  return {
    masters: [
      { name: "freeCodeCamp.org", channel: "freecodecamp", role: "World-Class Open Source Bootcamp" },
      { name: "Programming with Mosh", channel: "ProgrammingWithMosh", role: "Clear, High-Signal Professional Tutorials" },
      { name: "Traversy Media", channel: "TraversyMedia", role: "Modern Web & Software Engineering" },
      { name: "Fireship", channel: "Fireship", role: "Rapid High-Density Technical Explanations" },
      { name: "NetworkChuck", channel: "NetworkChuck", role: "Networking, Cloud & DevOps Essentials" },
    ],
    takeaways: [
      `Deconstruct the core architecture and fundamental principles of ${topic || "this course"}`,
      "Master step-by-step implementation through hands-on code examples and practical demonstrations",
      "Avoid common developer pitfalls, anti-patterns, and suboptimal performance bottlenecks",
      "Apply production-grade security, code maintainability, and clean architecture guidelines",
      "Synthesize takeaways into standalone real-world applications and deployment workflows"
    ],
    notes: [
      "Active synthesis beats passive video consumption — code every example by hand",
      "Watch at 1.25× speed to maintain hyper-focus and accelerate comprehension",
      "The first 20% of core concepts drive 80% of real-world production usage",
      "Write edge-case questions in the margin; resolve them before moving to the next phase",
      "Break complex architectures down into atomic, testable functions",
      "Version control your experimental branches with clean git commits"
    ]
  }
}

export function ExecutiveSummaryModal({ open, onClose, topic, mode: initialMode }: ExecutiveSummaryModalProps) {
  const [currentTab, setCurrentTab] = useState<"takeaways" | "notes" | "masters">(initialMode || "takeaways")
  const [copiedItemIndex, setCopiedItemIndex] = useState<number | null>(null)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [copiedAll, setCopiedAll] = useState(false)
  const [customNote, setCustomNote] = useState("")
  const [extraNotes, setExtraNotes] = useState<string[]>([])

  if (!open) return null

  const data = getInsights(topic)
  const allNotes = [...data.notes, ...extraNotes]

  const handleCopySingle = (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItemIndex(index)
      fireSuccessConfetti()
      setTimeout(() => setCopiedItemIndex(null), 1800)
    })
  }

  const handleToggleCheck = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleCopyAll = () => {
    const list =
      currentTab === "takeaways"
        ? data.takeaways
        : currentTab === "notes"
        ? allNotes
        : data.masters.map((m) => `${m.name} (${m.role}) - https://youtube.com/@${m.channel}`)

    navigator.clipboard.writeText(list.join("\n\n")).then(() => {
      setCopiedAll(true)
      fireSuccessConfetti()
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customNote.trim()) return
    setExtraNotes((prev) => [...prev, customNote.trim()])
    setCustomNote("")
    fireSuccessConfetti()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel border border-white/20 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 3D Laser Beam */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                Curriculum Intelligence Engine
              </span>
              <h3 className="font-extrabold text-lg text-white">
                {topic || "Full-Stack Development"} Masterclass Insights
              </h3>
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

        {/* Interactive Tab Header */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-neutral-950/40 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentTab("takeaways")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 ${
              currentTab === "takeaways"
                ? "border-purple-400 text-white bg-purple-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="size-3.5 text-purple-400" />
            <span>AI Executive Takeaways ({data.takeaways.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab("notes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 ${
              currentTab === "notes"
                ? "border-indigo-400 text-white bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="size-3.5 text-indigo-400" />
            <span>Smart Study Notes ({allNotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab("masters")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0 ${
              currentTab === "masters"
                ? "border-red-400 text-white bg-red-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Youtube className="size-3.5 text-red-400" />
            <span>YouTube Masters ({data.masters.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              💡 <em>Click any card to copy or mark as learned:</em>
            </span>
            <span className="text-[11px] text-indigo-400 font-semibold">
              {Object.values(checkedItems).filter(Boolean).length} items checked
            </span>
          </div>

          {/* TAB 1: AI TAKEAWAYS */}
          {currentTab === "takeaways" && (
            <div className="grid gap-3 animate-fade-in">
              {data.takeaways.map((item, idx) => {
                const key = `takeaway-${idx}`
                const isChecked = !!checkedItems[key]
                const isCopied = copiedItemIndex === idx

                return (
                  <div
                    key={idx}
                    onClick={(e) => handleCopySingle(item, idx, e)}
                    className={`group relative flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isChecked
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                        : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-500/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="size-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-black flex items-center justify-center shrink-0 border border-purple-500/40 mt-0.5">
                        0{idx + 1}
                      </span>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed font-medium ${
                          isChecked ? "line-through opacity-70" : "text-slate-200"
                        }`}
                      >
                        {item}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Copy Indicator */}
                      <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isCopied ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="size-3" /> Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="size-3" /> Copy
                          </span>
                        )}
                      </span>

                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleCheck(key, e)}
                        className={`size-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/40"
                            : "border-white/20 hover:border-emerald-400 bg-white/5"
                        }`}
                        title="Mark as learned"
                      >
                        {isChecked && <Check className="size-3.5 text-white" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 2: SMART STUDY NOTES */}
          {currentTab === "notes" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid gap-3">
                {allNotes.map((item, idx) => {
                  const key = `note-${idx}`
                  const isChecked = !!checkedItems[key]
                  const isCopied = copiedItemIndex === idx

                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleCopySingle(item, idx, e)}
                      className={`group relative flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                          : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-indigo-500/40 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="size-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 border border-indigo-500/40 mt-0.5">
                          {idx + 1}
                        </span>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed font-medium ${
                            isChecked ? "line-through opacity-70" : "text-slate-200"
                          }`}
                        >
                          {item}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Copy Indicator */}
                        <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isCopied ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="size-3" /> Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="size-3" /> Copy
                            </span>
                          )}
                        </span>

                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleCheck(key, e)}
                          className={`size-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/40"
                              : "border-white/20 hover:border-emerald-400 bg-white/5"
                          }`}
                          title="Mark as reviewed"
                        >
                          {isChecked && <Check className="size-3.5 text-white" />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add Custom Note Bar */}
              <form onSubmit={handleAddCustomNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add your own custom rule or study tip..."
                  className="flex-1 text-xs rounded-xl border border-white/15 bg-neutral-900/90 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-all"
                >
                  <Plus className="size-3.5" />
                  Add Note
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: YOUTUBE MASTERS */}
          {currentTab === "masters" && (
            <div className="grid gap-3 animate-fade-in">
              {data.masters.map((creator, idx) => {
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${creator.name} ${topic} tutorial`
                )}`

                return (
                  <a
                    key={idx}
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-10 rounded-2xl bg-red-600/20 text-red-400 font-black text-xs flex items-center justify-center border border-red-500/40 shrink-0 group-hover:scale-110 transition-transform">
                        <Youtube className="size-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {creator.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{creator.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verified Master
                      </span>
                      <ExternalLink className="size-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-neutral-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 cursor-pointer transition-all hover:-translate-y-0.5"
          >
            {copiedAll ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4 text-indigo-400" />}
            {copiedAll ? "Copied Everything to Clipboard!" : "Copy Entire Section"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer transition-all shadow-md shadow-indigo-500/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
