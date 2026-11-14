"use client";

import { getAssetPath } from "@/lib/utils";
import { PDFViewer } from "@/components/pdf-viewer";

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-lg px-4 pt-6 sm:px-8 md:max-w-2xl md:px-0 xl:max-w-6xl">
      <h1 className="sr-only">Resume</h1>
      <PDFViewer fileUrl={getAssetPath("/resume.pdf")} />
    </main>
  );
}
