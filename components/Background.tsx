import { science, site, sound } from "@/lib/content";
import { ArrowLink, Container, SectionHeading } from "./ui";

type Entry = { years: string; place: string; title: string; url?: string };

function Column({
  label,
  dot,
  entries,
  footer,
}: {
  label: string;
  dot: string;
  entries: Entry[];
  footer?: React.ReactNode;
}) {
  return (
    <div className="reveal">
      <h3 className="flex items-center gap-3 border-b border-fg pb-4 font-mono text-xs tracking-[0.16em] uppercase">
        <span className={`size-2.5 rounded-full ${dot}`} />
        {label}
      </h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.title} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-6">
            <span className="pt-0.5 font-mono text-xs text-muted">{entry.years}</span>
            <div>
              <p className="text-lg font-medium">
                {entry.url ? <ArrowLink href={entry.url}>{entry.place}</ArrowLink> : entry.place}
              </p>
              <p className="mt-1 text-muted">{entry.title}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">{footer}</div>}
    </div>
  );
}

export function Background() {
  return (
    <section id="background" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="04"
          label="Background"
          title={
            <>
              Two disciplines, <em className="italic">one habit.</em>
            </>
          }
        />
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <Column label="Science & AI" dot="bg-code" entries={science} />
          <Column
            label="Music & Sound"
            dot="bg-accent"
            entries={sound}
            footer={
              <>
                <ArrowLink href={site.links.soundcloud}>Listen on SoundCloud</ArrowLink>
                <ArrowLink href={site.links.youtube}>Watch a set</ArrowLink>
              </>
            }
          />
        </div>
      </Container>
    </section>
  );
}
