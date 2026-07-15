import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  AlertCircle, 
  Save, 
  Folder, 
  Award, 
  Cpu, 
  Terminal, 
  Loader2, 
  Sparkles,
  RefreshCw,
  LogOut,
  FileText
} from "lucide-react";
import { 
  loginAdmin, 
  logoutAdmin, 
  checkAdminSession, 
  getStoredToken,
  getProjects, 
  saveProject, 
  deleteProject,
  getCredentials, 
  saveCredential, 
  deleteCredential,
  getSkills, 
  saveSkills,
  SkillCategoryData,
  getResume,
  saveResumeText,
  uploadResumeFile,
  resetResume,
  ResumeData
} from "../lib/dataService";
import { ProjectDetail } from "../data/projectsData";
import { CertificateDetail } from "../data/credentialsData";

interface AdminPanelProps {
  onDataChange: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "skills" | "resume">("projects");

  // Entity Lists
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [credentials, setCredentials] = useState<CertificateDetail[]>([]);
  const [skills, setSkills] = useState<SkillCategoryData[]>([]);
  
  // Resume state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isResumeSaving, setIsResumeSaving] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  // Selection & Form States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  
  // Custom console log system for hacker-cyberpunk styling
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 30)]);
  };

  // Forms
  const [projectForm, setProjectForm] = useState<Partial<ProjectDetail>>({
    id: "",
    title: "",
    category: "Full Stack",
    description: "",
    longDescription: "",
    problemStatement: "",
    solution: "",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600",
    tags: [],
    difficulty: "Medium",
    status: "Complete",
    completionPercentage: 100,
    timeline: "2026",
    teamSize: "Solo",
    repoUrl: "https://github.com/mukteshwar845",
    liveUrl: "https://mukteswar.dev",
    features: [],
    architecture: { client: "React", server: "Node.js", database: "PostgreSQL", auth: "Passcode Authentication" },
    metrics: { speed: "Instant", commits: 24, linesOfCode: "1.2k lines", repoSize: "1.5 MB", issuesSolved: 4 },
    challenges: "",
    lessons: "",
    futurePlans: [],
    isFeatured: false
  });

  const [certForm, setCertForm] = useState<Partial<CertificateDetail>>({
    id: "",
    title: "",
    issuer: "",
    date: "",
    credentialId: "",
    skills: [],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
    verificationUrl: "",
    status: "Verified",
    category: "Backend"
  });

  // Load datasets
  const loadAllData = async () => {
    try {
      const p = await getProjects();
      const c = await getCredentials();
      const s = await getSkills();
      const r = await getResume();
      setProjects(p);
      setCredentials(c);
      setSkills(s);
      if (r) {
        setResumeData(r);
        setResumeText(r.textContent || "");
      }
      addLog(`Sync handshake secure. Synchronized ${p.length} projects, ${c.length} certs, ${s.length} skill tracks.`);
    } catch (err) {
      addLog(`⚠️ Handshake error: Failed to fetch backend databases.`);
    }
  };

  // Check login on mount
  useEffect(() => {
    const checkAuth = async () => {
      const active = await checkAdminSession();
      setIsAuthenticated(active);
      if (active) {
        addLog("Security status: ADMIN SESSION RESTORED");
        loadAllData();
      } else {
        addLog("Security status: UNVERIFIED");
      }
    };
    checkAuth();

    // Check query params or hash for admin panel routing
    if (window.location.search.includes("admin=true") || window.location.hash === "#admin") {
      setIsOpen(true);
    }

    // Listener for custom open event
    const handleOpenAdmin = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-admin", handleOpenAdmin);

    // Keypress listener for secret shortcut (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-admin", handleOpenAdmin);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setIsLoading(true);
    setAuthError(null);
    addLog(`Initiating verification handshake...`);

    const result = await loginAdmin(passcode);
    setIsLoading(false);
    if (result.success) {
      setIsAuthenticated(true);
      setPasscode("");
      addLog(`Verification complete. Token signed. Admin mode ACTIVE.`);
      loadAllData();
    } else {
      setAuthError(result.error || "Invalid Passcode.");
      addLog(`❌ Handshake denied: Verification failed.`);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    addLog(`Logged out. Credentials cleared.`);
  };

  // --------------------------------------------------
  // PROJECT ACTIONS
  // --------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.id || !projectForm.title) {
      addLog(`⚠️ Validation error: Missing Project ID or Title.`);
      return;
    }

    addLog(`Pushing project payload "${projectForm.title}"...`);
    setIsLoading(true);
    const success = await saveProject(projectForm as ProjectDetail);
    setIsLoading(false);

    if (success) {
      addLog(`Success! Saved project "${projectForm.title}" to database.`);
      setEditingProjectId(null);
      // Reset form
      setProjectForm({
        id: "", title: "", category: "Full Stack", description: "", longDescription: "",
        problemStatement: "", solution: "", imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600",
        tags: [], difficulty: "Medium", status: "Complete", completionPercentage: 100,
        timeline: "2026", teamSize: "Solo", repoUrl: "https://github.com/mukteshwar845",
        liveUrl: "https://mukteswar.dev", features: [],
        architecture: { client: "React", server: "Node.js", database: "PostgreSQL", auth: "Passcode Authentication" },
        metrics: { speed: "Instant", commits: 24, linesOfCode: "1.2k lines", repoSize: "1.5 MB", issuesSolved: 4 },
        challenges: "", lessons: "", futurePlans: [], isFeatured: false
      });
      loadAllData();
      onDataChange();
    } else {
      addLog(`❌ Database error: Project sync rejected.`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project permanently from the database?")) return;
    addLog(`Requesting deletion for Project Node [${id}]...`);
    const success = await deleteProject(id);
    if (success) {
      addLog(`Success! Deleted Project Node [${id}].`);
      loadAllData();
      onDataChange();
    } else {
      addLog(`❌ Database error: Deletion failed.`);
    }
  };

  const startEditProject = (p: ProjectDetail) => {
    setEditingProjectId(p.id);
    setProjectForm(p);
    addLog(`Loaded Project Node [${p.id}] into compiler.`);
  };

  // --------------------------------------------------
  // CERTIFICATE ACTIONS
  // --------------------------------------------------
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.id || !certForm.title) {
      addLog(`⚠️ Validation error: Missing Certificate ID or Title.`);
      return;
    }

    addLog(`Pushing credential payload "${certForm.title}"...`);
    setIsLoading(true);
    const success = await saveCredential(certForm as CertificateDetail);
    setIsLoading(false);

    if (success) {
      addLog(`Success! Saved credential "${certForm.title}" to database.`);
      setEditingCertId(null);
      setCertForm({
        id: "", title: "", issuer: "", date: "", credentialId: "", skills: [],
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
        verificationUrl: "", status: "Verified", category: "Backend"
      });
      loadAllData();
      onDataChange();
    } else {
      addLog(`❌ Database error: Credential sync rejected.`);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this credential permanently?")) return;
    addLog(`Requesting deletion for Certificate Node [${id}]...`);
    const success = await deleteCredential(id);
    if (success) {
      addLog(`Success! Deleted Certificate Node [${id}].`);
      loadAllData();
      onDataChange();
    } else {
      addLog(`❌ Database error: Deletion failed.`);
    }
  };

  const startEditCert = (c: CertificateDetail) => {
    setEditingCertId(c.id);
    setCertForm(c);
    addLog(`Loaded Certificate Node [${c.id}] into editor.`);
  };

  // --------------------------------------------------
  // SKILLS ACTIONS
  // --------------------------------------------------
  const handleUpdateSkillRow = (catIndex: number, skillIndex: number, field: string, value: any) => {
    const updated = [...skills];
    updated[catIndex].skills[skillIndex] = {
      ...updated[catIndex].skills[skillIndex],
      [field]: value
    };
    setSkills(updated);
  };

  const handleAddSkillToCat = (catIndex: number) => {
    const updated = [...skills];
    updated[catIndex].skills.push({
      name: "New Skill",
      years: 1,
      projects: 1,
      proficiency: "Intermediate"
    });
    setSkills(updated);
    addLog(`Appended skill node to "${updated[catIndex].title}" track.`);
  };

  const handleRemoveSkillFromCat = (catIndex: number, skillIndex: number) => {
    const updated = [...skills];
    const removedName = updated[catIndex].skills[skillIndex].name;
    updated[catIndex].skills.splice(skillIndex, 1);
    setSkills(updated);
    addLog(`Removed skill node "${removedName}" from track.`);
  };

  const handleSaveSkills = async () => {
    addLog(`Pushing updated skills configurations to server...`);
    setIsLoading(true);
    const success = await saveSkills(skills);
    setIsLoading(false);

    if (success) {
      addLog(`Success! Skill metrics compiled successfully.`);
      loadAllData();
      onDataChange();
    } else {
      addLog(`❌ Database error: Skill metrics sync rejected.`);
    }
  };

  const handleSaveResumeText = async () => {
    addLog(`Saving resume text changes to server...`);
    setIsResumeSaving(true);
    const success = await saveResumeText(resumeText);
    setIsResumeSaving(false);
    if (success) {
      addLog(`Success! Plain text resume updated dynamically.`);
      loadAllData();
    } else {
      addLog(`❌ Error: Resume text save rejected.`);
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploadError(null);
    addLog(`Staging resume file upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError("File size exceeds 5MB limit.");
      addLog(`❌ Error: Staged file exceeds maximum size threshold.`);
      return;
    }

    setIsResumeSaving(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const success = await uploadResumeFile(file.name, base64Data);
      setIsResumeSaving(false);
      if (success) {
        addLog(`Success! Custom resume file uploaded and set active.`);
        loadAllData();
      } else {
        setResumeUploadError("Failed to upload file to backend.");
        addLog(`❌ Error: File upload hand-off failed.`);
      }
    };
    reader.onerror = () => {
      setIsResumeSaving(false);
      setResumeUploadError("Error reading file.");
      addLog(`❌ Error: FileReader failure.`);
    };
    reader.readAsDataURL(file);
  };

  const handleResetResume = async () => {
    addLog(`Reverting active resume to default compiled text mode...`);
    setIsResumeSaving(true);
    const success = await resetResume();
    setIsResumeSaving(false);
    if (success) {
      addLog(`Success! Reverted resume format back to standard text.`);
      loadAllData();
    } else {
      addLog(`❌ Error: Reset handshake rejected.`);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-end overflow-hidden"
          >
            {/* Modal Drawer content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-4xl bg-[#090a0f] border-l border-white/10 h-full flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
            >
              {/* Drawer Header */}
              <div className="px-8 py-6 border-b border-white/5 bg-[#0d0f15]/90 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-[#c3f400]" />
                  <div className="text-left">
                    <h3 className="font-sora text-sm font-black text-white flex items-center gap-2">
                      Admin Settings
                    </h3>
                    <p className="text-xs text-white/60">
                      Manage your projects, achievements, and skills
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
                      title="Clear session token"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      De-auth
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* 1. Login State Guard */}
                {!isAuthenticated ? (
                  <div className="max-w-md mx-auto my-12 bg-black/40 border border-white/5 p-8 text-center space-y-6">
                    <div className="w-14 h-14 bg-red-500/5 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-sora text-base font-bold text-white">Enter Admin Passcode</h4>
                      <p className="text-xs text-white/60 leading-normal">
                        Enter the passcode to manage your portfolio data. Default passcode is configured in `.env.example`.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="ADMIN PASSCODE"
                        className="w-full bg-[#040507] border border-white/10 px-4 py-3 text-sm text-center font-mono focus:outline-none focus:border-[#c3f400] text-white transition-colors"
                        autoFocus
                      />
                      {authError && (
                        <div className="flex items-center gap-2 justify-center text-red-400 font-mono text-[10px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {authError}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#c3f400] hover:bg-white text-black font-mono text-xs uppercase font-black py-3 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.15)]"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                      </button>
                    </form>
                  </div>
                ) : (
                  // Active Panel (Authenticated)
                  <div className="space-y-8">
                    {/* Controls Console Toggle */}
                    <div className="flex bg-[#050608] border border-white/5 p-1 flex-wrap sm:flex-nowrap">
                      {[
                        { id: "projects", label: "Projects", icon: Folder },
                        { id: "certificates", label: "Achievements", fullLabel: "Achievements & Certs", icon: Award },
                        { id: "skills", label: "Skills", icon: Cpu },
                        { id: "resume", label: "Resume", fullLabel: "Resume Manager", icon: FileText }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id as any)}
                          className={`flex-1 py-2.5 px-3 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === t.id
                              ? "bg-[#c3f400] text-black font-black"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden sm:inline">{t.fullLabel || t.label}</span>
                          <span className="inline sm:hidden">{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* ACTIVE COMPILER VIEWPORTS */}
                    {activeTab === "projects" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                        {/* Form (7 cols) */}
                        <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-4 bg-black/20 border border-white/5 p-6">
                          <h4 className="font-sora text-xs font-bold text-[#c3f400] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {editingProjectId ? `Edit Project: [${editingProjectId}]` : "Add New Project"}
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Project ID *</label>
                              <input
                                type="text"
                                value={projectForm.id}
                                onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                                placeholder="e.g. smart-planner"
                                disabled={!!editingProjectId}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Project Title *</label>
                              <input
                                type="text"
                                value={projectForm.title}
                                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                placeholder="Smart Course Planner"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Category</label>
                              <select
                                value={projectForm.category}
                                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              >
                                <option value="Full Stack">Full Stack</option>
                                <option value="Backend">Backend</option>
                                <option value="Android">Android</option>
                                <option value="AI / Machine Learning">AI / Machine Learning</option>
                                <option value="Tools & Infrastructure">Tools & Infrastructure</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Difficulty</label>
                              <select
                                value={projectForm.difficulty}
                                onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value as any })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block font-mono text-[8px] text-white/40 uppercase">Brief Description</label>
                            <input
                              type="text"
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              placeholder="Brief summary sentence..."
                              className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block font-mono text-[8px] text-white/40 uppercase">Long Description</label>
                            <textarea
                              value={projectForm.longDescription}
                              onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                              placeholder="Complete overview paragraph detailing architectural flow..."
                              rows={3}
                              className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Problem Statement</label>
                              <input
                                type="text"
                                value={projectForm.problemStatement}
                                onChange={(e) => setProjectForm({ ...projectForm, problemStatement: e.target.value })}
                                placeholder="What problem does it solve?"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Solution</label>
                              <input
                                type="text"
                                value={projectForm.solution}
                                onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                                placeholder="How does your code solve it?"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Image URL</label>
                              <input
                                type="text"
                                value={projectForm.imageUrl}
                                onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Tags / Technologies (Comma Separated)</label>
                              <input
                                type="text"
                                value={projectForm.tags?.join(", ")}
                                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                                placeholder="React, Python, Redis"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">GitHub Repository Link</label>
                              <input
                                type="text"
                                value={projectForm.repoUrl}
                                onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Live Host URL</label>
                              <input
                                type="text"
                                value={projectForm.liveUrl}
                                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="isFeatured"
                                checked={!!projectForm.isFeatured}
                                onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                                className="accent-[#c3f400]"
                              />
                              <label htmlFor="isFeatured" className="font-mono text-[10px] text-white/60">Featured Project Highlight</label>
                            </div>
                            <div className="flex gap-2">
                              {editingProjectId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProjectId(null);
                                    setProjectForm({ id: "" });
                                  }}
                                  className="font-mono text-xs text-white border border-white/15 px-4 py-2 hover:bg-white/5 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="submit"
                                className="font-mono text-xs text-black bg-[#c3f400] hover:bg-white font-bold px-5 py-2 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Save className="w-4 h-4" />
                                {editingProjectId ? "Update Project" : "Save Project"}
                              </button>
                            </div>
                          </div>

                        </form>

                        {/* List (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Existing Projects ({projects.length})</h4>
                          <div className="h-[450px] overflow-y-auto space-y-3 border border-white/5 bg-zinc-950/20 p-4 scrollbar-thin">
                            {projects.map((p) => (
                              <div key={p.id} className="p-3 bg-[#0c0d12] border border-white/5 flex justify-between items-center gap-4">
                                <div className="truncate">
                                  <h5 className="font-sora text-xs font-bold text-white truncate">{p.title}</h5>
                                  <p className="font-mono text-[8px] text-[#adc6ff] uppercase">{p.category} • {p.id}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => startEditProject(p)}
                                    className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                                    title="Edit project payload"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/5 rounded hover:border-red-500/20 border border-transparent transition-colors cursor-pointer"
                                    title="Delete project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "certificates" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                        {/* Form */}
                        <form onSubmit={handleSaveCert} className="lg:col-span-7 space-y-4 bg-black/20 border border-white/5 p-6">
                          <h4 className="font-sora text-xs font-bold text-[#c3f400] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {editingCertId ? `Edit Achievement: [${editingCertId}]` : "Add New Achievement"}
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Achievement ID *</label>
                              <input
                                type="text"
                                value={certForm.id}
                                onChange={(e) => setCertForm({ ...certForm, id: e.target.value })}
                                placeholder="e.g. cert-docker-basics"
                                disabled={!!editingCertId}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Certificate Title *</label>
                              <input
                                type="text"
                                value={certForm.title}
                                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                                placeholder="Docker Basics & Containerization"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Issuer</label>
                              <input
                                type="text"
                                value={certForm.issuer}
                                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                                placeholder="IBM, Meta, Cisco"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Date</label>
                              <input
                                type="text"
                                value={certForm.date}
                                onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                                placeholder="June 2025"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Credential ID</label>
                              <input
                                type="text"
                                value={certForm.credentialId}
                                onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                                placeholder="GCC-PY-88491A"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Category</label>
                              <select
                                value={certForm.category}
                                onChange={(e) => setCertForm({ ...certForm, category: e.target.value as any })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              >
                                <option value="Languages">Languages</option>
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Cloud & Ops">Cloud & Ops</option>
                                <option value="Databases">Databases</option>
                                <option value="AI & Data Science">AI & Data Science</option>
                                <option value="Tools & Security">Tools & Security</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Verification URL</label>
                              <input
                                type="text"
                                value={certForm.verificationUrl}
                                onChange={(e) => setCertForm({ ...certForm, verificationUrl: e.target.value })}
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block font-mono text-[8px] text-white/40 uppercase">Associated Skills (Comma Separated)</label>
                              <input
                                type="text"
                                value={certForm.skills?.join(", ")}
                                onChange={(e) => setCertForm({ ...certForm, skills: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                                placeholder="Docker, Kubernetes, AWS"
                                className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block font-mono text-[8px] text-white/40 uppercase">Certificate Background Image URL</label>
                            <input
                              type="text"
                              value={certForm.imageUrl}
                              onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                              className="w-full bg-[#050608] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            {editingCertId && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCertId(null);
                                  setCertForm({ id: "" });
                                }}
                                className="font-mono text-xs text-white border border-white/15 px-4 py-2 hover:bg-white/5 cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              type="submit"
                              className="font-mono text-xs text-black bg-[#c3f400] hover:bg-white font-bold px-5 py-2 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              {editingCertId ? "Update Achievement" : "Save Achievement"}
                            </button>
                          </div>
                        </form>

                        {/* List */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Existing Achievements ({credentials.length})</h4>
                          <div className="h-[380px] overflow-y-auto space-y-3 border border-white/5 bg-zinc-950/20 p-4 scrollbar-thin">
                            {credentials.map((c) => (
                              <div key={c.id} className="p-3 bg-[#0c0d12] border border-white/5 flex justify-between items-center gap-4">
                                <div className="truncate">
                                  <h5 className="font-sora text-xs font-bold text-white truncate">{c.title}</h5>
                                  <p className="font-mono text-[8px] text-[#adc6ff] uppercase">{c.issuer} • {c.id}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => startEditCert(c)}
                                    className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                                    title="Edit certificate payload"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCert(c.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/5 rounded hover:border-red-500/20 border border-transparent transition-colors cursor-pointer"
                                    title="Delete certificate"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div className="space-y-6 text-left">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <div>
                            <h4 className="font-sora text-sm font-bold text-[#c3f400] uppercase tracking-wider">Manage Skills</h4>
                            <p className="font-sans text-[11px] text-white/40">Update your skills, years of experience, and proficiency levels.</p>
                          </div>
                          <button
                            onClick={handleSaveSkills}
                            className="bg-[#c3f400] hover:bg-white text-black font-mono text-xs uppercase font-bold px-4 py-2 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.15)]"
                          >
                            <Save className="w-4 h-4" />
                            Save Skills
                          </button>
                        </div>

                        <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                          {skills.map((category, catIdx) => (
                            <div key={catIdx} className="bg-black/20 border border-white/5 p-6 space-y-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="font-mono text-xs font-bold text-[#adc6ff] uppercase">{category.title} Category</span>
                                <button
                                  type="button"
                                  onClick={() => handleAddSkillToCat(catIdx)}
                                  className="font-mono text-[9px] text-[#c3f400] bg-[#c3f400]/5 border border-[#c3f400]/15 hover:bg-[#c3f400]/10 px-2 py-1 flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Add Skill Node
                                </button>
                              </div>

                              <div className="space-y-3">
                                {category.skills.map((skill, sIdx) => (
                                  <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#0c0d12] p-3 border border-white/5">
                                    <div className="sm:col-span-4">
                                      <label className="block font-mono text-[7px] text-white/30 uppercase mb-0.5">Skill Name</label>
                                      <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => handleUpdateSkillRow(catIdx, sIdx, "name", e.target.value)}
                                        className="w-full bg-[#050608] border border-white/5 px-2 py-1 text-xs text-white"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label className="block font-mono text-[7px] text-white/30 uppercase mb-0.5">Years Exp</label>
                                      <input
                                        type="number"
                                        value={skill.years}
                                        onChange={(e) => handleUpdateSkillRow(catIdx, sIdx, "years", parseFloat(e.target.value) || 0)}
                                        className="w-full bg-[#050608] border border-white/5 px-2 py-1 text-xs text-white"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label className="block font-mono text-[7px] text-white/30 uppercase mb-0.5">Projects</label>
                                      <input
                                        type="number"
                                        value={skill.projects}
                                        onChange={(e) => handleUpdateSkillRow(catIdx, sIdx, "projects", parseInt(e.target.value) || 0)}
                                        className="w-full bg-[#050608] border border-white/5 px-2 py-1 text-xs text-white"
                                      />
                                    </div>
                                    <div className="sm:col-span-3">
                                      <label className="block font-mono text-[7px] text-white/30 uppercase mb-0.5">Proficiency</label>
                                      <select
                                        value={skill.proficiency}
                                        onChange={(e) => handleUpdateSkillRow(catIdx, sIdx, "proficiency", e.target.value)}
                                        className="w-full bg-[#050608] border border-white/5 px-2 py-1 text-xs text-white font-mono"
                                      >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                      </select>
                                    </div>
                                    <div className="sm:col-span-1 text-right pt-4 sm:pt-0">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSkillFromCat(catIdx, sIdx)}
                                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer rounded"
                                        title="Delete Skill"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "resume" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                        {/* Text Resume Editor (7 cols) */}
                        <div className="lg:col-span-7 space-y-4 bg-black/20 border border-white/5 p-6">
                          <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <h4 className="font-sora text-xs font-bold text-[#c3f400] uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Edit Plain Text Resume
                            </h4>
                            {resumeData?.activeMode === "text" && (
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/25 px-2 py-0.5 rounded animate-pulse">
                                Currently Active
                              </span>
                            )}
                          </div>
                          
                          <p className="font-sans text-[11px] text-white/50 leading-relaxed">
                            This plain text is compiled as a downloadable attachment when visitors click the <strong>Resume</strong> button on your header. Use standard markdown or formatted text.
                          </p>

                          <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your standard text resume here..."
                            rows={15}
                            className="w-full bg-[#040507] border border-white/10 px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#c3f400]"
                          />

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={handleSaveResumeText}
                              disabled={isResumeSaving}
                              className="bg-[#c3f400] hover:bg-white text-black font-mono text-[10px] uppercase font-black px-4 py-2.5 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.15)] disabled:opacity-50"
                            >
                              {isResumeSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              Save & Set Text Active
                            </button>
                          </div>
                        </div>

                        {/* File Upload / Staging Column (5 cols) */}
                        <div className="lg:col-span-5 space-y-6 bg-black/20 border border-white/5 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                              <h4 className="font-sora text-xs font-bold text-[#adc6ff] uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                File Upload Gate
                              </h4>
                              {resumeData?.activeMode === "file" && (
                                <span className="font-mono text-[9px] uppercase tracking-widest text-[#adc6ff] bg-[#adc6ff]/10 border border-[#adc6ff]/25 px-2 py-0.5 rounded animate-pulse">
                                  Currently Active
                                </span>
                              )}
                            </div>

                            <p className="font-sans text-[11px] text-white/50 leading-relaxed">
                              Upload an official PDF or Word resume. Once uploaded, the download button on the live page automatically redirects recruiters to download this file instead.
                            </p>

                            {/* Status view */}
                            <div className="bg-[#050608] border border-white/5 p-4 space-y-2">
                              <span className="block font-mono text-[8px] text-white/30 uppercase">Active Core Channel</span>
                              <div className="text-white font-mono text-xs font-bold">
                                {resumeData?.activeMode === "file" ? "📁 CUSTOM UPLOADED RESUME" : "📝 DEFAULT TEXT RESUME"}
                              </div>
                              {resumeData?.activeMode === "file" && resumeData.uploadedFile && (
                                <div className="space-y-1.5 pt-1">
                                  <div className="font-sans text-xs text-indigo-400 font-semibold truncate">
                                    {resumeData.uploadedFile.name}
                                  </div>
                                  <div className="font-mono text-[9px] text-white/40 flex justify-between">
                                    <span>Size: {(resumeData.uploadedFile.size / 1024).toFixed(1)} KB</span>
                                    <span>Uploaded: {new Date(resumeData.uploadedFile.uploadedAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Input Form upload */}
                            <div className="space-y-2">
                              <label className="block text-center border-2 border-dashed border-white/10 hover:border-[#c3f400]/40 bg-[#050608]/50 hover:bg-black/40 p-6 transition-all duration-300 cursor-pointer group relative">
                                <input
                                  type="file"
                                  accept=".pdf,.txt,.doc,.docx"
                                  onChange={handleResumeFileUpload}
                                  disabled={isResumeSaving}
                                  className="hidden"
                                />
                                <div className="flex flex-col items-center gap-3">
                                  <Folder className="w-8 h-8 text-white/20 group-hover:text-[#c3f400]/60 transition-colors" />
                                  <div className="text-white/60 text-xs font-medium group-hover:text-white transition-colors">
                                    {isResumeSaving ? "Processing..." : "Select Resume File (PDF, TXT)"}
                                  </div>
                                  <div className="text-[9px] text-white/40 font-mono">
                                    Maximum Upload File Size: 5MB
                                  </div>
                                </div>
                              </label>

                              {resumeUploadError && (
                                <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] bg-red-500/5 border border-red-500/10 p-2.5">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{resumeUploadError}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Revert controls */}
                          {resumeData?.activeMode === "file" && (
                            <div className="pt-4 border-t border-white/5">
                              <button
                                type="button"
                                onClick={handleResetResume}
                                disabled={isResumeSaving}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-[10px] uppercase py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
                              >
                                {isResumeSaving ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3.5 h-3.5" />
                                )}
                                Revert back to plain text
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Clean & simple status message instead of long terminal log widget */}
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
