import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code2, 
  Sparkles, 
  Database, 
  Terminal, 
  Cpu, 
  Layers, 
  Flame, 
  Compass, 
  Zap, 
  Clock, 
  Github, 
  Award, 
  FolderGit2, 
  Lightbulb, 
  Users, 
  Brain, 
  Activity, 
  Puzzle,
  ChevronRight,
  BookOpen,
  Upload,
  Camera,
  RefreshCw,
  Server,
  Laptop,
  Globe,
  GitBranch,
  Package,
  Tv,
  Code
} from "lucide-react";

// Types for skills
interface SkillData {
  name: string;
  years: number;
  projects: number;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SkillCategory {
  title: string;
  skills: SkillData[];
}

// 1. Skill Categories Data matching requirements
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming",
    skills: [
      { name: "Python", years: 3, projects: 12, proficiency: "Expert" },
      { name: "Java", years: 3, projects: 8, proficiency: "Advanced" },
      { name: "JavaScript", years: 3, projects: 10, proficiency: "Advanced" },
      { name: "SQL", years: 2, projects: 9, proficiency: "Advanced" }
    ]
  },
  {
    title: "Frontend",
    skills: [
      { name: "React", years: 2, projects: 7, proficiency: "Advanced" },
      { name: "Next.js", years: 1.5, projects: 4, proficiency: "Intermediate" },
      { name: "HTML", years: 3, projects: 15, proficiency: "Expert" },
      { name: "CSS", years: 3, projects: 15, proficiency: "Expert" },
      { name: "Tailwind CSS", years: 2, projects: 12, proficiency: "Expert" }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Django", years: 2, projects: 8, proficiency: "Expert" },
      { name: "Django REST Framework", years: 2, projects: 6, proficiency: "Expert" },
      { name: "REST APIs", years: 2, projects: 10, proficiency: "Expert" }
    ]
  },
  {
    title: "Database",
    skills: [
      { name: "PostgreSQL", years: 2, projects: 6, proficiency: "Advanced" },
      { name: "MySQL", years: 2, projects: 7, proficiency: "Advanced" },
      { name: "SQLite", years: 3, projects: 12, proficiency: "Expert" }
    ]
  },
  {
    title: "AI & Data Science",
    skills: [
      { name: "Machine Learning", years: 1.5, projects: 5, proficiency: "Advanced" },
      { name: "Data Science", years: 1.5, projects: 4, proficiency: "Intermediate" },
      { name: "NumPy", years: 2, projects: 8, proficiency: "Advanced" },
      { name: "Pandas", years: 2, projects: 8, proficiency: "Advanced" },
      { name: "Scikit-learn", years: 1.5, projects: 5, proficiency: "Advanced" }
    ]
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", years: 3, projects: 20, proficiency: "Expert" },
      { name: "GitHub", years: 3, projects: 20, proficiency: "Expert" },
      { name: "Docker", years: 1, projects: 3, proficiency: "Intermediate" },
      { name: "Linux", years: 2, projects: 6, proficiency: "Advanced" },
      { name: "VS Code", years: 3, projects: 25, proficiency: "Expert" }
    ]
  }
];

// Timeline milestones
interface Milestone {
  icon: string;
  title: string;
  description: string;
  date: string;
}

const TIMELINE_STORY: Milestone[] = [
  { icon: "🚀", title: "Started Learning Programming", description: "Began with logical problem-solving, Python & Java fundamentals.", date: "2023" },
  { icon: "💻", title: "Built My First Web Application", description: "Developed interactive apps exploring custom layouts and server routes.", date: "2024" },
  { icon: "🌐", title: "Learned Full Stack Development", description: "Mastered Django, APIs, React, and database design with production paradigms.", date: "2024" },
  { icon: "🧠", title: "Exploring Artificial Intelligence", description: "Dived into Machine Learning models, regression, classification, and neural nets.", date: "2025" },
  { icon: "⚡", title: "Building Real-World Projects", description: "Deploying high-performance systems with automated telemetry and microservices.", date: "2025" },
  { icon: "🎯", title: "Becoming a Software Engineer", description: "Tackling scalable, distributed system architectures and industry problems.", date: "2026" }
];

// Stat counters type
interface StatCounterProps {
  label: string;
  target: number;
  suffix?: string;
  icon: React.ReactNode;
}

const CountUp: React.FC<StatCounterProps> = ({ label, target, suffix = "", icon }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const startTimestamp = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentCount = Math.floor(easedProgress * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, target]);

  return (
    <div ref={elementRef} className="bg-[#0b0c10] border border-white/5 p-5 relative overflow-hidden flex flex-col justify-between h-32 group hover:border-[#adc6ff]/20 transition-all duration-300">
      <div className="absolute right-3 top-3 text-white/5 group-hover:text-[#adc6ff]/10 group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <div className="font-mono text-[9px] text-[#adc6ff]/60 uppercase tracking-widest">
        {label}
      </div>
      <div className="font-sora text-3xl font-extrabold text-white mt-2 select-none tracking-tight">
        {count}
        <span className="text-[#c3f400]">{suffix}</span>
      </div>
      <div className="w-full h-[1px] bg-white/5 absolute bottom-0 left-0 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-[#adc6ff]/50 to-transparent w-1/2 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  );
};

export interface SkillCategoryData {
  title: string;
  skills: {
    name: string;
    years: number;
    projects: number;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  }[];
}

interface AboutMeProps {
  skills?: SkillCategoryData[];
}

export const AboutMe: React.FC<AboutMeProps> = ({ skills }) => {
  const activeSkills = skills && skills.length > 0 ? skills : SKILL_CATEGORIES;

  return (
    <section id="about" className="space-y-24 scroll-mt-28 relative">
      {/* Absolute floating ambient backgrounds */}
      <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-[#c3f400]/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold block">
            👋 Profile Dossier
          </span>
          <h2 className="font-sora text-3xl font-extrabold text-white tracking-tight mt-2">
            Engineered Identity
          </h2>
        </div>
        <p className="text-[#c1c6d7] text-xs font-mono max-w-sm">
          Combining deep computer science architecture with modern full-stack implementation and a passion for intelligent cognitive computing.
        </p>
      </div>

      {/* PROFESSIONAL DETAILS */}
      <div className="max-w-4xl space-y-8 text-left">
        <div className="space-y-4">
          <span className="font-mono text-xs text-[#c3f400] font-bold tracking-widest flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" /> Biography dossier
          </span>
          <h3 className="font-sora text-3xl font-extrabold text-white tracking-tight leading-tight">
            Turning Ideas Into <span className="bg-gradient-to-r from-[#adc6ff] to-[#c3f400] bg-clip-text text-transparent font-extrabold">Scalable Software</span> & <span className="bg-gradient-to-r from-[#c3f400] to-[#adc6ff] bg-clip-text text-transparent font-extrabold">Intelligent Solutions</span>
          </h3>
        </div>

        <div className="space-y-5 text-sm text-[#c1c6d7] leading-relaxed font-sans font-normal">
          <p className="animate-fade-in-up">
            I'm <strong className="text-white font-semibold">Mukteswar Gochhayat</strong>, a Computer Science and Engineering student at <strong className="text-white font-semibold">ITER, SOA University</strong>, driven by curiosity and a passion for building software that is scalable, intelligent, and impactful. Every project is a canvas to turn complex logistical questions into polished, robust architectures.
          </p>
          <p>
            Today, I primarily construct advanced application backends and interactive systems using <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-bold">Python</span>, <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-bold">Java</span>, <span className="bg-gradient-to-r from-[#092e20] to-[#2eb086] bg-clip-text text-transparent font-bold">Django</span>, and <span className="bg-gradient-to-r from-[#adc6ff] to-[#c3f400] bg-clip-text text-transparent font-bold">Full Stack</span> design elements, with an emphasis on rigorous <span className="text-[#c3f400] font-bold">Problem Solving</span> through Data Structures & Algorithms.
          </p>
          <p>
            I am highly fascinated by the frontier of <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-bold">Artificial Intelligence</span> and <span className="bg-gradient-to-r from-[#adc6ff] to-[#c3f400] bg-clip-text text-transparent font-bold">Machine Learning</span>. My mission in <span className="text-[#adc6ff] font-bold">Software Engineering</span> is to bridge traditional engineering excellence with cognitive learning networks—pioneering tools that make intelligent, automated decisions in real-time.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[#adc6ff]/5 border border-[#adc6ff]/20 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#adc6ff]" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase tracking-tight">Active In</h5>
              <p className="font-mono text-[10px] text-white/50 mt-0.5">Bhubaneswar, Odisha</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[#c3f400]/5 border border-[#c3f400]/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#c3f400]" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase tracking-tight">Status Uplink</h5>
              <p className="font-mono text-[10px] text-[#c3f400] font-bold mt-0.5 uppercase tracking-widest animate-pulse">Available for Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT I DO: SERVICE CARDS */}
      <div className="space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="font-mono text-[10px] text-[#c3f400] uppercase tracking-wider font-bold">Service Pillars</span>
          <h3 className="font-sora text-2xl font-extrabold text-white">Areas of Architectural Focus</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#0b0c10] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-[#adc6ff]/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-72 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#adc6ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#adc6ff]/10 transition-colors" />
            <div className="w-12 h-12 bg-[#adc6ff]/5 border border-[#adc6ff]/10 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-[#adc6ff]" />
            </div>
            <div>
              <h4 className="font-sora text-sm font-extrabold text-white group-hover:text-[#adc6ff] transition-colors">Full Stack Development</h4>
              <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed mt-2.5">
                Build scalable web applications using Django, React, REST APIs, PostgreSQL, and modern web technologies.
              </p>
            </div>
            <div className="w-8 h-[2px] bg-white/10 group-hover:bg-[#adc6ff] group-hover:w-16 transition-all duration-500 mt-4" />
          </div>

          {/* Card 2 */}
          <div className="bg-[#0b0c10] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-[#c3f400]/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-72 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#c3f400]/5 rounded-bl-full pointer-events-none group-hover:bg-[#c3f400]/10 transition-colors" />
            <div className="w-12 h-12 bg-[#c3f400]/5 border border-[#c3f400]/10 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-[#c3f400]" />
            </div>
            <div>
              <h4 className="font-sora text-sm font-extrabold text-white group-hover:text-[#c3f400] transition-colors">AI & Machine Learning</h4>
              <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed mt-2.5">
                Explore intelligent systems, machine learning models, custom neural networks, automation, and data-driven solutions.
              </p>
            </div>
            <div className="w-8 h-[2px] bg-white/10 group-hover:bg-[#c3f400] group-hover:w-16 transition-all duration-500 mt-4" />
          </div>

          {/* Card 3 */}
          <div className="bg-[#0b0c10] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-[#adc6ff]/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-72 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#adc6ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#adc6ff]/10 transition-colors" />
            <div className="w-12 h-12 bg-[#adc6ff]/5 border border-[#adc6ff]/10 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-[#adc6ff]" />
            </div>
            <div>
              <h4 className="font-sora text-sm font-extrabold text-white group-hover:text-[#adc6ff] transition-colors">Backend Engineering</h4>
              <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed mt-2.5">
                Develop secure and robust REST APIs, optimize databases, implement token verification protocols, and improve throughput.
              </p>
            </div>
            <div className="w-8 h-[2px] bg-white/10 group-hover:bg-[#adc6ff] group-hover:w-16 transition-all duration-500 mt-4" />
          </div>

          {/* Card 4 */}
          <div className="bg-[#0b0c10] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-[#c3f400]/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-72 text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#c3f400]/5 rounded-bl-full pointer-events-none group-hover:bg-[#c3f400]/10 transition-colors" />
            <div className="w-12 h-12 bg-[#c3f400]/5 border border-[#c3f400]/10 flex items-center justify-center mb-6">
              <Terminal className="w-6 h-6 text-[#c3f400]" />
            </div>
            <div>
              <h4 className="font-sora text-sm font-extrabold text-white group-hover:text-[#c3f400] transition-colors">Problem Solving</h4>
              <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed mt-2.5">
                Strengthen logical thinking through highly optimized Data Structures, Algorithms, and competitive programming models.
              </p>
            </div>
            <div className="w-8 h-[2px] bg-white/10 group-hover:bg-[#c3f400] group-hover:w-16 transition-all duration-500 mt-4" />
          </div>

        </div>
      </div>

      {/* STORY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        <div className="lg:col-span-4 space-y-4">
          <span className="font-mono text-[10px] text-[#c3f400] uppercase tracking-wider font-bold">Chronological Stream</span>
          <h3 className="font-sora text-2xl font-extrabold text-white">Journey Log</h3>
          <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed">
            The incremental accumulation of computer science principles, practical framework mastery, and artificial intelligence exploration. Scroll to track key developer milestones.
          </p>
        </div>

        <div className="lg:col-span-8 relative pl-6 border-l border-white/5 space-y-8">
          <div className="absolute left-[-1.5px] top-2 bottom-2 w-[3px] bg-gradient-to-b from-[#adc6ff] to-[#c3f400]" />
          
          {TIMELINE_STORY.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative pl-6 group"
            >
              {/* Dot node */}
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 bg-zinc-950 border-2 border-[#adc6ff] rounded-full flex items-center justify-center group-hover:border-[#c3f400] group-hover:scale-125 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-[#adc6ff] rounded-full group-hover:bg-[#c3f400]" />
              </div>

              <div className="glass-card p-5 bg-[#0a0c10] border border-white/5 hover:border-[#adc6ff]/20 transition-all duration-300">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <h4 className="font-sora text-sm font-bold text-white group-hover:text-[#adc6ff] transition-colors">{item.title}</h4>
                  </div>
                  <span className="font-mono text-[10px] text-[#c3f400] bg-[#c3f400]/5 px-2 py-0.5 border border-[#c3f400]/20 font-bold">
                    {item.date}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#c1c6d7] leading-relaxed mt-2.5">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface SkillsSnapshotProps {
  skills?: SkillCategoryData[];
}

export const SkillsSnapshot: React.FC<SkillsSnapshotProps> = ({ skills }) => {
  const [hoveredSkill, setHoveredSkill] = useState<any | null>(null);
  const [activeFocus, setActiveFocus] = useState<string>("Artificial Intelligence");
  const activeSkills = skills && skills.length > 0 ? skills : SKILL_CATEGORIES;

  return (
    <section id="skills" className="space-y-24 scroll-mt-28 relative">
      {/* Absolute floating ambient backgrounds */}
      <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-[#c3f400]/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* SKILLS SNAPSHOT */}
      <div className="text-left">
        <div className="bg-[#0b0c10]/40 border border-white/5 p-8 relative">
          <div className="space-y-8">
            <div>
              <span className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-wider font-bold block">Engineering Stack</span>
              <h3 className="font-sora text-xl font-bold text-white">Skills Snapshot</h3>
              <p className="font-sans text-xs text-white/40 mt-1">
                A comprehensive matrix of my programming languages, frameworks, databases, and technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeSkills.map((cat, index) => (
                <div key={index} className="space-y-4 bg-zinc-950/20 border border-white/5 p-5 hover:border-white/10 transition-all duration-300">
                  <h4 className="font-mono text-[10px] text-[#adc6ff] uppercase tracking-widest font-bold border-b border-white/5 pb-2">
                    {cat.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => {
                      const isHovered = hoveredSkill?.name === skill.name;
                      return (
                        <div
                          key={sIdx}
                          onMouseEnter={() => setHoveredSkill(skill)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className={`px-2.5 py-1.5 font-mono text-xs border cursor-pointer transition-all duration-300 flex items-center gap-1.5 relative select-none ${
                            isHovered 
                              ? "bg-[#c3f400] text-black border-[#c3f400] font-bold" 
                              : "bg-white/5 text-white/80 border-white/5 hover:text-white hover:border-white/10"
                          }`}
                        >
                          {skill.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STAT COUNTERS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <CountUp label="Projects Built" target={12} suffix="+" icon={<FolderGit2 className="w-6 h-6" />} />
        <CountUp label="Technologies" target={18} suffix="+" icon={<Code2 className="w-6 h-6" />} />
        <CountUp label="Coding Hours" target={1200} suffix="+" icon={<Clock className="w-6 h-6" />} />
        <CountUp label="GitHub Repos" target={15} suffix="+" icon={<Github className="w-6 h-6" />} />
        <CountUp label="Certificates" target={10} suffix="+" icon={<Award className="w-6 h-6" />} />
        <CountUp label="Hackathons" target={4} suffix="+" icon={<Sparkles className="w-6 h-6" />} />
        <CountUp label="Years Learning" target={3} suffix="+" icon={<Flame className="w-6 h-6" />} />
      </div>

      {/* QUOTE / PHILOSOPHY BLOCK */}
      <div className="glass-card p-10 md:p-14 relative overflow-hidden border-l-2 border-l-[#c3f400] text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#c3f400]/5 rounded-bl-full pointer-events-none" />
        <div className="max-w-3xl space-y-6">
          <span className="font-mono text-[10px] text-[#c3f400] uppercase tracking-widest font-bold block">
            Engineering Philosophy
          </span>
          <p className="font-sora text-lg md:text-xl font-bold text-white leading-relaxed tracking-tight select-none italic">
            "My goal is not just to write code, but to build technology that solves meaningful problems, creates value, and positively impacts people's lives."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#adc6ff]" />
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase tracking-tight">Mukteswar Gochhayat</h5>
              <p className="font-mono text-[10px] text-white/50">Computer Science & Engineering Scholar</p>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="font-mono text-[10px] text-[#adc6ff] uppercase tracking-wider font-bold">Internal Guidelines</span>
          <h3 className="font-sora text-2xl font-extrabold text-white">My Core Values</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-[#0b0c10] border border-white/5 p-5 flex flex-col justify-between h-44 text-left group hover:border-[#c3f400]/20 transition-all duration-300">
            <div className="w-8 h-8 bg-[#c3f400]/5 border border-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase group-hover:text-[#c3f400] transition-colors">🚀 Continuous Learning</h5>
              <p className="font-sans text-[11px] text-[#c1c6d7] leading-relaxed mt-2">
                Always exploring new frameworks, languages, and architectural models.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/5 p-5 flex flex-col justify-between h-44 text-left group hover:border-[#adc6ff]/20 transition-all duration-300">
            <div className="w-8 h-8 bg-[#adc6ff]/5 border border-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
              <Puzzle className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase group-hover:text-[#adc6ff] transition-colors">🧩 Problem Solving</h5>
              <p className="font-sans text-[11px] text-[#c1c6d7] leading-relaxed mt-2">
                Breaking down complex business criteria into simple, highly-optimized programs.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/5 p-5 flex flex-col justify-between h-44 text-left group hover:border-[#c3f400]/20 transition-all duration-300">
            <div className="w-8 h-8 bg-[#c3f400]/5 border border-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase group-hover:text-[#c3f400] transition-colors">⚡ Performance</h5>
              <p className="font-sans text-[11px] text-[#c1c6d7] leading-relaxed mt-2">
                Building responsive and fast software designed to scale with future loads.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/5 p-5 flex flex-col justify-between h-44 text-left group hover:border-[#adc6ff]/20 transition-all duration-300">
            <div className="w-8 h-8 bg-[#adc6ff]/5 border border-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase group-hover:text-[#adc6ff] transition-colors">🤝 Collaboration</h5>
              <p className="font-sans text-[11px] text-[#c1c6d7] leading-relaxed mt-2">
                Growing through shared code reviews, open-source work, and clear communication.
              </p>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/5 p-5 flex flex-col justify-between h-44 text-left group hover:border-[#c3f400]/20 transition-all duration-300">
            <div className="w-8 h-8 bg-[#c3f400]/5 border border-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-sora text-xs font-bold text-white uppercase group-hover:text-[#c3f400] transition-colors">💡 Innovation</h5>
              <p className="font-sans text-[11px] text-[#c1c6d7] leading-relaxed mt-2">
                Creating practical solutions to daily pain points with modern AI models.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ROADMAP / CURRENT FOCUS */}
      <div className="bg-[#0b0c10] border border-white/5 p-8 text-left space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c3f400]/5 rounded-bl-full pointer-events-none" />
        
        <div>
          <span className="font-mono text-[9px] text-[#adc6ff] uppercase tracking-wider font-bold">Horizon Scanning</span>
          <h3 className="font-sora text-xl font-bold text-white">Current Focus Roadmap</h3>
          <p className="font-sans text-xs text-white/40 mt-1">Syllabus of live research paths and technological milestones. Click on active milestones to highlight focus.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            "Full Stack Development",
            "Advanced Django",
            "Data Structures & Algorithms",
            "Artificial Intelligence",
            "Machine Learning",
            "Cloud Deployment",
            "Open Source",
            "System Design"
          ].map((item, index) => {
            const isActive = activeFocus === item;
            return (
              <div
                key={index}
                onClick={() => setActiveFocus(item)}
                className={`p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between h-28 relative rounded-none select-none ${
                  isActive
                    ? "border-[#c3f400] bg-[#c3f400]/5 shadow-[0_0_15px_rgba(195,244,0,0.15)]"
                    : "border-white/5 bg-[#050505]/40 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-2 h-2 rounded-full ${isActive ? "bg-[#c3f400] animate-ping" : "bg-white/20"}`} />
                  <span className="font-mono text-[9px] text-white/20">0{index + 1}</span>
                </div>
                <h5 className={`font-mono text-[10px] leading-tight font-bold ${isActive ? "text-[#c3f400]" : "text-white/70"}`}>
                  {item}
                </h5>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c3f400]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
