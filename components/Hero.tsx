import { site } from "@/lib/content";
import { Container } from "./ui";
import { Waveform } from "./Waveform";

const [first, last] = site.name.split(" ");

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[calc(100svh-4rem)] flex-col pt-10 pb-8 sm:pt-16">
      <Container>
        <h1
          className="rise font-serif text-[clamp(4.5rem,17vw,15rem)] leading-[0.82] tracking-[-0.03em]"
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          {first}
          <br />
          <em className="pl-[0.6em] italic">{last}</em>
        </h1>
      </Container>

      {/* Full-bleed: the wave runs edge to edge, past the text column. */}
      <div className="rise my-8 sm:my-10" style={{ "--d": "220ms" } as React.CSSProperties}>
        <Waveform className="h-28 sm:h-40" />
      </div>

      <Container className="mt-auto">
        <div className="rise grid items-end gap-8 sm:grid-cols-12" style={{ "--d": "320ms" } as React.CSSProperties}>
          <p className="text-2xl leading-snug text-balance sm:col-span-7 sm:text-3xl">{site.intro}</p>
          <div className="flex flex-wrap gap-3 sm:col-span-5 sm:justify-end">
            <a
              href="#publications"
              className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              See my work ↓
            </a>
            <a
              href="#contact"
              className="rounded-full border border-fg px-6 py-3 font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              Get in touch
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
