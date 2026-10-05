import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Question = {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

// Extensive banks of deep, technical questions per domain
const QUESTION_BANKS: Record<string, Question[]> = {
  python_ai: [
    {
      question: "In Transformer-based LLMs, what is the primary function of the Self-Attention mechanism?",
      options: [
        "To compress the vocabulary size into a fixed integer array",
        "To allow each token to dynamically compute contextual relationships with all other tokens in the sequence",
        "To replace backpropagation during gradient descent",
        "To store long-term conversational memory on disk"
      ],
      correctIndex: 1,
      explanation: "Self-Attention computes query-key-value dot products across tokens to capture contextual dependencies."
    },
    {
      question: "When implementing Retrieval-Augmented Generation (RAG), why are text chunks converted into vector embeddings?",
      options: [
        "To compress the raw text by 99% for cheaper database storage",
        "To enable semantic similarity search using cosine distance or dot products in high-dimensional vector space",
        "To encrypt sensitive user data before sending it to the LLM",
        "To convert non-English words into ASCII characters"
      ],
      correctIndex: 1,
      explanation: "Embeddings place semantically similar text chunks close together in vector space for fast retrieval."
    },
    {
      question: "In LLM generation parameters, what happens when you set the `temperature` parameter closer to 0.0?",
      options: [
        "The model produces more stochastic, creative, and varied outputs",
        "The model becomes deterministic, picking the highest-probability token greedily",
        "The model triples its inference speed",
        "The context window is automatically halved"
      ],
      correctIndex: 1,
      explanation: "Low temperature sharpens the softmax distribution, favoring the highest-probability tokens."
    },
    {
      question: "What is the primary advantage of Parameter-Efficient Fine-Tuning (PEFT) techniques like LoRA (Low-Rank Adaptation)?",
      options: [
        "It eliminates the need for training data entirely",
        "It freezes original model weights and injects trainable low-rank decomposition matrices, dramatically reducing VRAM and compute requirements",
        "It converts neural networks into decision trees",
        "It doubles the parameter count of the base LLM"
      ],
      correctIndex: 1,
      explanation: "LoRA decomposes weight updates into two smaller matrices, drastically reducing trainable parameters."
    },
    {
      question: "In Python, why is `asyncio` typically preferred over multithreading for building LLM agent pipelines with many API calls?",
      options: [
        "LLM API calls are I/O-bound; non-blocking event loops handle thousands of concurrent requests without thread overhead",
        "`asyncio` bypasses Python's Global Interpreter Lock (GIL) for CPU-bound training",
        "Python multithreading cannot make HTTP requests",
        "`asyncio` automatically fine-tunes the remote model"
      ],
      correctIndex: 0,
      explanation: "API calls spend time waiting for responses; asynchronous event loops maximize I/O concurrency."
    },
    {
      question: "What is 'Hallucination' in Large Language Models?",
      options: [
        "A GPU hardware memory corruption error during inference",
        "When the model generates plausible-sounding but factually incorrect or ungrounded statements",
        "When the context window exceeds 128k tokens",
        "An intentional randomization algorithm used in reinforcement learning"
      ],
      correctIndex: 1,
      explanation: "Hallucinations occur because LLMs predict probabilistic token sequences rather than maintaining explicit world state."
    },
    {
      question: "In LangChain / LlamaIndex, what is the role of a 'Vector Store' (e.g. Pinecone, Chroma, Qdrant)?",
      options: [
        "To execute Python code in a sandboxed Docker container",
        "To index, store, and perform approximate nearest-neighbor (ANN) similarity search on embedding vectors",
        "To serve as the primary relational database for ACID transactions",
        "To serialize neural network weights to disk"
      ],
      correctIndex: 1,
      explanation: "Vector databases are optimized for high-dimensional cosine/L2 distance search across millions of vectors."
    },
    {
      question: "What does 'Quantization' (e.g. 4-bit AWQ, GGUF, GPTQ) achieve in LLM deployment?",
      options: [
        "Reduces weight precision (e.g. FP16 to INT4) to drastically cut VRAM usage and enable local/edge execution with minimal perplexity loss",
        "Increases the context window size exponentially without memory cost",
        "Translates model architectures between PyTorch and TensorFlow",
        "Eliminates the prompt token limit"
      ],
      correctIndex: 0,
      explanation: "Quantization reduces memory footprint, allowing large models to run on consumer GPUs and laptops."
    },
    {
      question: "In Python AI workflows, what is the primary purpose of PyTorch's `torch.no_grad()` context manager during LLM inference?",
      options: [
        "It accelerates inference by disabling autograd history tracking and reducing memory consumption",
        "It prevents the model from generating toxic tokens",
        "It automatically loads weights from Hugging Face Hub",
        "It converts float32 tensors to Python native lists"
      ],
      correctIndex: 0,
      explanation: "`torch.no_grad()` tells PyTorch not to calculate gradients, saving memory during inference."
    },
    {
      question: "What is 'Prompt Injection' and how is it mitigated in production AI systems?",
      options: [
        "A technique to speed up tokenizer processing in C++",
        "A security vulnerability where adversarial user inputs override system instructions; mitigated by input sandboxing, guardrails, and delimiter isolation",
        "A database injection exploit targeting SQLite tables",
        "An automated hyperparameter tuning algorithm"
      ],
      correctIndex: 1,
      explanation: "Prompt injection attempts to hijack the model's instructions; guardrails and structured parsing defend against it."
    },
    {
      question: "What is the key difference between an 'Embedding Model' and a 'Generative LLM'?",
      options: [
        "Embedding models convert text into dense numerical vectors; generative models produce sequential text tokens",
        "Embedding models only work on numbers; generative models only work on images",
        "Embedding models have more parameters than generative models",
        "There is no architectural difference"
      ],
      correctIndex: 0,
      explanation: "Embedding models map inputs to fixed-size vectors; generative models predict the next token autoregressively."
    },
    {
      question: "In the context of LLM agents, what does the 'ReAct' (Reasoning + Acting) prompting paradigm do?",
      options: [
        "It renders React.js frontend components from prompts",
        "It interleaves chain-of-thought reasoning steps with tool execution actions and observation parsing",
        "It limits the model to only reactive memory stores",
        "It trains the model via reinforcement learning from human feedback (RLHF)"
      ],
      correctIndex: 1,
      explanation: "ReAct combines step-by-step reasoning traces with external tool execution and observation loops."
    }
  ],
  nextjs_react: [
    {
      question: "In Next.js 15 App Router, what is the default rendering behavior of components inside the `app/` directory?",
      options: [
        "They are Client Components rendered in the browser",
        "They are React Server Components (RSC) rendered on the server with zero client JavaScript bundle",
        "They are statically exported HTML files without dynamic capabilities",
        "They run exclusively inside Web Workers"
      ],
      correctIndex: 1,
      explanation: "All components in the App Router are Server Components by default unless marked with `'use client'`."
    },
    {
      question: "How do Server Actions in Next.js 15 handle form submissions and mutations?",
      options: [
        "They require writing manual REST API endpoints in `pages/api`",
        "They execute server-side async functions directly from form elements or client hooks with automatic RPC serialization",
        "They bypass HTTP requests using WebSockets",
        "They only work with GraphQL schemas"
      ],
      correctIndex: 1,
      explanation: "Server Actions allow calling server functions directly without manually configuring API route handlers."
    },
    {
      question: "In React 19, what does the new `useActionState` hook provide?",
      options: [
        "It replaces `useState` for all global state management",
        "It manages pending state, returned action values, and optimistic updates for async form actions",
        "It compiles React components to WebAssembly",
        "It connects React components to Redux stores"
      ],
      correctIndex: 1,
      explanation: "`useActionState` simplifies managing async server actions, pending state transitions, and returned error payloads."
    },
    {
      question: "Why should you avoid defining functions or objects inside React component bodies without `useCallback` or `useMemo` when passing them to memoized children?",
      options: [
        "It will throw a runtime syntax error in Strict Mode",
        "Every render creates new object/function references in memory, causing memoized children to re-render unnecessarily",
        "It prevents garbage collection from cleaning up state",
        "It triggers an infinite loop in Server Components"
      ],
      correctIndex: 1,
      explanation: "JavaScript creates new object references on every render; `useCallback` preserves reference equality."
    },
    {
      question: "What is Incremental Static Regeneration (ISR) in Next.js?",
      options: [
        "A mechanism to update static pages in the background after deployment without rebuilding the entire website",
        "A tool to generate TypeScript types incrementally",
        "A browser caching header that forces hard page refreshes",
        "A database indexing algorithm"
      ],
      correctIndex: 0,
      explanation: "ISR revalidates static pages on a time or tag basis without requiring a full redeployment."
    },
    {
      question: "What is the purpose of the `next/image` component over standard HTML `<img>` tags?",
      options: [
        "It eliminates Cumulative Layout Shift (CLS), serves modern AVIF/WebP formats, and resizes images on demand",
        "It only displays SVG vector graphics",
        "It converts 2D images into 3D meshes",
        "It uploads images to S3 automatically"
      ],
      correctIndex: 0,
      explanation: "`next/image` handles responsive sizing, modern format conversion, lazy loading, and prevents layout shift."
    },
    {
      question: "When should you mark a component with the `'use client'` directive in Next.js App Router?",
      options: [
        "Whenever you need to fetch data from an external database",
        "When using React hooks (`useState`, `useEffect`), browser event listeners (`onClick`), or browser APIs (`window`, `localStorage`)",
        "For all layout and page files",
        "To make the component SEO-friendly"
      ],
      correctIndex: 1,
      explanation: "`'use client'` declares the boundary where client-side interactivity and browser APIs are required."
    },
    {
      question: "In React 19, what is the role of `useOptimistic` hook?",
      options: [
        "It displays an optimistic UI state immediately while an asynchronous server mutation is in-flight, reverting if it fails",
        "It forces the network to execute at 5G speeds",
        "It hides all JavaScript runtime errors from the user",
        "It automatically retries failed API calls forever"
      ],
      correctIndex: 0,
      explanation: "`useOptimistic` provides instant feedback to users while background server operations are completing."
    },
    {
      question: "What does the `revalidatePath()` function do when called inside a Next.js Server Action?",
      options: [
        "It redirects the user to the login screen",
        "It purges the cached data and re-renders the specified route segment on the next request",
        "It re-compiles the entire TypeScript project",
        "It deletes the user's cookies"
      ],
      correctIndex: 1,
      explanation: "`revalidatePath` invalidates the Server Cache for a route, allowing fresh data to be rendered."
    },
    {
      question: "What is React Server Component (RSC) streaming and how is it implemented in Next.js?",
      options: [
        "Streaming video over WebRTC",
        "Breaking page HTML into chunks and streaming them progressively using React `Suspense` boundaries and `loading.tsx`",
        "Downloading npm packages during user interactions",
        "Connecting React to live audio streams"
      ],
      correctIndex: 1,
      explanation: "Streaming allows fast initial TTFB by sending fast UI chunks first and streaming heavy data blocks later."
    }
  ],
  system_design: [
    {
      question: "According to the CAP Theorem, what are the trade-offs in a distributed data store experiencing a network partition (P)?",
      options: [
        "You can achieve both Consistency (C) and Availability (A) simultaneously",
        "You must choose between Consistency (C) (refusing writes) or Availability (A) (serving potentially stale data)",
        "You must sacrifice Partition Tolerance (P) to keep data safe",
        "The system must switch from SQL to NoSQL"
      ],
      correctIndex: 1,
      explanation: "When a network partition occurs, a distributed system can either stay consistent (CP) or available (AP)."
    },
    {
      question: "What is Consistent Hashing and why is it essential in distributed caching (e.g. Memcached, DynamoDB)?",
      options: [
        "A hashing function that never produces hash collisions",
        "A ring-based hashing topology where adding or removing a node only redistributes k/N keys instead of re-hashing the entire cluster",
        "An encryption standard for storing passwords",
        "A method to guarantee ACID transactions across microservices"
      ],
      correctIndex: 1,
      explanation: "Consistent hashing minimizes key redistribution when servers scale up or down."
    },
    {
      question: "What is the difference between Database Sharding and Read Replicas?",
      options: [
        "Read replicas split write traffic horizontally; sharding only handles caching",
        "Read replicas copy all data to scale read throughput; sharding partitions data across multiple databases to scale write and storage capacity",
        "Sharding is only used in SQLite; read replicas are used in PostgreSQL",
        "There is no difference"
      ],
      correctIndex: 1,
      explanation: "Replicas duplicate data to distribute reads; sharding partitions datasets across distinct database nodes."
    },
    {
      question: "In a microservices architecture, what is the role of the Saga Pattern?",
      options: [
        "To manage distributed transactions across multiple independent services using a sequence of local transactions and compensating transactions on failure",
        "To replace API gateways with peer-to-peer WebSockets",
        "To compress microservice Docker container images",
        "To enforce synchronous HTTP 1.1 communication"
      ],
      correctIndex: 0,
      explanation: "The Saga pattern coordinates multi-service workflows without locking distributed two-phase commits."
    },
    {
      question: "Why are Message Queues (e.g. Apache Kafka, RabbitMQ) used for asynchronous inter-service communication?",
      options: [
        "To decouple producers and consumers, buffer peak traffic bursts, and guarantee message delivery without blocking web servers",
        "To replace persistent databases entirely",
        "To encrypt network traffic across VPCs",
        "To serve static HTML pages to users"
      ],
      correctIndex: 0,
      explanation: "Queues provide backpressure management, decoupling, and asynchronous reliability."
    },
    {
      question: "What is the 'Thundering Herd' problem in high-concurrency caching systems?",
      options: [
        "When thousands of concurrent requests miss the cache simultaneously upon expiration and overload the origin database at once",
        "A DDoS attack targeting DNS nameservers",
        "When microservices send duplicate emails to users",
        "A memory leak in Node.js event listeners"
      ],
      correctIndex: 0,
      explanation: "Thundering herd happens when cache keys expire and concurrent requests hit the origin database simultaneously."
    },
    {
      question: "What is the primary difference between a Forward Proxy and a Reverse Proxy?",
      options: [
        "A forward proxy protects clients by routing outbound requests; a reverse proxy protects servers by routing and balancing inbound requests",
        "A forward proxy handles databases; a reverse proxy handles HTML",
        "Forward proxies are only for HTTPS; reverse proxies are for HTTP",
        "They are identical"
      ],
      correctIndex: 0,
      explanation: "Forward proxies sit in front of clients; reverse proxies sit in front of backend web servers."
    },
    {
      question: "Which Rate Limiting algorithm allows short bursts of traffic while enforcing a steady long-term average request rate?",
      options: [
        "Token Bucket / Leaky Bucket algorithm",
        "Fixed Window Counter algorithm",
        "Round Robin algorithm",
        "Bubble Sort algorithm"
      ],
      correctIndex: 0,
      explanation: "Token Bucket accumulates tokens up to capacity to accommodate temporary bursts while capping rate."
    },
    {
      question: "What is the primary trade-off of using an Event-Driven Architecture over REST?",
      options: [
        "Event-driven provides loose coupling and high scalability, but increases debugging complexity and requires handling eventual consistency",
        "Event-driven architectures cannot handle JSON payloads",
        "REST is always faster than event queues",
        "Event-driven systems cannot run in the cloud"
      ],
      correctIndex: 0,
      explanation: "Asynchronous event architectures excel at scale but introduce eventual consistency and tracing challenges."
    },
    {
      question: "What is a Circuit Breaker pattern in microservice resilience?",
      options: [
        "A mechanism that detects failures and temporarily stops sending traffic to an unhealthy service, preventing cascading system crashes",
        "A physical switch in the data center that cuts power",
        "A firewall rule that blocks all IP addresses outside the country",
        "A load balancing algorithm based on CPU temperature"
      ],
      correctIndex: 0,
      explanation: "Circuit breakers prevent cascading failures by tripping open when downstream services fail."
    }
  ],
  threejs_3d: [
    {
      question: "In Three.js, what is the Scene Graph and how does hierarchical transformation work?",
      options: [
        "A 2D canvas drawing layout",
        "A tree structure of nodes (Objects/Groups) where child transforms (position, rotation, scale) are relative to and inherit from their parent nodes",
        "A database that stores 3D models on AWS S3",
        "A physics collision detection algorithm"
      ],
      correctIndex: 1,
      explanation: "The Scene Graph propagates transformation matrices down the hierarchy from parent to child."
    },
    {
      question: "What is the performance benefit of using `THREE.InstancedMesh` instead of creating 10,000 separate `THREE.Mesh` objects?",
      options: [
        "It renders 10,000 instances in a single GPU draw call by passing instance transformation matrices in a buffer, drastically reducing CPU-GPU overhead",
        "It converts 3D models into 2D sprite sheets",
        "It runs the render loop in WebAssembly",
        "It disables lighting calculations"
      ],
      correctIndex: 0,
      explanation: "Instancing consolidates thousands of identical geometries into a single draw call."
    },
    {
      question: "In WebGL shaders, what is the difference between a Vertex Shader and a Fragment Shader?",
      options: [
        "Vertex Shaders compute 3D vertex positions on screen; Fragment Shaders calculate pixel colors, lighting, and textures",
        "Vertex shaders handle sound; fragment shaders handle graphics",
        "Vertex shaders run on the CPU; fragment shaders run on the GPU",
        "Vertex shaders are for 2D; fragment shaders are for 3D"
      ],
      correctIndex: 0,
      explanation: "Vertex shaders transform vertex geometry in space; fragment/pixel shaders shade and color each pixel."
    },
    {
      question: "What is Frustum Culling in 3D rendering engines?",
      options: [
        "The process of skipping the rendering of objects that are outside the camera's visible viewing frustum to save GPU compute",
        "A method to compress 3D texture files",
        "A camera movement animation technique",
        "An anti-aliasing filter"
      ],
      correctIndex: 0,
      explanation: "Frustum culling prevents rendering invisible objects outside the camera's sight cone."
    },
    {
      question: "What is the purpose of Raycasting in interactive 3D Web applications?",
      options: [
        "To cast a 3D ray from the 2D mouse cursor coordinates into the 3D scene to detect object intersections and mouse clicks",
        "To calculate global illumination shadows",
        "To stream 3D assets over WebSockets",
        "To generate terrain procedurally"
      ],
      correctIndex: 0,
      explanation: "Raycasting projects a mathematical ray through mouse screen coordinates to find clicked 3D objects."
    },
    {
      question: "What is a PBR (Physically Based Rendering) material in Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)?",
      options: [
        "A material model that calculates light reflection using physical laws (roughness, metalness, Fresnel reflection, conservation of energy)",
        "A wireframe-only shader",
        "A 2D cartoon flat shading material",
        "A video texture player"
      ],
      correctIndex: 0,
      explanation: "PBR simulates real-world optical behavior using roughness and metalness maps."
    },
    {
      question: "What is Normal Mapping in 3D graphics?",
      options: [
        "Using an RGB texture map to perturb surface normals, creating the visual illusion of high-resolution geometric detail on low-poly meshes without extra vertices",
        "Mapping 3D models onto GPS coordinates",
        "Normalizing vector lengths to 1.0",
        "Creating flat 2D shadows"
      ],
      correctIndex: 0,
      explanation: "Normal maps fake complex surface bumps and grooves without increasing polygon count."
    },
    {
      question: "Why should `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` be capped at 2 for mobile devices?",
      options: [
        "Pixel ratios above 2 (e.g. 3x or 4x on Retina phones) quadruple GPU fragment shader workload with no perceptible visual improvement, killing frame rates and battery",
        "Three.js crashes on pixel ratios above 2",
        "Browsers do not support numbers higher than 2",
        "It prevents canvas touch events from firing"
      ],
      correctIndex: 0,
      explanation: "Rendering at 3x or 4x pixel ratio overwhelms mobile GPUs with minimal perceptible difference."
    },
    {
      question: "What is the purpose of post-processing passes (EffectComposer, UnrealBloomPass) in Three.js?",
      options: [
        "Applying fullscreen shader effects (bloom glow, depth of field, chromatic aberration, tone mapping) to the rendered frame buffer before final display",
        "Exporting 3D models to OBJ format",
        "Handling user authentication",
        "Compressing GLTF files on upload"
      ],
      correctIndex: 0,
      explanation: "Post-processing applies cinematic visual effects to the rendered 2D scene buffer."
    },
    {
      question: "In React Three Fiber (R3F), what does the `useFrame` hook do?",
      options: [
        "It registers a callback that executes on every single frame of the WebGL render loop (typically 60fps or 120fps) for animations and physics",
        "It captures a screenshot of the 3D scene",
        "It loads CSS keyframe animations",
        "It creates an HTML `<iframe>` element"
      ],
      correctIndex: 0,
      explanation: "`useFrame` runs on every tick of the render loop to drive real-time procedural animations."
    }
  ],
  database_sql: [
    {
      question: "In relational database systems like Oracle, what does ACID Atomicity guarantee?",
      options: [
        "All statements in a transaction complete successfully, or the entire transaction is rolled back with zero partial effects",
        "Data is automatically converted into JSON format before writing to disk",
        "Every table must have an auto-incrementing integer primary key",
        "Queries execute in parallel across all CPU cores"
      ],
      correctIndex: 0,
      explanation: "Atomicity ensures 'all-or-nothing' execution: either all operations commit or none persist."
    },
    {
      question: "What is the primary difference between a heap table with secondary B-Tree indexes and an Index-Organized Table (IOT) in Oracle?",
      options: [
        "In a heap table, row data is stored unordered and indexed by ROWID; in an IOT, data rows are stored directly in the B-Tree index leaf blocks",
        "Heap tables cannot store string columns",
        "Index-organized tables cannot have primary keys",
        "Heap tables run entirely in RAM and never write to disk"
      ],
      correctIndex: 0,
      explanation: "Index-Organized Tables store full row data inside the primary key B-Tree leaf blocks, avoiding ROWID lookups."
    },
    {
      question: "Why should SQL queries use parameterized prepared statements rather than raw string concatenation?",
      options: [
        "To allow the database to cache execution plans and permanently neutralize SQL Injection attacks",
        "To compress query text by 50%",
        "To bypass database authentication",
        "To convert SQL dialect automatically"
      ],
      correctIndex: 0,
      explanation: "Parameterized statements separate query structure from data inputs, neutralizing injection attacks."
    },
    {
      question: "In SQL, what is the fundamental difference between the `WHERE` clause and the `HAVING` clause?",
      options: [
        "`WHERE` filters individual rows before grouping; `HAVING` filters aggregated groups after `GROUP BY` is evaluated",
        "`HAVING` can only be used with subqueries",
        "`WHERE` is deprecated in modern SQL-99 standards",
        "There is no semantic difference"
      ],
      correctIndex: 0,
      explanation: "`WHERE` filters raw table rows prior to aggregation; `HAVING` filters computed aggregate values."
    },
    {
      question: "In Oracle Database, what is the purpose of the `EXPLAIN PLAN` command?",
      options: [
        "To display the execution path, join algorithms, and index access methods chosen by the Cost-Based Optimizer (CBO)",
        "To automatically rewrite SQL queries into C++",
        "To schedule backups during low-traffic windows",
        "To calculate total disk storage space"
      ],
      correctIndex: 0,
      explanation: "`EXPLAIN PLAN` reveals the cost-based optimizer's step-by-step strategy for executing the query."
    },
    {
      question: "Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads under the ANSI SQL standard?",
      options: [
        "Repeatable Read",
        "Read Uncommitted",
        "Read Committed",
        "Serializable"
      ],
      correctIndex: 0,
      explanation: "Repeatable Read guarantees rows read will not change, but new rows (phantoms) may still be inserted."
    },
    {
      question: "In Oracle PL/SQL, what is the difference between a `PROCEDURE` and a `FUNCTION`?",
      options: [
        "A function must return a value and can be called directly inside SQL queries; a procedure executes tasks and does not require a return value",
        "Procedures run on the client; functions run on the database server",
        "Functions cannot accept parameters",
        "Procedures cannot commit transactions"
      ],
      correctIndex: 0,
      explanation: "PL/SQL functions return a computed value and can be embedded within SQL statements."
    },
    {
      question: "What is Database Normalization (up to 3NF) designed to achieve?",
      options: [
        "Eliminate data redundancy, avoid insertion/update/deletion anomalies, and ensure data integrity",
        "Increase table row counts to maximize storage utilization",
        "Convert relational tables into unstructured document stores",
        "Bypass foreign key constraints for faster writes"
      ],
      correctIndex: 0,
      explanation: "3NF ensures all non-key attributes are fully dependent only on the primary key, preventing redundancy."
    },
    {
      question: "What does `SELECT ... FOR UPDATE` do in concurrent database transactions?",
      options: [
        "Acquires exclusive row-level locks on the selected records to prevent concurrent transactions from modifying them until commit/rollback",
        "Immediately deletes the matching rows",
        "Updates table statistics automatically",
        "Disables undo tablespace logging"
      ],
      correctIndex: 0,
      explanation: "`FOR UPDATE` enforces pessimistic row-level locking to prevent race conditions during updates."
    },
    {
      question: "In Oracle architecture, what is the role of the Redo Log (and Archivelog mode)?",
      options: [
        "To record all changes made to the database so that in the event of an unexpected crash or media failure, data can be reconstructed and recovered",
        "To log user website browsing history",
        "To compress temporary sorting tables",
        "To store compiled Java bytecode"
      ],
      correctIndex: 0,
      explanation: "Redo logs record all transaction changes to guarantee Durability and enable complete crash recovery."
    }
  ]
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Function to get 10 randomized technical questions
function getRandomizedTechnicalQuiz(topic: string, count = 10): Question[] {
  const key = topic.toLowerCase()
  let pool = QUESTION_BANKS.python_ai

  if (/\b(oracle|sql|database|postgres|mysql|sqlite|plsql|dba)\b/i.test(key)) {
    pool = QUESTION_BANKS.database_sql
  } else if (/\b(next|react)\b/i.test(key)) {
    pool = QUESTION_BANKS.nextjs_react
  } else if (/\b(three|3d|webgl)\b/i.test(key)) {
    pool = QUESTION_BANKS.threejs_3d
  } else if (/\b(system design|distributed system|microservice)\b/i.test(key)) {
    pool = QUESTION_BANKS.system_design
  } else if (/\b(python|ai|llm|gpt)\b/i.test(key)) {
    pool = QUESTION_BANKS.python_ai
  } else {
    // Combine multiple technical pools for broad topics
    pool = [...QUESTION_BANKS.database_sql, ...QUESTION_BANKS.python_ai, ...QUESTION_BANKS.system_design]
  }

  // Shuffle the pool to ensure different questions every time
  const shuffledPool = shuffleArray(pool)
  const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length))

  // Shuffle options for each question so correctIndex changes randomly
  return selected.map((q) => {
    const originalCorrectOption = q.options[q.correctIndex]
    const shuffledOptions = shuffleArray(q.options)
    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption)

    return {
      question: q.question,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
      explanation: q.explanation,
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const topic: string = body.topic || "Python AI & LLMs"
    const context: string = body.context || ""

    const hasKey = !!process.env.OPENAI_API_KEY

    if (hasKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a Principal Software Architect and technical exam designer. Generate exactly 10 challenging, conceptual, real-world scenario multiple-choice questions testing practical depth. Avoid trivial trivia.",
          prompt: `Create 10 high-quality technical multiple-choice questions for: ${topic}
Curriculum Context: ${context}

Format strictly as JSON array:
[
  {
    "question": "Clear technical question...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief 1-sentence technical explanation"
  }
]`,
        })

        const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
        const parsed = JSON.parse(cleaned) as Question[]
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return NextResponse.json({ questions: parsed.slice(0, 10) })
        }
      } catch (e) {
        console.log("[AI Quiz Fallback to Smart Bank]", e)
      }
    }

    // Dynamic 10-Question Random Sampling Engine
    const randomizedQuestions = getRandomizedTechnicalQuiz(topic, 10)
    return NextResponse.json({ questions: randomizedQuestions })
  } catch (error) {
    console.error("[Quiz API Error]", error)
    const fallback = getRandomizedTechnicalQuiz("Python AI & LLMs", 10)
    return NextResponse.json({ questions: fallback })
  }
}
