import type { ReactNode } from "react";

export function SectionHeading({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
      <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{title}</h2>
      {meta && <span className="font-mono text-[13px] text-muted-foreground">{meta}</span>}
    </div>
  );
}
