"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BRAND, CONTACT, IMAGES, NAV, whatsappLink } from "@/data/site";
import { useNearViewport } from "@/lib/hooks";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { ThatchEdge } from "../ThatchEdge";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon, YouTubeIcon } from "../icons";

const SOCIAL_ICONS = { Instagram: InstagramIcon, Facebook: FacebookIcon, YouTube: YouTubeIcon } as const;

function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "600px");
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&output=embed`;
  return (
    <div ref={ref} className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-soot">
      {near && (
        <iframe
          title="Kudil Biryani location on Google Maps"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 [filter:grayscale(0.4)_invert(0.92)_hue-rotate(180deg)_contrast(0.9)_sepia(0.25)] ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {!loaded && <div className="absolute inset-0 grid place-items-center text-sm text-sand/60">Loading map…</div>}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapQuery)}`}
        target="_blank"
        rel="noopener"
        className="btn btn-primary absolute right-4 bottom-4 !py-2.5 text-xs"
      >
        <PinIcon width={16} height={16} /> Get directions
      </a>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative bg-ink">
      <ThatchEdge className="rotate-180" />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image src={IMAGES.interior.src} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading
            eyebrow="Visit · Call · Order"
            ta="எங்களை தொடர்பு கொள்ள"
            title={
              <>
                Come hungry. <em className="text-gradient-fire italic">Leave as family.</em>
              </>
            }
            intro={`${BRAND.promise} Order for home, book catering for your event, or visit us in Trichy.`}
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <div className="glass flex h-full flex-col gap-7 rounded-[28px] p-7 sm:p-9">
                <a href={`tel:+${CONTACT.phoneIntl}`} className="group flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ember/15 text-ember"><PhoneIcon /></span>
                  <span>
                    <span className="block text-[0.65rem] font-bold tracking-[0.25em] text-sand/70 uppercase">Call us</span>
                    <span className="display text-2xl text-cream transition-colors group-hover:text-turmeric sm:text-3xl">{CONTACT.phoneDisplay}</span>
                  </span>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="group flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ember/15 text-ember"><MailIcon /></span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] font-bold tracking-[0.25em] text-sand/70 uppercase">Email</span>
                    <span className="block truncate text-base text-cream transition-colors group-hover:text-turmeric">{CONTACT.email}</span>
                  </span>
                </a>
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ember/15 text-ember"><PinIcon /></span>
                  <address className="not-italic">
                    <span className="block text-[0.65rem] font-bold tracking-[0.25em] text-sand/70 uppercase">Find us</span>
                    {CONTACT.addressLines.map((l) => (
                      <span key={l} className="block text-cream">{l}</span>
                    ))}
                  </address>
                </div>
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ember/15 text-ember"><ClockIcon /></span>
                  <dl>
                    <dt className="text-[0.65rem] font-bold tracking-[0.25em] text-sand/70 uppercase">Opening hours</dt>
                    {CONTACT.hours.map((h) => (
                      <dd key={h.days} className="mt-1 text-cream">
                        <span className="text-sand">{h.days}:</span> {h.time}
                      </dd>
                    ))}
                  </dl>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                  <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary">
                    <WhatsAppIcon /> WhatsApp us
                  </a>
                  {CONTACT.socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.label as keyof typeof SOCIAL_ICONS];
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener"
                        aria-label={s.label}
                        className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-cream/80 transition-all duration-500 hover:border-ember hover:bg-ember hover:text-ink"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MapEmbed />
            </Reveal>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-white/5 bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 py-14 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Image src={IMAGES.logo.src} alt="Kudil Biryani" width={IMAGES.logo.w} height={IMAGES.logo.h} sizes="96px" className="h-auto w-24" />
            <div>
              <p className="display text-xl text-cream">{BRAND.catering}</p>
              <p className="text-xs tracking-[0.2em] text-sand/70 uppercase">{BRAND.strap}</p>
              <p className="mt-1 text-xs text-sand/60">{BRAND.heritage}</p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-sand">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-cream">{n.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-t border-white/5 py-6 text-center text-xs text-sand/50">
          © {new Date().getFullYear()} Kudil Biryani & Catering, Trichy. {BRAND.tagline}
        </p>
      </footer>
    </section>
  );
}
