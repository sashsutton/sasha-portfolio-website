import { site } from "@/lib/content";
import { HeroComputer } from "./HeroComputer";
import { Container } from "./ui";
import { Waveform } from "./Waveform";

const [first, last] = site.name.split(" ");

export function Hero() {
  return (
    <section id="top" className="relative flex flex-col pt-8 pb-8 sm:pt-14 lg:min-h-[calc(100svh-4rem)]">
      {/* Phones: name, then the computer underneath. From md up: side by side.
          The hero only fills the screen height on landscape-sized screens (lg+);
          on tall portrait tablets that left a large empty gap. */}
      <Container className="grid items-end gap-2 md:grid-cols-12 md:gap-6">
        <h1
          className="rise font-serif text-[clamp(4.5rem,17vw,15rem)] leading-[0.82] tracking-[-0.03em] md:col-span-7 md:text-[clamp(4.5rem,13.5vw,13rem)]"
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          {first}
          <br />
          <em className="pl-[0.6em] italic">{last}</em>
        </h1>

        <div
          className="rise mx-auto aspect-[5/4] w-full max-w-sm md:col-span-5 md:-mb-6 md:aspect-[6/5] md:max-w-none"
          style={{ "--d": "260ms" } as React.CSSProperties}
        >
          <HeroComputer />
        </div>
      </Container>

      {/* Full-bleed: the wave runs edge to edge, past the text column. */}
      {/* Short laptop screens get a slimmer band so the intro stays above the fold. */}
      <div
        className="rise my-6 sm:my-10 [@media(min-width:640px)_and_(max-height:820px)]:my-5"
        style={{ "--d": "220ms" } as React.CSSProperties}
      >
        <Waveform className="h-24 sm:h-40 [@media(min-width:640px)_and_(max-height:820px)]:h-28" />
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
