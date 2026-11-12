import { site } from "@/lib/content";
import { Container } from "./ui";

const LINKS = [
  { label: "Papers", href: "#publications" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Background", href: "#background" },
  { label: "Contact", href: "#contact" },
];

function Links({ className }: { className: string }) {
  return (
    <ul className={className}>
      {LINKS.map((link) => (
        <li key={link.href} className="shrink-0">
          <a href={link.href} className="draw-underline text-muted transition-colors hover:text-fg">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" className="font-serif text-2xl tracking-tight">
          {site.name}
        </a>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <Links className="hidden items-center gap-6 md:flex" />
          <a
            href={site.links.cv}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-fg px-4 py-1.5 font-medium transition-colors hover:bg-fg hover:text-bg"
          >
            CV
          </a>
        </nav>
      </Container>

      {/* Phones and small tablets: the section links get their own row, scrollable sideways if they don't fit.
          The fade on the right edge hints that there is more. */}
      <nav aria-label="Sections" className="border-t border-line md:hidden">
        <Container className="overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Links className="flex h-10 items-center gap-5 pr-10 text-sm whitespace-nowrap" />
        </Container>
      </nav>
    </header>
  );
}
