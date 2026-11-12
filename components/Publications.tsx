import { publications, site } from "@/lib/content";
import { ArrowLink, Container, SectionHeading } from "./ui";

export function Publications() {
  return (
    <section id="publications" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          label="Papers & articles"
          title={
            <>
              Writing it down <em className="italic">properly.</em>
            </>
          }
        />

        <div className="flex flex-col gap-6">
          {publications.map((paper) => (
            <article key={paper.url} className="reveal relative overflow-hidden rounded-3xl bg-surface p-7 sm:p-12">
              <p className="font-mono text-xs tracking-[0.16em] text-code uppercase">{paper.venue}</p>
              <h3 className="mt-5 max-w-4xl font-serif text-3xl leading-[1.1] text-pretty sm:text-5xl">{paper.title}</h3>
              <p className="mt-4 font-mono text-xs text-muted">{paper.meta}</p>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted">{paper.blurb}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
                <ArrowLink href={paper.url}>{paper.urlLabel}</ArrowLink>
                {paper.repo && <ArrowLink href={paper.repo}>Source</ArrowLink>}
              </div>
            </article>
          ))}
        </div>

        <p className="reveal mt-10 text-sm text-muted">
          All papers on <ArrowLink href={site.links.scholar} className="text-fg">Google Scholar</ArrowLink>
        </p>
      </Container>
    </section>
  );
}
