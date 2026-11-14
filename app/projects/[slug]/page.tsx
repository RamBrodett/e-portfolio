import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import { getAssetPath, getYouTubeId } from "@/lib/utils";

function Note({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card/90 p-4">
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 bg-primary" />
      <div className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = (project.related ?? [])
    .map((s) => getProjectBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="min-h-screen py-24 px-8 md:px-0">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="-ml-4 mb-8">
          <Link href="/#projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>

        {/* Header */}
        <div className="space-y-4">
          <p className="font-mono text-[13px] text-muted-foreground">{project.subtitle}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{project.title}</h1>
          <p className="pt-1 font-mono text-xs leading-relaxed text-muted-foreground/80">
            {project.techStack.join(" / ")}
          </p>

          <div className="flex gap-4 pt-4 flex-wrap">
            {project.links.github && project.links.github.length > 0 ? (
              typeof project.links.github === 'string' ? (
                <Button variant="outline" asChild>
                  <Link href={project.links.github} target="_blank">
                    <Github className="mr-2 h-4 w-4" /> View Code
                  </Link>
                </Button>
              ) : (
                project.links.github.map((link, i) => (
                  <Button key={i} variant="outline" asChild>
                    <Link href={link.url} target="_blank">
                      <Github className="mr-2 h-4 w-4" /> {link.label}
                    </Link>
                  </Button>
                ))
              )
            ) : (
              <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                <Github className="mr-2 h-4 w-4" /> Private Repo
              </Button>
            )}
            {project.links.demo && (
              <Button asChild>
                <Link href={project.links.demo} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3 className="text-2xl font-semibold mb-4">Overview</h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {project.fullDescription}
          </p>
        </div>

        {project.contributions && project.contributions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">My part</h3>
            <ul className="divide-y divide-border border-y border-border">
              {project.contributions.map((c) => (
                <li key={c.area} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                  <span className="font-medium">{c.area}</span>
                  {c.detail && <span className="text-muted-foreground">{c.detail}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <p className="text-muted-foreground">
            Connected project:{" "}
            {related.map((r, i) => (
              <span key={r.slug}>
                {i > 0 && ", "}
                <Link href={`/projects/${r.slug}`} className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline">
                  {r.title}
                </Link>
              </span>
            ))}
          </p>
        )}

        {project.media.length === 0 && project.screenshotNote && (
          <Note label="Screenshots" text={project.screenshotNote} />
        )}

        {/* Media Gallery */}
        {project.media.length > 0 && (
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-semibold">Gallery</h3>
            {project.screenshotNote && <Note label="About these screenshots" text={project.screenshotNote} />}
            <div className="grid gap-6">
              {project.media.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="overflow-hidden rounded-lg border bg-muted relative">
                    {item.type === "video" ? (
                      getYouTubeId(item.url) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                          className="w-full h-auto aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video 
                          src={getAssetPath(item.url)} 
                          controls 
                          className="w-full h-auto aspect-video object-cover"
                        />
                      )
                    ) : (
                      <Image 
                        src={getAssetPath(item.url)} 
                        alt={item.caption || project.title} 
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </div>
                  {item.caption && (
                    <p className="text-sm text-muted-foreground text-center italic">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
