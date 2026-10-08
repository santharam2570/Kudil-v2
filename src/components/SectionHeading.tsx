import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  ta: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, ta, title, intro, align = "left" }: Props) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="tamil mt-5 text-lg font-semibold text-ember sm:text-xl">{ta}</p>
      </Reveal>
      <Reveal delay={0.14}>
        <h2 className="display mt-2 text-4xl leading-[1.02] font-medium text-cream sm:text-5xl lg:text-6xl">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.22}>
          <p className={`mt-6 text-base leading-relaxed text-sand sm:text-lg ${center ? "mx-auto max-w-2xl" : ""}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
