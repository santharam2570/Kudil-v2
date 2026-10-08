import * as THREE from "three";

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);

export const RICE_TOP = 1.12;
export const RICE_RADIUS = 0.8;
export const RIM_Y = 1.27;

/** Classic dum handi: narrow base, round belly, tight neck, flared lip. */
export function handiGeometry() {
  const pts = [
    v2(0, 0.02), v2(0.42, 0.0), v2(0.58, 0.03), v2(0.8, 0.14), v2(0.95, 0.34), v2(1.02, 0.56),
    v2(1.0, 0.76), v2(0.93, 0.93), v2(0.84, 1.06), v2(0.8, 1.14), v2(0.82, 1.2), v2(0.88, 1.25), v2(0.91, RIM_Y),
  ];
  const g = new THREE.LatheGeometry(pts, 96);
  g.computeVertexNormals();
  return g;
}

export function lidGeometry() {
  const pts = [
    v2(0.94, 0.0), v2(0.93, 0.03), v2(0.86, 0.06), v2(0.72, 0.13), v2(0.52, 0.19), v2(0.28, 0.23),
    v2(0.13, 0.245), v2(0.1, 0.27), v2(0.13, 0.33), v2(0.09, 0.37), v2(0.0, 0.38),
  ];
  return new THREE.LatheGeometry(pts, 80);
}

export function wave(x: number, z: number) {
  return (
    0.5 * Math.sin(x * 7.1 + z * 3.3) +
    0.3 * Math.sin(x * 13.7 - z * 11.1 + 1.3) +
    0.2 * Math.sin(x * 23.3 + z * 19.7 + 2.1)
  );
}

export function riceHeight(x: number, z: number) {
  const r = Math.min(1, Math.hypot(x, z) / RICE_RADIUS);
  return RICE_TOP + 0.27 * Math.pow(1 - r * r, 0.75) + wave(x, z) * 0.018 * (1 - r * 0.6);
}

/** Heaped rice mound with planar UVs for the grain texture. */
export function riceMoundGeometry(segments = 120) {
  const g = new THREE.RingGeometry(0.0001, RICE_RADIUS, segments, 48);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, riceHeight(x, z));
  }
  g.computeVertexNormals();
  return g;
}

/** Bumpy organic lump for meat pieces. */
export function lumpGeometry(seed: number, detail = 3, amp = 0.22) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = wave(v.x * 0.9 + seed, v.z * 0.9 - seed) * 0.6 + Math.sin(v.y * 9 + seed * 3) * 0.4;
    v.multiplyScalar(1 + n * amp);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

export function leafShape(len = 1, width = 0.42) {
  const s = new THREE.Shape();
  s.moveTo(0, -len / 2);
  s.quadraticCurveTo(width, -len * 0.1, 0, len / 2);
  s.quadraticCurveTo(-width, -len * 0.1, 0, -len / 2);
  return s;
}

export function starAniseGeometry() {
  const s = new THREE.Shape();
  const petals = 8;
  for (let k = 0; k < petals; k++) {
    const a = (k / petals) * Math.PI * 2;
    const a0 = a - Math.PI / petals;
    const a1 = a + Math.PI / petals;
    const inner0 = v2(Math.cos(a0) * 0.22, Math.sin(a0) * 0.22);
    const inner1 = v2(Math.cos(a1) * 0.22, Math.sin(a1) * 0.22);
    if (k === 0) s.moveTo(inner0.x, inner0.y);
    s.quadraticCurveTo(Math.cos(a - 0.2) * 0.9, Math.sin(a - 0.2) * 0.9, Math.cos(a), Math.sin(a));
    s.quadraticCurveTo(Math.cos(a + 0.2) * 0.9, Math.sin(a + 0.2) * 0.9, inner1.x, inner1.y);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: 3, curveSegments: 6 });
  g.center();
  return g;
}

export function chilliGeometry() {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    pts.push(v2(Math.sin(Math.PI * Math.pow(t, 0.7)) * 0.05 * (1 - t * 0.55) + 0.001, t * 0.34));
  }
  const g = new THREE.LatheGeometry(pts, 14);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) + Math.sin(y * 7) * 0.02);
  }
  g.computeVertexNormals();
  return g;
}

export function cardamomGeometry() {
  const g = new THREE.SphereGeometry(1, 18, 12);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ang = Math.atan2(v.z, v.x);
    const ridge = 1 + Math.cos(ang * 3) * 0.08;
    pos.setXYZ(i, v.x * 0.045 * ridge, v.y * 0.085, v.z * 0.045 * ridge);
  }
  g.computeVertexNormals();
  return g;
}
