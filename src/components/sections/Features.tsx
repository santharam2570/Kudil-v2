"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FEATURES, MENU, formatINR } from "@/data/site";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;
const SIGNATURE_DISHES = ["chicken-65", "chettinadu-gravy", "bread-halwa"].map((id) => MENU.find((m) => m.id === id)!);
const LAYOUT = ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", ""];

export function Features() {
  return (
    <section id="specialties" className="relative bg-ink py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Special Features"
          ta="எங்கள் தனிச்சிறப்புகள்"
          title={
            <>
              What makes Kudil <em className="text-gradient-fire italic">Kudil.</em>
            </>
          }
          intro="The methods our head chef refuses to change, and the dishes guests come back for."
        />

        <div className="mt-16 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              className={`group relative overflow-hidden rounded-[26px] border border-white/10 ${LAYOUT[i]}`}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, delay: i * 0.08, ease }}
            >
              <Image
                src={f.image.src}
                alt={f.image.alt}
                fill
                sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/5 transition-opacity duration-700 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="tamil text-sm font-semibold text-ember">{f.ta}</p>
                <h3 className={`display mt-1 text-cream ${i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{f.title}</h3>
                <p className={`mt-2 max-w-md text-sm leading-relaxed text-sand ${i === 0 ? "" : "line-clamp-2"}`}>{f.text}</p>
              </div>
            </motion.article>
          ))}

          <Reveal className="sm:col-span-2 lg:col-span-4">
            <div className="glass flex h-full flex-col justify-between gap-6 rounded-[26px] p-6 sm:p-8 lg:flex-row lg:items-center">
              <div>
                <p className="eyebrow">Signature dishes</p>
                <p className="display mt-3 text-2xl text-cream sm:text-3xl">Beyond the biryani</p>
              </div>
              <ul className="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-3xl">
                {SIGNATURE_DISHES.map((d) => (
                  <li key={d.id}>
                    <a href="#menu" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-3 transition-colors hover:border-ember/50">
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={d.image.src} alt="" fill sizes="64px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-cream">{d.name}</span>
                        <span className="text-xs text-sand/80">{formatINR(d.price)} {d.unit}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
