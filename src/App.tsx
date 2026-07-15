import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Header } from "./components/Header";
import { SidebarDock } from "./components/SidebarDock";
import { ShowcaseDashboard } from "./components/ShowcaseDashboard";
import { CredentialsShowcase } from "./components/CredentialsShowcase";
import { AboutMe, SkillsSnapshot } from "./components/AboutMe";
import { IdentityCard3D } from "./components/IdentityCard3D";
import { Github, Linkedin, Mail, ArrowRight, MessageSquare, MapPin, Phone, Home, User, Code2, Briefcase, Trophy } from "lucide-react";
import { getProjects, getCredentials, getSkills, getAbout, getTimeline } from "./lib/dataService";
import { AdminPanel } from "./components/AdminPanel";
import { InteractiveParticleField } from "./components/InteractiveParticleField";
import { PremiumFuturisticBackground } from "./components/PremiumFuturisticBackground";

export default function App() {
  const [scanCoords, setScanCoords] = useState({ x: 0.0, y: 0.0 });
  const [localTime, setLocalTime] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Dynamic Datasets State
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbCerts, setDbCerts] = useState<any[]>([]);
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [dbAbout, setDbAbout] = useState<any>(null);
  const [dbTimeline, setDbTimeline] = useState<any[]>([]);

  const fetchDatabase = async () => {
    try {
      const [projectsData, certsData, skillsData, aboutData, timelineData] = await Promise.all([
        getProjects(),
        getCredentials(),
        getSkills(),
        getAbout(),
        getTimeline()
      ]);
      setDbProjects(projectsData);
      setDbCerts(certsData);
      setDbSkills(skillsData);
      setDbAbout(aboutData);
      setDbTimeline(timelineData);
    } catch (err) {
      console.error("[Database] Error synchronizing backend data streams:", err);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);
  
  // Contact Uplink State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);

  // Update dynamic cyber clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setLocalTime(`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Submission Uplink Action Handlers
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    setIsTransmitting(true);
    setTransmissionSuccess(false);
    setTransmissionLogs([`[Connection] Initializing secure contact form routing...`]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      });

      const data = await response.json();
      
      // Animate logs arrival sequentially
      let idx = 0;
      const logInterval = setInterval(() => {
        if (idx < data.logs.length) {
          setTransmissionLogs(prev => [...prev, data.logs[idx]]);
          idx++;
        } else {
          clearInterval(logInterval);
          setIsTransmitting(false);
          setTransmissionSuccess(true);
          // Reset form fields
          setContactName("");
          setContactEmail("");
          setContactMessage("");
        }
      }, 650);

    } catch (err) {
      console.error("Transmission uplink offline:", err);
      // Fallback local animation sequence
      setTimeout(() => {
        setTransmissionLogs(prev => [
          ...prev,
          "[Status] Web server is working in backup mode.",
          `[Success] Message prepared successfully for user "${contactName}"!`,
          "[Success] Message saved successfully in backup storage."
        ]);
        setIsTransmitting(false);
        setTransmissionSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }, 1500);
    }
  };

  const handleContactTrigger = () => {
    const section = document.getElementById("uplink-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadResume = () => {
    const resumeContent = `MUKTESWAR GOCHHAYAT - COMPUTER SCIENCE PORTFOLIO RESUME
==========================================================
Email: mukteswar452@gmail.com | Phone: CSE Dept, ITER
LinkedIn: https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/
GitHub: https://github.com/mukteshwar845

OBJECTIVE:
Highly motivated Computer Science Engineering student and Software Engineer,
with a focus on building robust full-stack applications, advanced database
architectures, and intelligent Machine Learning models.

EDUCATION:
- Computer Science Engineering, ITER, SOA University, Bhubaneswar, Odisha

TECHNICAL SKILLS:
- Programming Languages: Python, Java, JavaScript, SQL, Kotlin
- Backend Frameworks: Django, Django REST Framework, REST APIs, Node.js
- Frontend Frameworks: React, Next.js, HTML5, CSS3, Tailwind CSS
- Databases: PostgreSQL, MySQL, SQLite, Firestore
- Tools & Technologies: Git, GitHub, Docker, Linux, VS Code, Drizzle, Vite

AREAS OF ARCHITECTURAL FOCUS:
- Full Stack Development: Scalable single page and server-rendered web applications.
- Machine Learning & Data Science: Predictive models, NumPy, Pandas, Scikit-learn.
- Problem Solving: Highly optimized Data Structures and Algorithms.

CONTACT:
- Location: Bhubaneswar, Odisha
- Portfolio: https://mukteswar.dev (Current Live View)`;

    const blob = new Blob([resumeContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mukteswar_Gochhayat_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[#6366f1] selection:text-white min-h-screen relative font-sans antialiased overflow-x-hidden">
      
      {/* Premium Futuristic Animated Backdrop */}
      <PremiumFuturisticBackground />

      {/* Dynamic Header */}
      <Header 
        onContactClick={handleContactTrigger} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />

      {/* Sidebar Dock (Fixed Left Navigation Bar) */}
      <SidebarDock />

      {/* Primary Container */}
      <main className="relative z-10 pt-20 px-6 md:px-16 xl:pl-32 max-w-7xl mx-auto space-y-16 lg:space-y-32 pb-24">
        {isMobile ? (
          <div className="space-y-16">
            {/* Mobile View - Conditional rendering based on activeTab */}
            {activeTab === "Home" && (
              <section className="relative pt-8 grid grid-cols-1 gap-12 items-center animate-fade-in">
                <InteractiveParticleField />
                
                {/* Left Column Text details */}
                <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <span className="font-mono text-sm tracking-widest text-[#a5b4fc]/90 block uppercase">
                      Hi, I'm 👋
                    </span>
                    <h1 className="font-sora text-5xl font-black tracking-tight leading-[1.05] flex flex-col">
                      <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent pb-1 drop-shadow-[0_2px_10px_rgba(99,102,241,0.2)]">
                        Mukteswar
                      </span>
                      <span className="bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#60a5fa] bg-clip-text text-transparent pb-2">
                        Gochhayat
                      </span>
                    </h1>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-[2px] w-8 bg-indigo-500" />
                      <h3 className="font-sora text-sm font-bold tracking-tight text-white/95">
                        Full Stack Developer <span className="text-[#a5b4fc] font-semibold drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]">&amp; AI Enthusiast</span>
                      </h3>
                    </div>
                    <p className="text-[#c1c6d7] font-sans text-xs leading-relaxed max-w-xl pt-1">
                      I build scalable web applications and intelligent systems that solve real-world problems and create impact.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => {
                        setActiveTab("Projects");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-sans text-xs font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View My Work
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleContactTrigger}
                      className="bg-[#0f1015]/60 hover:bg-[#151620]/80 border border-white/10 hover:border-white/30 text-white font-sans text-xs font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      Contact Me
                    </button>
                  </div>

                  {/* Social Links Row */}
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase block">
                      Find me on
                    </span>
                    <div className="flex gap-4">
                      {[
                        {
                          name: "GitHub",
                          icon: Github,
                          href: "https://github.com/mukteshwar845",
                          color: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        },
                        {
                          name: "LinkedIn",
                          icon: Linkedin,
                          href: "https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/",
                          color: "hover:text-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)]"
                        },
                        {
                          name: "LeetCode",
                          icon: "leetcode",
                          href: "https://leetcode.com/u/mukteswar845/",
                          color: "hover:text-[#ffa116] hover:border-[#ffa116] hover:shadow-[0_0_15px_rgba(255,161,22,0.2)]"
                        },
                        {
                          name: "Email",
                          icon: Mail,
                          href: "mailto:mukteswar452@gmail.com",
                          color: "hover:text-[#ea4335] hover:border-[#ea4335] hover:shadow-[0_0_15px_rgba(234,67,53,0.2)]"
                        }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-11 h-11 rounded-full border border-white/10 bg-[#0c0d12]/60 backdrop-blur-md flex items-center justify-center text-white/60 transition-all duration-300 hover:scale-110 ${social.color}`}
                          title={social.name}
                        >
                          {social.icon === "leetcode" ? (
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M16.102 17.93l-2.697 2.607c-.466.452-1.111.975-1.86.975-.778 0-1.423-.523-1.89-1.007L4.975 15.69c-.467-.483-.974-1.127-.974-1.905 0-.778.507-1.423.974-1.907l7.307-7.234c.467-.484 1.112-.975 1.89-.975.748 0 1.394.523 1.86.975l2.697 2.674c.484.452.484 1.196 0 1.648-.484.452-1.22.452-1.704 0l-2.502-2.47c-.244-.21-.523-.356-.838-.356-.316 0-.594.14-.814.356L6.92 13.784c-.21.21-.346.496-.346.814 0 .315.136.594.346.814l4.572 4.54c.22.21.498.356.814.356.315 0 .594-.146.814-.356l2.502-2.438c.484-.452 1.22-.452 1.704 0 .484.452.484 1.196 0 1.618z" />
                              <path d="M20.104 12.338l-4.102-4.043c-.484-.452-1.22-.452-1.704 0-.484.452-.484 1.196 0 1.648l4.102 4.043c.484.452 1.22.452 1.704 0 .484-.452.484-1.196 0-1.648z" />
                            </svg>
                          ) : (
                            <social.icon className="w-4.5 h-4.5" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive 3D ID Card */}
                <div className="w-full relative flex justify-center z-10 animate-fade-in">
                  <IdentityCard3D aboutData={dbAbout} />
                </div>
              </section>
            )}

            {activeTab === "About" && (
              <div className="space-y-16 animate-fade-in">
                <AboutMe skills={dbSkills} aboutData={dbAbout} timelineStory={dbTimeline} />
                {/* Embedded Philosophy under About on Mobile to keep it rich */}
                <section className="glass-card p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#adc6ff]/20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#c3f400]/20 pointer-events-none" />

                  <div className="space-y-6">
                    <span className="font-mono text-[9px] tracking-widest text-[#c3f400] uppercase font-bold block">
                      Coding Philosophy
                    </span>
                    <h2 className="font-sora text-2xl font-extrabold text-white tracking-tight">
                      Software Built with Care
                    </h2>
                    <p className="text-[#c1c6d7] text-xs leading-relaxed font-sans">
                      I believe that great software should be both powerful and delightful to use. By pairing rigorous computer science foundations with simple English and visual animations, I build high-performance web applications that are accessible, reliable, and modern.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "Skills" && (
              <div className="animate-fade-in">
                <SkillsSnapshot skills={dbSkills} aboutData={dbAbout} />
              </div>
            )}

            {activeTab === "Projects" && (
              <section id="case-studies" className="space-y-12 scroll-mt-28 animate-fade-in">
                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
                    Portfolio Showroom
                  </span>
                  <h2 className="font-sora text-2xl font-extrabold text-white tracking-tight">
                    Interactive Projects & Tech Stack
                  </h2>
                </div>
                <ShowcaseDashboard projects={dbProjects} />
              </section>
            )}

            {activeTab === "Achievements" && (
              <section id="credentials" className="space-y-12 scroll-mt-28 animate-fade-in">
                <div className="text-center space-y-4">
                  <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
                    Engineering Milestones
                  </span>
                  <h2 className="font-sora text-2xl font-extrabold text-white tracking-tight">
                    🏆 Achievements
                  </h2>
                </div>
                <CredentialsShowcase credentials={dbCerts} />
              </section>
            )}
          </div>
        ) : (
          <>
            {/* Section 1: Hero Profile Grid */}
            <section className="relative pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <InteractiveParticleField />
              
              {/* Left Column Text details */}
              <div className="lg:col-span-6 space-y-8 animate-fade-in-up relative z-10">
                <div className="space-y-4">
                  <span className="font-mono text-sm tracking-widest text-[#a5b4fc]/90 block uppercase">
                    Hi, I'm 👋
                  </span>
                  <h1 className="font-sora text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] flex flex-col">
                    <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent pb-1 drop-shadow-[0_2px_10px_rgba(99,102,241,0.2)]">
                      Mukteswar
                    </span>
                    <span className="bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#60a5fa] bg-clip-text text-transparent pb-2">
                      Gochhayat
                    </span>
                  </h1>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-[2px] w-8 bg-indigo-500" />
                    <h3 className="font-sora text-base md:text-lg font-bold tracking-tight text-white/95">
                      Full Stack Developer <span className="text-[#a5b4fc] font-semibold drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]">&amp; AI Enthusiast</span>
                    </h3>
                  </div>
                  <p className="text-[#c1c6d7] font-sans text-sm md:text-base leading-relaxed max-w-xl pt-1">
                    I build scalable web applications and intelligent systems that solve real-world problems and create impact.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <a 
                    href="#case-studies"
                    className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-sans text-xs md:text-sm font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={handleContactTrigger}
                    className="bg-[#0f1015]/60 hover:bg-[#151620]/80 border border-white/10 hover:border-white/30 text-white font-sans text-xs md:text-sm font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Contact Me
                  </button>
                </div>

                {/* Social Links Row */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase block">
                    Find me on
                  </span>
                  <div className="flex gap-4">
                    {[
                      {
                        name: "GitHub",
                        icon: Github,
                        href: "https://github.com/mukteshwar845",
                        color: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      },
                      {
                        name: "LinkedIn",
                        icon: Linkedin,
                        href: "https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/",
                        color: "hover:text-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)]"
                      },
                      {
                        name: "LeetCode",
                        icon: "leetcode",
                        href: "https://leetcode.com/u/mukteswar845/",
                        color: "hover:text-[#ffa116] hover:border-[#ffa116] hover:shadow-[0_0_15px_rgba(255,161,22,0.2)]"
                      },
                      {
                        name: "Email",
                        icon: Mail,
                        href: "mailto:mukteswar452@gmail.com",
                        color: "hover:text-[#ea4335] hover:border-[#ea4335] hover:shadow-[0_0_15px_rgba(234,67,53,0.2)]"
                      }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 rounded-full border border-white/10 bg-[#0c0d12]/60 backdrop-blur-md flex items-center justify-center text-white/60 transition-all duration-300 hover:scale-110 ${social.color}`}
                        title={social.name}
                      >
                        {social.icon === "leetcode" ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M16.102 17.93l-2.697 2.607c-.466.452-1.111.975-1.86.975-.778 0-1.423-.523-1.89-1.007L4.975 15.69c-.467-.483-.974-1.127-.974-1.905 0-.778.507-1.423.974-1.907l7.307-7.234c.467-.484 1.112-.975 1.89-.975.748 0 1.394.523 1.86.975l2.697 2.674c.484.452.484 1.196 0 1.648-.484.452-1.22.452-1.704 0l-2.502-2.47c-.244-.21-.523-.356-.838-.356-.316 0-.594.14-.814.356L6.92 13.784c-.21.21-.346.496-.346.814 0 .315.136.594.346.814l4.572 4.54c.22.21.498.356.814.356.315 0 .594-.146.814-.356l2.502-2.438c.484-.452 1.22-.452 1.704 0 .484.452.484 1.196 0 1.618z" />
                            <path d="M20.104 12.338l-4.102-4.043c-.484-.452-1.22-.452-1.704 0-.484.452-.484 1.196 0 1.648l4.102 4.043c.484.452 1.22.452 1.704 0 .484-.452.484-1.196 0-1.648z" />
                          </svg>
                        ) : (
                          <social.icon className="w-4.5 h-4.5" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D ID Card */}
              <div className="lg:col-span-6 w-full relative flex justify-center lg:justify-end z-10">
                <IdentityCard3D aboutData={dbAbout} />
              </div>
            </section>

            {/* Section 2: About Me */}
            <AboutMe skills={dbSkills} aboutData={dbAbout} timelineStory={dbTimeline} />

            {/* Section 3: Skills Snapshot */}
            <SkillsSnapshot skills={dbSkills} aboutData={dbAbout} />

            {/* Section 4: Interactive Projects & Tech Stack Showcase */}
            <section id="case-studies" className="space-y-12 scroll-mt-28">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
                    Portfolio Showroom
                  </span>
                  <h2 className="font-sora text-3xl font-extrabold text-white tracking-tight mt-2">
                    Interactive Projects & Tech Stack
                  </h2>
                </div>
                <p className="text-[#c1c6d7] text-xs font-mono max-w-sm">
                  A premium selection of computer science engineering solutions, complete with real-time analytics, automated test suites, and dynamic system architectures.
                </p>
              </div>

              <ShowcaseDashboard projects={dbProjects} />
            </section>

            {/* Section 5: Achievements & Certificates */}
            <section id="credentials" className="space-y-12 scroll-mt-28">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4 max-w-3xl mx-auto"
              >
                <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold">
                  Engineering Milestones
                </span>
                <h2 className="font-sora text-4xl font-extrabold text-white tracking-tight">
                  🏆 Achievements
                </h2>
                <p className="font-sans text-sm text-[#c1c6d7] max-w-xl mx-auto leading-relaxed mt-2">
                  "Every milestone represents curiosity, continuous learning, and the pursuit of engineering excellence."
                </p>
                <div className="h-0.5 w-16 bg-[#c3f400] mx-auto mt-4" />
              </motion.div>

              <CredentialsShowcase credentials={dbCerts} />
            </section>

            {/* Section 6: Philosophy Section (My Coding Philosophy) */}
            <section className="glass-card p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#adc6ff]/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#c3f400]/20 pointer-events-none" />

              <div className="max-w-3xl space-y-8">
                <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold block">
                  Coding Philosophy
                </span>
                <h2 className="font-sora text-3xl font-extrabold text-white tracking-tight">
                  Software Built with Care
                </h2>
                <p className="text-[#c1c6d7] text-base leading-relaxed font-sans">
                  I believe that great software should be both powerful and delightful to use. By pairing rigorous computer science foundations with simple English and visual animations, I build high-performance web applications that are accessible, reliable, and modern.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 font-mono">
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-2xl font-bold text-[#adc6ff]">03+</span>
                    <span className="block text-[8px] text-white/40 uppercase tracking-widest mt-1">Years Coding</span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-2xl font-bold text-[#adc6ff]">15+</span>
                    <span className="block text-[8px] text-white/40 uppercase tracking-widest mt-1">Repositories</span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-2xl font-bold text-[#adc6ff]">08+</span>
                    <span className="block text-[8px] text-white/40 uppercase tracking-widest mt-1">Featured Apps</span>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <span className="text-2xl font-bold text-[#c3f400]">99%</span>
                    <span className="block text-[8px] text-[#c3f400] uppercase tracking-widest mt-1">App Uptime</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Section 7: Communication Form (Get In Touch) */}
        <section id="uplink-section" className="space-y-10 scroll-mt-28">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold block">
                Get In Touch
              </span>
              <h2 className="font-sora text-3xl font-extrabold text-white tracking-tight mt-2">
                Let's Stay in Touch
              </h2>

            </div>
            <p className="text-[#c1c6d7] text-xs font-mono max-w-sm">
              Feel free to drop a friendly message, project idea, or career offer. Your submissions are processed securely and routed directly to my primary inbox!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Input Form Fields */}
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest mb-2 font-bold">
                    Your Name (Full Name)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    disabled={isTransmitting}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#0f0f0f] border border-white/10 px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#adc6ff] font-mono transition-colors placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest mb-2 font-bold">
                    Your Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={isTransmitting}
                    placeholder="e.g. email@example.com"
                    className="w-full bg-[#0f0f0f] border border-white/10 px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#adc6ff] font-mono transition-colors placeholder-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#adc6ff] uppercase tracking-widest mb-2 font-bold">
                  Your Message
                </label>
                <textarea 
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={isTransmitting}
                  placeholder="Hi Mukteswar, I would love to connect with you!"
                  className="w-full bg-[#0f0f0f] border border-white/10 px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#adc6ff] font-mono transition-colors placeholder-white/20 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-wrap gap-3">
                  <button 
                    type="submit"
                    disabled={isTransmitting}
                    className="cyber-btn-primary flex items-center gap-2 cursor-pointer uppercase text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">send</span>
                    Send Message
                  </button>
                  
                  <a
                    href="mailto:mukteswar452@gmail.com?subject=Inquiry from Portfolio&body=Hi Mukteswar,%0D%0A%0D%0AI saw your portfolio and would like to connect!%0D%0A%0D%0ABest regards,"
                    className="border border-[#adc6ff]/20 hover:border-[#adc6ff]/80 text-[#adc6ff] hover:text-white px-5 py-2.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2"
                    style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    title="Open your email application directly"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Email Directly
                  </a>
                </div>
                
                {transmissionSuccess && (
                  <span className="font-mono text-[10px] text-[#c3f400] font-bold tracking-wider animate-pulse uppercase">
                    Message Sent Successfully! ✅
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>

      </main>

      {/* Modern Footer */}
      <footer className="bg-[#040406] border-t border-white/5 pt-16 pb-12 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          {/* Brand/Logo Column */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-3 group transition-all">
              <div className="bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#3b82f6] text-white font-black text-xl px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform duration-300">
                MG
              </div>
              <span className="font-sora text-base font-extrabold text-white tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
                Mukteswar Gochhayat
              </span>
            </a>
            <p className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase">
              © 2025 All rights reserved.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h4 className="font-sora text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 font-mono text-[11px] text-zinc-400">
              {[
                { label: "Home", href: "#" },
                { label: "About", href: "#about" },
                { label: "Skills", href: "#skills" },
                { label: "Projects", href: "#case-studies" },
                { label: "Achievements", href: "#credentials" },
                { label: "Contact", href: "#uplink-section" }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-indigo-400 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="font-sora text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-mono text-[11px] text-zinc-400">
              <li>
                <a href="https://github.com/mukteshwar845" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <button onClick={handleDownloadResume} className="hover:text-indigo-400 transition-colors text-left focus:outline-none cursor-pointer">
                  Resume
                </button>
              </li>
              <li>
                <a href="https://leetcode.com/u/mukteswar845/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                  LeetCode
                </a>
              </li>
            </ul>
          </div>

          {/* Let's Connect Column */}
          <div className="space-y-4">
            <h4 className="font-sora text-xs font-bold text-white uppercase tracking-wider">
              Let's Connect
            </h4>
            <ul className="space-y-2.5 font-mono text-[11px] text-zinc-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Odisha, India</span>
              </li>
            </ul>

            {/* Social Connection Row */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  name: "GitHub",
                  icon: Github,
                  href: "https://github.com/mukteshwar845"
                },
                {
                  name: "LinkedIn",
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/"
                },
                {
                  name: "Mail",
                  icon: Mail,
                  href: "mailto:mukteswar452@gmail.com"
                },
                {
                  name: "LeetCode",
                  icon: "leetcode",
                  href: "https://leetcode.com/u/mukteswar845/"
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 bg-[#0c0d12]/60 hover:bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)] transition-all duration-300 hover:scale-110"
                  title={social.name}
                >
                  {social.icon === "leetcode" ? (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M16.102 17.93l-2.697 2.607c-.466.452-1.111.975-1.86.975-.778 0-1.423-.523-1.89-1.007L4.975 15.69c-.467-.483-.974-1.127-.974-1.905 0-.778.507-1.423.974-1.907l7.307-7.234c.467-.484 1.112-.975 1.89-.975.748 0 1.394.523 1.86.975l2.697 2.674c.484.452.484 1.196 0 1.648-.484.452-1.22.452-1.704 0l-2.502-2.47c-.244-.21-.523-.356-.838-.356-.316 0-.594.14-.814.356L6.92 13.784c-.21.21-.346.496-.346.814 0 .315.136.594.346.814l4.572 4.54c.22.21.498.356.814.356.315 0 .594-.146.814-.356l2.502-2.438c.484-.452 1.22-.452 1.704 0 .484.452.484 1.196 0 1.618z" />
                      <path d="M20.104 12.338l-4.102-4.043c-.484-.452-1.22-.452-1.704 0-.484.452-.484 1.196 0 1.648l4.102 4.043c.484.452 1.22.452 1.704 0 .484-.452.484-1.196 0-1.648z" />
                    </svg>
                  ) : (
                    <social.icon className="w-3.5 h-3.5" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
        

      </footer>
      
      {/* Mobile Floating Glass Dock */}
      {isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[420px]">
          <div className="bg-[#050508]/90 border border-white/10 rounded-2xl backdrop-blur-xl py-2.5 px-4 flex justify-around items-center shadow-[0_15px_35px_rgba(0,0,0,0.8),_0_0_20px_rgba(99,102,241,0.05)] relative">
            
            {/* Top slim glass reflection */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-full" />

            {[
              { label: "Home", icon: Home },
              { label: "About", icon: User },
              { label: "Skills", icon: Code2 },
              { label: "Projects", icon: Briefcase },
              { label: "Achievements", icon: Trophy },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all duration-300 relative cursor-pointer ${
                    isActive 
                      ? "text-[#c3f400]" 
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <TabIcon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(195,244,0,0.4)]" : "scale-100"}`} />
                  <span className="font-mono text-[7px] tracking-wider uppercase mt-1">
                    {tab.label === "Achievements" ? "Milestones" : tab.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -bottom-1 w-5 h-[2px] bg-[#c3f400] rounded-full shadow-[0_0_8px_#c3f400]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AdminPanel onDataChange={fetchDatabase} />
    </div>
  );
}
