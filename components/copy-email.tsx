"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable: the mailto button above still works */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-muted-foreground">
      <span>{email}</span>
      <button
        type="button"
        onClick={copy}
        className="rounded-md border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
