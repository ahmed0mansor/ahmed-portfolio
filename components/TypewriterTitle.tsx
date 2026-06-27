"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterTitleProps = {
  arTerms: string[];
  enTerms: string[];
  className?: string;
};

const TYPE_SPEED_MS = 72;
const DELETE_SPEED_MS = 46;
const HOLD_AFTER_TYPE_MS = 1350;
const HOLD_AFTER_DELETE_MS = 320;

function normalizeTerms(terms: string[]) {
  const cleaned = terms.map((term) => term.trim()).filter(Boolean);
  return cleaned.length ? Array.from(new Set(cleaned)) : [""];
}

function useTypewriter(terms: string[]) {
  const safeTerms = useMemo(() => normalizeTerms(terms), [terms]);
  const [termIndex, setTermIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleText(safeTerms[0] || "");
      return undefined;
    }

    const currentTerm = safeTerms[termIndex] || "";
    let delay = isDeleting ? DELETE_SPEED_MS : TYPE_SPEED_MS;

    if (!isDeleting && visibleText === currentTerm) {
      delay = HOLD_AFTER_TYPE_MS;
    }

    if (isDeleting && visibleText === "") {
      delay = HOLD_AFTER_DELETE_MS;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && visibleText === currentTerm) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && visibleText === "") {
        setIsDeleting(false);
        setTermIndex((index) => (index + 1) % safeTerms.length);
        return;
      }

      if (isDeleting) {
        setVisibleText(currentTerm.slice(0, Math.max(visibleText.length - 1, 0)));
        return;
      }

      setVisibleText(currentTerm.slice(0, visibleText.length + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, safeTerms, termIndex, visibleText]);

  return visibleText;
}

function TypewriterSpan({ terms, className }: { terms: string[]; className?: string }) {
  const text = useTypewriter(terms);
  const label = normalizeTerms(terms).join("، ");

  return (
    <span className={`typewriter-title ${className ?? ""}`} aria-label={label}>
      <span className="typewriter-text">{text}</span>
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
}

export function TypewriterTitle({ arTerms, enTerms, className }: TypewriterTitleProps) {
  return (
    <>
      <TypewriterSpan terms={arTerms} className={`lang-ar ${className ?? ""}`} />
      <TypewriterSpan terms={enTerms} className={`lang-en ${className ?? ""}`} />
    </>
  );
}
