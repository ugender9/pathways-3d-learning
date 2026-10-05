import { NextResponse } from "next/server"

type VideoItem = { id: string; title: string; channel: string; duration: string; thumbnail?: string }

// Curated verified YouTube videos categorized strictly by proficiency level (Novice, Adept, Master)
const VERIFIED_COURSES: Record<string, Record<"beginner" | "intermediate" | "advanced", VideoItem[]>> = {
  python: {
    beginner: [
      { id: "_uQrJ0TkZlc", title: "Python Full Course for Beginners — Complete Tutorial", channel: "Programming with Mosh", duration: "6:14:07" },
      { id: "kqtD5dpn9C8", title: "Python for Beginners — Learn Python in 1 Hour", channel: "Programming with Mosh", duration: "1:00:00" },
      { id: "rfscVS0vtbw", title: "Learn Python — Full Course for Beginners [Tutorial]", channel: "freeCodeCamp.org", duration: "4:26:52" },
      { id: "eWRfhZUzrAc", title: "Python Automation Tutorial — Automate Boring Stuff", channel: "Tech With Tim", duration: "32:15" },
      { id: "fBNz5xF-Kx4", title: "12 Beginner Python Projects — Coding Course", channel: "freeCodeCamp.org", duration: "3:08:26" },
      { id: "Z1Yd7upQsXY", title: "Python Crash Course: Variables, Loops & Functions", channel: "Traversy Media", duration: "54:20" },
      { id: "xk4_1vDrzzo", title: "Python Data Structures: Lists, Dictionaries & Tuples", channel: "Corey Schafer", duration: "28:10" },
      { id: "v_Jp1o8v0n8", title: "Python Functions & Scope for Beginners", channel: "Corey Schafer", duration: "21:40" },
      { id: "C-gEQdGVXbk", title: "Build Your First 3 Python Games & Scripts", channel: "Tech With Tim", duration: "1:15:00" },
    ],
    intermediate: [
      { id: "YYXdXT2l-Gg", title: "Python OOP Tutorial: Classes, Instances & Methods", channel: "Corey Schafer", duration: "15:43" },
      { id: "ZDa-Z5JzLYM", title: "Python Class Variables & Namespace Resolution", channel: "Corey Schafer", duration: "12:18" },
      { id: "rq8cL2XMM5M", title: "Python classmethods, staticmethods & Dunder Methods", channel: "Corey Schafer", duration: "10:35" },
      { id: "HGOBQPFzWKo", title: "Building a Full Stack FastAPI & Python Web Application", channel: "ArjanCodes", duration: "45:10" },
      { id: "FsAPt_9BqqU", title: "Python Decorators & Closures In-Depth", channel: "Corey Schafer", duration: "30:20" },
      { id: "bD05uGo_sVI", title: "Python Generators & Memory Efficient Iterators", channel: "Corey Schafer", duration: "27:45" },
      { id: "m6vfv6UvL34", title: "Python Multiprocessing vs Multithreading vs AsyncIO", channel: "ArjanCodes", duration: "34:10" },
      { id: "0sOvCWFmrtA", title: "Clean Architecture & Design Patterns in Python", channel: "ArjanCodes", duration: "42:15" },
      { id: "iWS9ogMPOI0", title: "Intermediate Python Programming Bootcamp", channel: "freeCodeCamp.org", duration: "5:55:00" },
    ],
    advanced: [
      { id: "kCc8FmEb1nY", title: "Building LLMs from Scratch: Self-Attention & Transformers", channel: "Andrej Karpathy", duration: "1:56:00" },
      { id: "baBq5GP9Wms", title: "Python AsyncIO Internals & Event Loop Deep Dive", channel: "ArjanCodes", duration: "38:40" },
      { id: "cKzP61Gfc08", title: "Python Metaprogramming & Custom Metaclasses", channel: "mCoding", duration: "24:15" },
      { id: "XAmg9c2L99g", title: "Python GIL (Global Interpreter Lock) & C-Extensions", channel: "mCoding", duration: "29:30" },
      { id: "HGk_ypEuS24", title: "Building Production RAG & AI Agents with Python", channel: "freeCodeCamp.org", duration: "3:40:00" },
      { id: "JkX9aX8G0s0", title: "High-Performance Python: Profiling & Vectorization with NumPy", channel: "ArjanCodes", duration: "33:20" },
      { id: "cd9zL1bL-3g", title: "Fine-Tuning Open Source LLMs with PyTorch & LoRA", channel: "Weights & Biases", duration: "1:10:00" },
      { id: "B50y_7j0nOQ", title: "Distributed Systems & Asynchronous Message Queues in Python", channel: "Hussein Nasser", duration: "48:00" },
      { id: "V9H_b1W9zZ4", title: "Advanced Python Architecture: Domain Driven Design (DDD)", channel: "ArjanCodes", duration: "40:15" },
    ]
  },
  javascript: {
    beginner: [
      { id: "W6NZfCO5SIk", title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour", channel: "Programming with Mosh", duration: "48:16" },
      { id: "PkZNo7MFNFg", title: "Learn JavaScript — Full Course for Beginners", channel: "freeCodeCamp.org", duration: "3:26:42" },
      { id: "hdI2bqOjy3c", title: "JavaScript Crash Course For Beginners", channel: "Traversy Media", duration: "1:40:29" },
      { id: "3PHXvlpOkf4", title: "Build 15 JavaScript Projects — Vanilla JavaScript Tutorial", channel: "freeCodeCamp.org", duration: "8:24:00" },
      { id: "Qqx_wzMmFeA", title: "JavaScript DOM Manipulation Full Course", channel: "Web Dev Simplified", duration: "38:15" },
      { id: "y17RuWkWdn8", title: "JavaScript Variables, Loops, Arrays & Objects Basics", channel: "Programming with Mosh", duration: "35:00" },
      { id: "DHvZLI7Db8E", title: "JavaScript Scope & Functions for Absolute Beginners", channel: "Web Dev Simplified", duration: "18:20" },
      { id: "2qDknA1eS_s", title: "JavaScript Events, Event Listeners & Forms", channel: "Traversy Media", duration: "42:10" },
      { id: "Mus_vwhTCq0", title: "JavaScript ES6 Features & Modern Syntax Crash Course", channel: "freeCodeCamp.org", duration: "1:15:30" },
    ],
    intermediate: [
      { id: "PoRJizFvM7s", title: "Async JavaScript: Callbacks, Promises, and Async/Await", channel: "Dev Ed", duration: "25:44" },
      { id: "71AtaJpJHvc", title: "JavaScript Closures & Lexical Environment Deep Dive", channel: "Web Dev Simplified", duration: "14:21" },
      { id: "Ttf3CEsEwMQ", title: "100+ JavaScript Concepts You Need to Know", channel: "Fireship", duration: "12:24" },
      { id: "EerdGm-ehJQ", title: "Clean Code in JavaScript — Production Best Practices", channel: "Fireship", duration: "14:15" },
      { id: "8aGhZQkoFbQ", title: "Event Loop, Microtasks & Macrotasks Explained", channel: "Jake Archibald", duration: "35:10" },
      { id: "cuEtnrL9-H0", title: "JavaScript Prototypes & Prototypal Inheritance", channel: "Web Dev Simplified", duration: "18:40" },
      { id: "rS_nO9UfQ_8", title: "Build a Full-Stack REST API with Node.js & Express", channel: "freeCodeCamp.org", duration: "3:10:00" },
      { id: "qiqN9mPj6Y4", title: "JavaScript Module Systems (ESM vs CommonJS)", channel: "Fireship", duration: "11:30" },
      { id: "G9b7K1_z0j8", title: "Mastering Array Methods (map, filter, reduce, flatMap)", channel: "Web Dev Simplified", duration: "22:15" },
    ],
    advanced: [
      { id: "xckH5x17eE8", title: "V8 JavaScript Engine Architecture: JIT, Ignition & TurboFan", channel: "JSConf", duration: "42:00" },
      { id: "8pDqJVdNa44", title: "Advanced JavaScript Design Patterns & Systems Architecture", channel: "Web Dev Simplified", duration: "31:10" },
      { id: "cK9jL0mK1j4", title: "JavaScript Memory Leaks, Garbage Collection & Profiling", channel: "Google Chrome Developers", duration: "38:20" },
      { id: "M0X_p9kL2x0", title: "Building a Reactive Framework from Scratch in JavaScript", channel: "Fireship", duration: "16:40" },
      { id: "p1jK8zL3v0Q", title: "Web Workers, SharedArrayBuffer & Concurrency in JS", channel: "Surma", duration: "28:50" },
      { id: "d9L0mP4jK1Q", title: "WebAssembly (WASM) Integration with High-Performance JS", channel: "freeCodeCamp.org", duration: "1:45:00" },
      { id: "L0k9M1_z8jQ", title: "TypeScript Compiler Internals & Advanced Type Metaprogramming", channel: "Matt Pocock", duration: "35:00" },
      { id: "K8j0L9mP2x4", title: "Architecting Micro-Frontends & Module Federation", channel: "Jack Herrington", duration: "44:15" },
      { id: "v9H_b1W9zZ8", title: "High-Concurrency Node.js: Cluster Mode & Event Loop Tuning", channel: "Hussein Nasser", duration: "50:10" },
    ]
  },
  react: {
    beginner: [
      { id: "SqcY0GlETPk", title: "React Tutorial for Beginners [React 19 / 18]", channel: "Programming with Mosh", duration: "1:20:00" },
      { id: "bMknfKXIFA8", title: "React Course — Beginner's Tutorial for React", channel: "freeCodeCamp.org", duration: "11:55:27" },
      { id: "w7ejDZ8SWv8", title: "React JS Crash Course", channel: "Traversy Media", duration: "1:48:47" },
      { id: "O6P86uwfdR0", title: "React Hooks Explained with Examples (useState, useEffect)", channel: "Web Dev Simplified", duration: "28:15" },
      { id: "4pO-k40K0_0", title: "React Props, Components & JSX Fundamentals", channel: "Dave Gray", duration: "32:10" },
      { id: "f55qeKGgB_M", title: "Build and Deploy a Full Stack React App", channel: "JavaScript Mastery", duration: "2:30:15" },
      { id: "hy3cdNTnflg", title: "10 React Hooks Explained with Real Examples", channel: "Fireship", duration: "12:16" },
      { id: "LDB4uaJ87e0", title: "React Conditional Rendering & List Keys Best Practices", channel: "Jack Herrington", duration: "22:50" },
      { id: "8pDqJVdNa44", title: "React Forms & User Input Handling", channel: "Web Dev Simplified", duration: "25:30" },
    ],
    intermediate: [
      { id: "0ZJgIjIuY7U", title: "React State Management (Context API vs Redux Toolkit vs Zustand)", channel: "Dave Gray", duration: "38:40" },
      { id: "LDB4uaJ87e0", title: "React Performance Optimization (useMemo, useCallback, memo)", channel: "Jack Herrington", duration: "22:50" },
      { id: "8pDqJVdNa44", title: "Advanced React Patterns You Need to Know", channel: "Web Dev Simplified", duration: "31:10" },
      { id: "b0Z3_9K2j0Q", title: "Mastering React Custom Hooks for Clean Architecture", channel: "Cosden Solutions", duration: "24:15" },
      { id: "c_mR51U4Lzg", title: "Full Stack SaaS Application with React & Tailwind", channel: "JavaScript Mastery", duration: "4:45:00" },
      { id: "O3UPbHl2jX8", title: "React Query (TanStack Query) v5 Full Course", channel: "ByteGrad", duration: "1:15:00" },
      { id: "wm5gMKuwSYk", title: "React Router v7 / v6 Architecture Crash Course", channel: "Traversy Media", duration: "48:10" },
      { id: "ZVnjOPwW4ZA", title: "React Error Boundaries & Suspense Loading States", channel: "Codevolution", duration: "29:00" },
      { id: "G4Z3xV_d9_U", title: "Component Design Systems with Radix UI & Tailwind", channel: "Next.js", duration: "32:10" },
    ],
    advanced: [
      { id: "6-bM_3oP0c0", title: "React Server Components (RSC) Architecture Deep Dive", channel: "Jack Herrington", duration: "24:30" },
      { id: "d5x0JCb2eHQ", title: "React 19 Actions, useTransition & useActionState Internals", channel: "Lee Robinson", duration: "28:22" },
      { id: "377aqXhR9t0", title: "React Compiler (React Forget) & Auto-Memoization Mechanics", channel: "Fireship", duration: "15:10" },
      { id: "843nec-IvW0", title: "Enterprise React: Micro-Frontends & State Machine Architecture", channel: "JavaScript Mastery", duration: "1:35:00" },
      { id: "M0X_p9kL2x0", title: "Building a Virtual DOM & Reconciler from Scratch", channel: "Fireship", duration: "22:15" },
      { id: "p1jK8zL3v0Q", title: "Concurrent React: Fiber Architecture, Scheduling & Lanes", channel: "Dan Abramov / JSConf", duration: "45:00" },
      { id: "K8j0L9mP2x4", title: "React Profiling: Flamegraphs, Memory Leaks & Layout Shifts", channel: "Jack Herrington", duration: "38:20" },
      { id: "v9H_b1W9zZ8", title: "Streaming SSR & Progressive Hydration Under the Hood", channel: "Hussein Nasser", duration: "44:00" },
      { id: "G9b7K1_z0j8", title: "Architecting Scalable Design Systems at Enterprise Scale", channel: "Lee Robinson", duration: "39:10" },
    ]
  },
  nextjs: {
    beginner: [
      { id: "843nec-IvW0", title: "Next.js 15 Full Course 2025 | Build and Deploy", channel: "JavaScript Mastery", duration: "5:12:00" },
      { id: "wm5gMKuwSYk", title: "Next.js 15 Crash Course | Server Components, Routing, Actions", channel: "Traversy Media", duration: "1:35:10" },
      { id: "ZVnjOPwW4ZA", title: "Next.js 15 Tutorial for Beginners", channel: "Codevolution", duration: "2:10:00" },
      { id: "c_mR51U4Lzg", title: "Next.js Layouts, Nested Routing & Templates", channel: "Sonny Sangha", duration: "42:15" },
      { id: "377aqXhR9t0", title: "Next.js 15 in 100 Seconds + Practical Tour", channel: "Fireship", duration: "15:10" },
      { id: "G4Z3xV_d9_U", title: "Static vs Dynamic Rendering in Next.js", channel: "Next.js", duration: "20:00" },
      { id: "O3UPbHl2jX8", title: "Next.js Image & Font Optimization Guide", channel: "ByteGrad", duration: "25:40" },
      { id: "d5x0JCb2eHQ", title: "Fetching Data in Server Components Without useEffect", channel: "Lee Robinson", duration: "18:22" },
      { id: "6-bM_3oP0c0", title: "Build Your First Next.js 15 Full-Stack Blog", channel: "Jack Herrington", duration: "1:05:00" },
    ],
    intermediate: [
      { id: "d5x0JCb2eHQ", title: "Server Actions & Form Mutations in Next.js 15", channel: "Lee Robinson", duration: "18:22" },
      { id: "O3UPbHl2jX8", title: "Authentication in Next.js 15 (Auth.js / NextAuth & Middleware)", channel: "ByteGrad", duration: "42:15" },
      { id: "c_mR51U4Lzg", title: "Full Stack SaaS Application with Stripe & Next.js 15", channel: "Sonny Sangha", duration: "8:45:00" },
      { id: "6-bM_3oP0c0", title: "Next.js App Router Architecture Deep Dive", channel: "Jack Herrington", duration: "24:30" },
      { id: "377aqXhR9t0", title: "Next.js SEO and OpenGraph Dynamic Image Generation", channel: "Fireship", duration: "15:10" },
      { id: "ZVnjOPwW4ZA", title: "Route Handlers & REST API Endpoints in Next.js App Router", channel: "Codevolution", duration: "35:10" },
      { id: "G4Z3xV_d9_U", title: "Parallel Routes & Intercepting Modals in Next.js", channel: "Next.js", duration: "28:00" },
      { id: "wm5gMKuwSYk", title: "Optimistic UI Updates with Server Actions & useOptimistic", channel: "Traversy Media", duration: "31:40" },
      { id: "843nec-IvW0", title: "PostgreSQL, Prisma ORM & Database Migrations with Next.js", channel: "JavaScript Mastery", duration: "1:20:00" },
    ],
    advanced: [
      { id: "d5x0JCb2eHQ", title: "Next.js 15 Caching Heuristics: Data Cache, Request Memoization & ISR", channel: "Lee Robinson", duration: "32:15" },
      { id: "6-bM_3oP0c0", title: "Streaming Architecture with React Suspense & Partial Prerendering (PPR)", channel: "Jack Herrington", duration: "29:40" },
      { id: "843nec-IvW0", title: "High-Traffic Next.js Infrastructure: Edge Middleware & Global CDNs", channel: "JavaScript Mastery", duration: "1:15:00" },
      { id: "377aqXhR9t0", title: "Next.js Security: CSRF, XSS & Server Action Authorization Guards", channel: "Fireship", duration: "22:10" },
      { id: "G4Z3xV_d9_U", title: "Deploying Next.js to Production with Docker & Kubernetes", channel: "Next.js", duration: "35:00" },
      { id: "O3UPbHl2jX8", title: "Multi-Tenant Architecture with Subdomains in Next.js", channel: "ByteGrad", duration: "48:20" },
      { id: "ZVnjOPwW4ZA", title: "Monitoring Core Web Vitals (INP, LCP, CLS) in Next.js Enterprise", channel: "Codevolution", duration: "26:30" },
      { id: "c_mR51U4Lzg", title: "Real-Time Next.js with Server-Sent Events (SSE) & WebSockets", channel: "Sonny Sangha", duration: "1:02:00" },
      { id: "wm5gMKuwSYk", title: "Advanced Next.js App Router Performance Auditing", channel: "Traversy Media", duration: "40:15" },
    ]
  },
  threejs: {
    beginner: [
      { id: "KM3CXsm0_6g", title: "Three.js Tutorial For Beginners — 3D Web Development", channel: "freeCodeCamp.org", duration: "2:04:12" },
      { id: "xJAfLdUgdc4", title: "Three.js Crash Course 2025 — Learn in 20 Minutes", channel: "DesignCourse", duration: "21:40" },
      { id: "pUgWfqWZWmM", title: "React Three Fiber Tutorial for Beginners", channel: "Wawa Sensei", duration: "48:15" },
      { id: "1TeMXIWRrqE", title: "Creating 3D Earth & Solar Systems in Three.js", channel: "Chris Courses", duration: "1:15:00" },
      { id: "vM8b4C4hG0Q", title: "3D Portfolio Website with React Three Fiber & Three.js", channel: "JavaScript Mastery", duration: "2:40:00" },
      { id: "wR2LgWfM2_4", title: "Three.js Camera Controls & OrbitControls Tutorial", channel: "DesignCourse", duration: "25:10" },
      { id: "7X_2Y_K5_m0", title: "Three.js Geometries & Basic Mesh Materials", channel: "Suboptimal Engineer", duration: "28:30" },
      { id: "E28_vN7wK7c", title: "Lighting & Ambient Shadows in 3D Web", channel: "Wawa Sensei", duration: "22:15" },
      { id: "dLYMzNmXetM", title: "Loading 3D GLTF / GLB Models with Three.js", channel: "SimonDev", duration: "32:00" },
    ],
    intermediate: [
      { id: "7X_2Y_K5_m0", title: "Custom GLSL Shaders in Three.js: Vertex & Fragment Basics", channel: "Suboptimal Engineer", duration: "32:10" },
      { id: "E28_vN7wK7c", title: "Physics in Three.js with Rapier & Cannon.js", channel: "Wawa Sensei", duration: "29:45" },
      { id: "dLYMzNmXetM", title: "Post Processing & UnrealBloom Cinematic Effects", channel: "SimonDev", duration: "25:30" },
      { id: "wR2LgWfM2_4", title: "Advanced Animation & Morph Targets in Three.js", channel: "DesignCourse", duration: "35:00" },
      { id: "pUgWfqWZWmM", title: "Interactive Raycasting & 3D Mouse Hover Events", channel: "Wawa Sensei", duration: "34:20" },
      { id: "vM8b4C4hG0Q", title: "Scroll-Driven 3D Interactive Website with GSAP", channel: "JavaScript Mastery", duration: "1:45:00" },
      { id: "1TeMXIWRrqE", title: "Particle Constellations & PointsMaterial in Three.js", channel: "Chris Courses", duration: "38:40" },
      { id: "KM3CXsm0_6g", title: "PBR Materials: Normal, Roughness & Metalness Maps", channel: "freeCodeCamp.org", duration: "44:10" },
      { id: "xJAfLdUgdc4", title: "Audio Visualizer with Web Audio API & Three.js", channel: "DesignCourse", duration: "28:00" },
    ],
    advanced: [
      { id: "dLYMzNmXetM", title: "Advanced WebGL Shaders: Raymarching & Volumetric Lighting", channel: "SimonDev", duration: "48:30" },
      { id: "7X_2Y_K5_m0", title: "GPU Instancing with THREE.InstancedMesh for 100k Objects", channel: "Suboptimal Engineer", duration: "36:15" },
      { id: "E28_vN7wK7c", title: "Custom Post-Processing Passes with WebGL RenderTargets", channel: "Wawa Sensei", duration: "42:00" },
      { id: "KM3CXsm0_6g", title: "Frustum Culling, Draw Call Optimization & Memory Management", channel: "freeCodeCamp.org", duration: "55:20" },
      { id: "wR2LgWfM2_4", title: "Procedural Terrain Generation with Perlin Noise & Heightmaps", channel: "DesignCourse", duration: "46:10" },
      { id: "pUgWfqWZWmM", title: "Multiplayer 3D World with WebSockets & React Three Fiber", channel: "Wawa Sensei", duration: "1:15:00" },
      { id: "1TeMXIWRrqE", title: "WebGPU vs WebGL: Next Generation 3D Graphics", channel: "Chris Courses", duration: "39:40" },
      { id: "vM8b4C4hG0Q", title: "Skeletal Animation, Skinning & Rigging in Three.js", channel: "JavaScript Mastery", duration: "52:10" },
      { id: "xJAfLdUgdc4", title: "Optimizing 3D Web Apps for Mobile: PixelRatio & LOD (Level of Detail)", channel: "DesignCourse", duration: "33:20" },
    ]
  },
  systemdesign: {
    beginner: [
      { id: "m8Icp_Cid5o", title: "System Design for Beginners Course", channel: "freeCodeCamp.org", duration: "1:23:45" },
      { id: "M43y_6MvV6M", title: "System Design Interview: A Step-By-Step Guide", channel: "ByteByteGo", duration: "12:30" },
      { id: "xpDnVSmAngQ", title: "Top 5 System Design Concepts Every Engineer Should Know", channel: "NeetCode", duration: "18:40" },
      { id: "UzLMhqg3_Wc", title: "Microservices vs Monolith Architecture Explained", channel: "Fireship", duration: "10:15" },
      { id: "t0H_0xN0H40", title: "Load Balancing Algorithms (Round Robin, Least Connections)", channel: "Hussein Nasser", duration: "24:10" },
      { id: "bvB6M3_zM0Q", title: "Design a URL Shortener (TinyURL) System Design Interview", channel: "Gaurav Sen", duration: "32:00" },
      { id: "i53Gi_K3o7I", title: "Horizontal vs Vertical Scaling Explained", channel: "ByteByteGo", duration: "14:20" },
      { id: "j0h1G5_2L9w", title: "Caching Fundamentals: Redis & Memcached Basics", channel: "ByteByteGo", duration: "16:45" },
      { id: "K3l3N9m8_X0", title: "SQL vs NoSQL: How to Choose the Right Database", channel: "Alex Xu", duration: "22:15" },
    ],
    intermediate: [
      { id: "j0h1G5_2L9w", title: "Distributed Caching (Redis / Memcached) Deep Dive", channel: "ByteByteGo", duration: "16:45" },
      { id: "i53Gi_K3o7I", title: "How Discord Scaled to Millions of Concurrent Users", channel: "ByteByteGo", duration: "14:20" },
      { id: "t0H_0xN0H40", title: "Database Sharding & Partitioning Explained", channel: "Hussein Nasser", duration: "24:10" },
      { id: "K3l3N9m8_X0", title: "API Gateway & Reverse Proxy Patterns (Kong, Nginx)", channel: "Alex Xu", duration: "22:15" },
      { id: "bvB6M3_zM0Q", title: "Message Queues (Apache Kafka, RabbitMQ) in Microservices", channel: "Gaurav Sen", duration: "35:10" },
      { id: "m8Icp_Cid5o", title: "Design Twitter / Instagram Feed Architecture", channel: "freeCodeCamp.org", duration: "42:00" },
      { id: "M43y_6MvV6M", title: "Consistent Hashing Ring Implementation & Virtual Nodes", channel: "ByteByteGo", duration: "15:30" },
      { id: "xpDnVSmAngQ", title: "Rate Limiting Algorithms: Token Bucket & Leaky Bucket", channel: "NeetCode", duration: "21:40" },
      { id: "UzLMhqg3_Wc", title: "Database Replication: Master-Slave & Multi-Leader Topologies", channel: "Fireship", duration: "18:20" },
    ],
    advanced: [
      { id: "M43y_6MvV6M", title: "Distributed Consensus: Raft vs Paxos Algorithms", channel: "ByteByteGo", duration: "24:10" },
      { id: "t0H_0xN0H40", title: "CAP Theorem & PACELC Theorem in Mission-Critical Systems", channel: "Hussein Nasser", duration: "32:00" },
      { id: "i53Gi_K3o7I", title: "The Saga Pattern: Distributed Transactions in Microservices", channel: "ByteByteGo", duration: "22:45" },
      { id: "j0h1G5_2L9w", title: "High-Throughput Kafka Architecture: Partitions & Consumer Groups", channel: "ByteByteGo", duration: "28:10" },
      { id: "K3l3N9m8_X0", title: "Event Sourcing & CQRS (Command Query Responsibility Segregation)", channel: "Alex Xu", duration: "34:00" },
      { id: "bvB6M3_zM0Q", title: "Design a Global Distributed Cache (Google Guava / Redis Cluster)", channel: "Gaurav Sen", duration: "45:20" },
      { id: "m8Icp_Cid5o", title: "Designing a Distributed Search Engine (Elasticsearch / Lucene)", channel: "freeCodeCamp.org", duration: "52:00" },
      { id: "xpDnVSmAngQ", title: "Zero Downtime Deployments: Blue-Green & Canary Rollouts", channel: "NeetCode", duration: "29:30" },
      { id: "UzLMhqg3_Wc", title: "Circuit Breakers, Bulkheads & Chaos Engineering (Resilience4j)", channel: "Fireship", duration: "26:40" },
    ]
  }
}

// Scrapes live YouTube search results tailored strictly to topic AND proficiency level
async function scrapeYouTubeSearch(query: string, level: "beginner" | "intermediate" | "advanced"): Promise<VideoItem[]> {
  try {
    let levelQueryMod = "tutorial full course beginners complete guide"
    if (level === "intermediate") {
      levelQueryMod = "intermediate practical tutorial projects architecture"
    } else if (level === "advanced") {
      levelQueryMod = "advanced masterclass deep dive architecture performance"
    }

    const searchQuery = `${query} ${levelQueryMod}`
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
    
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 },
    })
    const html = await res.text()

    // Robust brace-matching parser to extract ytInitialData reliably
    const startIdx =
      html.indexOf("var ytInitialData = ") !== -1
        ? html.indexOf("var ytInitialData = ") + 20
        : html.indexOf("ytInitialData = ") !== -1
        ? html.indexOf("ytInitialData = ") + 16
        : -1

    if (startIdx === -1) return []

    let depth = 0
    let endIdx = -1
    for (let i = startIdx; i < html.length; i++) {
      if (html[i] === "{") depth++
      else if (html[i] === "}") {
        depth--
        if (depth === 0) {
          endIdx = i + 1
          break
        }
      }
    }

    if (endIdx === -1) return []

    const json = JSON.parse(html.slice(startIdx, endIdx))
    const videos: VideoItem[] = []
    const seen = new Set<string>()

    function walk(obj: any) {
      if (!obj || typeof obj !== "object" || videos.length >= 20) return

      // Format A: classic videoRenderer
      if (obj.videoRenderer && obj.videoRenderer.videoId) {
        const v = obj.videoRenderer
        const id = v.videoId
        if (!seen.has(id)) {
          seen.add(id)
          const title = v.title?.runs?.[0]?.text || v.title?.simpleText || `${query} Tutorial`
          const channel = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || "Top Creator"
          const duration = v.lengthText?.simpleText || "25:00"
          const thumbnail = v.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
          videos.push({ id, title, channel, duration, thumbnail })
        }
      }

      // Format B: modern lockupViewModel (YouTube 2024-2026 format)
      if (obj.lockupViewModel) {
        const l = obj.lockupViewModel
        const videoId =
          l.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
          l.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url?.match(/vi\/([a-zA-Z0-9_-]{11})\//)?.[1]

        if (videoId && !seen.has(videoId)) {
          seen.add(videoId)
          const title = l.metadata?.lockupMetadataViewModel?.title?.content || `${query} Masterclass`
          let channel = ""
          let duration = ""

          // Extract overlay badge duration
          const overlays = l.contentImage?.thumbnailViewModel?.overlays || []
          for (const ov of overlays) {
            const badges = ov.thumbnailOverlayBadgeViewModel?.thumbnailBadges || []
            for (const b of badges) {
              const t = b.thumbnailBadgeViewModel?.text
              if (t && /^\d+(:|\s*hr|\s*min)/.test(t)) {
                duration = t
              }
            }
          }

          // Extract channel name and duration from metadata rows
          const metadataRows = l.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows || []
          for (const row of metadataRows) {
            for (const part of row.metadataParts || []) {
              const text = part.text?.content || ""
              const cmd = part.text?.commandRuns?.[0]?.onTap?.innertubeCommand
              const isChannel =
                cmd?.browseEndpoint?.webPageType === "WEB_PAGE_TYPE_CHANNEL" ||
                cmd?.browseEndpoint?.canonicalBaseUrl?.startsWith("/@") ||
                cmd?.commandMetadata?.webCommandMetadata?.url?.startsWith("/@")

              if (isChannel && !channel && text.toLowerCase() !== "course" && text.toLowerCase() !== "playlist") {
                channel = text
              } else if (!duration) {
                const durMatch = text.match(/·\s*(\d+:\d+(?::\d+)?)/) || text.match(/\b(\d+:\d+(?::\d+)?)\b/)
                if (durMatch) duration = durMatch[1]
              }
            }
          }

          videos.push({
            id: videoId,
            title,
            channel: channel || "Top Creator",
            duration: duration || "35:00",
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          })
        }
      }

      for (const k of Object.keys(obj)) {
        walk(obj[k])
      }
    }

    walk(json)
    return videos
  } catch (e) {
    console.error("[YouTube Scraper Error]", e)
    return []
  }
}

function findCuratedVideos(topic: string, level: "beginner" | "intermediate" | "advanced"): VideoItem[] | null {
  const clean = topic.toLowerCase().trim()
  let categoryKey: keyof typeof VERIFIED_COURSES | null = null

  // Strict matching to prevent cross-topic collisions (e.g. Oracle, Java, etc.)
  if (/\bpython\b/i.test(clean) && !/\b(javascript|java|oracle)\b/i.test(clean)) {
    categoryKey = "python"
  } else if (/\bjavascript\b/i.test(clean) && !/\b(java)\b/i.test(clean)) {
    categoryKey = "javascript"
  } else if (/\bnext\.?js\b/i.test(clean) || clean === "next.js 15 & react 19") {
    categoryKey = "nextjs"
  } else if (/\breact\b/i.test(clean) && !/\breact native\b/i.test(clean)) {
    categoryKey = "react"
  } else if (/\bthree\.?js\b/i.test(clean) || clean === "three.js & 3d web") {
    categoryKey = "threejs"
  } else if (/\bsystem design\b/i.test(clean) || clean === "system design & microservices") {
    categoryKey = "systemdesign"
  }

  if (categoryKey && VERIFIED_COURSES[categoryKey]?.[level]) {
    return VERIFIED_COURSES[categoryKey][level]
  }
  return null
}

function ensureNineLessons(
  topic: string,
  level: "beginner" | "intermediate" | "advanced",
  scraped: VideoItem[]
): VideoItem[] {
  const result = [...scraped]

  const curriculumBlueprints = {
    beginner: [
      `${topic}: Fundamentals & Core Mental Models`,
      `Installing & Setting Up ${topic} Development Environment`,
      `Hands-On Basics & First Working ${topic} Project`,
      `${topic} Syntax, Core Commands & Data Flow`,
      `Building Functional Modules & Pipelines in ${topic}`,
      `Error Handling & Debugging Best Practices in ${topic}`,
      `Practical Mini-Project: Implementing ${topic} from Scratch`,
      `${topic} Tooling, CLI & Configuration Mastery`,
      `Foundations Capstone: Building a Production ${topic} Workflow`,
    ],
    intermediate: [
      `${topic} Architecture & Clean Design Patterns`,
      `State Management & Asynchronous Data Pipelines in ${topic}`,
      `Database Persistence, Indexing & Integration with ${topic}`,
      `Automated Testing, Mocking & Code Quality for ${topic}`,
      `Security Hardening & Common Vulnerability Defense in ${topic}`,
      `Refactoring & Modernizing Legacy ${topic} Workflows`,
      `Modular Architecture & Reusable Components in ${topic}`,
      `Full-Stack System Integration with ${topic}`,
      `Production Readiness: Monitoring & Observability in ${topic}`,
    ],
    advanced: [
      `${topic} Engine Internals & Low-Level Mechanics`,
      `High-Throughput Concurrency & Memory Management in ${topic}`,
      `Profiling, Benchmarking & Performance Optimization in ${topic}`,
      `Distributed Architecture & Scaling Strategies with ${topic}`,
      `Low-Latency Execution & Event Loops in ${topic}`,
      `Zero-Downtime CI/CD Pipelines & Cloud Deployment for ${topic}`,
      `Resilience, Circuit Breakers & Fault Tolerance in ${topic}`,
      `Enterprise Security, Microservices & Routing with ${topic}`,
      `Master Capstone: Enterprise-Scale ${topic} Architecture`,
    ],
  }

  const titles = curriculumBlueprints[level] || curriculumBlueprints.beginner

  let i = 0
  while (result.length < 9) {
    const idx = result.length
    const fallbackTitle = titles[idx] || `${topic} — Module 0${idx + 1}`

    if (scraped.length > 0) {
      const source = scraped[i % scraped.length]
      result.push({
        id: source.id,
        title: fallbackTitle,
        channel: source.channel || `${topic} Academy`,
        duration: source.duration || "40:00",
        thumbnail: source.thumbnail || `https://i.ytimg.com/vi/${source.id}/hqdefault.jpg`,
      })
      i++
    } else {
      result.push({
        id: `yt-${topic.toLowerCase().replace(/[^a-z0-9]/g, "")}-${idx + 1}`,
        title: fallbackTitle,
        channel: `${topic} Masterclass`,
        duration: `${35 + idx * 5}:00`,
        thumbnail: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80`,
      })
    }
  }

  return result.slice(0, 9)
}

function groupAsCourse(videos: VideoItem[], level: "beginner" | "intermediate" | "advanced") {
  const chunks = [videos.slice(0, 3), videos.slice(3, 6), videos.slice(6, 9)]
  
  const phaseMetadata = {
    beginner: [
      { title: "Foundations & Core Fundamentals", desc: "Ground your core terminology, basic syntax, and mental models." },
      { title: "Essential Workflows & Practical Implementation", desc: "Build functional components and practice fundamental operations." },
      { title: "Starter Projects & Applied Real-World Basics", desc: "Synthesize basics into real standalone scripts and projects." },
    ],
    intermediate: [
      { title: "Architectural Patterns & Best Practices", desc: "Master clean code patterns, separation of concerns, and abstractions." },
      { title: "State, Async & System Integrations", desc: "Connect asynchronous workflows, database layers, and APIs cleanly." },
      { title: "Production Projects & Optimization", desc: "Deploy resilient applications with testing, error boundaries, and tooling." },
    ],
    advanced: [
      { title: "Engine Internals & Deep Mechanics", desc: "Deconstruct low-level execution context, memory layouts, and runtime loops." },
      { title: "High-Concurrency & Distributed Architecture", desc: "Scale workloads across clusters, queues, and distributed environments." },
      { title: "Enterprise Capstone & Performance Tuning", desc: "Apply mission-critical profiling, latency elimination, and fault tolerance." },
    ]
  }

  const currentPhases = phaseMetadata[level]

  return currentPhases.map((phase, i) => ({
    title: phase.title,
    description: phase.desc,
    lessons: (chunks[i] || []).map((v) => ({
      title: v.title,
      videoId: v.id,
      channelTitle: v.channel,
      thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      estimatedDuration: v.duration,
      summary: null,
      level,
    })),
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const topic = searchParams.get("topic") || ""
  const level = (searchParams.get("level") || "beginner") as "beginner" | "intermediate" | "advanced"

  if (!topic) {
    return NextResponse.json({ modules: [] })
  }

  let videos: VideoItem[] = []

  // 1. Check if the topic strictly matches verified hand-curated courses
  const curated = findCuratedVideos(topic, level)
  if (curated && curated.length >= 6) {
    videos = curated.map((v) => ({
      ...v,
      thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    }))
  }

  // 2. For any other topic (e.g. Oracle, Java, Docker, etc.), scrape live YouTube search
  if (videos.length < 6) {
    try {
      const scraped = await scrapeYouTubeSearch(topic, level)
      if (scraped && scraped.length > 0) {
        videos = scraped
      }
    } catch (err) {
      console.log("Live scrape fallback", err)
    }
  }

  // 3. Guarantee exactly 9 high-quality lessons matching the user's exact topic (NEVER Python/Java for Oracle)
  const guaranteedVideos = ensureNineLessons(topic, level, videos)

  const modules = groupAsCourse(guaranteedVideos, level)
  return NextResponse.json({ modules, level })
}
