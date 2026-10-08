"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { IMAGES, NAV, whatsappLink } from "@/data/site";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-ink/70 py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl" : "py-4"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main">
          <a href="#top" className="flex items-center gap-3" aria-label="Kudil Biryani, back to top">
            <Image
              src={IMAGES.logo.src}
              alt=""
              width={IMAGES.logo.w}
              height={IMAGES.logo.h}
              sizes="80px"
              className={`h-auto drop-shadow-[0_4px_18px_rgba(242,107,29,0.35)] transition-all duration-700 ${scrolled ? "w-14" : "w-16 sm:w-20"}`}
              priority
            />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative rounded-full px-4 py-2 text-[0.8rem] font-medium tracking-wide text-cream/80 transition-colors hover:text-cream"
                >
                  {n.label}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary hidden !py-2.5 sm:inline-flex">
              <WhatsAppIcon width={18} height={18} /> Order Now
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="glass grid h-11 w-11 place-items-center rounded-full lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Image src={IMAGES.logo.src} alt="Kudil Biryani" width={IMAGES.logo.w} height={IMAGES.logo.h} sizes="64px" className="h-auto w-16" />
              <button type="button" onClick={() => setOpen(false)} className="glass grid h-11 w-11 place-items-center rounded-full" aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={n.href} onClick={() => setOpen(false)} className="display block py-2 text-4xl text-cream">
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-8 pb-10">
              <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary w-full">
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
