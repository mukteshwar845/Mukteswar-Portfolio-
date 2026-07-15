import React, { useState, useMemo, useEffect } from "react";
import { 
  Briefcase, 
  Cpu, 
  GitBranch, 
  Calendar, 
  Search, 
  ExternalLink, 
  Github, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  Check, 
  ArrowRight, 
  Info, 
  Zap, 
  TrendingUp, 
  Lock, 
  Database,
  GitCommit,
  GitPullRequest,
  Sparkles,
  BookOpen
} from "lucide-react";
import { 
  PROJECTS_DATA, 
  TIMELINE_ITEMS, 
  ECOSYSTEM_GROUPS, 
  STATS, 
  CATEGORIES, 
  ProjectDetail 
} from "../data/projectsData";
import { GitHubStatsWidget } from "./GitHubStatsWidget";
import { MagneticCard } from "./MagneticCard";
import { getSyncedProjects } from "../lib/syncEngine";

interface ShowcaseDashboardProps {
  projects?: ProjectDetail[];
}

export const ShowcaseDashboard: React.FC<ShowcaseDashboardProps> = ({ projects: propsProjects }) => {
  // Navigation / Selection State
  const [projects, setProjects] = useState<ProjectDetail[]>(() => propsProjects || getSyncedProjects());

  useEffect(() => {
    if (propsProjects) {
      setProjects(propsProjects);
    }
  }, [propsProjects]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [testSuiteRunning, setTestSuiteRunning] = useState<boolean>(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  // Simulated GitHub Contributions (365-day heat map layout wrapper, styled elegantly)
  const simulatedContributions = useMemo(() => {
    const contributionLevels = [0, 1, 2, 3, 2, 1, 0, 1, 3, 4, 2, 1, 0, 0, 2, 3, 4, 1, 2, 0, 3, 2, 1, 4];
    return Array.from({ length: 98 }, (_, idx) => {
      const val = contributionLevels[idx % contributionLevels.length];
      let colorClass = "bg-[#101010] border border-white/5";
      if (val === 1) colorClass = "bg-emerald-950/40 border border-emerald-900/35";
      if (val === 2) colorClass = "bg-emerald-900/60 border border-emerald-800/40";
      if (val === 3) colorClass = "bg-emerald-700/80 border border-emerald-600/30";
      if (val === 4) colorClass = "bg-emerald-500 border border-emerald-400/20 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
      return { id: idx, val, colorClass };
    });
  }, []);

  // Filtered Projects Computation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category Filter
      const matchesCategory = 
        selectedCategory === "All" ||
        project.category === selectedCategory ||
        project.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());

      // Search Query Filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.longDescription.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query) ||
        project.architecture.database.toLowerCase().includes(query) ||
        project.architecture.client.toLowerCase().includes(query) ||
        project.architecture.server.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, projects]);

  // Handle running simulated project tests inside the details modal
  const runProjectVerification = (projectTitle: string) => {
    if (testSuiteRunning) return;
    setTestSuiteRunning(true);
    setTestLogs([
      `[SysExec] Spin-up secure container node on sandbox...`,
      `[EnvCheck] Loaded local configurations.`,
      `[GitCheckout] Sourcing HEAD revision of ${projectTitle}.`
    ]);

    const stepLogs = [
      `[DependencyCheck] Running integrity inspection on module packages...`,
      `[Compiler] Bundling sources through client optimizer...`,
      `[BuildSec] Core static payload compiled successfully.`,
      `[TestSuite] Dispatched 14 automated unit tests...`,
      `[Assert] Testing database connection pools... OK (1.1ms)`,
      `[Assert] Verifying payload sanitization guards... OK`,
      `[TestSuite] ALL ASSERTIONS PASSED // 14/14 tests green.`,
      `[Telemetry] Execution time: 18ms | RAM overhead: 12.5MB`,
      `[Status] SUCCESS! Deploy node is fully operational.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < stepLogs.length) {
        setTestLogs(prev => [...prev, stepLogs[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTestSuiteRunning(false);
      }
    }, 600);
  };

  // Close details modal helper
  const handleCloseModal = () => {
    setActiveProject(null);
    setTestLogs([]);
    setTestSuiteRunning(false);
  };

  // Get difficulty badge color rules
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-green-500/10 border border-green-500/30 text-green-400";
      case "Medium": return "bg-blue-500/10 border border-blue-500/30 text-blue-400";
      case "Hard": return "bg-amber-500/10 border border-amber-500/30 text-amber-400";
      case "Expert": return "bg-red-500/10 border border-red-500/30 text-red-400";
      default: return "bg-zinc-500/10 border border-zinc-500/30 text-zinc-400";
    }
  };

  // Get status badge color rules
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete": return "text-[#c3f400] bg-[#c3f400]/5 border border-[#c3f400]/20";
      case "Beta": return "text-cyan-400 bg-cyan-400/5 border border-cyan-400/20";
      case "In Progress": return "text-orange-400 bg-orange-400/5 border border-orange-400/20";
      default: return "text-zinc-400 bg-zinc-400/5 border border-zinc-400/20";
    }
  };

  return (
    <div className="space-y-20">
      
      {/* 1. Projects Dashboard - Animated Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {STATS.map((stat, idx) => {
          // Render suitable icons for metrics dynamically
          const renderIcon = (label: string) => {
            if (label.includes("Projects")) return <Briefcase className="w-4 h-4 text-[#c3f400]" />;
            if (label.includes("Tech")) return <Cpu className="w-4 h-4 text-[#adc6ff]" />;
            if (label.includes("Repos")) return <GitBranch className="w-4 h-4 text-[#c3f400]" />;
            if (label.includes("Years")) return <Calendar className="w-4 h-4 text-[#adc6ff]" />;
            if (label.includes("APIs")) return <Zap className="w-4 h-4 text-cyan-400" />;
            if (label.includes("Contribs")) return <GitPullRequest className="w-4 h-4 text-emerald-400" />;
            return <Activity className="w-4 h-4 text-white/50" />;
          };

          return (
            <div 
              key={stat.label} 
              className="bg-[#0b0b0d] border border-white/5 p-4 relative overflow-hidden group hover:border-[#adc6ff]/30 transition-all duration-300"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
            >
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">0{idx + 1}</span>
                {renderIcon(stat.label)}
              </div>
              <div className="font-sora text-2xl font-black text-white tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono text-white/60 tracking-wide mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Category Filter buttons & Project Search */}
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <h3 className="font-sora text-lg font-bold text-white tracking-tight">Interactive Showcases</h3>
            <p className="text-[#c1c6d7] text-xs font-mono mt-1">Explore all repositories, codebases, and experimental tools</p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/30" />
            </span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology, database, framework or keyword..."
              className="w-full bg-[#0b0b0d] border border-white/10 rounded-none pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#adc6ff] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white text-[10px] font-mono uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges List (horizontal scroll on mobile) */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-wide uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#c3f400] text-black border-[#c3f400] font-bold"
                  : "bg-[#0b0b0d] text-white/60 hover:text-white border-white/5 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="border border-white/5 p-12 text-center bg-[#070709] max-w-xl mx-auto space-y-4">
            <Info className="w-8 h-8 text-white/30 mx-auto" />
            <div className="text-sm font-mono text-white/60">No matching projects found in directory.</div>
            <p className="text-white/40 text-xs font-sans">
              Try adjusting your search filters or clear the search query to show all static assets.
            </p>
            <button 
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <MagneticCard
                key={proj.id}
                onClick={() => setActiveProject(proj)}
                className="h-full"
              >
                <div className="glass-card group p-1 relative flex flex-col justify-between overflow-hidden h-full">
                  <div>
                    {/* Thumbnail Image container */}
                    <div className="h-48 bg-black relative overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-30 grayscale group-hover:grayscale-0"
                        style={{ backgroundImage: `url('${proj.imageUrl}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-90" />
                      
                      {/* Category Overlay */}
                      <div className="absolute bottom-4 left-4 z-10 group-hover:opacity-0 transition-opacity duration-300">
                        <span className="bg-[#adc6ff]/10 backdrop-blur-md border border-[#adc6ff]/20 text-[#adc6ff] font-mono text-[8px] tracking-widest uppercase px-2 py-0.5">
                          {proj.category}
                        </span>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="absolute top-4 right-4 z-10 group-hover:opacity-0 transition-opacity duration-300">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 uppercase ${getDifficultyColor(proj.difficulty)}`}>
                          {proj.difficulty}
                        </span>
                      </div>

                      {/* Micro Quick View Prompt Badge */}
                      <div className="absolute top-4 left-4 z-10 group-hover:opacity-0 transition-opacity duration-300 flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/5 px-2 py-0.5 text-[7px] font-mono text-white/50">
                        <Sparkles className="w-2.5 h-2.5 text-[#c3f400] animate-pulse" />
                        <span>QUICK VIEW</span>
                      </div>

                      {/* Interactive 'Quick View' Slide-up Overlay */}
                      <div className="absolute inset-0 bg-[#070709]/95 backdrop-blur-md p-5 flex flex-col justify-between border-b border-[#adc6ff]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                            <span className="font-mono text-[8px] text-[#adc6ff] tracking-widest uppercase font-black flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#c3f400] animate-pulse inline-block" /> Telemetry Snapshot
                            </span>
                            <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 uppercase ${getStatusColor(proj.status)}`}>
                              {proj.status}
                            </span>
                          </div>

                          {/* Completion Metrics */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8px] font-mono text-white/40">
                              <span>COMPLETION STATUS</span>
                              <span className="text-[#c3f400] font-bold">{proj.completionPercentage}%</span>
                            </div>
                            <div className="h-1 bg-white/5 w-full">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-[#c3f400]" 
                                style={{ width: `${proj.completionPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Primary Tech Stack */}
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider block">Primary Tech Stack</span>
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-[8px] font-mono text-[#c3f400] bg-[#c3f400]/5 border border-[#c3f400]/20 px-1.5 py-0.5">
                                  {tag}
                                </span>
                              ))}
                              {proj.tags.length > 4 && (
                                <span className="text-[8px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5">
                                  +{proj.tags.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer telemetry information */}
                        <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[8px] font-mono text-white/40">
                          <span className="uppercase">Core DB Node</span>
                          <span className="text-[#adc6ff] font-bold truncate max-w-[100px]">{proj.architecture.database || "SQL / Local"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-sora text-base font-bold text-white group-hover:text-[#adc6ff] transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                        <p className="text-white/40 font-mono text-[9px] mt-1">Timeline: {proj.timeline}</p>
                      </div>

                      <p className="text-[#c1c6d7] font-sans text-xs leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>

                      {/* Completion Level meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-white/40">
                          <span>COMPLETION RATIO</span>
                          <span className="text-[#c3f400]">{proj.completionPercentage}%</span>
                        </div>
                        <div className="h-1 bg-white/5 w-full">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-[#c3f400]" 
                            style={{ width: `${proj.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Badges & Buttons */}
                  <div className="p-6 pt-0 border-t border-white/5 mt-4">
                    <div className="flex flex-wrap gap-1 mb-4 pt-4">
                      {proj.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                      {proj.tags.length > 3 && (
                        <span className="text-[9px] font-mono text-[#adc6ff] bg-white/5 px-2 py-0.5">
                          +{proj.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-[#adc6ff]">
                      <span>Scope: <strong className="text-white">{proj.teamSize}</strong></span>
                      <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[#c3f400]">
                        Review Specs <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            ))}
          </div>
        )}
      </div>

      {/* 5. Technology Timeline - Learn Path over time */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
            Evolution Chronology
          </span>
          <h3 className="font-sora text-2xl font-extrabold text-white tracking-tight">
            Technology Timeline
          </h3>
          <p className="text-[#c1c6d7] text-xs font-sans max-w-md mx-auto">
            Reviewing learned skills, architectures, and framework capabilities logged year-by-year.
          </p>
        </div>

        <div className="relative border-l border-white/10 max-w-4xl mx-auto pl-6 sm:pl-8 space-y-12 py-4">
          {TIMELINE_ITEMS.map((item, index) => (
            <div key={item.year} className="relative group">
              {/* Timeline dot node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 bg-black border-2 border-[#adc6ff] group-hover:border-[#c3f400] transition-colors z-10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#adc6ff] group-hover:bg-[#c3f400] transition-colors" />
              </div>

              <div className="bg-[#0b0b0d] border border-white/5 hover:border-[#adc6ff]/20 p-6 space-y-3 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sora text-lg font-black text-white group-hover:text-[#c3f400] transition-colors">
                    {item.year} Academic Cycle
                  </span>
                  <span className="text-[10px] font-mono text-[#adc6ff] bg-[#adc6ff]/10 px-3 py-1 font-bold">
                    STAGE 0{index + 1}
                  </span>
                </div>

                <p className="text-[#c1c6d7] font-sans text-xs leading-relaxed">
                  {item.milestone}
                </p>

                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">ACQUIRED EXPERTISE</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map(t => (
                      <span key={t} className="text-[9px] font-mono bg-[#111115] text-[#c3f400] px-2 py-0.5 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. GitHub Integration - Real-time Ingress Widget */}
      <GitHubStatsWidget />

      {/* 7. Development Process Pipeline Flow */}
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
            Rigorous Life Cycle Workflow
          </span>
          <h3 className="font-sora text-2xl font-extrabold text-white tracking-tight">
            My Software Development Process
          </h3>
          <p className="text-[#c1c6d7] text-xs font-sans max-w-md mx-auto">
            Hover over any process node below to review our rigorous step-by-step engineering principles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { step: "01", name: "Idea", details: "Conceiving structural solutions to user core pain-points." },
            { step: "02", name: "Research", details: "Analyzing catalog dependencies and technology options." },
            { step: "03", name: "UI/UX Design", details: "Drafting user interface grid layouts with precise typography." },
            { step: "04", name: "Planning", details: "Mapping dependencies, algorithms, and SQL structures." },
            { step: "05", name: "Development", details: "Writing clean, type-safe, modular, and optimized code." },
            { step: "06", name: "Testing", details: "Verifying response metrics, sandboxes, and compile gates." },
            { step: "07", name: "Deployment", details: "Launching server docker images onto isolated nodes." },
            { step: "08", name: "Maintenance", details: "Monitoring latency, server cache memory, and safety." }
          ].map((item, idx) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`p-4 border transition-all duration-300 relative group text-center flex flex-col justify-between h-36 ${
                hoveredStep === idx 
                  ? "bg-white/5 border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)]"
                  : "bg-[#0b0b0d] border-white/5"
              }`}
            >
              <div>
                <div className="text-[10px] font-mono text-white/35 group-hover:text-[#c3f400] transition-colors">{item.step}</div>
                <div className="font-sora text-xs font-extrabold text-white mt-1 group-hover:scale-105 transition-transform">{item.name}</div>
              </div>
              
              <p className="text-[10px] font-sans text-white/50 leading-relaxed mt-3">
                {item.details}
              </p>

              {/* Connected pointer line arrow */}
              {idx < 7 && (
                <div className="hidden lg:block absolute top-1/2 -right-3.5 z-20 translate-y-[-50%] text-white/10 group-hover:text-[#c3f400] transition-colors">
                  ➔
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8. Technology Ecosystem Grid Mapping */}
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-widest text-[#adc6ff] uppercase font-bold block">
            Ecosystem Directory mapping
          </span>
          <h3 className="font-sora text-2xl font-extrabold text-white tracking-tight">
            Grouped Technology Ecosystem
          </h3>
          <p className="text-[#c1c6d7] text-xs font-sans max-w-xl">
            A comprehensive overview of my tech stack separated into operational stacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ECOSYSTEM_GROUPS.map((group) => (
            <div 
              key={group.title} 
              className="bg-[#0b0b0d] border border-white/5 p-5 space-y-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-1 h-3 bg-[#adc6ff]" />
                <h5 className="font-mono text-xs font-extrabold text-white uppercase tracking-wider">{group.title}</h5>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.items.map(techName => (
                  <span 
                    key={techName}
                    className="text-[9px] font-mono bg-white/5 hover:bg-[#adc6ff]/10 hover:text-white border border-white/5 hover:border-[#adc6ff]/30 text-white/70 px-2.5 py-1 transition-colors cursor-default"
                  >
                    {techName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Interactive Case Study Modal Details */}
      {activeProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Blur Overlay */}
          <div 
            className="fixed inset-0 bg-[#050507]/90 backdrop-blur-md cursor-zoom-out"
            onClick={handleCloseModal}
          />

          {/* Modal Content container */}
          <div 
            className="relative w-full max-w-4xl bg-[#0b0b0d] border border-[#adc6ff]/30 rounded-none shadow-[0_0_80px_rgba(173,198,255,0.15)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
          >
            {/* Header section with Close */}
            <div className="flex justify-between items-center bg-[#070709] border-b border-white/5 px-6 py-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#c3f400] rounded-none animate-pulse" />
                <span className="font-mono text-[10px] text-[#adc6ff] tracking-widest uppercase font-bold">
                  Spec File Inspection: {activeProject.id}.spec
                </span>
              </div>
              <button 
                onClick={handleCloseModal}
                className="font-mono text-xs text-white/50 hover:text-white hover:underline uppercase"
              >
                Close Spec [X]
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
              {/* Hero Image Block */}
              <div className="h-64 md:h-80 relative overflow-hidden bg-black border border-white/5">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url('${activeProject.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 max-w-xl space-y-2">
                  <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 uppercase ${getDifficultyColor(activeProject.difficulty)}`}>
                    {activeProject.difficulty} LEVEL
                  </span>
                  <h3 className="font-sora text-2xl md:text-3xl font-black text-white tracking-tight">
                    {activeProject.title}
                  </h3>
                  <p className="text-white/80 font-sans text-xs leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>
              </div>

              {/* Micro specs counters */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-black/40 border border-white/5 p-4 text-center">
                <div>
                  <div className="text-[8px] font-mono text-white/40 uppercase">RUN SPEED</div>
                  <div className="font-mono text-xs text-[#c3f400] font-black mt-1">{activeProject.metrics.speed}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-white/40 uppercase">COMMITS LOG</div>
                  <div className="font-mono text-xs text-[#adc6ff] font-black mt-1">{activeProject.metrics.commits}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-white/40 uppercase">LINES OF CODE</div>
                  <div className="font-mono text-xs text-[#adc6ff] font-black mt-1">{activeProject.metrics.linesOfCode}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-white/40 uppercase">SIZE ON REPO</div>
                  <div className="font-mono text-xs text-cyan-400 font-black mt-1">{activeProject.metrics.repoSize}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-white/40 uppercase">ISSUES SOLVED</div>
                  <div className="font-mono text-xs text-emerald-400 font-black mt-1">{activeProject.metrics.issuesSolved}</div>
                </div>
              </div>

              {/* Core Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Side detail specs */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <h5 className="font-mono text-xs font-extrabold text-[#adc6ff] uppercase tracking-wider">Project Overview</h5>
                    <p className="text-white/70 text-xs leading-relaxed font-sans">{activeProject.longDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 bg-[#121215] border border-white/5 p-4">
                      <h6 className="font-mono text-[10px] font-extrabold text-[#c3f400] uppercase tracking-widest">Problem Statement</h6>
                      <p className="text-white/60 text-[11px] leading-relaxed font-sans">{activeProject.problemStatement}</p>
                    </div>
                    <div className="space-y-2 bg-[#121215] border border-white/5 p-4">
                      <h6 className="font-mono text-[10px] font-extrabold text-[#adc6ff] uppercase tracking-widest">Solution Approach</h6>
                      <p className="text-white/60 text-[11px] leading-relaxed font-sans">{activeProject.solution}</p>
                    </div>
                  </div>

                  {/* Architecture flow schematic diagram */}
                  <div className="space-y-3 bg-black/60 border border-white/5 p-5 font-mono text-[10px]">
                    <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">SYSTEM ARCHITECTURE SCHEMATIC FLOW</div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-center pt-3">
                      <div className="flex-1 bg-[#121215] border border-white/10 p-2 text-white/80 rounded-none font-bold">
                        <div>Client</div>
                        <div className="text-[8px] text-white/40 mt-1 truncate">{activeProject.architecture.client.split(",")[0]}</div>
                      </div>
                      
                      <div className="text-white/30 text-xs rotate-90 sm:rotate-0 my-0.5 sm:my-0">➔</div>

                      <div className="flex-1 bg-[#121215] border border-white/10 p-2 text-[#adc6ff] rounded-none font-bold">
                        <div>Gateway</div>
                        <div className="text-[8px] text-white/40 mt-1 truncate">{activeProject.architecture.auth.split(" ")[0]}</div>
                      </div>

                      <div className="text-white/30 text-xs rotate-90 sm:rotate-0 my-0.5 sm:my-0">➔</div>

                      <div className="flex-1 bg-[#121215] border border-white/10 p-2 text-[#c3f400] rounded-none font-bold">
                        <div>Server</div>
                        <div className="text-[8px] text-white/40 mt-1 truncate">{activeProject.architecture.server.split(" ")[0]}</div>
                      </div>

                      <div className="text-white/30 text-xs rotate-90 sm:rotate-0 my-0.5 sm:my-0">➔</div>

                      <div className="flex-1 bg-[#121215] border border-white/10 p-2 text-cyan-400 rounded-none font-bold">
                        <div>Database</div>
                        <div className="text-[8px] text-white/40 mt-1 truncate">{activeProject.architecture.database.split(" ")[0]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Challenges faced / lessons learned */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h5 className="font-mono text-xs font-extrabold text-[#adc6ff] uppercase tracking-wider">Engineering Challenges Faced</h5>
                      <p className="text-white/70 text-xs leading-relaxed font-sans">{activeProject.challenges}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-mono text-xs font-extrabold text-[#adc6ff] uppercase tracking-wider">Lessons Learned</h5>
                      <p className="text-white/70 text-xs leading-relaxed font-sans">{activeProject.lessons}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side metadata checklist */}
                <div className="md:col-span-5 space-y-6">
                  {/* Checklist Features */}
                  <div className="bg-[#101012] border border-white/5 p-5 space-y-4">
                    <h5 className="font-mono text-xs font-extrabold text-white uppercase tracking-wider">Core Features</h5>
                    <ul className="space-y-2.5 font-sans text-xs text-white/70">
                      {activeProject.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#c3f400] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Future Plans Checklist */}
                  <div className="bg-[#101012] border border-white/5 p-5 space-y-4">
                    <h5 className="font-mono text-xs font-extrabold text-[#adc6ff] uppercase tracking-wider">Future Improvements</h5>
                    <ul className="space-y-2.5 font-sans text-xs text-white/70">
                      {activeProject.futurePlans.map((plan) => (
                        <li key={plan} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#adc6ff] shrink-0 mt-0.5" />
                          <span>{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Run verification test suite */}
                  <div className="bg-black border border-white/10 p-5 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 uppercase tracking-widest font-bold">AUTOMATED TEST ENVIRONMENT</span>
                      <button 
                        onClick={() => runProjectVerification(activeProject.title)}
                        disabled={testSuiteRunning}
                        className="px-3 py-1 bg-transparent border border-[#c3f400] text-[#c3f400] hover:bg-[#c3f400] hover:text-black transition-colors"
                      >
                        {testSuiteRunning ? "Running..." : "Execute Test Suite"}
                      </button>
                    </div>

                    <div className="bg-[#050505] p-3 border border-white/5 h-36 overflow-y-auto space-y-1 text-white/80 select-text">
                      {testLogs.length === 0 ? (
                        <span className="text-white/30 italic">Console idle. Click "Execute Test Suite" to verify candidate code integrity...</span>
                      ) : (
                        testLogs.map((log, i) => {
                          let color = "text-white/60";
                          if (log.startsWith("[Status]") || log.startsWith("[TestSuite] ALL")) color = "text-[#c3f400] font-bold";
                          else if (log.startsWith("[SysExec]") || log.startsWith("[Compiler]")) color = "text-[#adc6ff]";
                          return <div key={i} className={color}>{log}</div>;
                        })
                      )}
                      {testSuiteRunning && (
                        <div className="text-[#c3f400] animate-pulse">Running assertions... █</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with external actions */}
            <div className="bg-[#070709] border-t border-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
              <span className="font-mono text-[9px] text-white/30">
                VERIFIED SAFE SANDBOX ARCHITECTURE // SECURE ENVIRONMENT // PORT 3000
              </span>

              <div className="flex gap-3">
                <a 
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 hover:border-white text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
                <a 
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#c3f400] text-black font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Live Application
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
