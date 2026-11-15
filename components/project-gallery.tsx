"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectMedia } from "@/lib/projects";
import { cn, getAssetPath, getYouTubeId } from "@/lib/utils";

const NAV_BUTTON =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Project media in a column; images open full size in a viewer with prev/next. */
export function ProjectGallery({ media, title }: { media: ProjectMedia[]; title: string }) {
  const images = media.filter((item) => item.type === "image");
  const [current, setCurrent] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Open and close the native dialog with the state, and keep the page behind it still.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [current]);

  const close = () => setCurrent(null);
  const step = (delta: number) =>
    setCurrent((i) => (i === null ? null : (i + delta + images.length) % images.length));
  // A click anywhere but the image, its caption or a button closes the viewer.
  const closeOnEmptyArea = (e: React.MouseEvent) => {
    if (!(e.target as Element).closest("img, p, button")) close();
  };

  const shown = current === null ? null : images[current];
  const hasMany = images.length > 1;
  const ratio = shown?.width && shown?.height ? shown.width / shown.height : 16 / 9;

  return (
    <>
      <div className="grid gap-6">
        {media.map((item, index) => {
          const imageIndex = images.indexOf(item);
          return (
            <figure key={index} className="space-y-2">
              <div className="relative overflow-hidden rounded-lg border bg-muted">
                {item.type === "video" ? (
                  getYouTubeId(item.url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                      className="aspect-video h-auto w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={getAssetPath(item.url)} controls className="aspect-video h-auto w-full object-cover" />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrent(imageIndex)}
                    aria-label={`View larger: ${item.caption || title}`}
                    className="group block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                  >
                    <Image
                      src={getAssetPath(item.url)}
                      alt={item.caption || title}
                      width={item.width ?? 0}
                      height={item.height ?? 0}
                      sizes="(min-width: 768px) 768px, 100vw"
                      className="h-auto w-full object-cover transition-opacity group-hover:opacity-95"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md border border-border bg-card/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <Maximize2 className="size-4" />
                    </span>
                  </button>
                )}
              </div>
              {item.caption && (
                <figcaption className="text-center text-sm italic text-muted-foreground">{item.caption}</figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={shown?.caption || title}
        onClose={close}
        onClick={closeOnEmptyArea}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches.length === 1 ? e.touches[0].clientX : null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          // Swipe between images, but not while the page is pinch-zoomed.
          if (start === null || !hasMany || (window.visualViewport?.scale ?? 1) > 1) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-background/95 p-0 text-foreground backdrop-blur-sm backdrop:bg-transparent"
      >
        {shown && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {hasMany ? `${(current ?? 0) + 1} / ${images.length}` : ""}
              </span>
              <button type="button" onClick={close} aria-label="Close" autoFocus className={NAV_BUTTON}>
                <X className="size-5" />
              </button>
            </div>

            {/* A size container, so the image is fitted from its known ratio before it loads. */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
              style={{ containerType: "size" }}
            >
              <Image
                key={shown.url}
                src={getAssetPath(shown.url)}
                alt={shown.caption || title}
                width={shown.width ?? 0}
                height={shown.height ?? 0}
                sizes="100vw"
                loading="eager"
                style={{ aspectRatio: ratio, width: `min(100cqw, ${ratio} * 100cqh)` }}
                className="h-auto rounded-md border border-border object-contain shadow-lg"
              />
              {hasMany && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className={cn(NAV_BUTTON, "absolute left-4 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className={cn(NAV_BUTTON, "absolute right-4 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 px-4 pb-5 pt-3 sm:px-6">
              {hasMany && (
                <button type="button" onClick={() => step(-1)} aria-label="Previous image" className={cn(NAV_BUTTON, "sm:hidden")}>
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {shown.caption && (
                <p className="max-w-2xl text-center text-sm text-muted-foreground">{shown.caption}</p>
              )}
              {hasMany && (
                <button type="button" onClick={() => step(1)} aria-label="Next image" className={cn(NAV_BUTTON, "sm:hidden")}>
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
