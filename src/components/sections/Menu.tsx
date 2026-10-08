"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { BRAND, CATEGORIES, MENU, formatINR, whatsappLink, type MenuCategory, type MenuItem } from "@/data/site";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { WhatsAppIcon } from "../icons";

const ease = [0.22, 1, 0.36, 1] as const;

function TiltCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 8);
    setGlare({ x: px * 100, y: py * 100 });
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const order = whatsappLink(
    `Vanakkam Kudil! I'd like to order ${item.name}${item.tier ? ` (${item.tier.tier} Pack, ${item.tier.rice})` : ""} - ${formatINR(item.price)} ${item.unit}.`,
  );

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
      transition={{ duration: 0.8, delay: index * 0.08, ease }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-soot/80"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soot via-soot/10 to-transparent" />
        {item.tier && (
          <span
            className="absolute top-4 left-4 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-cream uppercase shadow-lg"
            style={{ background: item.tier.accent }}
          >
            {item.tier.tier} Pack
          </span>
        )}
        {BRAND.halal && (
          <span className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold tracking-widest text-cream/90 backdrop-blur">
            HALAL
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col p-6 pt-2">
        <p className="tamil text-sm font-semibold text-ember">{item.ta}</p>
        <h3 className="display mt-1 text-2xl leading-tight text-cream">{item.name}</h3>
        {item.tier && <p className="mt-1 text-sm font-medium text-turmeric">{item.tier.rice}</p>}
        <ul className="mt-4 flex-1 space-y-1.5 text-sm text-sand">
          <li>{item.qty}</li>
          {item.details.slice(item.tier ? 1 : 0).map((d) => (
            <li key={d} className="text-sand/80">{d}</li>
          ))}
        </ul>
        <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-5">
          <p>
            <span className="display text-3xl text-cream">{formatINR(item.price)}</span>
            <span className="ml-1.5 text-xs text-sand/70">{item.unit}</span>
          </p>
          <a
            href={order}
            target="_blank"
            rel="noopener"
            className="flex h-11 items-center gap-2 rounded-full bg-white/5 px-4 text-xs font-semibold text-cream ring-1 ring-white/15 transition-all duration-500 hover:bg-ember hover:text-ink hover:ring-ember"
            aria-label={`Order ${item.name} on WhatsApp`}
          >
            <WhatsAppIcon width={16} height={16} /> Order
          </a>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, rgba(255,180,100,0.12), transparent 60%)` }}
      />
    </motion.article>
  );
}

export function Menu() {
  const [cat, setCat] = useState<MenuCategory>("chicken");
  const items = MENU.filter((m) => m.cat === cat);

  return (
    <section id="menu" className="relative bg-ink py-28 sm:py-36">
      <div className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-chili/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Menu"
            ta="எங்கள் உணவு பட்டியல்"
            title={
              <>
                Order by the <em className="text-gradient-fire italic">padi.</em>
              </>
            }
            intro="Biryani is sold by the padi (about 9 servings), so it is ready for family meals, parties and catering. Every biryani comes with thalcha and onion raitha."
          />
          <Reveal delay={0.2}>
            <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Menu categories">
              <div className="flex w-max gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={cat === c.id}
                    onClick={() => setCat(c.id)}
                    className={`relative rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5 ${cat === c.id ? "text-ink" : "text-cream/70 hover:text-cream"}`}
                  >
                    {cat === c.id && (
                      <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-turmeric via-flame to-ember" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className="relative">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <TiltCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-sand/70">
            Prices as per our current catering quotation. Bulk and wedding orders:{" "}
            <a href="#contact" className="text-turmeric underline-offset-4 hover:underline">talk to us</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
