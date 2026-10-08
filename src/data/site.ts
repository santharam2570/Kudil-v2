export const BRAND = {
  name: "Kudil Biryani",
  nameTa: "குடில் பிரியாணி",
  catering: "Kudil Catering",
  tagline: "Taste that stays with you…",
  promise: "Good Food Brings People Together…",
  strap: "Traditional Flavors · Memorable Occasions",
  heritage: "Trichy — Our Heritage, Our Pride",
  pillars: ["Quality Food", "Good People", "Great Moments"],
  halal: true,
};

// TODO(client): replace the placeholder address, hours, chef name and social handles with real details.
export const CONTACT = {
  phone: "7708097333",
  phoneDisplay: "+91 77080 97333",
  phoneIntl: "917708097333",
  email: "kudilbiriyani.trichy@gmail.com",
  addressLines: ["Kudil Biryani & Catering", "Tiruchirappalli (Trichy)", "Tamil Nadu, India"],
  mapQuery: "Kudil Biryani, Tiruchirappalli, Tamil Nadu",
  hours: [
    { days: "Monday – Sunday", time: "11:00 AM – 11:00 PM" },
    { days: "Catering orders", time: "Book 2 days ahead" },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
  ],
};

export const CHEF = {
  name: "Our Founder & Head Chef",
  role: "Owner · Head Chef · Keeper of the Dum",
  quote:
    "Biryani is patience. You cannot rush the dum, and you cannot fake the love that goes into the pot.",
};

export const whatsappLink = (message = "Vanakkam Kudil Biryani! I would like to place an order.") =>
  `https://wa.me/${CONTACT.phoneIntl}?text=${encodeURIComponent(message)}`;

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

type Img = { src: string; w: number; h: number; alt: string };

const img = (src: string, w: number, h: number, alt: string): Img => ({ src: `/images/${src}`, w, h, alt });

export const IMAGES = {
  logo: img("kudil-logo.png", 995, 681, "Kudil Biryani logo: a thatched hut with the name குடில் பிரியாணி"),
  hero: img("hero-dum.jpg", 1280, 720, "Our head chef lifting the lid of a copper dum handi as steam bursts out"),
  story: img("story-kudil.jpg", 1152, 864, "The head chef holding a brass plate of whole spices in a thatched hut kitchen"),
  portrait: img("chef-portrait.jpg", 985, 1024, "Portrait of the Kudil Biryani founder and head chef in his kitchen"),
  presenting: img("chef-presenting.jpg", 864, 1152, "The head chef presenting a copper handi of mutton biryani"),
  team: img("team.jpg", 1280, 720, "The Kudil kitchen team laughing together around a handi of biryani"),
  catering: img("catering.jpg", 1280, 720, "Kudil wedding catering: the head chef serving biryani at a Trichy marriage hall"),
  interior: img("interior.jpg", 1280, 720, "Inside Kudil: thatched ceiling, brass lamps and banana-leaf table settings"),
  macro: img("macro-ladle.jpg", 1280, 720, "Close-up of seeraga samba biryani lifted with a brass ladle"),
  ingredients: img("step-ingredients.jpg", 1152, 864, "The head chef hand-selecting seeraga samba rice, shallots and spices"),
  masala: img("step-masala.jpg", 1152, 864, "The head chef grinding green masala on a traditional ammi kal stone"),
  layering: img("step-layering.jpg", 1152, 864, "The head chef layering rice and pouring saffron over mutton in a copper handi"),
  dum: img("step-dum.jpg", 1152, 864, "The head chef sealing the handi with dough, live coals on the lid"),
  serving: img("step-serving.jpg", 1152, 864, "The head chef serving biryani on banana leaf to a smiling Tamil family"),
  chickenBiryani: img("food-chicken-biryani.jpg", 1152, 864, "Seeraga samba chicken biryani in a copper handi with raitha and thalcha"),
  muttonBiryani: img("food-mutton-biryani.jpg", 1152, 864, "Seeraga samba mutton biryani with egg, mint and whole spices"),
  chickenPlate: img("food-chicken-plate.jpg", 1152, 864, "Chicken biryani on banana leaf with egg, raitha and thalcha"),
  chickenLuxury: img("food-chicken-luxury.jpg", 1152, 864, "A freshly opened copper handi of pure seeraga samba chicken biryani"),
  muttonLeaf: img("food-mutton-leaf.jpg", 1152, 864, "Mutton biryani on banana leaf with raitha"),
  muttonLadle: img("food-mutton-ladle.jpg", 1152, 864, "A brass ladle lifting seeraga samba mutton biryani from a copper handi"),
  chicken65: img("food-chicken-65.jpg", 1152, 864, "Crispy Chicken 65 with curry leaves and green chillies"),
  chettinad: img("food-chettinad.jpg", 1152, 864, "Chettinadu chicken gravy in an iron kadai"),
  pepper: img("food-pepper-chicken.jpg", 1152, 864, "Pepper chicken gravy in a copper bowl"),
  kesari: img("food-kesari.jpg", 1152, 864, "Kesari with cashews and raisins in a brass bowl"),
  halwa: img("food-bread-halwa.jpg", 1152, 864, "Wedding-style bread halwa with cashews"),
  firni: img("food-firni.jpg", 1152, 864, "Chilled firni in clay bowls with pistachio and rose"),
} satisfies Record<string, Img>;

export type MenuCategory = "chicken" | "mutton" | "sides" | "desserts";

export const CATEGORIES: { id: MenuCategory; label: string; ta: string }[] = [
  { id: "chicken", label: "Chicken Biryani", ta: "சிக்கன் பிரியாணி" },
  { id: "mutton", label: "Mutton Biryani", ta: "மட்டன் பிரியாணி" },
  { id: "sides", label: "Additional Items", ta: "கூடுதல் உணவுகள்" },
  { id: "desserts", label: "Desserts", ta: "இனிப்புகள்" },
];

export type Tier = "Budget" | "Premium" | "Luxury";

export const TIERS: { tier: Tier; ta: string; rice: string; accent: string }[] = [
  { tier: "Budget", ta: "பட்ஜெட்", rice: "Thulasi Gold", accent: "#1f5a32" },
  { tier: "Premium", ta: "பிரீமியம்", rice: "Kalyana Biryani", accent: "#7a1712" },
  { tier: "Luxury", ta: "லக்ஸரி", rice: "Pure Seeraga Samba", accent: "#1b2a52" },
];

export type MenuItem = {
  id: string;
  cat: MenuCategory;
  name: string;
  ta: string;
  price: number;
  unit: string;
  qty: string;
  details: string[];
  image: Img;
  tier?: (typeof TIERS)[number];
};

const biryani = (cat: "chicken" | "mutton", prices: number[], pieces: string): MenuItem[] =>
  TIERS.map((t, i) => ({
    id: `${cat}-${t.tier.toLowerCase()}`,
    cat,
    name: `${cat === "chicken" ? "Chicken" : "Mutton"} Biryani`,
    ta: cat === "chicken" ? "சிக்கன் பிரியாணி" : "மட்டன் பிரியாணி",
    price: prices[i],
    unit: "per Padi",
    qty: "1 Padi · approx. 9 servings",
    details: [`${t.rice} rice`, pieces, "Thalcha & Onion Raitha"],
    image: (cat === "chicken"
      ? [IMAGES.chickenPlate, IMAGES.chickenBiryani, IMAGES.chickenLuxury]
      : [IMAGES.muttonLeaf, IMAGES.muttonBiryani, IMAGES.muttonLadle])[i],
    tier: t,
  }));

export const MENU: MenuItem[] = [
  ...biryani("chicken", [1500, 1700, 2000], "10 chicken pieces (130 g each)"),
  ...biryani("mutton", [2750, 3000, 3600], "Mutton pieces (1.5 kg)"),
  {
    id: "chicken-65", cat: "sides", name: "Chicken 65", ta: "சிக்கன் 65", price: 550, unit: "per kg", qty: "1 kg",
    details: ["Crispy, fiery, fried with curry leaves"], image: IMAGES.chicken65,
  },
  {
    id: "chettinadu-gravy", cat: "sides", name: "Chettinadu Chicken Gravy", ta: "செட்டிநாடு சிக்கன் கிரேவி", price: 600,
    unit: "per kg", qty: "1 kg", details: ["Freshly roasted Chettinadu masala"], image: IMAGES.chettinad,
  },
  {
    id: "pepper-gravy", cat: "sides", name: "Pepper Chicken Gravy", ta: "பெப்பர் சிக்கன் கிரேவி", price: 650,
    unit: "per kg", qty: "1 kg", details: ["Crushed black pepper & curry leaves"], image: IMAGES.pepper,
  },
  {
    id: "kesari", cat: "desserts", name: "Kesari", ta: "கேசரி", price: 300, unit: "per kg", qty: "1 kg",
    details: ["Ghee, cashews & raisins"], image: IMAGES.kesari,
  },
  {
    id: "bread-halwa", cat: "desserts", name: "Bread Halwa", ta: "பிரெட் அல்வா", price: 400, unit: "per kg", qty: "1 kg",
    details: ["Wedding-style, rich & glossy"], image: IMAGES.halwa,
  },
  {
    id: "firni", cat: "desserts", name: "Firni", ta: "பிர்னி", price: 600, unit: "per litre", qty: "1 Litre",
    details: ["Chilled, cardamom & pistachio"], image: IMAGES.firni,
  },
];

export const STEPS = [
  {
    n: "01", short: "Ingredients", ta: "தேர்வு", en: "Choosing the ingredients", image: IMAGES.ingredients, origin: "60% 40%",
    text: "Every morning begins at the table: tiny fragrant seeraga samba grains run through the chef’s fingers, shallots are hand-peeled and whole spices are picked one by one.",
  },
  {
    n: "02", short: "Masala", ta: "மசாலா அரைப்பு", en: "Grinding on the ammi kal", image: IMAGES.masala, origin: "50% 70%",
    text: "Mint, coriander, green chilli, ginger and garlic are ground on the stone ammi kal. Never from a packet, so the masala keeps its fresh, green heat.",
  },
  {
    n: "03", short: "Layering", ta: "அடுக்குதல்", en: "Layering the handi", image: IMAGES.layering, origin: "30% 60%",
    text: "Marinated meat goes in first, then the rice, layer by layer, finished with saffron milk, fried onions and fresh mint in a hammered copper handi.",
  },
  {
    n: "04", short: "Dum", ta: "தம் போடுதல்", en: "Sealing the dum", image: IMAGES.dum, origin: "35% 55%",
    text: "The lid is sealed with dough, live coals go on top and firewood burns low beneath. The biryani cooks slowly in its own steam until every grain is perfumed.",
  },
  {
    n: "05", short: "Serving", ta: "பரிமாறுதல்", en: "Serving with love", image: IMAGES.serving, origin: "45% 50%",
    text: "The seal is broken at the table. Biryani is served on fresh banana leaf with thalcha and onion raitha, the way Tamil families have always shared a feast.",
  },
];

export const FEATURES = [
  {
    title: "Firewood Dum", ta: "விறகு அடுப்பு தம்",
    text: "Dough-sealed copper handis, live coals on the lid and a slow firewood flame beneath.", image: IMAGES.dum,
  },
  {
    title: "Pure Seeraga Samba", ta: "சீரக சம்பா",
    text: "Short, fragrant grains that drink in the masala and stay perfectly separate.", image: IMAGES.macro,
  },
  {
    title: "Stone-ground Masala", ta: "அம்மி அரைப்பு",
    text: "Green masala ground fresh on the ammi kal for every batch.", image: IMAGES.masala,
  },
  {
    title: "Wedding & Event Catering", ta: "திருமண கேட்டரிங்",
    text: "From mini halls to marriage halls. One padi feeds about nine guests, served on banana leaf.", image: IMAGES.catering,
  },
];

export type GalleryTag = "Food" | "Kitchen" | "People" | "Restaurant";

export const GALLERY: { image: Img; tag: GalleryTag; span?: "tall" | "wide" }[] = [
  { image: IMAGES.hero, tag: "Kitchen", span: "wide" },
  { image: IMAGES.presenting, tag: "People", span: "tall" },
  { image: IMAGES.muttonBiryani, tag: "Food" },
  { image: IMAGES.interior, tag: "Restaurant", span: "wide" },
  { image: IMAGES.masala, tag: "Kitchen" },
  { image: IMAGES.chicken65, tag: "Food" },
  { image: IMAGES.team, tag: "People", span: "wide" },
  { image: IMAGES.kesari, tag: "Food" },
  { image: IMAGES.story, tag: "People" },
  { image: IMAGES.macro, tag: "Food", span: "wide" },
  { image: IMAGES.catering, tag: "Restaurant" },
  { image: IMAGES.firni, tag: "Food" },
  { image: IMAGES.dum, tag: "Kitchen" },
  { image: IMAGES.serving, tag: "People" },
  { image: IMAGES.chettinad, tag: "Food" },
  { image: IMAGES.halwa, tag: "Food" },
  { image: IMAGES.chickenLuxury, tag: "Food" },
  { image: IMAGES.muttonLadle, tag: "Food" },
];

export const NAV = [
  { href: "#story", label: "Story" },
  { href: "#process", label: "Process" },
  { href: "#signature", label: "Signature" },
  { href: "#menu", label: "Menu" },
  { href: "#people", label: "People" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];
