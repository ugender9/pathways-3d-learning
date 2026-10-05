# 🌌 Pathways 3D — Spatial AI YouTube Learning Academy

> **Transform any YouTube topic or playlist into an interactive, 3D-accelerated masterclass with AI executive takeaways, contextual smart notes, adaptive 10-question quizzes, spaced-repetition flashcards, and verified completion certificates.**

---

## 🚀 Overview

**Pathways 3D** is an independent, self-contained, enterprise-grade learning operating system built on Next.js 15 and Three.js. It solves the "curation chaos" of online video learning by organizing scattered YouTube tutorials into structured, 3-phase masterclass curriculums.

This project is **100% independent and open** — free of proprietary platform lock-in, vendor analytics, or third-party platform rights.

---

## ✨ Key Features

### 1. 🌌 Interactive 3D WebGL Universe
* **Three.js Particle Galaxy:** 350-particle constellation field that orbits dynamically in response to mouse velocity and cursor inertia.
* **Floating 3D Polyhedrons:** Wireframe iridescent Torus Knot, Icosahedrons, and glowing Cyber Halos floating in real-time space.
* **Physics-Based 3D Tilt Cards (`components/card-3d.tsx`):** Real-time perspective tilt with dynamic specular glare reflection and layered spatial depth (`translateZ`).

### 2. 🎬 Live YouTube Video Curation & Real Thumbnails
* **Direct High-Res Thumbnails:** Extracts authentic creator artwork directly from YouTube (`https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`).
* **Direct YouTube URL / Playlist Parser:** Paste any YouTube video (`https://youtube.com/watch?v=...`) or playlist link to automatically scaffold a curriculum around that topic.
* **Verified Creator Catalog:** Includes verified industry educators (*Programming with Mosh, freeCodeCamp, Corey Schafer, Traversy Media, Fireship, etc.*).

### 3. 💡 AI Executive Overviews & Lesson Intelligence
* **Technical Summaries:** In-depth architectural overviews and 5 actionable technical takeaways per lesson.
* **🔊 AI Voice Speech Synthesis:** Browser-native **Web Speech API** integration to read overviews and takeaways aloud for hands-free learning.
* **Integrated Theater Mode:** Watch the YouTube tutorial while referencing summaries and notes simultaneously without leaving the app.

### 4. 📝 Contextual Smart Notes & Personal Scratchpad
* **Cheat-Sheet Rules:** Numbered technical notes detailing key concepts, syntax rules, and performance considerations.
* **1-Click Copy:** Instant clipboard export with visual checkmark confirmation.
* **Persistent Browser Scratchpad:** Take custom notes and timestamps saved directly to browser `localStorage`.

### 5. 🧠 10-Question Adaptive Quiz Arena
* **Deep Conceptual Scenarios:** 10 rigorous multiple-choice questions per topic testing real-world engineering concepts (e.g., *Self-Attention, Embeddings & RAG, LoRA, Quantization, React Server Components, CAP Theorem, Shading*).
* **Randomized Question Pools:** Questions and option positions are shuffled on every attempt.
* **💡 Technical Explanations:** Reveals the underlying mechanics and reason for each correct answer after submission.
* **Mastery Tier Rankings:** 
  - 🥇 **Master Tier** (80–100%) with celebratory particle confetti
  - ⚡ **Proficient Tier** (60–79%)
  - 📚 **Apprentice Tier** (<60%)
* **"Reroll Questions ↻":** Re-generate 10 brand-new questions with 1 click.

### 6. 🎴 3D Active Recall & Spaced Repetition Flashcards
* **Interactive 3D Card Flips:** Test mental models and active recall before taking quizzes.
* **Session Mastery Tracking:** Mark cards as mastered with particle animations.

### 7. 📥 1-Click Markdown Study Pack Exporter
* **Notion & Obsidian Ready:** Export the entire course syllabus, video links, AI overviews, key takeaways, and personal notes into a single formatted `.md` file.

### 8. 🏆 Verified Certificate of Curriculum Mastery
* **Personalized Award:** Generates a verifiable completion certificate with custom recipient name, date, XP points, and a unique verification ID (`PW-XXXXXX`).
* **Print / PDF Download:** 1-click print dialog formatted for LinkedIn or portfolio sharing.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
* **3D Graphics:** [Three.js](https://threejs.org/) (WebGL Canvas, Procedural Geometry, Particle Physics)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Cyberpunk & Obsidian Glassmorphism Design System
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animations & Confetti:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI / local fallback engine
* **Telemetry & Tracking:** **Zero** (All external analytics removed)

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── curate/route.ts        # YouTube scraper & verified course curation API
│   │   ├── summarize/route.ts     # AI summary & technical takeaway generator
│   │   ├── lesson-notes/route.ts  # Topic-aware contextual notes API
│   │   └── quiz/route.ts          # 10-question randomized technical quiz API
│   ├── globals.css                # 3D perspective, laser beams, glassmorphism & keyframes
│   ├── layout.tsx                 # Root layout & independent metadata
│   └── page.tsx                   # 3D Hero, Course Generator Terminal & Starter Showcases
├── components/
│   ├── canvas-3d.tsx              # Three.js 3D background with particle galaxy
│   ├── card-3d.tsx                # Physics-driven 3D perspective tilt card
│   ├── channel-avatar.tsx         # Deterministic colored creator avatar
│   ├── course-outline.tsx         # 3D Course Matrix, HUD progress ring, module roadmap
│   ├── lesson-card.tsx            # Lesson card with YouTube cinema button & modal triggers
│   ├── lesson-detail-modal.tsx    # Lesson intelligence modal with AI Voice TTS & video player
│   ├── quiz-panel.tsx             # 10-question Quiz Arena with 1-10 dots & explanations
│   ├── executive-summary-modal.tsx# Curriculum Intelligence modal (Click-to-copy, check off)
│   ├── flashcards-modal.tsx       # 3D Spaced Repetition flip flashcards
│   └── certificate-modal.tsx      # Printable Certificate of Completion generator
├── lib/
│   ├── confetti.ts                # Multi-cannon milestone particle celebrations
│   ├── export-study-pack.ts       # Markdown (.md) course study guide generator
│   └── topic-thumbnails.ts        # Fallback topic thumbnail resolver
├── package.json
└── README.md
```

---

## 🚦 Getting Started

### 1. Prerequisites
* **Node.js:** v18.18.0 or higher (Node.js 20+ recommended)
* **Package Manager:** `npm` or `pnpm`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/pathways-3d.git
cd pathways-3d

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Variables (Optional)
The project includes a **smart fallback engine** that runs smoothly without any API keys. To enable live OpenAI generations and the official YouTube Data API:

Create a `.env.local` file in the root directory:
```env
# Optional: OpenAI API Key for live AI generation
OPENAI_API_KEY="sk-..."

# Optional: YouTube Data API v3 Key (Scraper works without this)
YOUTUBE_API_KEY="AIzaSy..."
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Independence & Privacy

* **Zero Vendor Tracking:** `@vercel/analytics` and proprietary generator tags have been completely removed.
* **Local Storage First:** All personal notes, progress checklists, and customized settings are stored client-side in browser `localStorage`.
* **Self-Hostable:** Deploy anywhere (Docker, AWS, Google Cloud, DigitalOcean, Linux VPS, Netlify, Cloudflare, etc.).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal and commercial educational use.
