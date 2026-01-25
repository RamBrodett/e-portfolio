import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, FileText, ChevronDown } from "lucide-react";
import { getProjects } from "@/lib/projects";
import { getAssetPath } from "@/lib/utils";

import { ScrollDownButton } from "@/components/scroll-down-button";

export default function Home() {
  const projects = getProjects();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg md:max-w-2xl xl:max-w-6xl px-4 sm:px-8 md:px-0">
        <section id="about" className="flex flex-col justify-center items-center text-center gap-8 min-h-[calc(100vh-3.5rem)] py-12 relative">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
              Hi, I'm Ram Brodett.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A <strong>Full Stack Software Engineer</strong> with a deep interest in <strong>Artificial Intelligence</strong> and <strong>Human-Computer Interaction</strong>.
              I engineer <strong>scalable, intelligent solutions</strong> backed by modern <strong>DevOps practices</strong>.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="h-10 px-6">
              <Link href="#contact">
                Contact Me <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/rambrodett" target="_blank">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Link>
            </Button>
             <Button variant="outline" asChild>
              <Link href="/resume">
                <FileText className="mr-2 h-4 w-4" /> Resume
              </Link>
            </Button>
          </div>

          <div className="absolute bottom-8 animate-bounce">
            <ScrollDownButton />
          </div>
        </section>

        <section id="projects" className="space-y-12 scroll-mt-28 py-24">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="block h-full">
                <Card className="h-full flex flex-col border-border/40 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-muted shrink-0 relative">
                    <Image 
                      src={getAssetPath(project.coverImage)} 
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                        <CardDescription>{project.subtitle}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                         {project.techStack.slice(0, 2).map((tech) => (
                           <Badge key={tech} variant="secondary">{tech}</Badge>
                         ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="text-muted-foreground flex-1">
                      {project.shortDescription}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-auto">
                      {project.techStack.slice(2).map((tech) => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator className="bg-border/40" />
        <section id="contact" className="space-y-8 scroll-mt-28 py-24">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">
              I am open to Software Engineering roles where I can contribute to backend systems and AI-driven development.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="mailto:rmbrodett@gmail.com">
                <Mail className="mr-2 h-5 w-5" /> Say Hello
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="https://linkedin.com/in/rmbrodett" target="_blank">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}