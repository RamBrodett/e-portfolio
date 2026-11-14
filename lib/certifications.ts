import certificationsData from "@/data/certifications.json";

/**
 * One entry in data/certifications.json. Example:
 * {
 *   "name": "Google Cloud Professional Data Engineer",
 *   "issuer": "Google Cloud",
 *   "issued": "Mar 2026",
 *   "credentialId": "ABC-123",
 *   "url": "https://www.credly.com/badges/..."
 * }
 */
export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  url?: string;
}

export function getCertifications(): Certification[] {
  return certificationsData as Certification[];
}
