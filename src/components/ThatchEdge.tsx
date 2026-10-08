const W = 1440;
const H = 64;

function fringePath(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let d = `M0 0 H${W} V${H * 0.35}`;
  let x = W;
  while (x > 0) {
    const w = 10 + rand() * 18;
    const depth = H * (0.45 + rand() * 0.55);
    d += ` L${(x - w / 2).toFixed(1)} ${depth.toFixed(1)} L${Math.max(0, x - w).toFixed(1)} ${(H * 0.3 + rand() * 6).toFixed(1)}`;
    x -= w;
  }
  return d + " Z";
}

const BACK = fringePath(7);
const FRONT = fringePath(31);

/** Jagged thatch fringe echoing the roof edge in the Kudil logo. */
export function ThatchEdge({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none block h-10 w-full sm:h-14 ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="thatch-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b3260f" />
          <stop offset="0.55" stopColor="#f26b1d" />
          <stop offset="1" stopColor="#ff9a3c" />
        </linearGradient>
      </defs>
      <path d={BACK} fill="#6e1410" opacity="0.9" />
      <path d={FRONT} fill="url(#thatch-g)" transform={`translate(0 -6)`} />
    </svg>
  );
}
