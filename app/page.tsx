import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Background />
      </main>
    </>
  );
}
