import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowRight, FileText } from "lucide-react";
import { getProjects, getProjectMeta, type Project } from "@/lib/projects";
import { getExperience } from "@/lib/experience";
import { getSkills } from "@/lib/skills";
import { siteConfig } from "@/lib/site-config";

import { ScrollDownButton } from "@/components/scroll-down-button";
import { ProjectCover } from "@/components/project-cover";
import { SectionHeading } from "@/components/section-heading";
import { CopyEmail } from "@/components/copy-email";
import { CertificationsSection } from "@/components/certifications-section";

const EMAIL = "rmbrodett@gmail.com";
const GITHUB = "https://github.com/rambrodett";
const LINKEDIN = "https://linkedin.com/in/rmbrodett";

function ProjectCard({ project }: { project: Project }) {
  const { kind, year } = getProjectMeta(project);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/90 transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
        <ProjectCover project={project} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <span className="shrink-0 font-mono text-[13px] tabular-nums text-muted-foreground">{year}</span>
        </div>
        <span className="text-sm text-muted-foreground">{kind}</span>
        <p className="text-[15px] text-muted-foreground">{project.shortDescription}</p>
        <MyPart project={project} />
        <p className="mt-auto pt-3 font-mono text-xs leading-relaxed text-muted-foreground/80">
          {project.techStack.join(" / ")}
        </p>
        <ScreenshotTag project={project} />
      </div>
    </Link>
  );
}

function MyPart({ project }: { project: Project }) {
  if (!project.contributions?.length) return null;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">My part: </span>
      {project.contributions.map((c) => c.area).join(", ")}
    </p>
  );
}

function ScreenshotTag({ project }: { project: Project }) {
  if (!project.screenshotTag) return null;
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/80">
      {project.screenshotTag}
    </p>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const { kind, year } = getProjectMeta(project);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid overflow-hidden rounded-xl border border-border bg-card/90 transition-colors hover:border-primary/50 md:grid-cols-[1.4fr_1fr]"
    >
      <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-[300px]">
        <ProjectCover project={project} />
      </div>
      <div className="flex flex-col justify-center gap-2 p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">{kind}</span>
          <span className="font-mono text-[13px] tabular-nums text-muted-foreground">{year}</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{project.title}</h3>
        <p className="text-muted-foreground">{project.shortDescription}</p>
        <MyPart project={project} />
        <p className="pt-3 font-mono text-xs leading-relaxed text-muted-foreground/80">
          {project.techStack.join(" / ")}
        </p>
        <ScreenshotTag project={project} />
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, ...projects] = getProjects();
  // Keep the two-column grid full: an odd one out gets the wide layout at the end.
  const gridProjects = projects.length % 2 ? projects.slice(0, -1) : projects;
  const trailing = projects.length % 2 ? projects[projects.length - 1] : null;
  const experience = getExperience();
  const skills = getSkills();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg md:max-w-2xl xl:max-w-6xl px-4 sm:px-8 md:px-0">
        <section
          id="about"
          className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-20 text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground text-balance sm:text-xs">
            Full stack systems · AI integration · Human-computer interaction
          </p>
          <h1 className="mt-6 text-[clamp(3.5rem,12.5vw,9.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
            Ram Brodett
            <span aria-hidden="true" className="ml-[0.05em] inline-block size-[0.14em] bg-primary" />
          </h1>
          <p className="mx-auto mt-8 max-w-[46ch] text-lg text-muted-foreground text-balance sm:text-xl">
            A <strong className="font-medium text-foreground">Full Stack Software Engineer</strong> who builds{" "}
            <strong className="font-medium text-foreground">scalable systems</strong> and brings{" "}
            <strong className="font-medium text-foreground">AI</strong> into them where it does real work. A background in{" "}
            <strong className="font-medium text-foreground">Human-Computer Interaction</strong> keeps the people who use
            them at the center.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            <Button asChild className="h-10 px-5">
              <Link href="#contact">
                Contact me <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-10 px-4">
              <Link href={GITHUB} target="_blank">
                <Github className="mr-1 h-4 w-4" /> GitHub
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-10 px-4">
              <Link href="/resume">
                <FileText className="mr-1 h-4 w-4" /> Resume
              </Link>
            </Button>
          </div>

          <p className="mt-8 inline-flex items-center gap-2.5 font-mono text-[13px] text-muted-foreground">
            <span aria-hidden="true" className="size-[7px] bg-primary" />
            Open to full stack and AI roles
          </p>

          <div className="absolute bottom-6">
            <ScrollDownButton />
          </div>
        </section>

        <section id="projects" className="scroll-mt-16 py-24">
          <SectionHeading title="Projects" meta={`${projects.length + 1} projects · 2024–2026`} />
          <FeaturedProject project={featured} />
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {gridProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          {trailing && (
            <div className="mt-5">
              <FeaturedProject project={trailing} />
            </div>
          )}
        </section>

        <section id="experience" className="scroll-mt-16 py-24">
          <SectionHeading title="Experience" meta="2024 – present" />
          <ol>
            {experience.map((item) => (
              <li
                key={`${item.organization}-${item.role}`}
                className="grid gap-2 border-b border-border py-6 first:pt-0 md:grid-cols-[11rem_minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-6"
              >
                <div className="flex flex-col gap-1 pt-0.5 font-mono text-[13px] tabular-nums text-muted-foreground">
                  <span>
                    {item.start} – {item.end}
                  </span>
                  {item.end === "Present" && (
                    <span className="text-[11px] uppercase tracking-[0.1em] text-primary">Current</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">{item.role}</h3>
                  <p className="text-[15px] text-muted-foreground">{item.organization}</p>
                </div>
                <p className="text-[15px] text-muted-foreground">{item.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="toolbox" className="scroll-mt-16 py-24">
          <SectionHeading title="Toolbox" />
          <dl>
            {skills.map((group) => (
              <div
                key={group.group}
                className="grid gap-1 border-b border-border py-4 first:pt-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6"
              >
                <dt className="pt-0.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {group.group}
                </dt>
                <dd className="text-[15px]">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {siteConfig.features.certifications && <CertificationsSection />}

        <section id="contact" className="scroll-mt-16 py-24">
          <h2 className="text-4xl font-semibold leading-none tracking-[-0.045em] sm:text-6xl">Get in touch</h2>
          <p className="mt-4 max-w-[52ch] text-lg text-muted-foreground">
            I am open to software engineering roles where I can build backend systems and AI-driven products.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Button size="lg" asChild>
              <Link href={`mailto:${EMAIL}`}>
                <Mail className="mr-1 h-4 w-4" /> Say hello
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={LINKEDIN} target="_blank">
                <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={GITHUB} target="_blank">
                <Github className="mr-1 h-4 w-4" /> GitHub
              </Link>
            </Button>
          </div>
          <div className="mt-5">
            <CopyEmail email={EMAIL} />
          </div>
        </section>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-lg flex-wrap justify-between gap-2 px-4 py-6 font-mono text-xs text-muted-foreground/80 sm:px-8 md:max-w-2xl md:px-0 xl:max-w-6xl">
          <span>© {new Date().getFullYear()} Ram Brodett</span>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </main>
  );
}
