import { NextResponse } from "next/server"

// Topic-aware note templates that feel hand-crafted per subject
const NOTE_BANKS: Record<string, string[][]> = {
  python: [
    ["Variables are dynamically typed — no declaration needed", "Use f-strings for clean string interpolation: `f\"Hello {name}\"`", "Lists are mutable; tuples are immutable — prefer tuples for constants", "The `enumerate()` and `zip()` builtins save you from manual indexing", "Always use `if __name__ == '__main__':` to guard entry points"],
    ["Comprehensions are faster than explicit loops in most cases", "`*args` collects positional extras; `**kwargs` collects keyword extras", "Use `with open(...)` — context managers auto-close file handles", "The GIL limits CPU-bound threading — use `multiprocessing` instead", "Type hints with `mypy` catch bugs before runtime"],
    ["Decorators are just functions returning functions — demystify them", "`dataclasses` replace boilerplate `__init__` and `__repr__`", "Generators (`yield`) are memory-efficient for large sequences", "Use `pathlib.Path` over `os.path` for cross-platform file handling", "`functools.lru_cache` makes recursion blazing fast"],
  ],
  javascript: [
    ["`const` for references, `let` for rebinding — avoid `var` entirely", "Arrow functions don't bind their own `this` — use for callbacks", "Destructuring reduces noise: `const { name, age } = user`", "Spread operator clones arrays/objects shallowly: `[...arr]`", "Optional chaining `?.` prevents null-reference explosions"],
    ["Promises chain with `.then()` / `.catch()`; `async/await` flattens them", "Event loop: microtasks (Promises) run before macrotasks (setTimeout)", "`Array.prototype.map/filter/reduce` — the functional triad", "Modules: `import`/`export` (ESM) vs `require`/`module.exports` (CJS)", "WeakMap/WeakSet hold references without preventing GC"],
    ["Prototypal inheritance: every object has a `[[Prototype]]` chain", "Closure = function + its lexical environment — powerful and leaky", "Web Workers move heavy computation off the main thread", "Intersection Observer replaces scroll-event-based lazy loading", "Bundle size matters: tree-shake with ESM, audit with `bundlephobia`"],
  ],
  react: [
    ["Components are pure functions of props — same props, same output", "`useState` triggers re-render; derived values need no state at all", "Keys in lists must be stable & unique — not array index", "Lifting state up is the core pattern for sibling communication", "`useEffect` runs after paint — not during render"],
    ["`useCallback` memoizes functions; `useMemo` memoizes values", "Context is for global stable data — not high-frequency updates", "Controlled inputs bind value to state; uncontrolled use refs", "Error boundaries catch render errors — wrap route-level components", "React.lazy + Suspense gives you code-splitting for free"],
    ["Reconciliation uses a virtual DOM diff — keys make it O(n)", "Custom hooks extract stateful logic — prefix with `use`", "Concurrent features (useTransition, useDeferredValue) keep UI responsive", "Server Components render on server, ship zero JS to client", "Strict Mode double-invokes effects to expose side-effect bugs"],
  ],
  database: [
    [
      "B-Tree indexes speed up equality and range lookups: O(log N)",
      "Always inspect EXPLAIN PLAN before creating speculative indexes",
      "Foreign keys enforce referential integrity across parent-child schemas",
      "Avoid `SELECT *` in production — project only required columns to reduce I/O",
      "Use prepared parameterized statements to permanently neutralize SQL Injection"
    ],
    [
      "ACID transactions: Atomicity, Consistency, Isolation, and Durability",
      "Read Committed is default isolation in Oracle; Serializable prevents phantom reads",
      "Use Common Table Expressions (`WITH cte AS (...)`) for clean, readable subqueries",
      "`GROUP BY` groups aggregated rows; `HAVING` filters results post-aggregation",
      "Row-level locking (`SELECT ... FOR UPDATE`) prevents concurrent write races"
    ],
    [
      "Partitioning large tables by Range or Hash improves query pruning performance",
      "PL/SQL packages bundle related procedures, functions, and state together",
      "Triggers automate audit logging but can introduce hidden side-effects if overused",
      "Database connection pooling eliminates expensive TCP connection handshake overhead",
      "Regularly gather table statistics to keep cost-based optimizer (CBO) accurate"
    ]
  ],
  default: [
    ["Watch at 1.25× speed — your brain adapts within minutes", "Pause and replicate every demo before continuing", "The first 20% of concepts explain 80% of real-world usage", "Write questions in the margin; answer them after the video", "Connect new ideas to something you already know well"],
    ["Build a tiny project using only what this video taught", "Explain the concept out loud — the Feynman technique reveals gaps", "Re-watch confusing sections at 0.75× with closed captions", "Cross-reference with official docs for edge cases", "A messy working solution beats a clean theoretical one"],
    ["Spaced repetition: revisit these notes in 1 day, 1 week, 1 month", "Share what you learned — teaching cements understanding", "The 'stuck' feeling means you're at the edge of growth", "Version-control your experiments — git is your undo history", "Ship something small; real usage teaches what videos can't"],
  ],
}

function getNotesForLesson(title: string, channel: string, index: number): string[] {
  const text = `${title} ${channel}`.toLowerCase()

  let bank = NOTE_BANKS.default
  if (/\b(oracle|sql|database|postgres|mysql|sqlite|plsql|dba)\b/i.test(text)) bank = NOTE_BANKS.database
  else if (/\bpython\b/i.test(text)) bank = NOTE_BANKS.python
  else if (/\b(javascript|vanilla js|es6)\b/i.test(text)) bank = NOTE_BANKS.javascript
  else if (/\b(react|react\.?js)\b/i.test(text)) bank = NOTE_BANKS.react

  // Deterministically pick a set based on lesson index so same lesson always shows same notes
  const set = bank[index % bank.length]
  return set
}

export async function POST(req: Request) {
  const body = await req.json()
  const title: string = body.title || "Lesson"
  const channel: string = body.channel || ""
  const lessonIndex: number = body.lessonIndex ?? 0

  const notes = getNotesForLesson(title, channel, lessonIndex)

  return Response.json({ notes })
}
