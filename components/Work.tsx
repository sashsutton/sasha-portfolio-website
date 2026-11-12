import { projects, publication, site } from "@/lib/content";
import { ArrowLink, Container, SectionHeading } from "./ui";

export function Work() {
  return (
    <section id="work" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="01"
          label="Selected work"
          title={
            <>
              Things I built <em className="italic">to understand them.</em>
            </>
          }
        />

        {/* The paper leads: it's the most substantial piece of work. */}
        <article className="reveal relative overflow-hidden rounded-3xl bg-surface p-7 sm:p-12">
          <p className="font-mono text-xs tracking-[0.16em] text-code uppercase">Publication · HAL 2026</p>
          <h3 className="mt-5 max-w-4xl font-serif text-3xl leading-[1.1] text-pretty sm:text-5xl">
            {publication.title}
          </h3>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{publication.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
            <ArrowLink href={publication.hal}>Read on HAL</ArrowLink>
            <ArrowLink href={publication.repo}>Source</ArrowLink>
            <ArrowLink href={site.links.scholar}>Google Scholar</ArrowLink>
          </div>
        </article>

        <ol className="mt-6">
          {projects.map((project, i) => (
            <li
              key={project.title}
              className="reveal group grid gap-4 border-b border-line py-8 sm:grid-cols-12 sm:gap-6 sm:py-10"
            >
              <span className="font-mono text-xs text-muted sm:col-span-1 sm:pt-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="sm:col-span-7">
                <h3 className="font-mono text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                  {project.title}
                </h3>
                <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">{project.blurb}</p>
              </div>
              <div className="flex flex-col gap-4 sm:col-span-4 sm:items-end sm:pt-2">
                <ul className="flex flex-wrap gap-1.5 sm:justify-end">
                  {project.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-6 text-sm font-medium">
                  {project.demo && <ArrowLink href={project.demo}>Live</ArrowLink>}
                  <ArrowLink href={project.repo}>Code</ArrowLink>
                  <span className="font-mono text-xs leading-5 text-muted">{project.year}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="reveal mt-10 text-sm text-muted">
          More on <ArrowLink href={site.links.github} className="text-fg">GitHub</ArrowLink>
        </p>
      </Container>
    </section>
  );
}
