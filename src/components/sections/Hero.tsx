"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { BRAND, IMAGES, MENU, formatINR, whatsappLink } from "@/data/site";
import { useDeviceProfile, useNearViewport } from "@/lib/hooks";
import { ArrowIcon, FlameIcon, HeartIcon, UsersIcon, WhatsAppIcon } from "../icons";

const HeroAtmosphere = dynamic(() => import("@/three/HeroAtmosphere"), { ssr: false });

const IMG_W = IMAGES.hero.w;
const IMG_H = IMAGES.hero.h;
/** Pot rim and firebox positions inside the hero photo (0..1 from the top-left). */
const POT = [0.5, 0.68] as const;
const FIRE = [0.49, 0.93] as const;

const focusX = (w: number, h: number) => (w / h < 1 ? 0.8 : 0.66);

function toContainerUv(w: number, h: number, [u, v]: readonly [number, number]): [number, number] {
  const s = Math.max(w / IMG_W, h / IMG_H);
  const rw = IMG_W * s;
  const rh = IMG_H * s;
  const x = (w - rw) * focusX(w, h) + u * rw;
  const y = (h - rh) * 0.5 + v * rh;
  return [x / w, 1 - y / h];
}

const ease = [0.22, 1, 0.36, 1] as const;
const luxury = MENU.find((m) => m.id === "mutton-luxury")!;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const profile = useDeviceProfile();
  const near = useNearViewport(ref, "0px");
  const [origins, setOrigins] = useState<{ steam: [number, number]; fire: [number, number] }>({
    steam: [0.5, 0.32],
    fire: [0.49, 0.07],
  });
  const [atmosphere, setAtmosphere] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const dim = useTransform(scrollYProgress, [0, 0.9], [0, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, (v) => v * -14), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, (v) => v * -10), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setOrigins({ steam: toContainerUv(width, height, POT), fire: toContainerUv(width, height, FIRE) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!profile.ready || !profile.webgl || profile.reduced) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setAtmosphere(true), { timeout: 1500 });
    else setTimeout(() => setAtmosphere(true), 600);
  }, [profile]);

  const onPointer = (e: React.PointerEvent) => {
    if (profile.touch) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointer}
      className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-ink"
      aria-label="Kudil Biryani"
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <motion.div ref={stage} className="absolute -inset-4 animate-kenburns" style={{ x: px, y: py }}>
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover object-[66%_50%] [@media(max-aspect-ratio:1/1)]:object-[80%_50%]"
          />
          {atmosphere && (
            <HeroAtmosphere steamOrigin={origins.steam} fireOrigin={origins.fire} active={near} lite={profile.lite} />
          )}
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/45 to-transparent md:block" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-25% via-ink/55 via-55% to-ink/10 md:from-ink md:from-0% md:via-transparent md:to-ink/40" />
      <div className="vignette absolute inset-0" />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: dim }} />

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 sm:px-8 md:justify-center md:pb-0"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl pt-24">
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            <span className="rounded-full border border-leaf/60 bg-leaf/30 px-3 py-1 text-[0.65rem] font-bold tracking-[0.25em] text-[#bfe3b4] uppercase">
              100% Halal
            </span>
            <span className="text-[0.7rem] font-semibold tracking-[0.3em] text-sand uppercase">Biryani & Catering · Trichy</span>
          </motion.div>

          <h1 className="mt-6">
            <motion.span
              className="tamil text-gradient-fire block text-[clamp(2.6rem,8vw,5.6rem)] leading-[1.15] font-extrabold drop-shadow-[0_6px_30px_rgba(242,107,29,0.25)]"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 0.35, ease }}
            >
              {BRAND.nameTa}
            </motion.span>
            <span className="display mt-3 block text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.05] font-medium text-cream">
              {["Slow-cooked on firewood.", "Sealed with dum."].map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.6 + i * 0.15, ease }}
                >
                  {i === 1 ? (
                    <>
                      Sealed with <em className="text-gradient-fire pr-[0.06em] italic">dum</em>.
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed text-sand sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95, ease }}
          >
            Pure seeraga samba biryani, cooked in hammered copper handis by our founder and head chef. {BRAND.tagline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
          >
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary">
              <WhatsAppIcon /> Order on WhatsApp
            </a>
            <a href="#menu" className="btn btn-ghost">
              Explore the menu <ArrowIcon width={16} height={16} />
            </a>
          </motion.div>

          <motion.ul
            className="mt-10 hidden gap-6 text-xs font-semibold tracking-[0.18em] text-cream/70 uppercase sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.35 }}
          >
            {[
              [FlameIcon, BRAND.pillars[0]],
              [UsersIcon, BRAND.pillars[1]],
              [HeartIcon, BRAND.pillars[2]],
            ].map(([Icon, label]) => {
              const I = Icon as typeof FlameIcon;
              return (
                <li key={label as string} className="flex items-center gap-2">
                  <I width={16} height={16} className="text-ember" /> {label as string}
                </li>
              );
            })}
          </motion.ul>
        </div>
      </motion.div>

      <motion.a
        href="#signature"
        className="glass absolute right-8 bottom-10 z-10 hidden max-w-[260px] rounded-2xl p-4 lg:block"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 1.5, ease }}
      >
        <p className="text-[0.65rem] font-bold tracking-[0.25em] text-turmeric uppercase">The Signature</p>
        <p className="display mt-1 text-lg leading-snug text-cream">Pure Seeraga Samba Mutton Biryani</p>
        <p className="mt-2 text-sm text-sand">
          {formatINR(luxury.price)} <span className="text-cream/50">/ padi · serves ~9</span>
        </p>
      </motion.a>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-cream/50 uppercase">
        <span>Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-cream/15">
          <span className="animate-scroll-cue absolute top-0 left-0 h-4 w-px bg-ember" />
        </span>
      </div>
    </section>
  );
}
