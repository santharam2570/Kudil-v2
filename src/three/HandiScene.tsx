"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { NOISE_GLSL } from "./noise.glsl";
import {
  RICE_RADIUS,
  RIM_Y,
  cardamomGeometry,
  chilliGeometry,
  handiGeometry,
  leafShape,
  lidGeometry,
  lumpGeometry,
  riceHeight,
  riceMoundGeometry,
  starAniseGeometry,
} from "./geometry";
import { bananaLeafTexture, copperColor, hammeredBump, riceTexture } from "./textures";

export type Variant = "chicken" | "mutton";
type Props = { variant: Variant; lidOpen: boolean; active: boolean; lite: boolean; interactive: boolean };

type GroupProps = ThreeElements["group"];

const damp = THREE.MathUtils.damp;

function useCopper() {
  return useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      map: copperColor(),
      metalness: 1,
      roughness: 0.3,
      bumpMap: hammeredBump(),
      bumpScale: 1.4,
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
    });
    return m;
  }, []);
}

function Handi({ copper }: { copper: THREE.Material }) {
  const body = useMemo(() => handiGeometry(), []);
  return (
    <group>
      <mesh geometry={body} material={copper} />
      <mesh position={[0, RIM_Y, 0]} rotation={[Math.PI / 2, 0, 0]} material={copper}>
        <torusGeometry args={[0.905, 0.024, 12, 96]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.97, 0.93, 0]} rotation={[0, s > 0 ? 0 : Math.PI, 0.25 * s]} material={copper}>
          <torusGeometry args={[0.11, 0.022, 10, 28, Math.PI * 1.3]} />
        </mesh>
      ))}
    </group>
  );
}

function Rice({ lite }: { lite: boolean }) {
  const mound = useMemo(() => riceMoundGeometry(lite ? 72 : 120), [lite]);
  const tex = useMemo(() => riceTexture(lite ? 768 : 1024), [lite]);
  const grains = useRef<THREE.InstancedMesh>(null);
  const count = lite ? 700 : 2200;

  useEffect(() => {
    const mesh = grains.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3(1, 1, 1);
    const c = new THREE.Color();
    const cols = ["#fff6e4", "#f8e4b8", "#f4b83f", "#ea8f26", "#fff1d6", "#f6c35a"];
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * (RICE_RADIUS - 0.04);
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      p.set(x, riceHeight(x, z) + 0.006, z);
      e.set(Math.PI / 2 + (Math.random() - 0.5) * 0.9, Math.random() * Math.PI, (Math.random() - 0.5) * 0.9);
      q.setFromEuler(e);
      const k = 0.8 + Math.random() * 0.45;
      s.set(k, k, k);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(cols[(Math.random() * cols.length) | 0]));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count]);

  return (
    <group>
      <mesh geometry={mound}>
        <meshStandardMaterial map={tex} color="#ffd79c" roughness={0.6} />
      </mesh>
      <instancedMesh ref={grains} args={[undefined, undefined, count]}>
        <capsuleGeometry args={[0.0075, 0.026, 2, 6]} />
        <meshStandardMaterial color="#ffe2b0" roughness={0.45} />
      </instancedMesh>
    </group>
  );
}

const masala = new THREE.MeshPhysicalMaterial({ color: "#8a3a12", roughness: 0.48, clearcoat: 0.5, clearcoatRoughness: 0.5 });
const muttonMat = new THREE.MeshPhysicalMaterial({ color: "#7a3416", roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.5 });
const boneMat = new THREE.MeshStandardMaterial({ color: "#e9d9bb", roughness: 0.6 });
const mintMat = new THREE.MeshStandardMaterial({ color: "#3d8b37", roughness: 0.55, side: THREE.DoubleSide });
const onionMat = new THREE.MeshStandardMaterial({ color: "#5a260b", roughness: 0.7 });

function Drumstick({ seed, ...rest }: { seed: number } & GroupProps) {
  const g = useMemo(() => lumpGeometry(seed, 3, 0.12), [seed]);
  return (
    <group {...rest}>
      <mesh geometry={g} material={masala} scale={[0.11, 0.09, 0.19]} />
      <mesh material={boneMat} position={[0, 0.01, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.03, 0.14, 10]} />
      </mesh>
      <mesh material={boneMat} position={[0, 0.01, 0.32]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.035, 12, 10]} />
      </mesh>
    </group>
  );
}

function MuttonPiece({ seed, bone, ...rest }: { seed: number; bone?: boolean } & GroupProps) {
  const g = useMemo(() => lumpGeometry(seed, 3, 0.3), [seed]);
  return (
    <group {...rest}>
      <mesh geometry={g} material={muttonMat} scale={[0.15, 0.1, 0.12]} />
      {bone && (
        <mesh material={boneMat} position={[0.1, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.14, 12]} />
        </mesh>
      )}
    </group>
  );
}

function Egg(props: GroupProps) {
  return (
    <group {...props}>
      <mesh scale={[0.09, 0.07, 0.12]}>
        <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#f5f1e8" roughness={0.25} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.05, 0.065, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color="#f2b232" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Toppings({ variant }: { variant: Variant }) {
  const leaf = useMemo(() => new THREE.ShapeGeometry(leafShape(0.12, 0.06), 4), []);
  const onions = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const appear = useRef(0);

  useEffect(() => {
    appear.current = 0;
  }, [variant]);

  useEffect(() => {
    const mesh = onions.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    for (let i = 0; i < mesh.count; i++) {
      const r = Math.sqrt(Math.random()) * 0.7;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      p.set(x, riceHeight(x, z) + 0.01, z);
      q.setFromEuler(new THREE.Euler(Math.PI / 2 + (Math.random() - 0.5) * 0.6, 0, Math.random() * Math.PI * 2));
      m.compose(p, q, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    appear.current = damp(appear.current, 1, 5, dt);
    group.current?.scale.setScalar(0.6 + appear.current * 0.4);
  });

  const at = (x: number, z: number, lift = 0.03) => [x, riceHeight(x, z) + lift, z] as const;
  const mint = [
    [0.05, 0.1, 0.3], [-0.3, -0.2, 1.9], [0.38, 0.22, 4.1], [-0.15, 0.45, 2.6], [0.2, -0.42, 5.2], [-0.48, 0.2, 0.9],
  ] as const;

  return (
    <group>
      <group ref={group}>
        {variant === "chicken" ? (
          <>
            <Drumstick seed={1} position={at(-0.22, 0.05, 0.05)} rotation={[0.25, 0.6, 0.15]} />
            <Drumstick seed={2} position={at(0.26, -0.12, 0.04)} rotation={[0.2, -2.3, -0.1]} />
            <Drumstick seed={3} position={at(0.02, 0.36, 0.03)} rotation={[0.3, 3.6, 0.2]} />
          </>
        ) : (
          <>
            <MuttonPiece seed={4} bone position={at(-0.25, 0.0, 0.04)} rotation={[0.2, 0.4, 0.1]} />
            <MuttonPiece seed={5} position={at(0.22, -0.2, 0.035)} rotation={[0.1, 1.5, -0.2]} />
            <MuttonPiece seed={6} position={at(0.05, 0.34, 0.03)} rotation={[-0.15, 2.5, 0.1]} />
            <MuttonPiece seed={7} position={at(-0.42, -0.3, 0.02)} rotation={[0.2, 0.9, 0.3]} />
            <Egg position={at(0.3, 0.2, 0.0)} rotation={[0.15, 0.6, 0]} />
          </>
        )}
      </group>
      {mint.map(([x, z, r], i) => (
        <mesh key={i} geometry={leaf} material={mintMat} position={at(x, z, 0.035)} rotation={[-Math.PI / 2 + 0.35, 0, r]} />
      ))}
      <instancedMesh ref={onions} args={[undefined, undefined, 70]} material={onionMat}>
        <torusGeometry args={[0.028, 0.005, 4, 10, Math.PI * 1.25]} />
      </instancedMesh>
    </group>
  );
}

function Coals() {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1b120e", roughness: 0.95, emissive: new THREE.Color("#ff4410"), emissiveIntensity: 0.9 }),
    [],
  );
  const geos = useMemo(() => [0, 1, 2].map((i) => lumpGeometry(10 + i, 1, 0.25)), []);
  useFrame(({ clock }) => {
    mat.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 3.1) * 0.18 + Math.sin(clock.elapsedTime * 7.3) * 0.1;
  });
  const spots = [
    [0.32, 0.0], [0.16, 0.28], [-0.18, 0.27], [-0.33, 0.02], [-0.16, -0.28], [0.18, -0.27], [0.5, 0.2], [-0.48, -0.22],
  ];
  return (
    <group>
      {spots.map(([x, z], i) => {
        const r = Math.hypot(x, z);
        const y = 0.24 - r * r * 0.25;
        return (
          <mesh key={i} geometry={geos[i % 3]} material={mat} position={[x, y + 0.07, z]} scale={[0.07, 0.05, 0.065]} rotation={[i, i * 2.1, 0]} />
        );
      })}
    </group>
  );
}

function Lid({ copper, open }: { copper: THREE.Material; open: boolean }) {
  const geo = useMemo(() => lidGeometry(), []);
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current = damp(t.current, open ? 1 : 0, 2.4, dt);
    const g = ref.current;
    if (!g) return;
    const k = t.current;
    const arc = Math.sin(k * Math.PI) * 0.35;
    g.position.set(0.85 * k, RIM_Y - 0.01 + k * 0.6 + arc, -0.9 * k);
    g.rotation.set(-0.5 * k, 0, -0.45 * k);
  });
  return (
    <group ref={ref}>
      <mesh geometry={geo} material={copper} />
      <Coals />
    </group>
  );
}

const steamVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const steamFrag = /* glsl */ `
uniform float uTime;
uniform float uOpen;
varying vec2 vUv;
${NOISE_GLSL}
void main() {
  vec2 p = vec2(vUv.x - 0.5, vUv.y);
  float h = p.y;
  float sway = (fbm(vec2(h * 2.0 - uTime * 0.2, uTime * 0.1)) - 0.5) * 0.35 * h;
  float width = 0.22 + h * 0.28;
  float d = abs(p.x - sway) / width;
  float plume = smoothstep(1.0, 0.0, d) * smoothstep(0.0, 0.1, h) * smoothstep(1.0, 0.3, h);
  vec2 q = vec2(p.x * 3.0, h * 2.2 - uTime * 0.38);
  float n = fbm(q * 2.0 + fbm(q + uTime * 0.1));
  float a = plume * smoothstep(0.36, 0.86, n) * 0.6 * uOpen;
  gl_FragColor = vec4(vec3(1.0, 0.96, 0.9), a);
}
`;

function Steam({ open }: { open: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVert,
        fragmentShader: steamFrag,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uOpen: { value: 0 } },
      }),
    [],
  );
  const { camera } = useThree();
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += Math.min(dt, 0.05);
    mat.uniforms.uOpen.value = damp(mat.uniforms.uOpen.value, open ? 1 : 0.08, 1.6, dt);
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });
  return (
    <mesh ref={ref} position={[0, RIM_Y + 1.05, 0]} material={mat}>
      <planeGeometry args={[1.8, 2.2]} />
    </mesh>
  );
}

function BananaLeaf() {
  const tex = useMemo(() => bananaLeafTexture(), []);
  const geo = useMemo(() => {
    const g = new THREE.ShapeGeometry(leafShape(3.5, 1.6), 24);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / 1.6 + 0.5, pos.getY(i) / 3.5 + 0.5);
    }
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, Math.PI / 2.6]} position={[0, 0.002, 0]}>
      <meshStandardMaterial map={tex} roughness={0.42} side={THREE.DoubleSide} />
    </mesh>
  );
}

const spiceMats = {
  anise: new THREE.MeshStandardMaterial({ color: "#5e2c14", roughness: 0.8 }),
  cardamom: new THREE.MeshStandardMaterial({ color: "#8ea457", roughness: 0.75 }),
  cinnamon: new THREE.MeshStandardMaterial({ color: "#7a3f1d", roughness: 0.92, side: THREE.DoubleSide }),
  clove: new THREE.MeshStandardMaterial({ color: "#3a1d0f", roughness: 0.85 }),
  bay: new THREE.MeshStandardMaterial({ color: "#7c8442", roughness: 0.7, side: THREE.DoubleSide }),
  chilli: new THREE.MeshPhysicalMaterial({ color: "#8f150b", roughness: 0.32, clearcoat: 0.8 }),
};

type SpiceKind = keyof typeof spiceMats;

function Spice({ kind }: { kind: SpiceKind }) {
  const geos = useMemo(
    () => ({
      anise: starAniseGeometry(),
      cardamom: cardamomGeometry(),
      chilli: chilliGeometry(),
      bay: new THREE.ExtrudeGeometry(leafShape(0.3, 0.1), { depth: 0.004, bevelEnabled: false }),
    }),
    [],
  );
  switch (kind) {
    case "anise":
      return <mesh geometry={geos.anise} material={spiceMats.anise} scale={0.11} />;
    case "cardamom":
      return <mesh geometry={geos.cardamom} material={spiceMats.cardamom} />;
    case "chilli":
      return <mesh geometry={geos.chilli} material={spiceMats.chilli} />;
    case "bay":
      return <mesh geometry={geos.bay} material={spiceMats.bay} />;
    case "cinnamon":
      return (
        <group>
          <mesh material={spiceMats.cinnamon}>
            <cylinderGeometry args={[0.04, 0.04, 0.42, 18, 1, true, 0, Math.PI * 1.7]} />
          </mesh>
          <mesh material={spiceMats.cinnamon}>
            <cylinderGeometry args={[0.028, 0.028, 0.42, 14, 1, true, 1, Math.PI * 1.6]} />
          </mesh>
        </group>
      );
    case "clove":
      return (
        <group>
          <mesh material={spiceMats.clove}>
            <cylinderGeometry args={[0.008, 0.013, 0.1, 6]} />
          </mesh>
          <mesh material={spiceMats.clove} position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.022, 8, 6]} />
          </mesh>
        </group>
      );
  }
}

const SPICES: { kind: SpiceKind; p: [number, number, number] }[] = [
  { kind: "anise", p: [-1.65, 1.7, 0.3] },
  { kind: "cinnamon", p: [1.7, 1.25, 0.5] },
  { kind: "cardamom", p: [-1.35, 0.6, 1.0] },
  { kind: "chilli", p: [1.45, 2.05, -0.4] },
  { kind: "bay", p: [-1.9, 1.05, -0.6] },
  { kind: "clove", p: [1.15, 0.5, 1.2] },
  { kind: "anise", p: [1.95, 0.75, -0.8] },
  { kind: "cardamom", p: [-0.9, 2.25, -0.9] },
  { kind: "clove", p: [-2.05, 2.0, 0.9] },
  { kind: "cinnamon", p: [0.9, 2.45, 0.8] },
  { kind: "bay", p: [1.95, 1.8, 0.9] },
  { kind: "chilli", p: [-1.6, 0.35, -1.1] },
  { kind: "cardamom", p: [0.55, 0.3, 1.6] },
  { kind: "anise", p: [-0.6, 2.6, 0.9] },
];

function Spices({ lite }: { lite: boolean }) {
  const list = lite ? SPICES.slice(0, 8) : SPICES;
  return (
    <>
      {list.map((s, i) => (
        <Float key={i} speed={1 + (i % 4) * 0.25} rotationIntensity={1.2} floatIntensity={0.9} floatingRange={[-0.08, 0.08]}>
          <group position={s.p} rotation={[i * 0.7, i * 1.3, i * 0.4]} scale={1.6}>
            <Spice kind={s.kind} />
          </group>
        </Float>
      ))}
    </>
  );
}

function Rig({ interactive }: { interactive: boolean }) {
  return interactive ? (
    <OrbitControls
      makeDefault
      target={[0, 0.95, 0]}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      autoRotate
      autoRotateSpeed={0.55}
      minPolarAngle={0.7}
      maxPolarAngle={1.32}
    />
  ) : null;
}

function Scene({ variant, lidOpen, lite, interactive }: Omit<Props, "active">) {
  const copper = useCopper();
  const spin = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0.95, 0);
  }, [camera]);

  useFrame((_, dt) => {
    if (!interactive && spin.current) spin.current.rotation.y += dt * 0.16;
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <spotLight position={[3, 6, 3]} angle={0.42} penumbra={1} intensity={90} color="#ffd6a8" decay={2} />
      <pointLight position={[-3, 1.4, -2]} intensity={22} color="#ff5a14" decay={2} />
      <pointLight position={[0, 3.2, 2.5]} intensity={6} color="#ffe2c0" decay={2} />

      <Environment resolution={lite ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffdcb4" position={[0, 5, -1]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={5} color="#ff6a1f" position={[-5, 1.4, 0]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} color="#ffe9cf" position={[5, 2, 2]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2.4} color="#ffb067" position={[0, 2.5, 5]} scale={2.2} />
        <Lightformer form="rect" intensity={0.35} color="#ff7a2a" position={[0, -3, 0]} scale={[4, 4, 1]} rotation-x={-Math.PI / 2} />
      </Environment>

      <group ref={spin}>
        <Handi copper={copper} />
        <Rice lite={lite} />
        <Toppings variant={variant} />
        <Lid copper={copper} open={lidOpen} />
        <BananaLeaf />
      </group>
      <Steam open={lidOpen} />
      <Spices lite={lite} />

      <ContactShadows position={[0, 0.005, 0]} opacity={0.75} scale={6} blur={2.6} far={2.2} frames={1} resolution={lite ? 256 : 512} color="#000000" />
      <Rig interactive={interactive} />
    </>
  );
}

export default function HandiScene({ active, ...rest }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={rest.lite ? [1, 1.4] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.7, 6.4], fov: 30, near: 0.1, far: 40 }}
      style={{ touchAction: rest.interactive ? "none" : "pan-y" }}
    >
      <Scene {...rest} />
    </Canvas>
  );
}
