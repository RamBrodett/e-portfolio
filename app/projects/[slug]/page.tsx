import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import { getAssetPath, getYouTubeId } from "@/lib/utils";

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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.subtitle}</p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>

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

        {/* Media Gallery */}
        {project.media.length > 0 && (
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-semibold">Gallery</h3>
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
