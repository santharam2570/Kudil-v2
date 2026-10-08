import { FloatingOrder } from "@/components/FloatingOrder";
import { Nav } from "@/components/Nav";
import { Contact } from "@/components/sections/Contact";
import { Features } from "@/components/sections/Features";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Interlude } from "@/components/sections/Interlude";
import { Menu } from "@/components/sections/Menu";
import { People } from "@/components/sections/People";
import { Process } from "@/components/sections/Process";
import { Signature } from "@/components/sections/Signature";
import { Story } from "@/components/sections/Story";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Process />
        <Signature />
        <Interlude />
        <Menu />
        <People />
        <Features />
        <Gallery />
        <Contact />
      </main>
      <FloatingOrder />
    </>
  );
}
