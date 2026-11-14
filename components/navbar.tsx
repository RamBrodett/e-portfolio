"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience", desktopOnly: true },
  ...(siteConfig.features.certifications
    ? [{ id: "certifications", label: "Certifications", desktopOnly: true }]
    : []),
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const scrollToSection = useSmoothScroll();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      scrollToSection(e, id);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-4 px-4 sm:px-8 md:max-w-2xl md:px-0 xl:max-w-6xl">
        <Link
          href="/#about"
          onClick={(e) => handleNavClick(e, "about")}
          className="text-[15px] font-semibold tracking-tight"
        >
          rmbrodett
        </Link>
        <nav className="flex items-center gap-5 text-sm sm:gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                link.desktopOnly && "hidden sm:inline"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
