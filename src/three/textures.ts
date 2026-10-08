import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Hammered-metal dents as a bump map. */
export function hammeredBump() {
  const [c, ctx] = canvas(512, 512);
  const r = seeded(11);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1100; i++) {
    const x = r() * 512;
    const y = r() * 512;
    const rad = 7 + r() * 16;
    for (const [ox, oy] of [[0, 0], [512, 0], [-512, 0], [0, 512], [0, -512]]) {
      const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad);
      g.addColorStop(0, "rgba(40,40,40,0.55)");
      g.addColorStop(0.75, "rgba(128,128,128,0.15)");
      g.addColorStop(1, "rgba(200,200,200,0.35)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(7, 2);
  return t;
}

/** Copper colour with firewood soot creeping up from the base (lathe v runs bottom → top). */
export function copperColor() {
  const [c, ctx] = canvas(64, 512);
  const g = ctx.createLinearGradient(0, 512, 0, 0);
  g.addColorStop(0, "#1a0d06");
  g.addColorStop(0.16, "#3b1f0f");
  g.addColorStop(0.32, "#a35f32");
  g.addColorStop(0.6, "#c98552");
  g.addColorStop(0.86, "#b8703f");
  g.addColorStop(1, "#d79a66");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Top-down seeraga samba rice: short grains in cream, saffron and masala orange. */
export function riceTexture(size = 1024) {
  const [c, ctx] = canvas(size, size);
  const r = seeded(5);
  ctx.fillStyle = "#dc9a3e";
  ctx.fillRect(0, 0, size, size);
  const palette = [
    ["#fff4dc", 0.36],
    ["#f8e1ac", 0.18],
    ["#f5b53c", 0.22],
    ["#ec8c22", 0.15],
    ["#c26a1e", 0.06],
    ["#8a4214", 0.03],
  ] as const;
  const pick = () => {
    let v = r();
    for (const [col, w] of palette) {
      if ((v -= w) <= 0) return col;
    }
    return palette[0][0];
  };
  const n = Math.round((size * size) / 52);
  const k = size / 1024;
  for (let i = 0; i < n; i++) {
    const x = r() * size;
    const y = r() * size;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r() * Math.PI);
    ctx.fillStyle = "rgba(90,40,8,0.22)";
    ctx.beginPath();
    ctx.ellipse(1.2 * k, 1.4 * k, 2.6 * k, 7 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pick();
    ctx.beginPath();
    ctx.ellipse(0, 0, (2.1 + r()) * k, (5.6 + r() * 2.4) * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(-0.6 * k, -1.5 * k, 0.8 * k, 2.6 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Banana leaf with a pale midrib and fine parallel veins. */
export function bananaLeafTexture() {
  const [c, ctx] = canvas(512, 1024);
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, "#1d4f22");
  g.addColorStop(0.45, "#2f7a33");
  g.addColorStop(0.5, "#a9c77a");
  g.addColorStop(0.55, "#2f7a33");
  g.addColorStop(1, "#1a4a1f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 1024);
  ctx.lineWidth = 1.2;
  for (let y = -512; y < 1024 + 512; y += 7) {
    ctx.strokeStyle = `rgba(${y % 21 === 0 ? "200,230,160,0.18" : "10,40,10,0.22"})`;
    ctx.beginPath();
    ctx.moveTo(256, y);
    ctx.lineTo(0, y - 140);
    ctx.moveTo(256, y);
    ctx.lineTo(512, y - 140);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
