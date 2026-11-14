import projectsData from "@/data/projects.json";

export interface ProjectMedia {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface ProjectLinks {
  github?: string | { label: string; url: string }[];
  demo?: string;
}

export interface ProjectContribution {
  area: string;
  detail?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  /** Note about where the screenshots come from (e.g. a scrubbed build with placeholder data). */
  screenshotNote?: string;
  /** Short version of the note, shown on the project card. */
  screenshotTag?: string;
  /** What I worked on: a short area label plus an optional sentence. */
  contributions?: ProjectContribution[];
  /** Slugs of connected projects, linked from the project page. */
  related?: string[];
  techStack: string[];
  /** Optional: projects without a cover get a typographic one (see ProjectCover). */
  coverImage?: string;
  /** Short line shown on the typographic cover. */
  tagline?: string;
  media: ProjectMedia[];
  links: ProjectLinks;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return (projectsData as Project[]).find((project) => project.slug === slug);
}

/** Splits a subtitle like "Freelance • 2026" into its kind and year. */
export function getProjectMeta(project: Project): { kind: string; year: string } {
  const [kind, year] = project.subtitle.split(" • ");
  return { kind: kind ?? project.subtitle, year: year ?? "" };
}
