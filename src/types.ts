export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  repoUrl: string;
  stats: {
    latency: string;
    throughput: string;
    memory: string;
    cpu: string;
  };
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verifyId: string;
  skills: string[];
  description: string;
  iconName: "cloud_done" | "architecture" | "terminal";
}

export interface Competency {
  id: string;
  name: string;
  category: "Infrastructure" | "Performance" | "Visualization" | "FinTech" | "Engineering";
  percentage: number;
  description: string;
  metrics: string[];
}

export interface CvAnalysis {
  candidateName: string;
  matchScore: number;
  coreRole: string;
  detectedSkills: string[];
  strengths: string[];
  recruiterVerdict: string;
  isAiGenerated?: boolean;
}

export interface TelemetryLog {
  text: string;
  timestamp: string;
  type: "system" | "success" | "warning" | "info";
}
