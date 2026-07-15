export interface CertificateDetail {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  skills: string[];
  imageUrl: string; // certificate thumbnail
  verificationUrl: string;
  status: "Verified" | "Expired" | "Pending";
  category: "Languages" | "Backend" | "Frontend" | "Cloud & Ops" | "Databases" | "AI & Data Science" | "Tools & Security";
}

export interface AchievementDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Competition" | "Open Source" | "Academic" | "Community";
  impact: string;
  iconName: string;
}

export interface HackathonDetail {
  id: string;
  name: string;
  theme: string;
  teamSize: "Solo" | "Team of 3" | "Team of 4";
  technologies: string[];
  projectBuilt: string;
  position: string;
  certificateUrl: string;
  demoUrl: string;
  repoUrl: string;
}

export interface AwardDetail {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface CodingProfile {
  name: string;
  logo: string;
  url: string;
  metrics: { [key: string]: string | number };
  badgeText?: string;
  accentColor: string;
}

export const CREDENTIAL_STATS = [
  { label: "Certifications", value: "15+" },
  { label: "Projects Completed", value: "25+" },
  { label: "Tech Skills", value: "30+" },
  { label: "Hackathons", value: "5+" },
  { label: "Problems Solved", value: "850+" },
  { label: "GitHub Commits", value: "3.4k+" },
  { label: "Workshops", value: "8+" },
  { label: "Completed Courses", value: "12+" }
];

export const CERTIFICATES_DATA: CertificateDetail[] = [
  {
    id: "cert-python",
    title: "Python Programming & Scripting",
    issuer: "Google Career Certificates",
    date: "May 2023",
    credentialId: "GCC-PY-88491A",
    skills: ["Python", "Scripting", "Automation", "Data Structures"],
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://coursera.org/verify",
    status: "Verified",
    category: "Languages"
  },
  {
    id: "cert-java",
    title: "Java Programming Masterclass",
    issuer: "Udemy Professional",
    date: "August 2023",
    credentialId: "UD-JV-229410L",
    skills: ["Java OOP", "Multithreading", "Data Streams", "Swing"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://udemy.com",
    status: "Verified",
    category: "Languages"
  },
  {
    id: "cert-django",
    title: "Django Professional Development",
    issuer: "Django Software Foundation",
    date: "April 2024",
    credentialId: "DSF-DJ-30249K",
    skills: ["Django REST", "ORMs", "Routing APIs", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://djangoproject.com",
    status: "Verified",
    category: "Backend"
  },
  {
    id: "cert-fullstack",
    title: "Full Stack Web Engineering",
    issuer: "Meta Academy",
    date: "November 2024",
    credentialId: "MET-FS-99120Z",
    skills: ["React", "Node.js", "Express", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://coursera.org",
    status: "Verified",
    category: "Frontend"
  },
  {
    id: "cert-ml",
    title: "Machine Learning Fundamentals",
    issuer: "DeepLearning.AI",
    date: "February 2025",
    credentialId: "DLAI-ML-41924B",
    skills: ["Scikit-learn", "Regression", "Gradient Descent", "Supervised Learning"],
    imageUrl: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://deeplearning.ai",
    status: "Verified",
    category: "AI & Data Science"
  },
  {
    id: "cert-ai",
    title: "Artificial Intelligence Specialist",
    issuer: "IBM Technical Academy",
    date: "January 2026",
    credentialId: "IBM-AI-77291F",
    skills: ["LLMs", "TensorFlow", "Neural Networks", "NLP"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://ibm.com/verify",
    status: "Verified",
    category: "AI & Data Science"
  },
  {
    id: "cert-sql",
    title: "SQL & Relational Databases",
    issuer: "Oracle Database Academy",
    date: "December 2024",
    credentialId: "ORA-SQL-11928N",
    skills: ["PostgreSQL", "MySQL", "DB Tuning", "Stored Procedures"],
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://oracle.com/verify",
    status: "Verified",
    category: "Databases"
  },
  {
    id: "cert-docker",
    title: "Docker Basics & Containerization",
    issuer: "Docker Inc.",
    date: "June 2025",
    credentialId: "DK-BAS-88210X",
    skills: ["Dockerfiles", "Multi-stage Builds", "Compose Nodes", "Registries"],
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://docker.com/verify",
    status: "Verified",
    category: "Cloud & Ops"
  },
  {
    id: "cert-cloud",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services (AWS)",
    date: "September 2025",
    credentialId: "AWS-CLF-391024",
    skills: ["AWS Lambda", "EC2 Instances", "S3 Storage", "IAM Governance"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://aws.amazon.com/verify",
    status: "Verified",
    category: "Cloud & Ops"
  },
  {
    id: "cert-api",
    title: "REST API & Gateway Development",
    issuer: "Postman Professional",
    date: "March 2025",
    credentialId: "PM-REST-55102G",
    skills: ["API Design", "Rate Limiting", "Bearer Tokens", "Testing Suites"],
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://postman.com",
    status: "Verified",
    category: "Backend"
  },
  {
    id: "cert-cyber",
    title: "Cybersecurity Fundamentals",
    issuer: "Cisco Networking Academy",
    date: "October 2025",
    credentialId: "CIS-SEC-99014M",
    skills: ["Penetration Testing", "Encryption", "OWASP Rules", "Firewalls"],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://cisco.com",
    status: "Verified",
    category: "Tools & Security"
  },
  {
    id: "cert-linux",
    title: "Linux System Essentials",
    issuer: "Linux Foundation",
    date: "July 2023",
    credentialId: "LF-LIN-22019Q",
    skills: ["Shell Scripting", "System Administration", "Cron Pipelines", "Streams"],
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=600&auto=format&fit=crop",
    verificationUrl: "https://linuxfoundation.org",
    status: "Verified",
    category: "Tools & Security"
  }
];

export const TIMELINE_LEARNING = [
  {
    year: "2023",
    skills: ["Python", "HTML5", "CSS3", "Git", "SQLite", "Linux Basics"],
    milestone: "Formed core logical foundations. Acquired Linux shell operations, clean scripting structures, and responsive CSS grids."
  },
  {
    year: "2024",
    skills: ["JavaScript", "React", "Django Core", "REST APIs", "SQL", "Bootstrap"],
    milestone: "Transitioned to complex state managers. Engineered customizable templates, secure REST interfaces, and robust schema migrations."
  },
  {
    year: "2025",
    skills: ["Next.js", "Docker", "PostgreSQL", "AWS Services", "Machine Learning", "Scikit-learn"],
    milestone: "Mastered containerization, serverless clouds, advanced SSR models, and basic supervised machine learning loops."
  },
  {
    year: "2026",
    skills: ["Artificial Intelligence", "Large Language Models", "Vector Databases", "MLOps", "System Design"],
    milestone: "Developing production-grade enterprise API gateways, neural pipelines, caching controllers, and scalable software systems."
  }
];

export const ACHIEVEMENTS_DATA: AchievementDetail[] = [
  {
    id: "ach-1",
    title: "Hackathon Champion",
    description: "Led a team of 3 CSE students to win the Best Software Solution track, creating a functional academic planner with topological prerequisite sorting.",
    date: "November 2024",
    category: "Competition",
    impact: "1st Place out of 40 competing software engineering squads",
    iconName: "trophy"
  },
  {
    id: "ach-2",
    title: "Open Source Contributor",
    description: "Contributed modular Django routing and caching micro-checkers to public software repositories, resolving 8 issues.",
    date: "Ongoing",
    category: "Open Source",
    impact: "Merged 12 Pull Requests into major backend framework modules",
    iconName: "git-merge"
  },
  {
    id: "ach-3",
    title: "Lead Technical Coordinator",
    description: "Successfully organized and coordinated a campus-wide algorithm hackathon, drafting problem sets and managing live test suites.",
    date: "March 2025",
    category: "Community",
    impact: "Supported 250+ student coders across 5 departments",
    iconName: "users"
  },
  {
    id: "ach-4",
    title: "Research Assistant: Dynamic RAG Models",
    description: "Partnered with university faculty to develop localized RAG systems mapping university syllabi against professional job descriptions.",
    date: "February 2026",
    category: "Academic",
    impact: "Published diagnostic blueprints showing 92% retrieval rate on catalog data",
    iconName: "book-open"
  }
];

export const CODING_PROFILES: CodingProfile[] = [
  {
    name: "GitHub",
    logo: "github",
    url: "https://github.com",
    metrics: {
      "Total Repositories": 42,
      "Contributions (YTD)": "3,412",
      "Followers": "280+",
      "Repository Stars": 124
    },
    badgeText: "Enterprise Node",
    accentColor: "border-zinc-700 text-zinc-300"
  },
  {
    name: "LeetCode",
    logo: "code",
    url: "https://leetcode.com",
    metrics: {
      "Problems Solved": "542 / 800+",
      "Contest Rating": "1,780+",
      "Global Rank": "Top 8%",
      "Badges Earned": 6
    },
    badgeText: "Knight Tracker",
    accentColor: "border-amber-600/30 text-amber-500"
  },
  {
    name: "HackerRank",
    logo: "star",
    url: "https://hackerrank.com",
    metrics: {
      "Problem Stars": "5-Stars (Python & Java)",
      "Certificates Earned": 3,
      "Algorithmic Rank": "Top 2%",
      "Languages Certified": 4
    },
    badgeText: "Elite Certified",
    accentColor: "border-green-600/30 text-green-500"
  },
  {
    name: "CodeChef",
    logo: "award",
    url: "https://codechef.com",
    metrics: {
      "Contest Rating": "1,822 (4-Star)",
      "Highest Rating": "1,894",
      "Contests Attempted": 22,
      "Problem Sweeps": "140+"
    },
    badgeText: "4-Star Coder",
    accentColor: "border-indigo-600/30 text-indigo-500"
  },
  {
    name: "Codeforces",
    logo: "activity",
    url: "https://codeforces.com",
    metrics: {
      "Current Rating": "1,540",
      "Global Rank": "Expert",
      "Contests Done": 14,
      "Max Rating": "1,610"
    },
    badgeText: "Expert Level",
    accentColor: "border-cyan-600/30 text-cyan-400"
  }
];

export const HACKATHONS_DATA: HackathonDetail[] = [
  {
    id: "hack-1",
    name: "Apex Innovation Hackathon 2024",
    theme: "Academic Efficiency & Student Schedulers",
    teamSize: "Team of 3",
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    projectBuilt: "Smart Course Planner (Directed Acyclic Graph solver)",
    position: "1st Place Winner // Grand Prize Award",
    certificateUrl: "https://apex-hack.com/verify",
    demoUrl: "https://google.com",
    repoUrl: "https://github.com"
  },
  {
    id: "hack-2",
    name: "Global AI Hack 2025",
    theme: "AI Assistant Integration & Prompt Engineering",
    teamSize: "Team of 4",
    technologies: ["Next.js", "FastAPI", "VectorDB", "Gemini API"],
    projectBuilt: "Automated Student Catalog Assistant & RAG system",
    position: "Top 5 Finalist // Best Technical Execution",
    certificateUrl: "https://globalai.com",
    demoUrl: "https://google.com",
    repoUrl: "https://github.com"
  },
  {
    id: "hack-3",
    name: "National Collegiate Coding Arena 2024",
    theme: "High Performance Web Gateways & Algorithmic Security",
    teamSize: "Solo",
    technologies: ["Node.js", "Express", "Docker", "Redis"],
    projectBuilt: "API Gateway with Multi-tier Token-bucket Rate Limiting",
    position: "Special Recognition for Code Optimization",
    certificateUrl: "https://collegarena.com",
    demoUrl: "https://google.com",
    repoUrl: "https://github.com"
  }
];

export const AWARDS_DATA: AwardDetail[] = [
  {
    id: "aw-1",
    title: "Best CSE Software Project Award",
    issuer: "Dean of Computer Science Engineering Department",
    date: "December 2024",
    description: "Awarded to the creator of the topological Smart Course Planner, recognizing elite user design and algorithm innovation."
  },
  {
    id: "aw-2",
    title: "Innovation & Technology Excellence Award",
    issuer: "State Engineering Congress",
    date: "May 2025",
    description: "Recognized outstanding software engineering concepts, performance optimization, and local data persistence models."
  },
  {
    id: "aw-3",
    title: "Academic Honor Roll & Top Performer",
    issuer: "University Chancellor's Office",
    date: "Ongoing (2023-2026)",
    description: "Consistently maintained high-ranking academic excellence, algorithmic development, and student community mentorship."
  }
];
