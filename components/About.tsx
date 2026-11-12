import Image from "next/image";
import portrait from "@/assets/portrait.jpg";
import { about, site } from "@/lib/content";
import { Container, SectionHeading } from "./ui";

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="02"
          label="About"
          title={
            <>
              From the mixing desk <em className="italic">to machine learning.</em>
            </>
          }
        />

        <div className="grid gap-12 md:grid-cols-12">
          <figure className="reveal md:col-span-5">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={portrait}
                alt={site.name}
                placeholder="blur"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="aspect-[4/5] w-full object-cover grayscale transition-[filter,scale] duration-700 hover:scale-[1.02] hover:grayscale-0"
              />
            </div>
          </figure>

          <div className="md:col-span-7">
            <p className="reveal font-serif text-3xl leading-tight text-balance sm:text-4xl">{about.lead}</p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p} className="reveal">
                  {p}
                </p>
              ))}
            </div>
            <blockquote className="reveal mt-10 border-l-2 border-accent pl-6 font-serif text-2xl leading-snug italic">
              “{about.quote}”
            </blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
}
