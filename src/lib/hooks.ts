"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/** Tracks whether an element is within `margin` of the viewport. */
export function useNearViewport(ref: RefObject<Element | null>, margin = "200px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

export type DeviceProfile = { lite: boolean; touch: boolean; reduced: boolean; webgl: boolean; ready: boolean };

const SERVER_PROFILE: DeviceProfile = { lite: true, touch: false, reduced: false, webgl: false, ready: false };
let clientProfile: DeviceProfile | null = null;

function detectProfile(): DeviceProfile {
  if (clientProfile) return clientProfile;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || !!nav.connection?.saveData;
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  clientProfile = { lite: touch || weak || window.innerWidth < 900, touch, reduced, webgl, ready: true };
  return clientProfile;
}

const noopSubscribe = () => () => {};

export function useDeviceProfile(): DeviceProfile {
  return useSyncExternalStore(noopSubscribe, detectProfile, () => SERVER_PROFILE);
}
