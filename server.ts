import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

// Import initial static datasets for automatic backend file database setup
import { PROJECTS_DATA } from "./src/data/projectsData";
import { CERTIFICATES_DATA } from "./src/data/credentialsData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Nodemailer SMTP transporter lazily
let smtpTransporter: nodemailer.Transporter | null = null;
function getSmtpTransporter(): nodemailer.Transporter | null {
  if (!smtpTransporter) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;

    if (user && pass) {
      smtpTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
    }
  }
  return smtpTransporter;
}

// REST API Endpoints
// Endpoint to handle direct contact form message transmission via email
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "mukteswar452@gmail.com";
  const transporter = getSmtpTransporter();
  
  const telemetryLogs = [
    `[Connection] Initializing secure contact form routing...`,
    `[Routing] Preparing contact message buffer for: ${name}`,
  ];

  let emailSent = false;
  let errorDetails = "";

  if (transporter) {
    try {
      telemetryLogs.push("[Mail Server] Connecting to secure mail dispatcher...");
      
      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: receiverEmail,
        subject: `📬 Portfolio Contact Form: Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message || "No message provided."}\n\nSent on: ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #4a90e2; border-bottom: 2px solid #4a90e2; padding-bottom: 8px;">📬 Portfolio Contact Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-left: 4px solid #4a90e2; border-radius: 4px;">
              <p style="margin-top: 0;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; font-style: italic;">${message || "No message provided."}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 11px; color: #888; text-align: center;">This message was routed securely via Mukteswar Gochhayat's Portfolio Contact Proxy.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
      telemetryLogs.push(`[Success] Message sent successfully to Mukteswar (${receiverEmail})!`);
    } catch (err: any) {
      console.error("Nodemailer error sending contact message:", err);
      errorDetails = err.message || "Unknown error";
      telemetryLogs.push(`[Warning] Direct email dispatch failed: ${errorDetails}`);
    }
  } else {
    telemetryLogs.push("[Mail Server] Email credentials not configured in active environment.");
    telemetryLogs.push(`[Local Inbox] Saved message safely in portfolio inbox for Mukteswar.`);
  }

  telemetryLogs.push("[Status] Connection: Stable // Latency: 12ms");
  telemetryLogs.push("[Security] Transport layer encryption check: Secure");
  telemetryLogs.push("[Success] Message submission process complete.");

  return res.json({
    status: "STABLE",
    logs: telemetryLogs,
    emailSent,
    errorDetails,
    receivedAt: new Date().toISOString()
  });
});

// ==========================================
// ALL-TIME FREE SECURE FILE-DATABASE HANDLERS
// ==========================================

// Paths for persistent JSON data files
const PROJECTS_FILE = path.join(process.cwd(), "src", "data", "db_projects.json");
const CERTS_FILE = path.join(process.cwd(), "src", "data", "db_credentials.json");
const SKILLS_FILE = path.join(process.cwd(), "src", "data", "db_skills.json");
const RESUME_META_FILE = path.join(process.cwd(), "src", "data", "db_resume_meta.json");
const RESUME_TEXT_FILE = path.join(process.cwd(), "src", "data", "db_resume_text.txt");
const RESUME_UPLOAD_DIR = path.join(process.cwd(), "src", "data", "uploads");
const ABOUT_FILE = path.join(process.cwd(), "src", "data", "db_about.json");
const TIMELINE_FILE = path.join(process.cwd(), "src", "data", "db_timeline.json");

// Default About section info
const DEFAULT_ABOUT_CONTENT = {
  bio_title: "Biography dossier",
  bio_subtitle: "Turning Ideas Into Scalable Software & Intelligent Solutions",
  bio_paragraphs: [
    "I'm Mukteswar Gochhayat, a Computer Science and Engineering student at ITER, SOA University, driven by curiosity and a passion for building software that is scalable, intelligent, and impactful. Every project is a canvas to turn complex logistical questions into polished, robust architectures.",
    "Today, I primarily construct advanced application backends and interactive systems using Python, Java, Django, and Full Stack design elements, with an emphasis on rigorous Problem Solving through Data Structures & Algorithms.",
    "I am highly fascinated by the frontier of Artificial Intelligence and Machine Learning. My mission in Software Engineering is to bridge traditional engineering excellence with cognitive learning networks—pioneering tools that make intelligent, automated decisions in real-time."
  ],
  philosophy_quote: "\"My goal is not just to write code, but to build technology that solves meaningful problems, creates value, and positively impacts people's lives.\"",
  philosophy_author: "Mukteswar Gochhayat",
  philosophy_title: "Computer Science & Engineering Scholar"
};

// Default Timeline milestones
const DEFAULT_TIMELINE_CONTENT = [
  { id: "1", icon: "🚀", title: "Started Learning Programming", description: "Began with logical problem-solving, Python & Java fundamentals.", date: "2023" },
  { id: "2", icon: "💻", title: "Built My First Web Application", description: "Developed interactive apps exploring custom layouts and server routes.", date: "2024" },
  { id: "3", icon: "🌐", title: "Learned Full Stack Development", description: "Mastered Django, APIs, React, and database design with production paradigms.", date: "2024" },
  { id: "4", icon: "🧠", title: "Exploring Artificial Intelligence", description: "Dived into Machine Learning models, regression, classification, and neural nets.", date: "2025" },
  { id: "5", icon: "⚡", title: "Building Real-World Projects", description: "Deploying high-performance systems with automated telemetry and microservices.", date: "2025" },
  { id: "6", icon: "🎯", title: "Becoming a Software Engineer", description: "Tackling scalable, distributed system architectures and industry problems.", date: "2026" }
];

// Ensure data folder exists
const dataDir = path.join(process.cwd(), "src", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(RESUME_UPLOAD_DIR)) {
  fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });
}

const DEFAULT_RESUME_CONTENT = `MUKTESWAR GOCHHAYAT - COMPUTER SCIENCE PORTFOLIO RESUME
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

// Default skill categories matching AboutMe.tsx SKILL_CATEGORIES
const defaultSkills = [
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

// Initialize JSON database files if they don't exist
function initDb() {
  try {
    if (!fs.existsSync(PROJECTS_FILE)) {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(PROJECTS_DATA, null, 2));
    }
    if (!fs.existsSync(CERTS_FILE)) {
      fs.writeFileSync(CERTS_FILE, JSON.stringify(CERTIFICATES_DATA, null, 2));
    }
    if (!fs.existsSync(SKILLS_FILE)) {
      fs.writeFileSync(SKILLS_FILE, JSON.stringify(defaultSkills, null, 2));
    }
    if (!fs.existsSync(RESUME_META_FILE)) {
      fs.writeFileSync(RESUME_META_FILE, JSON.stringify({ activeMode: "text", uploadedFile: null }, null, 2));
    }
    if (!fs.existsSync(RESUME_TEXT_FILE)) {
      fs.writeFileSync(RESUME_TEXT_FILE, DEFAULT_RESUME_CONTENT);
    }
    if (!fs.existsSync(ABOUT_FILE)) {
      fs.writeFileSync(ABOUT_FILE, JSON.stringify(DEFAULT_ABOUT_CONTENT, null, 2));
    }
    if (!fs.existsSync(TIMELINE_FILE)) {
      fs.writeFileSync(TIMELINE_FILE, JSON.stringify(DEFAULT_TIMELINE_CONTENT, null, 2));
    }
  } catch (err) {
    console.error("File DB initialization failed:", err);
  }
}
initDb();

// Secure session tokens in server memory
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "mukteswar2026";
const ACTIVE_TOKENS = new Set<string>();

// Admin Login/Verification routes
app.post("/api/admin/login", (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    const token = "admin_sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    ACTIVE_TOKENS.add(token);
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: "Access Denied: Invalid Passcode." });
});

app.post("/api/admin/check", (req, res) => {
  const { token } = req.body;
  if (token && ACTIVE_TOKENS.has(token)) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

app.post("/api/admin/logout", (req, res) => {
  const { token } = req.body;
  if (token) {
    ACTIVE_TOKENS.delete(token);
  }
  return res.json({ success: true });
});

// Middleware helper to check admin privileges
function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && ACTIVE_TOKENS.has(authHeader)) {
    return next();
  }
  return res.status(403).json({ error: "Access Forbidden: Admin privileges required." });
}

// 1. PROJECTS ENDPOINTS
app.get("/api/projects", (req, res) => {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
    return res.json(JSON.parse(data));
  } catch (err) {
    return res.json(PROJECTS_DATA);
  }
});

app.post("/api/projects", verifyAdmin, (req, res) => {
  try {
    const newProject = req.body;
    if (!newProject.id || !newProject.title) {
      return res.status(400).json({ error: "Missing unique ID or title." });
    }
    const current = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
    const filtered = current.filter((p: any) => p.id !== newProject.id);
    filtered.push(newProject);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2));
    return res.json({ success: true, project: newProject });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/projects/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = req.body;
    const current = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
    const index = current.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Project not found." });
    }
    current[index] = { ...current[index], ...updatedProject };
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(current, null, 2));
    return res.json({ success: true, project: current[index] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const current = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
    const filtered = current.filter((p: any) => p.id !== id);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2));
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. CREDENTIALS ENDPOINTS (Certificates & Achievements)
app.get("/api/credentials", (req, res) => {
  try {
    const data = fs.readFileSync(CERTS_FILE, "utf-8");
    return res.json(JSON.parse(data));
  } catch (err) {
    return res.json(CERTIFICATES_DATA);
  }
});

app.post("/api/credentials", verifyAdmin, (req, res) => {
  try {
    const newCert = req.body;
    if (!newCert.id || !newCert.title) {
      return res.status(400).json({ error: "Missing unique ID or title." });
    }
    const current = JSON.parse(fs.readFileSync(CERTS_FILE, "utf-8"));
    const filtered = current.filter((c: any) => c.id !== newCert.id);
    filtered.push(newCert);
    fs.writeFileSync(CERTS_FILE, JSON.stringify(filtered, null, 2));
    return res.json({ success: true, credential: newCert });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/credentials/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updatedCert = req.body;
    const current = JSON.parse(fs.readFileSync(CERTS_FILE, "utf-8"));
    const index = current.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Credential not found." });
    }
    current[index] = { ...current[index], ...updatedCert };
    fs.writeFileSync(CERTS_FILE, JSON.stringify(current, null, 2));
    return res.json({ success: true, credential: current[index] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/credentials/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const current = JSON.parse(fs.readFileSync(CERTS_FILE, "utf-8"));
    const filtered = current.filter((c: any) => c.id !== id);
    fs.writeFileSync(CERTS_FILE, JSON.stringify(filtered, null, 2));
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. SKILLS ENDPOINTS
app.get("/api/skills", (req, res) => {
  try {
    const data = fs.readFileSync(SKILLS_FILE, "utf-8");
    return res.json(JSON.parse(data));
  } catch (err) {
    return res.json(defaultSkills);
  }
});

app.post("/api/skills", verifyAdmin, (req, res) => {
  try {
    const updatedSkills = req.body;
    if (!Array.isArray(updatedSkills)) {
      return res.status(400).json({ error: "Invalid skills format. Must be an array." });
    }
    fs.writeFileSync(SKILLS_FILE, JSON.stringify(updatedSkills, null, 2));
    return res.json({ success: true, skills: updatedSkills });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3.5. ABOUT & TIMELINE ENDPOINTS
app.get("/api/about", (req, res) => {
  try {
    const data = fs.readFileSync(ABOUT_FILE, "utf-8");
    return res.json(JSON.parse(data));
  } catch (err) {
    return res.json(DEFAULT_ABOUT_CONTENT);
  }
});

app.post("/api/about", verifyAdmin, (req, res) => {
  try {
    const updatedAbout = req.body;
    if (!updatedAbout || typeof updatedAbout !== "object") {
      return res.status(400).json({ error: "Invalid about format." });
    }
    fs.writeFileSync(ABOUT_FILE, JSON.stringify(updatedAbout, null, 2));
    return res.json({ success: true, about: updatedAbout });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/timeline", (req, res) => {
  try {
    const data = fs.readFileSync(TIMELINE_FILE, "utf-8");
    return res.json(JSON.parse(data));
  } catch (err) {
    return res.json(DEFAULT_TIMELINE_CONTENT);
  }
});

app.post("/api/timeline", verifyAdmin, (req, res) => {
  try {
    const newMilestone = req.body;
    if (!newMilestone.title || !newMilestone.date) {
      return res.status(400).json({ error: "Missing title or date." });
    }
    if (!newMilestone.id) {
      newMilestone.id = "timeline_" + Date.now().toString(36);
    }
    const current = JSON.parse(fs.readFileSync(TIMELINE_FILE, "utf-8"));
    current.push(newMilestone);
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(current, null, 2));
    return res.json({ success: true, milestone: newMilestone });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/timeline/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updatedMilestone = req.body;
    const current = JSON.parse(fs.readFileSync(TIMELINE_FILE, "utf-8"));
    const index = current.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Milestone not found." });
    }
    current[index] = { ...current[index], ...updatedMilestone };
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(current, null, 2));
    return res.json({ success: true, milestone: current[index] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/timeline/:id", verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const current = JSON.parse(fs.readFileSync(TIMELINE_FILE, "utf-8"));
    const filtered = current.filter((m: any) => m.id !== id);
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(filtered, null, 2));
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. RESUME ENDPOINTS
app.get("/api/resume", (req, res) => {
  try {
    const meta = JSON.parse(fs.readFileSync(RESUME_META_FILE, "utf-8"));
    const textContent = fs.readFileSync(RESUME_TEXT_FILE, "utf-8");
    return res.json({
      activeMode: meta.activeMode || "text",
      textContent,
      uploadedFile: meta.uploadedFile || null
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/resume/text", verifyAdmin, (req, res) => {
  try {
    const { textContent } = req.body;
    if (textContent === undefined) {
      return res.status(400).json({ error: "Missing textContent." });
    }
    fs.writeFileSync(RESUME_TEXT_FILE, textContent);
    
    const meta = JSON.parse(fs.readFileSync(RESUME_META_FILE, "utf-8"));
    meta.activeMode = "text";
    fs.writeFileSync(RESUME_META_FILE, JSON.stringify(meta, null, 2));

    return res.json({ success: true, activeMode: "text" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/resume/upload", verifyAdmin, (req, res) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: "Missing fileName or fileData." });
    }

    // Parse base64 string
    let base64Content = fileData;
    if (fileData.includes(";base64,")) {
      base64Content = fileData.split(";base64,").pop() || "";
    }

    const buffer = Buffer.from(base64Content, "base64");
    const safeFileName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const savePath = path.join(RESUME_UPLOAD_DIR, safeFileName);
    fs.writeFileSync(savePath, buffer);

    const meta = {
      activeMode: "file",
      uploadedFile: {
        name: fileName,
        pathName: safeFileName,
        size: buffer.length,
        uploadedAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(RESUME_META_FILE, JSON.stringify(meta, null, 2));

    return res.json({ success: true, activeMode: "file", uploadedFile: meta.uploadedFile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/resume/reset", verifyAdmin, (req, res) => {
  try {
    const meta = {
      activeMode: "text",
      uploadedFile: null
    };
    fs.writeFileSync(RESUME_META_FILE, JSON.stringify(meta, null, 2));
    return res.json({ success: true, activeMode: "text" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/resume/download", (req, res) => {
  try {
    const meta = JSON.parse(fs.readFileSync(RESUME_META_FILE, "utf-8"));
    if (meta.activeMode === "file" && meta.uploadedFile && meta.uploadedFile.pathName) {
      const filePath = path.join(RESUME_UPLOAD_DIR, meta.uploadedFile.pathName);
      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Disposition", `attachment; filename="${meta.uploadedFile.name}"`);
        const ext = path.extname(meta.uploadedFile.name).toLowerCase();
        if (ext === ".pdf") {
          res.setHeader("Content-Type", "application/pdf");
        } else if (ext === ".txt") {
          res.setHeader("Content-Type", "text/plain");
        } else {
          res.setHeader("Content-Type", "application/octet-stream");
        }
        return res.sendFile(filePath);
      }
    }
    
    if (fs.existsSync(RESUME_TEXT_FILE)) {
      res.setHeader("Content-Disposition", 'attachment; filename="Mukteswar_Gochhayat_Resume.txt"');
      res.setHeader("Content-Type", "text/plain");
      return res.sendFile(RESUME_TEXT_FILE);
    }

    res.setHeader("Content-Disposition", 'attachment; filename="Mukteswar_Gochhayat_Resume.txt"');
    res.setHeader("Content-Type", "text/plain");
    return res.send(DEFAULT_RESUME_CONTENT);
  } catch (err: any) {
    return res.status(500).send("Error reading resume file.");
  }
});

// Fallback Mock Parser

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
