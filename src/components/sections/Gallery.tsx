"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { GALLERY, type GalleryTag } from "@/data/site";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { ArrowIcon, CloseIcon } from "../icons";

const TAGS: ("All" | GalleryTag)[] = ["All", "Food", "Kitchen", "People", "Restaurant"];
const ease = [0.22, 1, 0.36, 1] as const;

export function Gallery() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const items = tag === "All" ? GALLERY : GALLERY.filter((g) => g.tag === tag);

  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, step, lenis]);

  return (
    <section id="gallery" className="relative bg-coal py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            ta="தருணங்கள்"
            title={
              <>
                Moments from the <em className="text-gradient-fire italic">kudil.</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  aria-pressed={tag === t}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all duration-500 ${
                    tag === t ? "border-ember bg-ember text-ink" : "border-white/15 text-cream/70 hover:border-white/40 hover:text-cream"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-14 grid auto-rows-[180px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.button
                layout
                key={g.image.src}
                type="button"
                onClick={() => setOpen(i)}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.7, ease }}
                className={`group relative overflow-hidden rounded-2xl ${g.span === "wide" ? "col-span-2" : ""} ${g.span === "tall" ? "row-span-2" : ""}`}
                aria-label={`Open image: ${g.image.alt}`}
              >
                <Image
                  src={g.image.src}
                  alt={g.image.alt}
                  fill
                  sizes={g.span === "wide" ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-2 text-[0.65rem] font-bold tracking-[0.2em] text-turmeric uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.tag}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open !== null && items[open] && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={items[open].image.alt}
          >
            <motion.div
              key={items[open].image.src}
              className="relative h-full max-h-[85vh] w-full max-w-6xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={items[open].image.src} alt={items[open].image.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 w-[90%] max-w-xl -translate-x-1/2 text-center text-sm text-sand">{items[open].image.alt}</p>
            <button type="button" className="glass absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full" onClick={() => setOpen(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <button
              type="button"
              className="glass absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 rotate-180 place-items-center rounded-full sm:left-6"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous image"
            >
              <ArrowIcon />
            </button>
            <button
              type="button"
              className="glass absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full sm:right-6"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next image"
            >
              <ArrowIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
