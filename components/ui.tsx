import type { ReactNode } from "react";

/** Page-width container used by every section. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-10 ${className}`}>{children}</div>;
}

/**
 * Section opener: a heavy rule, a numbered mono label, and a serif headline
 * on a 12-column grid. The numbering is what gives the page its rhythm.
 */
export function SectionHeading({ index, label, title }: { index: string; label: string; title: ReactNode }) {
  return (
    <div className="reveal mb-12 grid gap-4 border-t border-fg pt-5 sm:mb-16 sm:grid-cols-12">
      <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase sm:col-span-3">
        {index} — {label}
      </p>
      <h2 className="font-serif text-5xl leading-[0.95] tracking-tight text-balance sm:col-span-9 sm:text-7xl">
        {title}
      </h2>
    </div>
  );
}

/** External link: opens in a new tab, arrow nudges on hover. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:\/\//.test(href) || href.endsWith(".pdf");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={`group inline-flex items-center gap-1.5 ${className}`}
    >
      <span className="draw-underline">{children}</span>
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </a>
  );
}
