"use client";

import "@/lib/polyfills";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { getAssetPath } from "@/lib/utils";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-3 bg-card border border-border rounded-lg">
        <h1 className="text-xl md:text-2xl font-bold">Resume</h1>
        
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={pageNumber <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[60px] md:min-w-[100px] text-center">
                Page {pageNumber} of {numPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={pageNumber >= numPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
            </div>

            <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[40px] md:min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
            </Button>
            </div>
            
            <Button variant="outline" size="sm" asChild>
                <a href={getAssetPath("/resume.pdf")} download="Ram_Brodett_Resume.pdf">
                    <Download className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Download</span>
                </a>
            </Button>
        </div>
      </div>

      {/* PDF Display */}
      <div 
        className="flex-1 overflow-auto bg-muted rounded-lg relative" 
        ref={containerRef}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-muted-foreground">Loading PDF...</div>
          </div>
        )}
        <div className="min-w-full min-h-full flex items-start justify-center p-4 w-fit">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
            error={
              <div className="text-destructive p-4">
                Failed to load PDF. Please try downloading instead.
              </div>
            }
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              width={containerWidth ? Math.min(containerWidth - 40, 800) * scale : undefined}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
