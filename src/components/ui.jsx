import { reduceMotion, spotlight, useInView, useScramble } from "../hooks.js";

const ICONS = {
  mail: <><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></>,
  down: <><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4" /></>,
  external: <path d="M7 17 17 7M9 7h8v8" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  siren: <><path d="M7 18v-6a5 5 0 0 1 10 0v6" /><path d="M5 21h14" /><path d="M12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4M3 12h1M20 12h1" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /><path d="M11 8v3l2 2" /></>,
  branch: <><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="9" r="2.5" /><path d="M6 8.5v7" /><path d="M18 11.5c0 4-6 2.5-10.5 5" /></>,
  pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  gauge: <><path d="M4 18a8 8 0 1 1 16 0" /><path d="m12 18 4-6" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="m9 13 2 2 4-4" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
};

export function Icon({ name, size }) {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" style={size ? { width: size, height: size } : undefined}>
      {ICONS[name]}
    </svg>
  );
}

/** Fades/slides in on scroll. Content is only hidden when motion is allowed. */
export function Reveal({ as: Tag = "div", className = "", i, style, card, children, ...rest }) {
  const [ref, inView] = useInView();
  const cls = [className, card && "card", !reduceMotion && "pre", inView && "in"].filter(Boolean).join(" ");
  return (
    <Tag ref={ref} className={cls} style={i != null ? { ...style, "--i": i } : style} onPointerMove={card ? spotlight : undefined} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children }) {
  const [ref, inView] = useInView();
  const text = useScramble(children, inView, 700);
  return <span ref={ref} className="eyebrow" aria-label={children}><span aria-hidden="true">{text}</span></span>;
}

/** H2 whose words rise in one by one; `grad` is the highlighted tail. */
export function SplitHeading({ text, grad }) {
  const [ref, inView] = useInView();
  const words = text ? text.split(" ") : [];
  return (
    <h2 ref={ref} className={reduceMotion ? "" : `split-ready${inView ? " in" : ""}`}>
      {words.map((w, i) => <span key={i}><span className="w" style={{ "--i": i }}>{w}</span>{" "}</span>)}
      {grad && <span className="grad w" style={{ "--i": words.length }}>{grad}</span>}
    </h2>
  );
}
