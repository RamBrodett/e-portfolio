"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getAssetPath } from "@/lib/utils";
import { PDFViewer } from "@/components/pdf-viewer";
import { useEffect } from "react";

export default function ResumePage() {
  useEffect(() => {
    // Hide the wave background on this page
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
    
    return () => {
      // Show it again when leaving the page
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.display = 'block';
      }
    };
  }, []);

  return (
    <main className="pt-2">
      <div className="mx-auto max-w-lg md:max-w-2xl xl:max-w-6xl px-4 md:px-0 py-4">
        <div className="h-[calc(100vh-10rem)]">
          <PDFViewer fileUrl={getAssetPath("/resume.pdf")} />
        </div>
      </div>
    </main>
  );
}