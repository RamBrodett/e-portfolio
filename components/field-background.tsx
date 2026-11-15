"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { createField, type FieldHandle } from "@/lib/field-engine";
import { siteConfig } from "@/lib/site-config";

// Pages where the moving background would compete with the content.
const HIDDEN_ON = ["/resume"];

export function FieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<FieldHandle | null>(null);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  // trailingSlash is on, so the path can arrive as "/resume/".
  const hidden = HIDDEN_ON.includes(pathname.replace(/\/+$/, "") || "/");

  useEffect(() => {
    if (hidden || !canvasRef.current) return;
    const field = createField(canvasRef.current, {
      mode: siteConfig.background,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    });
    fieldRef.current = field;
    return () => {
      field.destroy();
      fieldRef.current = null;
    };
  }, [hidden]);

  useEffect(() => {
    fieldRef.current?.setTheme(resolvedTheme === "light" ? "light" : "dark");
  }, [resolvedTheme]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
    />
  );
}
