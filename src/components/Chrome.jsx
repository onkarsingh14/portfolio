import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "../data.js";
import MatrixRain from "./MatrixRain.jsx";
import { hms, reduceMotion, useScrollFrame, useUptime } from "../hooks.js";

export function Background() {
  const aurora = useRef(null);
  const glow = useRef(null);
  // Moves the soft cursor light without re-rendering React.
  const onPointer = useCallback((x, y) => {
    const g = glow.current;
    if (x == null) { g.classList.remove("on"); return; }
    g.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    g.classList.add("on");
  }, []);
  const [paused, setPaused] = useState(false);
  useScrollFrame(() => {
    if (reduceMotion) return;
    aurora.current.style.transform = `translate3d(0, ${scrollY * -0.15}px, 0)`;
    setPaused(scrollY > innerHeight * 1.5);
  });
  return (
    <div className={`bgfx${paused ? " paused" : ""}`} aria-hidden="true">
      <div className="aurora" ref={aurora}><div className="blob b1" /><div className="blob b2" /><div className="blob b3" /></div>
      <div className="grid" />
      <MatrixRain onPointer={onPointer} />
      <div className="cursor-glow" ref={glow} />
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  useScrollFrame(() => setScrolled(scrollY > 24));
  useEffect(() => {
    const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
    return () => spy.disconnect();
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="Sections">
      <div className="wrap">
        <a className="logo" href="#top" aria-label="Onkar Singh, back to top"><span className="logo-mark">OS</span><span className="full">Onkar Singh</span></a>
        <ul>
          {nav.map(([id, label]) => <li key={id}><a href={`#${id}`} className={active === id ? "on" : undefined}>{label}</a></li>)}
        </ul>
      </div>
    </nav>
  );
}

export function Footer() {
  const s = useUptime();
  return (
    <footer>
      <div className="wrap">
        <span>© Onkar Singh · Major Incident, Problem &amp; Change Manager</span>
        <span>Session uptime <span className="okc">{hms(s)}</span> · 0 incidents</span>
      </div>
    </footer>
  );
}

export function Toast({ toast }) {
  return (
    <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
      {toast?.ok && <span className="okc">✓ RESOLVED</span>} {toast?.text}
    </div>
  );
}
