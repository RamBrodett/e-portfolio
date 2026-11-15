"use client";

import { useEffect } from "react";

const EDITABLE = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

function isEditable(target: EventTarget | null) {
  const el = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  return Boolean(el?.closest(EDITABLE));
}

/**
 * Stops page text from being selected, copied or cut, backing up the
 * `user-select: none` rule in globals.css. Form fields still work.
 * The Copy email button is unaffected: it writes to the clipboard directly.
 */
export function CopyGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const events = ["selectstart", "copy", "cut"] as const;
    events.forEach((type) => document.addEventListener(type, block));
    return () => events.forEach((type) => document.removeEventListener(type, block));
  }, []);

  return null;
}
