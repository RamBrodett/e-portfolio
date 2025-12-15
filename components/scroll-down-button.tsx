"use client";

import { ChevronDown } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function ScrollDownButton() {
  const scrollToSection = useSmoothScroll();

  return (
    <a 
      href="#projects" 
      onClick={(e) => scrollToSection(e, "projects")}
      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer block"
      aria-label="Scroll to projects"
    >
      <ChevronDown className="h-8 w-8" />
    </a>
  );
}
