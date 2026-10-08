"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { STEPS } from "@/data/site";
import { Reveal, RevealImage } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

function PinnedSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length * 0.999))));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const target = top + span * ((i + 0.5) / STEPS.length);
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={ref} className="relative hidden md:block" style={{ height: `${STEPS.length * 85 + 40}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.08 }}
              transition={{ duration: 1.3, ease }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: s.origin }}
                animate={i === active ? { scale: [1.0, 1.12] } : { scale: 1.0 }}
                transition={{ duration: 9, ease: "linear" }}
              >
                <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: s.origin }} />
              </motion.div>
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr] items-center gap-10 px-8 lg:gap-16">
          <ol className="flex flex-col gap-1" aria-label="Cooking steps">
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`group flex items-center gap-4 py-2 text-left transition-colors duration-500 ${i === active ? "text-cream" : "text-cream/35 hover:text-cream/70"}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className={`display text-sm tabular-nums ${i === active ? "text-ember" : ""}`}>{s.n}</span>
                  <span className={`h-px transition-all duration-700 ${i === active ? "w-12 bg-ember" : "w-5 bg-current"}`} />
                  <span className="hidden text-xs font-semibold tracking-[0.18em] uppercase lg:inline">{s.short}</span>
                </button>
              </li>
            ))}
            <li className="mt-6 h-40 w-px overflow-hidden bg-cream/10">
              <motion.span className="block w-px bg-gradient-to-b from-turmeric to-ember" style={{ height: bar }} />
            </li>
          </ol>

          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.8, ease }}
              >
                <p className="display text-sm tracking-[0.3em] text-turmeric">
                  STEP {STEPS[active].n} <span className="text-cream/30">/ 0{STEPS.length}</span>
                </p>
                <p className="tamil mt-4 text-2xl font-semibold text-ember">{STEPS[active].ta}</p>
                <h3 className="display mt-2 text-4xl leading-tight text-cream lg:text-5xl">{STEPS[active].en}</h3>
                <p className="mt-5 text-lg leading-relaxed text-sand">{STEPS[active].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <ol className="space-y-14 px-5 md:hidden">
      {STEPS.map((s) => (
        <li key={s.n}>
          <RevealImage className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
            <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: s.origin }} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <span className="display absolute bottom-3 left-4 text-5xl text-white/80">{s.n}</span>
          </RevealImage>
          <Reveal delay={0.1}>
            <p className="tamil mt-5 text-lg font-semibold text-ember">{s.ta}</p>
            <h3 className="display mt-1 text-3xl text-cream">{s.en}</h3>
            <p className="mt-3 leading-relaxed text-sand">{s.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function Process() {
  return (
    <section id="process" className="relative bg-ink pt-24 pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 md:pb-10">
        <SectionHeading
          eyebrow="Our Cooking Process"
          ta="சமையல் பயணம்"
          title={
            <>
              Five steps. <em className="text-gradient-fire italic">No shortcuts.</em>
            </>
          }
          intro="Follow our head chef through a day in the Kudil kitchen, from choosing the rice at sunrise to breaking the dum seal at your table."
        />
      </div>
      <PinnedSequence />
      <StackedSteps />
    </section>
  );
}
