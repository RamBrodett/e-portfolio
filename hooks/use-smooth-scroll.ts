"use client";

import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Use native smooth scroll - faster and smoother
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update URL hash without jumping
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  return scrollToSection;
}
