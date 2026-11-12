import { site } from "@/lib/content";
import { ArrowLink, Container } from "./ui";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="bg-fg pt-24 pb-10 text-bg sm:pt-32">
      <Container>
        <p className="reveal font-mono text-xs tracking-[0.16em] uppercase opacity-70">04 — Contact</p>

        <a
          href={`mailto:${site.email}`}
          className="reveal group mt-6 block font-serif text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-[-0.03em]"
        >
          Let&rsquo;s <em className="italic transition-colors group-hover:text-accent">talk.</em>
          <span
            aria-hidden
            className="ml-4 inline-block text-[0.5em] transition-transform duration-500 group-hover:translate-x-3"
          >
            →
          </span>
        </a>
        <p className="reveal mt-6 text-lg opacity-70">{site.email}</p>

        <div className="reveal mt-14 flex flex-wrap gap-x-10 gap-y-4 font-medium">
          <ArrowLink href={site.links.cv}>Download CV</ArrowLink>
          <ArrowLink href={site.links.linkedin}>LinkedIn</ArrowLink>
          <ArrowLink href={site.links.github}>GitHub</ArrowLink>
          <ArrowLink href={site.links.scholar}>Google Scholar</ArrowLink>
          <ArrowLink href={site.links.soundcloud}>SoundCloud</ArrowLink>
        </div>

        <footer className="mt-24 flex flex-col gap-2 border-t border-bg/20 pt-6 font-mono text-xs opacity-60 sm:flex-row sm:justify-between">
          <span>
            © {year} {site.name}
          </span>
          <a href="#top" className="draw-underline self-start">
            Back to top ↑
          </a>
        </footer>
      </Container>
    </section>
  );
}
