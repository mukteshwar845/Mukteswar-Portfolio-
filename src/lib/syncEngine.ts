import { ProjectDetail, PROJECTS_DATA } from "../data/projectsData";
import { CertificateDetail, CERTIFICATES_DATA } from "../data/credentialsData";

// LocalStorage Keys
const PROJECTS_STORAGE_KEY = "mukteswar_synced_projects";
const CERTS_STORAGE_KEY = "mukteswar_synced_certificates";

export function getSyncedProjects(): ProjectDetail[] {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) return PROJECTS_DATA;
    const parsed = JSON.parse(stored) as ProjectDetail[];
    // Merge static and synced, avoiding duplicates by ID
    const staticIds = new Set(PROJECTS_DATA.map(p => p.id));
    const uniqueSynced = parsed.filter(p => !staticIds.has(p.id));
    return [...PROJECTS_DATA, ...uniqueSynced];
  } catch (e) {
    console.error("Error reading synced projects from storage", e);
    return PROJECTS_DATA;
  }
}

export function saveSyncedProjects(projects: ProjectDetail[]): void {
  try {
    // Only save the non-static projects
    const staticIds = new Set(PROJECTS_DATA.map(p => p.id));
    const nonStatic = projects.filter(p => !staticIds.has(p.id));
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(nonStatic));
  } catch (e) {
    console.error("Error saving synced projects to storage", e);
  }
}

export function getSyncedCertificates(): CertificateDetail[] {
  try {
    const stored = localStorage.getItem(CERTS_STORAGE_KEY);
    if (!stored) return CERTIFICATES_DATA;
    const parsed = JSON.parse(stored) as CertificateDetail[];
    // Merge static and synced, avoiding duplicates by ID
    const staticIds = new Set(CERTIFICATES_DATA.map(c => c.id));
    const uniqueSynced = parsed.filter(c => !staticIds.has(c.id));
    return [...CERTIFICATES_DATA, ...uniqueSynced];
  } catch (e) {
    console.error("Error reading synced certificates from storage", e);
    return CERTIFICATES_DATA;
  }
}

export function saveSyncedCertificates(certs: CertificateDetail[]): void {
  try {
    // Only save the non-static certs
    const staticIds = new Set(CERTIFICATES_DATA.map(c => c.id));
    const nonStatic = certs.filter(c => !staticIds.has(c.id));
    localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(nonStatic));
  } catch (e) {
    console.error("Error saving synced certificates to storage", e);
  }
}

export function clearSyncedData(): void {
  try {
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(CERTS_STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing synced data", e);
  }
}
