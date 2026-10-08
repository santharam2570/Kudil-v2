"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { IMAGES, MENU, TIERS, formatINR, whatsappLink } from "@/data/site";
import { useDeviceProfile, useNearViewport } from "@/lib/hooks";
import type { Variant } from "@/three/HandiScene";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { RotateIcon, WhatsAppIcon } from "../icons";

const HandiScene = dynamic(() => import("@/three/HandiScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Signature() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const profile = useDeviceProfile();
  const near = useNearViewport(stageRef, "400px");
  const visible = useNearViewport(stageRef, "0px");
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<Variant>("mutton");
  const [manual, setManual] = useState<boolean | null>(null);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [tier, setTier] = useState(2);

  if (near && !mounted) setMounted(true);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollOpen(v > 0.38 && v < 0.9));
  const lidOpen = manual ?? scrollOpen;

  const item = MENU.find((m) => m.id === `${variant}-${TIERS[tier].tier.toLowerCase()}`)!;
  const show3D = profile.ready && profile.webgl && mounted;

  return (
    <section id="signature" ref={ref} className="relative overflow-hidden bg-coal py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_55%,rgba(242,107,29,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Signature Biryani"
          ta="குடிலின் சிறப்பு"
          title={
            <>
              The Kudil <em className="text-gradient-fire italic">dum handi.</em>
            </>
          }
          intro="Our signature: pure seeraga samba biryani, slow-cooked in a hammered copper handi under live coals. Turn the handi, lift the lid, and choose your biryani."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div ref={stageRef} className="relative aspect-square w-full sm:aspect-[5/4] lg:aspect-square">
            {!show3D && (
              <Image src={IMAGES.muttonBiryani.src} alt={IMAGES.muttonBiryani.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="rounded-[28px] object-cover opacity-80" />
            )}
            {show3D && (
              <motion.div
                className="absolute inset-0 [mask-image:radial-gradient(closest-side,black_78%,transparent)]"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease }}
              >
                <HandiScene variant={variant} lidOpen={lidOpen} active={visible} lite={profile.lite} interactive={!profile.touch} />
              </motion.div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <span className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] font-semibold tracking-[0.2em] text-cream/70 uppercase">
                <RotateIcon width={14} height={14} className="text-ember" />
                {profile.touch ? "Tap the buttons to explore" : "Drag to turn the handi"}
              </span>
            </div>
          </div>

          <Reveal>
            <div className="glass rounded-[28px] p-6 sm:p-8">
              <div className="flex gap-2 rounded-full bg-black/30 p-1" role="tablist" aria-label="Choose biryani">
                {(["mutton", "chicken"] as Variant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={variant === v}
                    onClick={() => setVariant(v)}
                    className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${variant === v ? "text-ink" : "text-cream/70 hover:text-cream"}`}
                  >
                    {variant === v && (
                      <motion.span layoutId="variant-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-flame to-ember" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className="relative">{v} Biryani</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease }}
                  className="mt-7"
                >
                  <p className="tamil text-lg font-semibold text-ember">{item.ta}</p>
                  <h3 className="display mt-1 text-3xl text-cream sm:text-4xl">
                    {TIERS[tier].rice} {item.name}
                  </h3>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="display text-5xl text-turmeric">{formatINR(item.price)}</span>
                    <span className="text-sm text-sand">{item.unit}</span>
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-sand">
                    <li className="flex gap-3"><span className="text-ember">◆</span>{item.qty}</li>
                    {item.details.slice(1).map((d) => (
                      <li key={d} className="flex gap-3"><span className="text-ember">◆</span>{d}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <p className="mt-7 text-[0.65rem] font-bold tracking-[0.25em] text-cream/50 uppercase">Choose your pack</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {TIERS.map((t, i) => (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => setTier(i)}
                    aria-pressed={tier === i}
                    className={`rounded-2xl border px-2 py-3 text-center transition-all duration-500 ${tier === i ? "border-turmeric/70 bg-white/10" : "border-white/10 hover:border-white/25"}`}
                    style={tier === i ? { boxShadow: `inset 0 -3px 0 ${t.accent}` } : undefined}
                  >
                    <span className="block text-xs font-bold text-cream">{t.tier}</span>
                    <span className="mt-0.5 block text-[0.65rem] leading-tight text-sand/80">{t.rice}</span>
                  </button>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(`Vanakkam Kudil! I'd like to order ${item.name} (${TIERS[tier].tier} Pack, ${TIERS[tier].rice}) - ${formatINR(item.price)} per padi.`)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary flex-1"
                >
                  <WhatsAppIcon /> Order this
                </a>
                <button type="button" onClick={() => setManual(!lidOpen)} className="btn btn-ghost">
                  {lidOpen ? "Close the lid" : "Lift the lid"}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
