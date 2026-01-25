"use client";

import "@/lib/polyfills";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex items-center justify-center gap-6 mb-4 p-3 bg-card border border-border rounded-lg">
        <h1 className="text-2xl font-bold mr-auto">Resume</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[100px] text-center">
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
          <span className="text-sm min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="sm" asChild>
            <a href={getAssetPath("/resume.pdf")} download="Ram_Brodett_Resume.pdf">
                <Download className="h-4 w-4" />
            </a>
        </Button>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto bg-muted rounded-lg flex items-start justify-center p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading PDF...</div>
          </div>
        )}
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
            scale={scale}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
