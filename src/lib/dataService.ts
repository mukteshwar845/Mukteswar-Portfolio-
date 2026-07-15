import { ProjectDetail } from "../data/projectsData";
import { CertificateDetail } from "../data/credentialsData";

// Local Cache Keys
const PROJECTS_CACHE_KEY = "mukteswar_cached_projects";
const CERTS_CACHE_KEY = "mukteswar_cached_credentials";
const SKILLS_CACHE_KEY = "mukteswar_cached_skills";
const TOKEN_KEY = "mukteswar_admin_token";

export interface SkillCategoryData {
  title: string;
  skills: {
    name: string;
    years: number;
    projects: number;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  }[];
}

// --------------------------------------------------
// AUTHENTICATION MANAGEMENT
// --------------------------------------------------
export async function loginAdmin(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true, token: data.token };
    }
    return { success: false, error: data.error || "Authentication failed." };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error. Server might be offline." };
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logoutAdmin(): void {
  const token = getStoredToken();
  if (token) {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(console.error);
  }
  localStorage.removeItem(TOKEN_KEY);
}

export async function checkAdminSession(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/admin/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!data.success) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return data.success;
  } catch (err) {
    return false;
  }
}

// --------------------------------------------------
// DYNAMIC PROJECTS MANAGEMENT
// --------------------------------------------------
export async function getProjects(): Promise<ProjectDetail[]> {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Server returned error status");
    const data = await res.json() as ProjectDetail[];
    localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Falling back to local projects cache...", err);
    const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    // If no cache, dynamic loading fails, which is handled gracefully by components
    return [];
  }
}

export async function saveProject(project: ProjectDetail): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(project)
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving project to server:", err);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error deleting project from server:", err);
    return false;
  }
}

// --------------------------------------------------
// DYNAMIC CREDENTIALS MANAGEMENT
// --------------------------------------------------
export async function getCredentials(): Promise<CertificateDetail[]> {
  try {
    const res = await fetch("/api/credentials");
    if (!res.ok) throw new Error("Server returned error status");
    const data = await res.json() as CertificateDetail[];
    localStorage.setItem(CERTS_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Falling back to local credentials cache...", err);
    const cached = localStorage.getItem(CERTS_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

export async function saveCredential(cert: CertificateDetail): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(cert)
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving credential to server:", err);
    return false;
  }
}

export async function deleteCredential(id: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch(`/api/credentials/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error deleting credential from server:", err);
    return false;
  }
}

// --------------------------------------------------
// DYNAMIC SKILLS MANAGEMENT
// --------------------------------------------------
export async function getSkills(): Promise<SkillCategoryData[]> {
  try {
    const res = await fetch("/api/skills");
    if (!res.ok) throw new Error("Server returned error status");
    const data = await res.json() as SkillCategoryData[];
    localStorage.setItem(SKILLS_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Falling back to local skills cache...", err);
    const cached = localStorage.getItem(SKILLS_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

export async function saveSkills(skills: SkillCategoryData[]): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(skills)
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving skills to server:", err);
    return false;
  }
}

// --------------------------------------------------
// RESUME OPERATIONS
// --------------------------------------------------
export interface ResumeData {
  activeMode: "text" | "file";
  textContent: string;
  uploadedFile: {
    name: string;
    size: number;
    uploadedAt: string;
  } | null;
}

export async function getResume(): Promise<ResumeData | null> {
  try {
    const res = await fetch("/api/resume");
    if (!res.ok) throw new Error("Failed to fetch resume");
    return await res.json() as ResumeData;
  } catch (err) {
    console.error("Error getting resume from server:", err);
    return null;
  }
}

export async function saveResumeText(textContent: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/resume/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ textContent })
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving resume text to server:", err);
    return false;
  }
}

export async function uploadResumeFile(fileName: string, fileData: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/resume/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ fileName, fileData })
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error uploading resume file to server:", err);
    return false;
  }
}

export async function resetResume(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/resume/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error resetting resume on server:", err);
    return false;
  }
}

// --------------------------------------------------
// DYNAMIC ABOUT SECTION & JOURNEY TIMELINE MANAGEMENT
// --------------------------------------------------
const ABOUT_CACHE_KEY = "mukteswar_cached_about";
const TIMELINE_CACHE_KEY = "mukteswar_cached_timeline";

export interface AboutData {
  bio_title: string;
  bio_subtitle: string;
  bio_paragraphs: string[];
  philosophy_quote: string;
  philosophy_author: string;
  philosophy_title: string;
  id_card_image?: string;
  id_card_images?: string[];
  id_card_name?: string;
  id_card_college?: string;
  id_card_grad_year?: string;
  id_card_role?: string;
  id_card_extra?: string;
  card_back_protocol?: string;
  card_back_networks?: string;
  card_back_paradigms?: string;
  card_back_signature?: string;
  card_back_core?: string;
  card_back_temp?: string;
}

export async function uploadIdCardImage(fileName: string, fileData: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = getStoredToken();
  if (!token) return { success: false, error: "Authentication required." };
  try {
    const res = await fetch("/api/idcard/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ fileName, fileData })
    });
    const data = await res.json();
    if (data.success && data.url) {
      return { success: true, url: data.url };
    }
    return { success: false, error: data.error || "Upload failed." };
  } catch (err: any) {
    console.error("Error uploading ID card image to server:", err);
    return { success: false, error: err.message || "Network error." };
  }
}

export interface TimelineMilestone {
  id?: string;
  icon: string;
  title: string;
  description: string;
  date: string;
}

export async function getAbout(): Promise<AboutData | null> {
  try {
    const res = await fetch("/api/about");
    if (!res.ok) throw new Error("Server returned error status");
    const data = await res.json() as AboutData;
    localStorage.setItem(ABOUT_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Falling back to local about cache...", err);
    const cached = localStorage.getItem(ABOUT_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return null;
  }
}

export async function saveAbout(about: AboutData): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/about", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(about)
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving about info to server:", err);
    return false;
  }
}

export async function getTimeline(): Promise<TimelineMilestone[]> {
  try {
    const res = await fetch("/api/timeline");
    if (!res.ok) throw new Error("Server returned error status");
    const data = await res.json() as TimelineMilestone[];
    localStorage.setItem(TIMELINE_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Falling back to local timeline cache...", err);
    const cached = localStorage.getItem(TIMELINE_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

export async function saveTimelineMilestone(milestone: TimelineMilestone): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const url = milestone.id && !milestone.id.startsWith("new_") 
      ? `/api/timeline/${milestone.id}` 
      : "/api/timeline";
    const method = milestone.id && !milestone.id.startsWith("new_") ? "PUT" : "POST";
    
    // clean temporary custom ids from form fields before sending
    const payload = { ...milestone };
    if (payload.id && payload.id.startsWith("new_")) {
      delete payload.id;
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error saving timeline milestone to server:", err);
    return false;
  }
}

export async function deleteTimelineMilestone(id: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch(`/api/timeline/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Error deleting timeline milestone from server:", err);
    return false;
  }
}
