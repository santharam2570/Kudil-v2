"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, IMAGES } from "@/data/site";

export function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(12% 6% 12% 6% round 32px)", "inset(0% 0% 0% 0% round 0px)"]);

  return (
    <section ref={ref} className="relative h-[85svh] min-h-[520px] overflow-hidden bg-ink" aria-label={BRAND.tagline}>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <motion.div className="absolute -inset-y-[15%] inset-x-0" style={{ y, scale }}>
          <Image src={IMAGES.macro.src} alt={IMAGES.macro.alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
      </motion.div>
      <motion.div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center" style={{ y: textY }}>
        <p className="tamil text-2xl font-semibold text-ember sm:text-3xl">சுவை நினைவில் நிற்கும்</p>
        <p className="display mt-3 max-w-4xl text-[clamp(2.4rem,7vw,6rem)] leading-[1] text-cream italic">{BRAND.tagline}</p>
      </motion.div>
    </section>
  );
}
