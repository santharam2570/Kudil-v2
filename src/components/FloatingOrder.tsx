"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";

export function FloatingOrder() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener"
          aria-label="Order on WhatsApp"
          className="fixed right-4 bottom-4 z-40 flex h-14 items-center gap-2 rounded-full bg-[#25d366] px-5 font-semibold text-[#06260f] shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] sm:hidden"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhatsAppIcon width={22} height={22} /> Order
        </motion.a>
      )}
    </AnimatePresence>
  );
}
