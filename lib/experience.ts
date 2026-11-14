import experienceData from "@/data/experience.json";

export interface Experience {
  role: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  summary: string;
}

export function getExperience(): Experience[] {
  return experienceData as Experience[];
}
