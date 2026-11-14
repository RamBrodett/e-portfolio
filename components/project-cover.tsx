import Image from "next/image";
import { getAssetPath, cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { projectArt, COVER_GRID } from "@/components/project-art";

/** Project cover: SVG art when the project has one, then its image, then a typographic cover. */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const Art = projectArt[project.slug];
  if (Art) return <Art />;

  if (project.coverImage) {
    return (
      <Image
        src={getAssetPath(project.coverImage)}
        alt={project.title}
        fill
        className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.03]", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-end gap-2 p-6 bg-muted",
        className
      )}
      style={COVER_GRID}
    >
      <span aria-hidden="true" className="absolute right-6 top-6 size-2.5 bg-primary" />
      <span className="text-3xl font-semibold leading-none tracking-tight sm:text-4xl">{project.title}</span>
      {project.tagline && (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{project.tagline}</span>
      )}
    </div>
  );
}
