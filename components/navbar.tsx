import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/60 ">
      <div className="mx-auto max-w-lg md:max-w-2xl xl:max-w-6xl  flex h-14 items-center justify-between px-8 md:px-0">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              rmbrodett
            </span>
          </Link>
        </div>
        <div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
            <Link href="/#projects" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Projects
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}