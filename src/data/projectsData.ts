export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  problemStatement: string;
  solution: string;
  imageUrl: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "Complete" | "Beta" | "In Progress";
  completionPercentage: number;
  timeline: string;
  teamSize: "Solo" | string;
  repoUrl: string;
  liveUrl: string;
  features: string[];
  architecture: {
    client: string;
    server: string;
    database: string;
    auth: string;
  };
  metrics: {
    speed: string;
    commits: number;
    linesOfCode: string;
    repoSize: string;
    issuesSolved: number;
  };
  challenges: string;
  lessons: string;
  futurePlans: string[];
  isFeatured?: boolean;
}

export interface TechItem {
  name: string;
  category: string;
  icon: string;
  color: string;
  experienceYears: number;
  projectsCount: number;
  skillLevel: number; // percentage
  favoriteFeature: string;
  latestVersion: string;
  relatedTech: string[];
}

export const STATS = [
  { label: "Total Projects", value: "25+" },
  { label: "Technologies Used", value: "30+" },
  { label: "GitHub Repositories", value: "40+" },
  { label: "Years Learning", value: "3+" },
  { label: "APIs Built", value: "12+" },
  { label: "Full Stack Projects", value: "8+" },
  { label: "Open Source Contribs", value: "15+" }
];

export const CATEGORIES = [
  "All",
  "AI / Machine Learning",
  "Full Stack",
  "Backend",
  "Frontend",
  "Python",
  "Django",
  "React",
  "Next.js",
  "Android",
  "Data Science",
  "Automation",
  "Open Source",
  "Personal Projects",
  "Experimental"
];

export const TECHNOLOGIES: TechItem[] = [
  {
    name: "Python",
    category: "Languages",
    icon: "🐍",
    color: "from-blue-500 to-yellow-500",
    experienceYears: 3,
    projectsCount: 12,
    skillLevel: 95,
    favoriteFeature: "List comprehensions & rich ML ecosystem",
    latestVersion: "3.12.2",
    relatedTech: ["Django", "FastAPI", "NumPy", "TensorFlow"]
  },
  {
    name: "React",
    category: "Frontend",
    icon: "⚛",
    color: "from-cyan-400 to-blue-600",
    experienceYears: 2.5,
    projectsCount: 15,
    skillLevel: 92,
    favoriteFeature: "Custom Hooks & concurrent rendering scheduler",
    latestVersion: "19.0.0",
    relatedTech: ["Next.js", "TypeScript", "Tailwind CSS", "Redux"]
  },
  {
    name: "Next.js",
    category: "Frontend",
    icon: "▲",
    color: "from-neutral-800 to-black",
    experienceYears: 2,
    projectsCount: 8,
    skillLevel: 90,
    favoriteFeature: "App Router Server Components & incremental regeneration",
    latestVersion: "15.1.0",
    relatedTech: ["React", "TypeScript", "Vercel", "Tailwind CSS"]
  },
  {
    name: "HTML5",
    category: "Frontend",
    icon: "🌐",
    color: "from-orange-500 to-red-500",
    experienceYears: 3,
    projectsCount: 22,
    skillLevel: 98,
    favoriteFeature: "Semantic elements & native lazy loading",
    latestVersion: "Living Standard",
    relatedTech: ["CSS3", "JavaScript"]
  },
  {
    name: "CSS3",
    category: "Frontend",
    icon: "🎨",
    color: "from-blue-400 to-indigo-600",
    experienceYears: 3,
    projectsCount: 22,
    skillLevel: 95,
    favoriteFeature: "Custom Properties (CSS variables) & Grid layout",
    latestVersion: "Level 3/4",
    relatedTech: ["Tailwind CSS", "Sass"]
  },
  {
    name: "JavaScript",
    category: "Languages",
    icon: "🟨",
    color: "from-yellow-400 to-amber-500",
    experienceYears: 3,
    projectsCount: 20,
    skillLevel: 95,
    favoriteFeature: "Asynchronous generators & event loops",
    latestVersion: "ES2024",
    relatedTech: ["TypeScript", "Node.js", "React"]
  },
  {
    name: "TypeScript",
    category: "Languages",
    icon: "🔷",
    color: "from-blue-600 to-sky-700",
    experienceYears: 2,
    projectsCount: 14,
    skillLevel: 90,
    favoriteFeature: "Utility types, advanced mapped types, and generics",
    latestVersion: "5.4.5",
    relatedTech: ["React", "Next.js", "Node.js"]
  },
  {
    name: "Node.js",
    category: "Backend",
    icon: "🟢",
    color: "from-green-500 to-emerald-700",
    experienceYears: 2.5,
    projectsCount: 11,
    skillLevel: 88,
    favoriteFeature: "Asynchronous non-blocking file streaming API",
    latestVersion: "21.7.1",
    relatedTech: ["Express", "MongoDB", "TypeScript"]
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: "🍃",
    color: "from-green-400 to-emerald-600",
    experienceYears: 2,
    projectsCount: 7,
    skillLevel: 85,
    favoriteFeature: "Aggregation pipelines & flexible document nesting",
    latestVersion: "7.0.5",
    relatedTech: ["Node.js", "Express", "Mongoose"]
  },
  {
    name: "PostgreSQL",
    category: "Database",
    icon: "🐘",
    color: "from-blue-700 to-cyan-800",
    experienceYears: 2,
    projectsCount: 9,
    skillLevel: 89,
    favoriteFeature: "JSONB indexing & robust relational constraint safety",
    latestVersion: "16.2",
    relatedTech: ["Django", "Next.js", "Prisma"]
  },
  {
    name: "MySQL",
    category: "Database",
    icon: "🐬",
    color: "from-sky-500 to-indigo-600",
    experienceYears: 2.5,
    projectsCount: 8,
    skillLevel: 87,
    favoriteFeature: "Prepared statements & transaction safety grids",
    latestVersion: "8.3.0",
    relatedTech: ["PHP", "Express", "Java"]
  },
  {
    name: "Firebase",
    category: "Cloud",
    icon: "🔥",
    color: "from-amber-500 to-orange-600",
    experienceYears: 2,
    projectsCount: 10,
    skillLevel: 91,
    favoriteFeature: "Realtime subscriptions & offline storage persistence",
    latestVersion: "10.8.1",
    relatedTech: ["React", "Authentication", "Firestore Rules"]
  },
  {
    name: "Django",
    category: "Backend",
    icon: "🎯",
    color: "from-emerald-800 to-green-900",
    experienceYears: 2,
    projectsCount: 6,
    skillLevel: 90,
    favoriteFeature: "Built-in ORM with rapid admin site integration",
    latestVersion: "5.0.3",
    relatedTech: ["Python", "Django REST Framework", "PostgreSQL"]
  },
  {
    name: "Django REST Framework",
    category: "Backend",
    icon: "🚀",
    color: "from-red-700 to-rose-900",
    experienceYears: 2,
    projectsCount: 5,
    skillLevel: 88,
    favoriteFeature: "Dynamic model serializers & pluggable permission checks",
    latestVersion: "3.15.1",
    relatedTech: ["Python", "Django", "PostgreSQL"]
  },
  {
    name: "Docker",
    category: "Tools",
    icon: "🐳",
    color: "from-blue-500 to-sky-600",
    experienceYears: 1.5,
    projectsCount: 6,
    skillLevel: 80,
    favoriteFeature: "Multi-stage builder modules to slim image footprints",
    latestVersion: "25.0.3",
    relatedTech: ["Linux", "AWS", "Nginx"]
  },
  {
    name: "AWS",
    category: "Cloud",
    icon: "☁",
    color: "from-amber-600 to-yellow-600",
    experienceYears: 1.5,
    projectsCount: 4,
    skillLevel: 78,
    favoriteFeature: "AWS Lambda serverless auto-scaling micro-triggers",
    latestVersion: "Cloud SDK v3",
    relatedTech: ["Docker", "Linux", "S3"]
  },
  {
    name: "Linux",
    category: "Tools",
    icon: "🐧",
    color: "from-neutral-700 to-neutral-900",
    experienceYears: 3,
    projectsCount: 15,
    skillLevel: 86,
    favoriteFeature: "Bash scripting pipelines with clean stream commands",
    latestVersion: "Kernel 6.8",
    relatedTech: ["Docker", "Git", "VS Code"]
  },
  {
    name: "Postman",
    category: "Tools",
    icon: "📬",
    color: "from-orange-500 to-red-600",
    experienceYears: 2.5,
    projectsCount: 20,
    skillLevel: 92,
    favoriteFeature: "Pre-request test scripts and team mock environments",
    latestVersion: "10.24.0",
    relatedTech: ["REST APIs", "FastAPI", "Express"]
  },
  {
    name: "GitHub",
    category: "Tools",
    icon: "🐙",
    color: "from-neutral-800 to-neutral-900",
    experienceYears: 3,
    projectsCount: 35,
    skillLevel: 94,
    favoriteFeature: "GitHub Actions CI/CD workflows and page deployments",
    latestVersion: "Enterprise",
    relatedTech: ["Git", "Linux", "Docker"]
  },
  {
    name: "Java",
    category: "Languages",
    icon: "☕",
    color: "from-red-500 to-orange-600",
    experienceYears: 3,
    projectsCount: 10,
    skillLevel: 92,
    favoriteFeature: "Strong static typing & robust concurrent collections API",
    latestVersion: "21 LTS",
    relatedTech: ["Spring Boot", "Android SDK", "Kotlin", "PostgreSQL"]
  },
  {
    name: "Kotlin",
    category: "Languages",
    icon: "📱",
    color: "from-indigo-500 to-purple-600",
    experienceYears: 2,
    projectsCount: 6,
    skillLevel: 88,
    favoriteFeature: "Null safety, first-class properties, and coroutines",
    latestVersion: "1.9.22",
    relatedTech: ["Android SDK", "Jetpack Compose", "Java", "SQLite"]
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    icon: "🌀",
    color: "from-teal-400 to-cyan-500",
    experienceYears: 2.5,
    projectsCount: 18,
    skillLevel: 94,
    favoriteFeature: "Utility-first design paradigm & modern JIT scaffolding engine",
    latestVersion: "4.0.0",
    relatedTech: ["React", "Next.js", "HTML5", "CSS3"]
  },
  {
    name: "FastAPI",
    category: "Backend",
    icon: "⚡",
    color: "from-teal-500 to-emerald-600",
    experienceYears: 2,
    projectsCount: 7,
    skillLevel: 91,
    favoriteFeature: "Asynchronous endpoint runners and Pydantic validation structures",
    latestVersion: "0.110.0",
    relatedTech: ["Python", "Docker", "PostgreSQL", "Pydantic"]
  },
  {
    name: "SQLite",
    category: "Database",
    icon: "💾",
    color: "from-blue-600 to-indigo-800",
    experienceYears: 3,
    projectsCount: 14,
    skillLevel: 90,
    favoriteFeature: "Serverless zero-configuration embedded transactional storage engine",
    latestVersion: "3.45.1",
    relatedTech: ["Django", "Android SDK", "Python", "Kotlin"]
  }
];

export const TIMELINE_ITEMS = [
  {
    year: "2023",
    technologies: ["Python", "HTML5", "CSS3", "Git", "SQLite", "Basic Algorithms"],
    milestone: "Built solid coding foundations. Wrote automation scripts and designed basic static portfolios."
  },
  {
    year: "2024",
    technologies: ["JavaScript", "React", "Django", "SQL", "Bootstrap", "REST API", "Tailwind CSS"],
    milestone: "Transitioned to full-stack development. Engineered dynamic client dashboards and custom database schemas."
  },
  {
    year: "2025",
    technologies: ["Next.js", "Docker", "PostgreSQL", "Machine Learning", "TensorFlow", "Cloud Deployment", "Mongoose"],
    milestone: "Mastered containerization, advanced React SSR models, serverless functions, and basic neural network training."
  },
  {
    year: "2026",
    technologies: ["Artificial Intelligence", "LLMs", "RAG Systems", "Vector Databases", "MLOps", "Advanced System Design"],
    milestone: "Designing scalable cloud architecture patterns, caching middleware, real-time message brokers, and secure RESTful systems."
  }
];

export const ECOSYSTEM_GROUPS = [
  {
    title: "Programming Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "SQL"]
  },
  {
    title: "Frontend Engineering",
    items: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"]
  },
  {
    title: "Backend & APIs",
    items: ["Django", "Django REST Framework", "Flask", "Authentication", "REST APIs"]
  },
  {
    title: "Data Storage",
    items: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"]
  },
  {
    title: "Cloud & Ops",
    items: ["AWS", "Vercel", "Railway", "Render", "Firebase"]
  },
  {
    title: "AI & Data Science",
    items: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "Matplotlib", "OpenCV"]
  },
  {
    title: "Developer Tools",
    items: ["Git", "GitHub", "Docker", "Linux", "VS Code", "Postman", "Figma"]
  }
];

export const PROJECTS_DATA: ProjectDetail[] = [
  {
    id: "academic-planner",
    title: "Smart Course Planner",
    category: "Full Stack",
    description: "A user-friendly planner for CSE students to map out semesters, check dynamic course requirements, and balance prerequisites using custom-built topological sort graph structures.",
    longDescription: "The Smart Course Planner is designed to solve the critical student planning challenge of academic prerequisite tracking. By mapping out courses as directed acyclic graphs (DAGs), students can interactively design their degree pathway. The system auto-calculates dependencies on the fly, alerts them to cycle dependency traps, and displays estimated workloads per semester.",
    problemStatement: "CSE students often face bottleneck semester delays due to strict prerequisite sequences. Finding optimal paths through complex academic catalogs manually is highly error-prone.",
    solution: "We modeled the academic catalog as a graph and ran a topological sorting engine. The system evaluates a student's passed history and presents viable semester paths interactively.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    tags: ["React", "TypeScript", "Tailwind CSS", "College Projects", "Data Science"],
    difficulty: "Hard",
    status: "Complete",
    completionPercentage: 100,
    timeline: "3 Months (Fall 2024)",
    teamSize: "Solo",
    repoUrl: "https://github.com",
    liveUrl: "https://google.com",
    features: [
      "Dynamic topological sorting engine",
      "Semesters and prerequisite drag-and-drop mapping",
      "Interactive graph path highlighted in yellow on hover",
      "Real-time bottleneck credit hour workload indicator",
      "Preloaded official university department curriculum sheets"
    ],
    architecture: {
      client: "React 19, Tailwind CSS v4, Lucide Icons",
      server: "Node.js with Express and local file caches",
      database: "PostgreSQL with optimized schema indexes",
      auth: "Custom state cookies with safe role keys"
    },
    metrics: {
      speed: "0.8ms sort response",
      commits: 42,
      linesOfCode: "4.5k lines",
      repoSize: "12.4 MB",
      issuesSolved: 14
    },
    challenges: "Handling graph cyclic reference errors when users accidentally added reciprocal prerequisite pairings. Solved by writing an optimized cycle-detection algorithm (Tarjan's strongly connected components method) before committing nodes.",
    lessons: "Acquired deep practical mastery in mapping complex real-world data constraints as abstract computer science graph data structures.",
    futurePlans: [
      "Integrate AI to auto-recommend classes based on desired industry career paths",
      "Support multi-student template collaboration panels"
    ],
    isFeatured: true
  },
  {
    id: "algo-visualizer",
    title: "Interactive Algo Sandbox",
    category: "Frontend",
    description: "An interactive web environment visualizing search, sorting, and tree traversal algorithms, complete with speed control, state inspection, and live sliders.",
    longDescription: "The Interactive Algo Sandbox brings abstract algorithms to life with dynamic rendering and step-by-step state inspection. Written with vanilla HTML5 canvas wrappers inside React, the visualizer showcases complex tasks like Dijkstra's pathfinding, Red-Black tree rebalancing, and sorting sweeps in high-fps loops.",
    problemStatement: "Students struggle to grasp O(N log N) algorithm execution loops simply by reading textbooks or viewing console arrays. Visual tracking is key.",
    solution: "Designed a rendering stage that halts execution on state change triggers, drawing the array comparison blocks dynamically with customizable framer rates.",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop",
    tags: ["React", "HTML5", "CSS3", "JavaScript", "Experimental"],
    difficulty: "Medium",
    status: "Complete",
    completionPercentage: 100,
    timeline: "2 Months (Summer 2024)",
    teamSize: "Solo",
    repoUrl: "https://github.com",
    liveUrl: "https://google.com",
    features: [
      "Real-time sorting step slider and speed knobs",
      "Array value randomized array shuffling with sound synths",
      "Interactive maze creator for pathfinding demonstrations",
      "Visual comparison panel showing QuickSort vs MergeSort",
      "Detailed tree node balancing animations with vector anchors"
    ],
    architecture: {
      client: "React, Tailwind, HTML5 Canvas, SVG Web APIs",
      server: "None (Fully client-side, offline static hosting)",
      database: "Local storage configuration persistence",
      auth: "None"
    },
    metrics: {
      speed: "90+ FPS canvas paint",
      commits: 28,
      linesOfCode: "3.1k lines",
      repoSize: "4.2 MB",
      issuesSolved: 8
    },
    challenges: "Synchronizing state updates with visual animation frames without lagging the browser tab. Overcame this by decoupling the algorithm state calculator from the rendering thread, tracking states in a buffer.",
    lessons: "Discovered the power of requestAnimationFrame web engines and micro-interactions in educational UI/UX design.",
    futurePlans: [
      "Add 3D node meshes using lightweight Three.js controls",
      "Include a code compiler playground to test custom student scripts"
    ],
    isFeatured: true
  },
  {
    id: "secure-express-api",
    title: "High-Performance API Gateway",
    category: "Backend",
    description: "A fast, production-ready Express API serving as a secure gateway, with token limits, payload filters, and dynamic system diagnostic tools.",
    longDescription: "A robust back-end server microservice designed to safely process high-volume requests. Features multi-tier rate limiting, payload security filters to guard against SQL injections, and a real-time health diagnostic router tracking telemetry.",
    problemStatement: "Exposing databases and core microservices directly to client code creates severe vulnerability vectors and load-shedding risks.",
    solution: "Set up a proxy controller filtering client payloads, caching repetitive database queries, and utilizing security-standard HTTP headers.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    tags: ["Python", "Django", "Django REST Framework", "Backend"],
    difficulty: "Expert",
    status: "Beta",
    completionPercentage: 90,
    timeline: "4 Months (Winter 2025)",
    teamSize: "Solo",
    repoUrl: "https://github.com",
    liveUrl: "https://google.com",
    features: [
      "Custom token-bucket algorithm rate limiter",
      "Security header profiles via Helmet and CORS setups",
      "Detailed automated logger capturing server telemetry",
      "Caching layer returning database results instantly",
      "Database pool scaling with automated health flags"
    ],
    architecture: {
      client: "Minimalist diagnostics interface styled with Tailwind",
      server: "Express Node.js, Cluster Mode enabled",
      database: "Redis Cache, PostgreSQL database pool",
      auth: "JSON Web Tokens (JWT) inside HTTP-only cookies"
    },
    metrics: {
      speed: "4.1ms average API turn",
      commits: 64,
      linesOfCode: "5.8k lines",
      repoSize: "18.1 MB",
      issuesSolved: 23
    },
    challenges: "Syncing real-time statistics without impacting API throughput under heavy traffic spikes. Handled by executing logs asynchronously on detached worker threads.",
    lessons: "Deepened engineering expertise in horizontal clustering, cache tuning, and securing APIs from distributed exploits.",
    futurePlans: [
      "Incorporate robust GraphQL query complexity calculations",
      "Implement gRPC message streaming channels"
    ],
    isFeatured: true
  },
  {
    id: "smart-task-scheduler",
    title: "Django Task Coordinator",
    category: "Automation",
    description: "An automated queue manager using Django, Celery, and SQLite to schedule system scripts, email triggers, and recurring database cleaning.",
    longDescription: "A powerful scheduling platform for developer scripts. Built on Django, it coordinates asynchronous microtasks, routes alert reports, and manages complex database cleaning routines with real-time status indicators.",
    problemStatement: "Running bulky system audits and email alerts synchronously delays response times for active web client connections.",
    solution: "Asynchronously dispatched tasks into a processing queue, keeping the web server thin, fast, and constantly available.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    tags: ["Python", "Django", "Automation", "Personal Projects"],
    difficulty: "Medium",
    status: "Complete",
    completionPercentage: 100,
    timeline: "1 Month (Spring 2025)",
    teamSize: "Solo",
    repoUrl: "https://github.com",
    liveUrl: "https://google.com",
    features: [
      "Dynamic task execution calendars with scheduling dashboards",
      "Automated system reports emailed directly to managers",
      "Failed task automated retry with exponential decay intervals",
      "Detailed visual run audits charting database growth",
      "Clean command line interface for developer tasks"
    ],
    architecture: {
      client: "Django templates paired with modern Tailwind CSS utilities",
      server: "Django Core and Celery Task Runner",
      database: "SQLite database instance with concurrent write locks",
      auth: "Django standard sessions with secure crypt hashes"
    },
    metrics: {
      speed: "12ms task dispatch",
      commits: 15,
      linesOfCode: "1.8k lines",
      repoSize: "3.6 MB",
      issuesSolved: 4
    },
    challenges: "Handling database locking during high-frequency parallel write requests. Solved by fine-tuning write queues and optimizing transaction contexts.",
    lessons: "Gained proficiency in coordinating background services and processing pipelines safely.",
    futurePlans: [
      "Deploy onto AWS ECS with container auto-scaling triggers",
      "Integrate web hook push-alerts directly to developer chats"
    ]
  },
  {
    id: "android-fitness-track",
    title: "Android Activity Hub",
    category: "Android",
    description: "A native Kotlin application to monitor steps, water consumption, and sleep cycles, integrating local databases and high-precision sensor loops.",
    longDescription: "A modern, fluid native Android application leveraging sensor suites and local databases to map out athletic wellness. Users track steps, log hydration, and review detailed history calendars directly on-device.",
    problemStatement: "Most health trackers leak critical data to centralized clouds and drain device batteries with poor background processing loops.",
    solution: "Engineered a low-power foreground loop utilizing local Android SQLite, storing all personal telemetry strictly on-device.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    tags: ["Android", "Kotlin", "Personal Projects"],
    difficulty: "Hard",
    status: "In Progress",
    completionPercentage: 75,
    timeline: "Currently developing (Started May 2026)",
    teamSize: "Solo",
    repoUrl: "https://github.com",
    liveUrl: "https://google.com",
    features: [
      "Low-overhead accelerometer step detection calculations",
      "Clean, responsive Room Database for local profile history",
      "Material Design 3 custom widgets and progress curves",
      "Localized system notification alarms for workout alerts",
      "Encrypted export tools for private local JSON logs"
    ],
    architecture: {
      client: "Android Native XML and Jetpack Compose bindings",
      server: "None (Localized on-device architecture)",
      database: "Room SQLite Local Database with SQL queries",
      auth: "Biometric fingerprint device secure key check"
    },
    metrics: {
      speed: "Instant local load",
      commits: 34,
      linesOfCode: "6.2k lines",
      repoSize: "16.8 MB",
      issuesSolved: 19
    },
    challenges: "Standardizing low-overhead sensor updates across different Android device chipsets. Solved by writing an adaptable accelerometer noise-filter algorithm.",
    lessons: "Understood the complexities of low-power mobile thread scheduling and native device sensor permissions.",
    futurePlans: [
      "Implement companion smartwatch Bluetooth connectivity",
      "Provide secure local mesh synchronization with local desktop clients"
    ]
  }
];
