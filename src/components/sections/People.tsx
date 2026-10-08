"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { CHEF, IMAGES } from "@/data/site";
import { Reveal, RevealImage } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { ChefIcon, FlameIcon, HeartIcon, UsersIcon } from "../icons";

const ROLES = [
  { Icon: ChefIcon, title: "Masters of the dum", text: "Cooks who have learnt the handi, the coals and the timing at our head chef’s side." },
  { Icon: FlameIcon, title: "Masala makers", text: "Hands that grind, roast and blend our masala fresh every day." },
  { Icon: HeartIcon, title: "Hosts & servers", text: "The smiles who serve your biryani on banana leaf, hot from the handi." },
  { Icon: UsersIcon, title: "Catering crew", text: "The team that brings Kudil to mini halls and marriage halls across Trichy." },
];

function ChefPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(30);
  const light = useTransform([lightX, lightY], ([x, y]) => `radial-gradient(500px circle at ${x}% ${y}%, rgba(255,170,90,0.22), transparent 55%)`);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set((0.5 - py) * 10);
    lightX.set(px * 100);
    lightY.set(py * 100);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }} className="[perspective:1200px]">
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-ember/40 via-chili/20 to-transparent blur-3xl" />
        <RevealImage className="relative aspect-[985/1024] overflow-hidden rounded-[28px] border border-white/10">
          <Image src={IMAGES.portrait.src} alt={IMAGES.portrait.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          <motion.div className="absolute inset-0 mix-blend-overlay" style={{ background: light }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
        </RevealImage>
        <div className="absolute right-5 bottom-5 left-5 sm:right-8 sm:bottom-8 sm:left-8" style={{ transform: "translateZ(60px)" }}>
          <p className="text-[0.65rem] font-bold tracking-[0.28em] text-turmeric uppercase">{CHEF.role}</p>
          <p className="display mt-1 text-2xl text-cream sm:text-3xl">{CHEF.name}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function People() {
  const strip = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: strip, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-6%", "14%"]);

  return (
    <section id="people" className="relative overflow-hidden bg-coal py-28 sm:py-36">
      <div className="pointer-events-none absolute -top-20 -left-40 h-[600px] w-[600px] rounded-full bg-ember/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <ChefPortrait />
          <div>
            <SectionHeading
              eyebrow="Our People"
              ta="உணவுக்குப் பின்னால் உள்ள மனிதர்கள்"
              title={
                <>
                  The hands behind <em className="text-gradient-fire italic">every handi.</em>
                </>
              }
            />
            <Reveal delay={0.2}>
              <blockquote className="relative mt-8 border-l-2 border-ember pl-6">
                <p className="display text-2xl leading-snug text-cream italic sm:text-[1.7rem]">“{CHEF.quote}”</p>
                <footer className="mt-4 text-sm text-sand">— {CHEF.name}</footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 leading-relaxed text-sand">
                Our founder is in the kitchen every day: tasting the masala, checking the rice and breaking the first dum seal himself. He
                leads a small team that cooks, serves and laughs together like family. That warmth is the secret ingredient you taste in every
                plate.
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={strip} className="mt-28 grid gap-5 md:grid-cols-[1.6fr_1fr]">
          <RevealImage className="relative aspect-[16/10] overflow-hidden rounded-[28px] md:aspect-auto md:min-h-[460px]">
            <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ y: leftY }}>
              <Image src={IMAGES.team.src} alt={IMAGES.team.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="tamil text-lg font-semibold text-ember">குடில் குடும்பம்</p>
              <p className="display text-3xl text-cream">The Kudil family</p>
            </div>
          </RevealImage>
          <div className="grid gap-5">
            <RevealImage delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
              <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ y: rightY }}>
                <Image src={IMAGES.serving.src} alt={IMAGES.serving.alt} fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <p className="absolute bottom-4 left-5 text-sm font-semibold text-cream">Serving guests, the Tamil way</p>
            </RevealImage>
            <RevealImage delay={0.2} className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
              <Image src={IMAGES.presenting.src} alt={IMAGES.presenting.alt} fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover object-[50%_30%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <p className="absolute bottom-4 left-5 text-sm font-semibold text-cream">Presenting the day’s first handi</p>
            </RevealImage>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ember/40">
                <Icon className="text-ember" />
                <p className="mt-4 font-semibold text-cream">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-sand/80">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
