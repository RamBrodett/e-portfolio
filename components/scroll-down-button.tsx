"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function ScrollDownButton() {
  const scrollToSection = useSmoothScroll();

  return (
    <a
      href="#projects"
      onClick={(e) => scrollToSection(e, "projects")}
      className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70 transition-colors hover:text-foreground"
      aria-label="Scroll to projects"
    >
      Scroll
    </a>
  );
}
