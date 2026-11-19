import { useEffect, useRef, useState } from "react";

export const reduceMotion = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const canHover = typeof matchMedia !== "undefined" && matchMedia("(hover: hover)").matches;

const pad = n => String(n).padStart(2, "0");
export const hms = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>";

/** Animates `final` from random glyphs to the real text, left to right, once `active` is true. */
export function useScramble(final, active, dur = 900) {
  const [text, setText] = useState(final);
  useEffect(() => {
    if (!active || reduceMotion) return;
    const start = performance.now();
    let raf;
    const tick = t => {
      const p = Math.min(1, (t - start) / dur), solved = Math.floor(p * final.length);
      setText(final.split("").map((c, i) => (i < solved || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (p < 1) raf = requestAnimationFrame(tick); else setText(final);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [final, active, dur]);
  return text;
}

/** True once the element has scrolled into view (always true with reduced motion). */
export function useInView(options = { rootMargin: "0px 0px -8% 0px" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(reduceMotion);
  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, options);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/** Counts from 0 to `end` when `active` flips true. */
export function useCountUp(end, active, dur = 1200) {
  const [n, setN] = useState(end);
  useEffect(() => {
    if (!active || reduceMotion) return;
    const start = performance.now();
    let raf;
    const f = t => { const p = Math.min(1, (t - start) / dur); setN(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [end, active, dur]);
  return n;
}

/** Calls `fn` at most once per animation frame while scrolling (and once on mount). */
export function useScrollFrame(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    let ticking = false;
    const run = () => { ticking = false; fnRef.current(); };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    addEventListener("scroll", onScroll, { passive: true });
    run();
    return () => removeEventListener("scroll", onScroll);
  }, []);
}

/** Seconds since mount, ticking every second. */
export function useUptime() {
  const [s, setS] = useState(0);
  useEffect(() => { const t0 = Date.now(), iv = setInterval(() => setS(Math.floor((Date.now() - t0) / 1000)), 1000); return () => clearInterval(iv); }, []);
  return s;
}

// rAF-throttled pointer handlers shared by cards and magnet buttons.
function throttled(apply) {
  return e => {
    const el = e.currentTarget, x = e.clientX, y = e.clientY;
    if (el._raf) return;
    el._raf = requestAnimationFrame(() => { el._raf = 0; apply(el, x, y); });
  };
}
export const spotlight = canHover && !reduceMotion
  ? throttled((el, x, y) => { const r = el.getBoundingClientRect(); el.style.setProperty("--mx", x - r.left + "px"); el.style.setProperty("--my", y - r.top + "px"); })
  : undefined;
export const magnet = canHover && !reduceMotion
  ? {
      onPointerMove: throttled((el, x, y) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(x - r.left - r.width / 2) * 0.25}px, ${(y - r.top - r.height / 2) * 0.35}px)`; }),
      onPointerLeave: e => { e.currentTarget.style.transform = ""; },
    }
  : {};

/** Burst of small squares from (x, y), for copy feedback. */
export function sparks(x, y) {
  if (reduceMotion) return;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span"), a = (i / 10) * Math.PI * 2, d = 26 + Math.random() * 18;
    s.className = "spark"; s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + "px");
    document.body.appendChild(s); setTimeout(() => s.remove(), 650);
  }
}
