"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noise.glsl";

/** Points are in the hero container's UV space (0..1, y up). */
type Props = { steamOrigin: [number, number]; fireOrigin: [number, number]; active: boolean; lite: boolean };

const steamVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const steamFrag = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform vec2 uOrigin;
varying vec2 vUv;
${NOISE_GLSL}
void main() {
  vec2 p = vec2((vUv.x - uOrigin.x) * uAspect, vUv.y - uOrigin.y);
  float h = max(p.y, 0.0);
  float sway = sin(uTime * 0.35 + h * 3.2) * 0.06 * h + (fbm(vec2(h * 1.8 - uTime * 0.12, uTime * 0.04)) - 0.5) * 0.35 * h;
  float width = 0.1 + h * 0.5;
  float d = abs(p.x - sway) / width;
  float plume = smoothstep(1.0, 0.0, d) * smoothstep(-0.02, 0.08, p.y) * smoothstep(0.95, 0.15, h);
  vec2 q = vec2(p.x * 2.4, p.y * 1.4 - uTime * 0.16);
  float n = fbm(q * 2.6 + fbm(q * 1.4 + uTime * 0.05) * 1.3);
  float a = plume * smoothstep(0.38, 0.9, n) * 0.5;
  float haze = fbm(vec2(vUv.x * 2.5 + uTime * 0.015, vUv.y * 1.8 - uTime * 0.05)) * smoothstep(0.55, 0.0, vUv.y) * 0.09;
  gl_FragColor = vec4(vec3(1.0, 0.94, 0.86), a + haze);
}
`;

const emberVert = /* glsl */ `
attribute vec3 aRand;
uniform float uTime;
uniform float uAspect;
uniform vec2 uOrigin;
uniform float uDpr;
varying float vAlpha;
varying float vHeat;
void main() {
  float life = 3.5 + aRand.x * 5.0;
  float t = mod(uTime + aRand.y * 40.0, life) / life;
  vec2 o = uOrigin * 2.0 - 1.0;
  float spread = (aRand.z - 0.5) * 0.18;
  float x = o.x + (spread * (1.0 + t * 3.0) + sin(uTime * (0.7 + aRand.x) + aRand.y * 30.0) * 0.04 * t) / uAspect;
  float y = o.y + t * (0.9 + aRand.x * 0.9);
  gl_Position = vec4(x, y, 0.0, 1.0);
  gl_PointSize = (1.5 + aRand.z * 3.0) * uDpr * (1.0 - t * 0.5);
  vAlpha = smoothstep(0.0, 0.06, t) * (1.0 - t) * (0.6 + 0.4 * sin(uTime * 8.0 + aRand.y * 50.0));
  vHeat = 1.0 - t;
}
`;

const emberFrag = /* glsl */ `
varying float vAlpha;
varying float vHeat;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float g = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(0.9, 0.25, 0.05), vec3(1.0, 0.78, 0.4), vHeat);
  gl_FragColor = vec4(col * 1.6, g * vAlpha);
}
`;

function Atmosphere({ steamOrigin, fireOrigin, lite }: Omit<Props, "active">) {
  const { size, viewport } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const count = lite ? 70 : 160;

  const steamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVert,
        fragmentShader: steamFrag,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uOrigin: { value: new THREE.Vector2() } },
      }),
    [],
  );

  const emberMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: emberVert,
        fragmentShader: emberFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uOrigin: { value: new THREE.Vector2() },
          uDpr: { value: 1 },
        },
      }),
    [],
  );

  const emberGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = new Float32Array(count * 3);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));
    return g;
  }, [count]);

  const time = useRef(0);
  useFrame((_, dt) => {
    time.current += Math.min(dt, 0.05);
    steamMat.uniforms.uTime.value = time.current;
    steamMat.uniforms.uAspect.value = aspect;
    steamMat.uniforms.uOrigin.value.set(steamOrigin[0], steamOrigin[1]);
    emberMat.uniforms.uTime.value = time.current;
    emberMat.uniforms.uAspect.value = aspect;
    emberMat.uniforms.uOrigin.value.set(fireOrigin[0], fireOrigin[1]);
    emberMat.uniforms.uDpr.value = viewport.dpr;
  });

  return (
    <>
      <mesh frustumCulled={false} material={steamMat}>
        <planeGeometry args={[2, 2]} />
      </mesh>
      <points frustumCulled={false} geometry={emberGeo} material={emberMat} />
    </>
  );
}

export default function HeroAtmosphere({ active, ...rest }: Props) {
  return (
    <Canvas
      className="!pointer-events-none"
      frameloop={active ? "always" : "never"}
      dpr={rest.lite ? [1, 1.25] : [1, 1.75]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Atmosphere {...rest} />
    </Canvas>
  );
}
