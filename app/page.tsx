import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Publications } from "@/components/Publications";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Publications />
        <Projects />
        <About />
        <Background />
        <Contact />
      </main>
    </>
  );
}
