import { site } from "@/lib/content";
import { Container } from "./ui";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Background", href: "#background" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" className="font-serif text-2xl tracking-tight">
          {site.name}
        </a>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="draw-underline text-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
    </header>
  );
}
