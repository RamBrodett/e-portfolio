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

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  coverImage: string;
  media: ProjectMedia[];
  links: ProjectLinks;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return (projectsData as Project[]).find((project) => project.slug === slug);
}
