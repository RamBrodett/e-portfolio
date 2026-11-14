"use client";

import "@/lib/polyfills";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, Minus, Plus } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_SCALE = 0.6;
const MAX_SCALE = 2;
const STEP = 0.2;
const MAX_PAGE_WIDTH = 860;

interface PDFViewerProps {
  fileUrl: string;
  downloadName?: string;
}

/** Every page stacked for continuous scrolling, with a small floating zoom/download bar. */
export function PDFViewer({ fileUrl, downloadName = "Ram_Brodett_Resume.pdf" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pageWidth = containerWidth ? Math.min(containerWidth, MAX_PAGE_WIDTH) * scale : undefined;
  const zoom = (delta: number) =>
    setScale((s) => Math.round(Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)) * 10) / 10);

  const iconButton =
    "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

  return (
    <div>
      <div className="sticky top-[4.5rem] z-40 mx-auto flex w-fit items-center gap-1 rounded-lg border border-border bg-background/85 p-1 shadow-sm backdrop-blur">
        <button type="button" className={iconButton} onClick={() => zoom(-STEP)} disabled={scale <= MIN_SCALE} aria-label="Zoom out">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <button type="button" className={iconButton} onClick={() => zoom(STEP)} disabled={scale >= MAX_SCALE} aria-label="Zoom in">
          <Plus className="h-4 w-4" />
        </button>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
        <a
          href={fileUrl}
          download={downloadName}
          className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>

      <div ref={containerRef} className="mt-6 overflow-x-auto">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="mx-auto flex aspect-[8.5/11] w-full max-w-[860px] items-center justify-center rounded-sm border border-border bg-card/90 font-mono text-xs text-muted-foreground">
              Loading resume…
            </div>
          }
          error={
            <div className="rounded-lg border border-border bg-card/90 p-6 text-center text-muted-foreground">
              The resume could not be displayed.{" "}
              <a href={fileUrl} download={downloadName} className="font-medium text-primary underline-offset-4 hover:underline">
                Download the PDF
              </a>{" "}
              instead.
            </div>
          }
          className="mx-auto flex w-fit min-w-full flex-col items-center gap-6 pb-16"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={pageWidth}
              className="overflow-hidden rounded-sm shadow-lg"
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
