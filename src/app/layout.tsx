import type { Metadata, Viewport } from "next";
import { Baloo_Thambi_2, Fraunces, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BRAND, CONTACT } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const baloo = Baloo_Thambi_2({
  subsets: ["tamil", "latin"],
  weight: ["600", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const title = `${BRAND.name} · ${BRAND.nameTa} | Seeraga Samba Dum Biryani & Catering, Trichy`;
const description =
  "Kudil Biryani & Catering, Trichy. Pure seeraga samba dum biryani slow-cooked over firewood in copper handis, Chettinadu gravies, desserts and wedding catering. Order on WhatsApp: 77080 97333.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://kudilbiryani.in"),
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/hero-dum.jpg", width: 1280, height: 720, alt: "Kudil Biryani head chef opening the dum handi" }],
  },
  icons: { icon: "/images/kudil-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0604",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Kudil Biryani & Catering",
  alternateName: BRAND.nameTa,
  servesCuisine: ["Biryani", "South Indian", "Chettinad", "Tamil"],
  telephone: `+${CONTACT.phoneIntl}`,
  email: CONTACT.email,
  priceRange: "₹₹",
  image: "/images/hero-dum.jpg",
  address: { "@type": "PostalAddress", addressLocality: "Tiruchirappalli", addressRegion: "Tamil Nadu", addressCountry: "IN" },
  slogan: BRAND.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${baloo.variable}`}>
      <body className="bg-ink text-cream antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>{children}</SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
