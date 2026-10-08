"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, IMAGES } from "@/data/site";
import { Reveal, RevealImage } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { FlameIcon, HeartIcon, UsersIcon } from "../icons";

const TICKER = [
  "சீரக சம்பா · Seeraga Samba",
  "சின்ன வெங்காயம் · Small Onions",
  "அம்மி மசாலா · Stone-ground Masala",
  "நெய் · Pure Ghee",
  "புதினா · Mint",
  "விறகு தம் · Firewood Dum",
];

const PILLARS = [
  { Icon: FlameIcon, title: BRAND.pillars[0], text: "Seeraga samba, fresh meat, real ghee. Nothing from a packet." },
  { Icon: UsersIcon, title: BRAND.pillars[1], text: "A kitchen that cooks together like family, led by our head chef." },
  { Icon: HeartIcon, title: BRAND.pillars[2], text: "Birthdays, offices, weddings: food that brings people together." },
];

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["30%", "-25%"]);
  const tickerX = useTransform(scrollYProgress, [0, 1], ["5%", "-45%"]);

  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-ink pt-28 pb-24 sm:pt-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-ember/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="relative">
          <RevealImage className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[4/3] lg:aspect-[4/5]">
            <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y: bigY }}>
              <Image
                src={IMAGES.story.src}
                alt={IMAGES.story.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "62% 40%" }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 max-w-[60%] text-xs leading-relaxed tracking-wide text-cream/80">
              Dawn in the kudil kitchen. Whole spices, picked by hand.
            </p>
          </RevealImage>

          <motion.figure
            className="absolute -right-2 -bottom-14 w-[44%] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:-right-6 lg:-right-10"
            style={{ y: smallY }}
          >
            <div className="relative aspect-[4/5]">
              <Image src={IMAGES.portrait.src} alt={IMAGES.portrait.alt} fill sizes="(min-width: 1024px) 22vw, 44vw" className="object-cover object-top" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-3 pt-10 text-[0.65rem] font-semibold tracking-[0.2em] text-turmeric uppercase">
              Founder & Head Chef
            </figcaption>
          </motion.figure>
        </div>

        <div className="pt-10 lg:pt-0">
          <SectionHeading
            eyebrow="Our Story"
            ta="ஒரு குடிலில் தொடங்கிய சுவை"
            title={
              <>
                Born under a <em className="text-gradient-fire italic">thatched</em> roof.
              </>
            }
          />
          <Reveal delay={0.2}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-sand sm:text-[1.05rem]">
              <p>
                <span className="tamil text-cream">குடில்</span> (kudil) means a humble thatched hut, the kind of kitchen where Tamil families
                have cooked for generations. That is where our biryani comes from.
              </p>
              <p>
                Our founder and head chef still cooks the slow way: seeraga samba rice, masala ground on stone, and a copper handi sealed with dough
                over firewood. Today Kudil Biryani & Catering brings that same patience to every padi we cook, for families, offices and weddings
                across Trichy.
              </p>
              <p className="display text-xl text-cream italic">“{BRAND.tagline}”</p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={0.25 + i * 0.08}>
                <div className="glass h-full rounded-2xl p-5 transition-colors duration-500 hover:border-ember/40">
                  <Icon className="text-ember" />
                  <p className="mt-3 text-sm font-semibold text-cream">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-sand/80">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-32 border-y border-white/5 py-6" aria-hidden>
        <motion.div className="flex w-max gap-12 whitespace-nowrap" style={{ x: tickerX }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="display flex items-center gap-12 text-3xl text-cream/25 italic sm:text-5xl">
              {t}
              <span className="h-2 w-2 rotate-45 bg-ember/70" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
