# Pathways — AI-Powered YouTube Course Builder
TAS2025 — Problem Statement 1 (Effective Learning with AI)

1) Summary
- Problem: Learners rely on YouTube but drown in unstructured content of varying quality, causing wasted time and shallow retention.
- Solution: Pathways organizes top YouTube videos into a structured, personalized, interactive course that feels guided — with AI summaries, interactive notes, and quick quizzes for active learning.
- Audience: Self-driven learners and upskillers (students, early-career professionals, career switchers) seeking fast, credible skill acquisition.

2) Goals & Non-Goals
- Goals:
  - Reduce time-to-learning by curating a clear path (intro → core → apply).
  - Improve comprehension with AI summaries and key takeaways.
  - Increase retention with active recall via quick quizzes.
  - Encourage habit-building with lightweight, interactive notes.
- Non-Goals:
  - Replace full MOOCs or formal accreditation.
  - Build social features (comments, cohorts) in initial release.
  - Support every platform beyond YouTube in initial release.

3) Users & JTBD
- Primary: Motivated learners (beginner to advanced) who want a credible, fast path without analysis paralysis.
- JTBD: “When I want to learn a topic, help me follow a proven path of top videos with concise guidance so I can progress confidently without wasting time.”

4) Key Pain Points
- Curation chaos: Too many videos, inconsistent quality.
- No progression: Playlists rarely scaffold from foundation to project.
- Passive consumption: Low retention without summaries, notes, and checks.
- Fragmentation: Notes, resources, and practice live in different tools.

5) Solution Overview (MVP)
- AI-assisted Curation: Search top YouTube videos, group into 3 modules (Foundations, Core, Apply).
- AI Summaries: 2–3 sentence overview + 3–5 takeaways per lesson.
- Interactive Notes: Local, quick-capture with “AI Clean Up” to structure notes.
- Quick Quizzes: 3 MCQs to reinforce key ideas and diagnose gaps.
- Course-Like Flow: Single path with progress, not a chaotic playlist.

6) Core Workflows
- Onboarding:
  - Input topic + level → generate course outline (3 modules, 9 lessons).
- Learning:
  - Open a lesson → watch video → click “AI Summary” → capture notes → mark done.
- Assessment:
  - Launch Quick Quiz → answer 3 MCQs → score → suggested focus areas (next).
- Personalization:
  - Level selector (beginner/intermediate/advanced) adjusts module framing.
  - Future: preferred session length, time/day, pace.

7) AI Leverage
- Summarization: generateText (AI SDK) using OpenAI “gpt-4o-mini” to create concise overviews and takeaways (graceful fallback if no key).
- Quiz Generation: AI-based MCQs from context (fallback included).
- Notes Cleanup: Rewrite freeform notes into clean bullets.

8) Data Sources
- YouTube Data API (search). If no key: deterministic mock results to keep demo functional.
- Transcripts (future): Pull transcripts when available to improve summaries.

9) Success Metrics
- Time-to-First-Lesson: < 60 seconds from topic input to first play.
- Completion Rate: % users finishing Module 1.
- Active Learning Rate: % lessons with either AI Summary, Notes saved, or Quiz taken.
- Retention Proxy: Quiz score improvement between attempts.

10) Risks & Mitigations
- API limits/keys → Provide mock fallback; progressive enhancement.
- Summary quality variance → Prompt design; add transcript use later.
- Cold start curation quality → Seed topic heuristics; allow quick edit in v1.

11) Release Plan
- Initial Release (MVP):
  - Topic + level input, curated outline (3 modules/9 lessons).
  - AI summaries, interactive notes, quick quiz.
  - Progress tracking (client-side).
- v1:
  - Transcript-based summaries, timeboxing/focus mode, spaced review.
  - Save progress/accounts, richer personalization, export to Notion.

12) Design System (per TAS2025 constraints)
- Colors (4 total): Primary Blue #2563eb; Neutrals White #ffffff & Slate #0f172a; Accent Emerald #059669.
- Typography: Geist (sans) for headings/body; Geist Mono for code only (kept minimal).
- Mobile-first layout, generous spacing, semantic HTML, WCAG AA contrast.

13) Acceptance Criteria
- Users can enter a topic and level and receive a structured course outline.
- Each lesson supports AI Summary (or fallback), notes with persistence, and a link to watch.
- A quiz can be generated and scored.
- Works without API keys; improves automatically when keys are added.
