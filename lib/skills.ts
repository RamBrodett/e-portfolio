import skillsData from "@/data/skills.json";

export interface SkillGroup {
  group: string;
  items: string[];
}

export function getSkills(): SkillGroup[] {
  return skillsData as SkillGroup[];
}
