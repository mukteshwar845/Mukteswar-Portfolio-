import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Award, 
  Calendar, 
  ExternalLink, 
  Code, 
  GitMerge, 
  Users, 
  BookOpen, 
  Star, 
  Activity, 
  Github, 
  Shield, 
  ChevronRight, 
  Zap, 
  Target, 
  Flame, 
  Database, 
  Terminal, 
  Cpu, 
  Layers, 
  Sparkles, 
  Server, 
  Check, 
  HelpCircle, 
  Loader2, 
  RefreshCw,
  Search,
  CheckCircle2,
  Bookmark,
  Hourglass,
  BadgeAlert,
  ArrowRight
} from "lucide-react";
import { getSyncedCertificates } from "../lib/syncEngine";
import { CertificateDetail } from "../data/credentialsData";

// Expanded Achievement representation matching standard CSE credentials
interface PortfolioAchievement {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  problemSolved: string;
  impact: string;
  date: string;
  organization: string;
  category: "Hackathons" | "Coding Competitions" | "Projects" | "Open Source" | "GitHub" | "Leadership" | "Community" | "Research" | "Academic" | "Awards";
  technologies: string[];
  credentialId?: string;
  verificationUrl?: string;
  image: string;
  achievementLevel: "Elite" | "Expert" | "Advanced" | "Highly Commended";
  status: "Completed" | "Ongoing" | "Verified";
  links?: {
    github?: string;
    live?: string;
  };
}

const NEW_ACHIEVEMENTS_DATA: PortfolioAchievement[] = [
  {
    id: "featured-1",
    title: "Apex Innovation Hackathon Grand Prize",
    description: "Led a team of computer science engineers to develop the Smart Course Planner, a topological graph-based scheduling engine resolving prerequisite conflicts in real-time.",
    longDescription: "Engineered an intelligent Directed Acyclic Graph (DAG) workspace utilizing topological sort algorithms to prevent students from scheduling courses before meeting prerequisite benchmarks. Secured first-place overall grand prize after an exhaustive 48-hour development sprint.",
    problemSolved: "Manual academic prerequisite tracking was highly error-prone, resulting in students failing to register for required sequential modules due to complex dependencies.",
    impact: "First-place champion award from 40+ engineering cohorts; adopted by local student unions for syllabus visualization.",
    date: "November 2024",
    organization: "Apex CSE Association",
    category: "Hackathons",
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "PostgreSQL", "D3.js"],
    credentialId: "APX-HACK-2024-001",
    verificationUrl: "https://apex-hack.com/verify",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Elite",
    status: "Verified",
    links: {
      github: "https://github.com/mukteshwar845",
      live: "https://apex-hack.com"
    }
  },
  {
    id: "ach-ai-rag",
    title: "Research Assistant: Dynamic Syllabus RAG Model",
    description: "Partnered with CSE faculty to design a semantic vector retrieval model mapping university lecture transcripts against modern technical job postings.",
    longDescription: "Co-authored code structures implementing cosine similarity metrics and OpenAI/Gemini embeddings to parse student performance logs against active skill vacancies, revealing immediate curricular holes.",
    problemSolved: "Traditional university computer science syllabi fail to align with real-time requirements, leading to a gap in job-readiness.",
    impact: "Successfully mapped 12 curricular paths; demonstrated a 92% semantic accuracy index verified by faculty.",
    date: "February 2026",
    organization: "University CSE Department",
    category: "Research",
    technologies: ["Python", "FastAPI", "VectorDB", "Gemini SDK", "Scikit-learn"],
    credentialId: "RES-RAG-2026-042",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Expert",
    status: "Completed",
    links: {
      github: "https://github.com/mukteshwar845"
    }
  },
  {
    id: "ach-django-pr",
    title: "Django Core Routing Contributor",
    description: "Contributed specialized route cache invalidators and mid-tier payload filters to community Django repositories.",
    longDescription: "Analyzed memory consumption profiles in routing middleware and drafted patches to optimize route evaluation loops under high concurrency. Successfully merged several performance-focused Pull Requests.",
    problemSolved: "Nested route evaluations inside large application routers caused unnecessary thread lockups under parallel requests.",
    impact: "Merged 12 key patches; reduced routing CPU footprints by up to 8% in active testing frameworks.",
    date: "Ongoing",
    organization: "Open Source Community",
    category: "Open Source",
    technologies: ["Python", "Django", "Git", "Docker", "PyTest"],
    verificationUrl: "https://github.com",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Elite",
    status: "Verified",
    links: {
      github: "https://github.com/mukteshwar845"
    }
  },
  {
    id: "ach-api-gateway",
    title: "National Coding Arena Rate-Limiting Engine",
    description: "Designed a multi-tier token-bucket rate limiter for a distributed API gateway under extreme simulation loads.",
    longDescription: "Constructed an Express-based gateway proxy wrapping containerized microservices, utilizing sliding-window Redis cache states to protect internal clusters from concurrent DDoS simulations.",
    problemSolved: "Server nodes frequently crashed during collegiate programming competitions because of unthrottled submission webhooks.",
    impact: "Special Recognition for code optimization; handled 10,000 requests per minute with 0.02% error rate.",
    date: "March 2024",
    organization: "Collegiate Programming Arena",
    category: "Coding Competitions",
    technologies: ["Node.js", "Express", "Redis", "Docker", "Frama-C"],
    credentialId: "CCA-SEC-4412",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Expert",
    status: "Completed",
    links: {
      github: "https://github.com/mukteshwar845"
    }
  },
  {
    id: "ach-tech-lead",
    title: "Lead Technical Coordinator & Organizer",
    description: "Successfully organized and coordinated a campus-wide computer science sprint, drafting problem sets and managing live test suites.",
    longDescription: "Led the academic council of 15 student developers to build a secure coding sand-box environment for grading student submissions. Wrote automated mock unit tests and validated results securely.",
    problemSolved: "Collegiate hackathons lacked a standardized, secure sandbox for compiling submissions, causing long grading backlogs.",
    impact: "Handled 250+ student coders across 5 engineering departments; reduced assessment delay from 4 hours to real-time.",
    date: "March 2025",
    organization: "State Technical Council",
    category: "Leadership",
    technologies: ["Python", "Docker Containers", "Shell Scripting", "React"],
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Expert",
    status: "Completed"
  },
  {
    id: "ach-peer-mentor",
    title: "CSE Peer Instructor & Educator",
    description: "Volunteered as a peer mentor, delivering weekly structured workshops on Object-Oriented Java streams and secure database designs.",
    longDescription: "Curated curriculum tracks targeting standard collegiate exams, algorithm development, and basic microservice assembly using PostgreSQL and Spring modules. Conducted review clinics for underperforming peers.",
    problemSolved: "Junior students struggled with complex OOP concurrency topics, yielding high failure rates in mid-semester modules.",
    impact: "Supported 120+ students; academic passing metrics in mentored segments improved by 28%.",
    date: "Ongoing (2024-2026)",
    organization: "Academic Peer Guild",
    category: "Community",
    technologies: ["Java", "SQL", "OOP Design Patterns", "Git Workflow"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Advanced",
    status: "Ongoing"
  },
  {
    id: "ach-cloud-prac",
    title: "AWS Certified Cloud Practitioner",
    description: "Demonstrated thorough mastery of Amazon Web Services core resources, serverless IAM governance, and global billing portals.",
    longDescription: "Completed detailed certification modules on virtual compute units (EC2), event-driven microservices (AWS Lambda), cloud databases (RDS, DynamoDB), and optimal high-availability architectural design.",
    problemSolved: "Scaling localized servers was slow and costly, which required full migration to serverless pay-as-you-go instances.",
    impact: "Officially certified AWS node capable of designing enterprise-grade cloud deployments with auto-scaling capabilities.",
    date: "September 2025",
    organization: "Amazon Web Services (AWS)",
    category: "Academic",
    technologies: ["AWS Lambda", "S3 Storage", "IAM Governance", "EC2", "CloudWatch"],
    credentialId: "AWS-CLF-391024",
    verificationUrl: "https://aws.amazon.com/verify",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    achievementLevel: "Advanced",
    status: "Verified"
  }
];

const BADGES = [
  { id: "badge-performer", title: "Top Performer", icon: Award, desc: "CSE Department Top Rank student with excellent academic and operational milestones.", color: "from-[#c3f400] to-[#00f0ff]" },
  { id: "badge-builder", title: "Project Builder", icon: Zap, desc: "Engineered 25+ complex custom applications spanning full-stack frameworks and caching.", color: "from-[#a855f7] to-[#ec4899]" },
  { id: "badge-fullstack", title: "Full Stack Developer", icon: Layers, desc: "Expertise across backend APIs, routing engines, modern frontends, and schemas.", color: "from-[#3b82f6] to-[#06b6d4]" },
  { id: "badge-ai", title: "AI Explorer", icon: Cpu, desc: "Successfully integrated generative models, fine-tuned retrieval states, and similarity indexes.", color: "from-[#10b981] to-[#6366f1]" },
  { id: "badge-python", title: "Python Developer", icon: Code, desc: "Expert script writer, automation developer, and machine learning algorithm tester.", color: "from-[#f59e0b] to-[#ec4899]" },
  { id: "badge-solver", title: "Problem Solver", icon: Target, desc: "Solved 850+ algorithmic tasks across Codeforces, LeetCode, and HackerRank platforms.", color: "from-[#ef4444] to-[#f59e0b]" },
  { id: "badge-opensource", title: "Open Source Contributor", icon: GitMerge, desc: "Authored approved optimizations for core Django routing tables and server utilities.", color: "from-[#6366f1] to-[#a855f7]" },
  { id: "badge-hackathon", title: "Hackathon Participant", icon: Trophy, desc: "Regular participant in department sprints, holding 1st place champion titles.", color: "from-[#06b6d4] to-[#10b981]" },
  { id: "badge-learner", title: "Continuous Learner", icon: Flame, desc: "Holds 15+ verified tech certificates and maintains daily software commit routines.", color: "from-[#ec4899] to-[#ef4444]" },
  { id: "badge-team", title: "Team Player", icon: Users, desc: "Coordinated campus workshops and guided multi-person agile software projects.", color: "from-[#00f0ff] to-[#3b82f6]" }
];

interface CredentialsShowcaseProps {
  credentials?: CertificateDetail[];
}

// Adapter to transform database Certs into Career Timeline achievements
const mapCertToAchievement = (cert: CertificateDetail): PortfolioAchievement => {
  return {
    id: cert.id,
    title: cert.title,
    description: `Issued by ${cert.issuer}. Verified technical credentials specializing in ${cert.skills.join(", ")}.`,
    longDescription: `Professional certification from ${cert.issuer}, completed with validated test metrics. Focus track covers: ${cert.skills.join(", ")}.`,
    problemSolved: "Requires verification of software engineering skills under industry standard frameworks.",
    impact: `Successfully certified in ${cert.title} to deliver production-ready solutions.`,
    date: cert.date,
    organization: cert.issuer,
    category: (cert.category as any) || "Academic",
    technologies: cert.skills,
    credentialId: cert.credentialId,
    verificationUrl: cert.verificationUrl,
    image: cert.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    achievementLevel: cert.status === "Verified" ? "Expert" : "Advanced",
    status: (cert.status as any) || "Verified"
  };
};

export const CredentialsShowcase: React.FC<CredentialsShowcaseProps> = ({ credentials: propsCredentials }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAchievement, setSelectedAchievement] = useState<PortfolioAchievement | null>(null);
  
  // Dynamic milestones adapter
  const activeAchievements = useMemo(() => {
    if (propsCredentials && propsCredentials.length > 0) {
      return propsCredentials.map(mapCertToAchievement);
    }
    return NEW_ACHIEVEMENTS_DATA;
  }, [propsCredentials]);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Stats Animation State
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    hackathons: 0,
    solved: 0,
    commits: 0,
    hours: 0,
    tech: 0,
    streak: 0,
    certs: 0
  });

  // Featured 3D hover state
  const [tiltStyle, setTiltStyle] = useState({});
  const [isHoveredFeatured, setIsHoveredFeatured] = useState(false);

  // Live GitHub mock states or real loading if synced
  const [githubMetrics, setGithubMetrics] = useState({
    totalCommits: 3412,
    starredRepo: "OpsAI-Agent",
    stars: 54,
    streak: 42,
    reposCreated: 15,
    latestCommit: "docs: update neural weights diagnostic script",
    growth: "+14.2%"
  });

  const [loadingGithub, setLoadingGithub] = useState(false);

  useEffect(() => {
    // Stat count-up interval
    const duration = 1800; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out quad
      const easedProgress = progress * (2 - progress);

      setAnimatedStats({
        projects: Math.round(easedProgress * 25),
        hackathons: Math.round(easedProgress * 5),
        solved: Math.round(easedProgress * 850),
        commits: Math.round(easedProgress * 3412),
        hours: Math.round(easedProgress * 1200),
        tech: Math.round(easedProgress * 30),
        streak: Math.round(easedProgress * 120),
        certs: Math.round(easedProgress * 15)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleFeaturedMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = (yc - y) / 10; 
    const tiltY = (x - xc) / 10; 
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: "transform 0.1s ease"
    });
    setIsHoveredFeatured(true);
  };

  const handleFeaturedMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease"
    });
    setIsHoveredFeatured(false);
  };

  const syncGitHubLive = async () => {
    setLoadingGithub(true);
    // Simulate real handshake API loading
    setTimeout(() => {
      setGithubMetrics(prev => ({
        ...prev,
        totalCommits: prev.totalCommits + Math.floor(Math.random() * 8) + 1,
        stars: prev.stars + Math.floor(Math.random() * 3),
        streak: prev.streak + 1,
        latestCommit: "feat: optimized local redis sliding-window throttle schema"
      }));
      setLoadingGithub(false);
    }, 1200);
  };

  // Filter Categories
  const categories: string[] = [
    "All",
    "Hackathons",
    "Coding Competitions",
    "Projects",
    "Open Source",
    "GitHub",
    "Leadership",
    "Community",
    "Research",
    "Academic",
    "Awards"
  ];

  // Filter & Search computation
  const filteredAchievements = activeAchievements.filter(item => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative text-zinc-300 space-y-20 selection:bg-[#c3f400]/20 selection:text-white"
      id="credentials-trophy-room-container"
    >
      {/* 1. MOUSE FOLLOW LIGHTING EFFECT & GRADIENT BLOBS */}
      <div 
        className="absolute pointer-events-none -z-10 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px] transition-all duration-150"
        style={{
          background: "radial-gradient(circle, rgba(195,244,0,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 100%)",
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
        }}
      />
      
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#3b82f6]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-20 w-[450px] h-[450px] rounded-full bg-[#a855f7]/5 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00f0ff]/5 blur-[130px] pointer-events-none -z-10" />

      {/* 2. DYNAMIC STATISTICS DASHBOARD (KPI Cards) */}
      <div 
        id="achievements-kpi-dashboard"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10"
      >
        {[
          { label: "Projects Completed", value: `${animatedStats.projects}+`, icon: Code, desc: "Containerized & Deployed apps" },
          { label: "Hackathons Won", value: `${animatedStats.hackathons}`, icon: Trophy, desc: "Collegiate & Open Sprints" },
          { label: "Problems Solved", value: `${animatedStats.solved}+`, icon: Target, desc: "Across LeetCode, Codeforces" },
          { label: "GitHub Commits", value: `${(animatedStats.commits / 1000).toFixed(1)}k+`, icon: GitMerge, desc: "YTD Verified updates" },
          { label: "Coding Hours", value: `${animatedStats.hours}+`, icon: Hourglass, desc: "Algorithmic engineering" },
          { label: "Verified Credentials", value: `${animatedStats.certs}`, icon: Shield, desc: "Amazon AWS, Google, Oracle" },
          { label: "Technologies Learned", value: `${animatedStats.tech}+`, icon: Cpu, desc: "Languages, Frameworks, DBs" },
          { label: "Active Commit Streak", value: `${animatedStats.streak} days`, icon: Flame, desc: "Consistency standard" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            id={`kpi-card-${i}`}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative bg-[#040507]/60 border border-white/5 p-6 hover:border-[#c3f400]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
          >
            {/* Glowing card head strip */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c3f400]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#adc6ff] font-bold">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-white/30 group-hover:text-[#c3f400] transition-colors duration-300" />
            </div>

            <div className="mt-6">
              <span className="font-sora text-3xl font-extrabold text-white group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(195,244,0,0.3)] transition-all duration-300 tracking-tight">
                {stat.value}
              </span>
              <p className="font-sans text-[10px] text-zinc-500 mt-1.5 leading-none">
                {stat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. SPLIT TIMELINE & FEATURED ACHIEVEMENT AREA */}
      <div 
        id="timeline-featured-split"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10"
      >
        {/* LEFT COLUMN: Vertical Journey Timeline (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-left border-b border-white/5 pb-4">
            <h3 className="font-sora text-lg font-extrabold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c3f400] animate-pulse" />
              Dynamic Engineering Timeline
            </h3>
            <p className="font-mono text-[10px] text-zinc-500 mt-1">
              Scroll-synced nodes tracing technical evolution
            </p>
          </div>

          <div className="relative pl-6 space-y-8 py-2 text-left">
            {/* Connecting Vertical line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#c3f400] via-[#a855f7] to-[#00f0ff] opacity-25" />
            
            {[
              { year: "2023 // FOUNDATION", title: "Formed Logical Foundations", icon: Code, desc: "Mastered Python procedural scripting, Java OOP structures, Linux operating schemas, and database foundations.", color: "border-[#c3f400]" },
              { year: "2024 // TRANSITION", title: "Engineered first full-stack webs", icon: Layers, desc: "Constructed functional Django platforms, integrated PostgreSQL nodes, and successfully won Apex CSE Hackathon.", color: "border-[#a855f7]" },
              { year: "2025 // SCALE", title: "Mastered Serverless Clouds & Docker", icon: Server, desc: "Built scalable AWS serverless Lambda systems, encapsulated clusters via Docker, and certified on AWS Practitioner guidelines.", color: "border-[#3b82f6]" },
              { year: "2026 // EXCELLENCE", title: "Deploying Local neural RAG models", icon: Cpu, desc: "Developing multi-department vector queries, tuning RAG parameters, and finalizing collegiate peer-mentoring labs.", color: "border-[#00f0ff]" }
            ].map((milestone, idx) => (
              <motion.div
                key={milestone.year}
                id={`milestone-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group cursor-default"
              >
                {/* Milestone Node Badge Icon */}
                <div className={`absolute -left-[28px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border ${milestone.color} flex items-center justify-center group-hover:scale-125 group-hover:bg-white transition-all duration-300 z-10`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-black transition-colors" />
                </div>

                <div className="p-4 bg-[#040507]/40 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="font-mono text-[9px] tracking-wider text-[#c3f400] font-extrabold uppercase">
                    {milestone.year}
                  </span>
                  <h4 className="font-sora text-sm font-bold text-white mt-1 group-hover:text-white transition-colors">
                    {milestone.title}
                  </h4>
                  <p className="font-sans text-[11px] text-zinc-500 mt-2 leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Large Featured Achievement Card (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="text-left border-b border-white/5 pb-4 mb-6">
            <h3 className="font-sora text-lg font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#c3f400] animate-bounce" />
              Flagship Achievement Node
            </h3>
            <p className="font-mono text-[10px] text-zinc-500 mt-1">
              Prime engineering highlight with verifiability parameters
            </p>
          </div>

          <motion.div
            id="featured-achievement-card-3d"
            onMouseMove={handleFeaturedMouseMove}
            onMouseLeave={handleFeaturedMouseLeave}
            style={tiltStyle}
            onClick={() => setSelectedAchievement(NEW_ACHIEVEMENTS_DATA[0])}
            className="relative cursor-pointer group bg-[#050609]/80 border border-purple-500/10 hover:border-purple-500/35 p-6 lg:p-8 flex flex-col justify-between overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md h-full"
          >
            {/* Visual Particle / Aurora blob inside featured card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#c3f400]/10 transition-all duration-500 -z-10" />

            {/* Glowing animated frame borders */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:via-[#c3f400] transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:via-[#c3f400] transition-all duration-700" />

            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <span className="font-mono text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 uppercase tracking-widest font-extrabold">
                  🏆 {NEW_ACHIEVEMENTS_DATA[0].category} // TOP LEVEL
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> SECURE_VERIFIED
                  </span>
                  <span className="font-mono text-[9px] text-[#c3f400] font-bold">
                    {NEW_ACHIEVEMENTS_DATA[0].date}
                  </span>
                </div>
              </div>

              {/* Large Image Showcase with elegant zoom and clip */}
              <div className="relative h-44 w-full overflow-hidden border border-white/5 bg-zinc-950">
                <img 
                  src={NEW_ACHIEVEMENTS_DATA[0].image} 
                  alt={NEW_ACHIEVEMENTS_DATA[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-transparent to-transparent" />
                
                {/* Floating Trophy Illustration */}
                <div className="absolute right-4 bottom-4 w-12 h-12 bg-zinc-950/90 border border-purple-500/20 flex items-center justify-center rounded-full shadow-lg group-hover:border-[#c3f400] transition-colors duration-300">
                  <Trophy className="w-5 h-5 text-purple-400 group-hover:text-[#c3f400] transition-colors duration-300 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-sora text-xl font-extrabold text-white group-hover:text-[#c3f400] transition-colors duration-300">
                  {activeAchievements[0]?.title || "Milestone"}
                </h3>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                  {activeAchievements[0]?.description || ""}
                </p>
              </div>

              {/* Technical Stack Tag Pile */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeAchievements[0]?.technologies.map(tech => (
                  <span key={tech} className="font-mono text-[8px] bg-white/5 text-zinc-400 px-2 py-0.5 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Impact Callout Box */}
              <div className="bg-[#0b0c10]/80 border-l-2 border-purple-500 group-hover:border-[#c3f400] p-3 text-left transition-colors duration-300">
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500 block">Demonstrated Impact Metrics</span>
                <span className="font-sora text-xs font-bold text-white group-hover:text-purple-300 transition-colors duration-300 block mt-0.5">
                  {activeAchievements[0]?.impact || ""}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center font-mono text-[10px]">
              <span className="text-zinc-500">Issuer: {activeAchievements[0]?.organization || "Academic"}</span>
              <button className="text-[#c3f400] hover:text-white transition-colors flex items-center gap-1 font-bold">
                VIEW STORY MODULE <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. PREMIUM BADGES SHOWCASE SECTION */}
      <div 
        id="premium-badges-rack"
        className="relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="font-mono text-[9px] tracking-widest text-[#c3f400] uppercase font-bold">
            Cognitive Competence Verification
          </span>
          <h3 className="font-sora text-xl font-extrabold text-white">
            Interactive Digital Trophy Cabinet
          </h3>
          <p className="font-sans text-xs text-zinc-500 max-w-xl mx-auto">
            Hover over any technical badge to decode verification parameters and evaluation logs.
          </p>
        </div>

        {/* Badge Grid Shelf */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {BADGES.map((badge) => {
            const isHovered = hoveredBadge === badge.id;
            return (
              <div
                key={badge.id}
                id={badge.id}
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
                className="relative bg-[#040507]/70 border border-white/5 hover:border-white/15 p-4 flex flex-col items-center justify-center text-center cursor-help group transition-all duration-300 backdrop-blur-md"
              >
                {/* Dynamic radial hover border glow */}
                {isHovered && (
                  <div className="absolute inset-0 border border-[#c3f400]/30 bg-[#c3f400]/5 -z-10 animate-pulse" />
                )}

                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center mb-3 group-hover:border-[#c3f400]/40 group-hover:shadow-[0_0_15px_rgba(195,244,0,0.15)] transition-all duration-300">
                  <badge.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#c3f400] transition-colors duration-300" />
                </div>

                <span className="font-sora text-xs font-bold text-white group-hover:text-white transition-colors">
                  {badge.title}
                </span>

                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-600 group-hover:text-[#c3f400] mt-1.5 transition-colors">
                  VERIFIED
                </span>

                {/* Highly-styled Floating Hover Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full mb-3 w-56 p-4 bg-[#08090d] border border-[#c3f400]/30 text-left shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-[100]"
                    >
                      <div className="h-1 w-8 bg-gradient-to-r from-[#c3f400] to-[#00f0ff] mb-2" />
                      <h5 className="font-sora text-xs font-extrabold text-white">{badge.title}</h5>
                      <p className="font-sans text-[10px] text-zinc-400 mt-2 leading-relaxed">
                        {badge.desc}
                      </p>
                      <div className="font-mono text-[8px] text-[#c3f400] uppercase mt-2.5 font-bold tracking-wider">
                        STATUS: ACTIVE_RECOGNITION
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE GITHUB ACHIEVEMENTS DASHBOARD */}
      <div 
        id="live-github-dashboard"
        className="relative z-10 bg-[#040507]/80 border border-white/5 p-6 lg:p-8 backdrop-blur-md text-left"
      >
        <div className="absolute top-0 right-0 w-96 h-28 bg-[#10b981]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
          <div>
            <span className="font-mono text-[8px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 px-2 py-1 uppercase tracking-widest font-extrabold">
              🛰️ LIVE GRAPH HANDSHAKE // GITHUB
            </span>
            <h3 className="font-sora text-lg font-extrabold text-white mt-2">
              GitHub Technical Execution Dashboard
            </h3>
            <p className="font-sans text-xs text-zinc-500 mt-1">
              Active system triggers and repository growth parameters synced securely with profile stream.
            </p>
          </div>

          <button
            onClick={syncGitHubLive}
            disabled={loadingGithub}
            className="font-mono text-xs text-black bg-white hover:bg-[#c3f400] px-4 py-2.5 flex items-center gap-2 font-bold cursor-pointer transition-colors"
          >
            {loadingGithub ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                TUNING SYNAPSE...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                REFRESH UPLINK
              </>
            )}
          </button>
        </div>

        {/* GitHub Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-4">
            
            <div className="p-4 bg-[#07090e]/80 border border-white/5 hover:border-white/10 transition-colors">
              <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">Starred Repository Highlight</span>
              <div className="flex justify-between items-center mt-1">
                <span className="font-sora text-sm font-bold text-white flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#10b981]" />
                  {githubMetrics.starredRepo}
                </span>
                <span className="font-mono text-xs text-zinc-400 bg-white/5 px-2 py-0.5 border border-white/5 flex items-center gap-1">
                  ★ {githubMetrics.stars}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#07090e]/80 border border-white/5 text-left">
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">Commits Count YTD</span>
                <span className="font-sora text-base font-extrabold text-white block mt-1">{githubMetrics.totalCommits}</span>
              </div>
              <div className="p-4 bg-[#07090e]/80 border border-white/5 text-left">
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">Repos Completed</span>
                <span className="font-sora text-base font-extrabold text-[#10b981] block mt-1">{githubMetrics.reposCreated}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10">
              <span className="font-mono text-[8px] uppercase text-emerald-400 font-extrabold tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Latest Verified Commit
              </span>
              <p className="font-mono text-[10px] text-zinc-300 mt-1.5 leading-relaxed truncate">
                "{githubMetrics.latestCommit}"
              </p>
            </div>

          </div>

          {/* Vercel-like Contribution Heatmap Graphic Grid */}
          <div className="md:col-span-7 bg-[#05060a]/90 border border-white/5 p-5 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                Commits Frequency Grid Map
              </span>
              <span className="font-mono text-[8px] text-[#10b981] uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                STREAK ACTIVE // {githubMetrics.streak} DAYS
              </span>
            </div>

            {/* Simulated Git Matrix representation */}
            <div className="grid grid-cols-24 gap-1 overflow-x-auto py-1 scrollbar-none">
              {Array.from({ length: 168 }).map((_, idx) => {
                // Generate a pseudo-random commit depth representation
                let intensity = "bg-zinc-900";
                const hash = (idx * 31 + 17) % 100;
                if (hash > 85) intensity = "bg-[#10b981]";
                else if (hash > 65) intensity = "bg-[#10b981]/70";
                else if (hash > 40) intensity = "bg-[#10b981]/30";
                else if (hash > 20) intensity = "bg-[#10b981]/10";

                return (
                  <div 
                    key={idx} 
                    className={`aspect-square w-full min-w-[7px] max-w-[12px] ${intensity} transition-colors duration-300 hover:bg-white`} 
                    title={`Day index ${idx}: commits computed`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
              <span>Jan 2026</span>
              <span>Jun 2026</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="w-2 h-2 bg-zinc-900" />
                <div className="w-2 h-2 bg-[#10b981]/10" />
                <div className="w-2 h-2 bg-[#10b981]/30" />
                <div className="w-2 h-2 bg-[#10b981]/70" />
                <div className="w-2 h-2 bg-[#10b981]" />
                <span>More</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 6. FILTER PILLS SUB-NAV */}
      <div 
        id="achievements-navigation-filter-system"
        className="space-y-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-sora text-base font-extrabold text-white">
              Verifiable Milestones Registry
            </h3>
          </div>

          {/* Search box within filters */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search achievements or tech..."
              className="w-full bg-[#040507]/80 border border-white/5 pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400] font-mono transition-colors"
            />
          </div>
        </div>

        {/* Scrolling Filter Pills */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  isActive 
                    ? "bg-[#c3f400] text-black font-extrabold border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)]" 
                    : "bg-[#040507]/60 text-zinc-400 border-white/5 hover:text-white hover:border-white/15"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. MASONRY GRID OF ACHIEVEMENT CARDS */}
      <div 
        id="achievements-masonry-grid"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-left"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedAchievement(item)}
              className="group cursor-pointer bg-[#040507]/70 border border-white/5 hover:border-white/15 p-5 flex flex-col justify-between overflow-hidden relative shadow-lg backdrop-blur-md hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Soft top border light indicator */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[8px] bg-white/5 text-zinc-400 px-2 py-0.5 border border-white/5 uppercase font-bold">
                    {item.category}
                  </span>
                  
                  <span className="font-mono text-[9px] text-[#c3f400] font-bold">
                    {item.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-sora text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors duration-300 leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-sans text-[11px] text-zinc-500 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1">
                  {item.technologies.slice(0, 3).map(t => (
                    <span key={t} className="font-mono text-[7px] bg-zinc-950 text-zinc-500 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="font-mono text-[7px] text-zinc-600 px-1.5 py-0.5">
                      +{item.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">
                  {item.achievementLevel} LEVEL
                </span>
                <span className="font-mono text-[9px] text-[#c3f400] font-bold group-hover:underline flex items-center gap-0.5">
                  VIEW STORY &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAchievements.length === 0 && (
          <div className="col-span-3 py-16 text-center border border-dashed border-white/5 bg-zinc-950/20 font-mono text-zinc-500 text-xs">
            No milestones matches the current active search query or filter segment.
          </div>
        )}
      </div>

      {/* 8. DETAILED INTERACTIVE MULTI-VIEW PORTAL MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#040507]/90 backdrop-blur-md"
              onClick={() => setSelectedAchievement(null)}
            />

            {/* Modal content body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#07090e] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-left flex flex-col max-h-[90vh]"
            >
              {/* Dynamic Header Banner with blur effect */}
              <div className="relative h-48 w-full overflow-hidden shrink-0 border-b border-white/5 bg-zinc-950">
                <img 
                  src={selectedAchievement.image} 
                  alt={selectedAchievement.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />
                
                {/* Banner Text overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-mono text-[8px] bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/20 px-2 py-1 uppercase tracking-widest font-extrabold">
                    🏆 {selectedAchievement.category} MODULE
                  </span>
                  <h3 className="font-sora text-lg md:text-xl font-extrabold text-white mt-2 leading-snug">
                    {selectedAchievement.title}
                  </h3>
                </div>

                <button 
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Scrollable Story content */}
              <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">REGISTRATION ISSUER</span>
                    <span className="font-sora text-xs font-bold text-white block mt-0.5">{selectedAchievement.organization}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">COMPLETION DATE</span>
                    <span className="font-sora text-xs font-bold text-[#c3f400] block mt-0.5">{selectedAchievement.date}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">RECOGNITION LEVEL</span>
                    <span className="font-sora text-xs font-bold text-purple-400 block mt-0.5">{selectedAchievement.achievementLevel}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#adc6ff] font-bold block">1. Full Story</span>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                    {selectedAchievement.longDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#ef4444] font-bold block">2. Problem Solved</span>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                      {selectedAchievement.problemSolved}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#10b981] font-bold block">3. Demonstrated Impact</span>
                    <p className="font-sans text-xs text-zinc-300 leading-relaxed font-bold bg-white/[0.02] p-3 border-l border-[#10b981]">
                      {selectedAchievement.impact}
                    </p>
                  </div>
                </div>

                {/* Technologies List */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#adc6ff] font-bold block">4. Integrated Core Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAchievement.technologies.map(tech => (
                      <span key={tech} className="font-mono text-[9px] bg-white/5 text-zinc-300 px-2.5 py-1 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Verification Secure Module */}
                {selectedAchievement.credentialId && (
                  <div className="bg-[#050608] border border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">SECURE REGISTRY SECURE ID</span>
                      <span className="font-mono text-xs text-[#c3f400] font-bold select-all">{selectedAchievement.credentialId}</span>
                    </div>
                    {selectedAchievement.verificationUrl && (
                      <a 
                        href={selectedAchievement.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] bg-[#c3f400]/10 hover:bg-[#c3f400] text-[#c3f400] hover:text-black border border-[#c3f400]/30 px-4 py-2 font-bold transition-all flex items-center gap-1 shrink-0"
                      >
                        SOLVE VERIFICATION <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-white/5 bg-[#050608]/90 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <span className="font-mono text-[8px] text-zinc-600 uppercase">
                  REGISTRY ARCHIVE NODES STATUS: SECURE_SYNC
                </span>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/5 transition-colors cursor-pointer text-center"
                  >
                    CLOSE VIEWPORT
                  </button>
                  {selectedAchievement.links?.github && (
                    <a
                      href={selectedAchievement.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-[#c3f400] text-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <Github className="w-3.5 h-3.5" /> CODE BASE
                    </a>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
