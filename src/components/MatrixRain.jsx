import { useEffect, useRef } from "react";
import { canHover, reduceMotion } from "../hooks.js";

const SIZE = 16;          // px per glyph cell
const FPS = 30;           // classic stepped rain look; also halves the cost
const REACH = 150;        // px: cursor influence radius
// Half-width katakana + digits + incident-desk letters.
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFINCPSLARC#*+<>";
const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/**
 * Matrix-style digital rain on a transparent canvas.
 * Near the cursor columns fall faster and their glyphs turn white-hot;
 * a click starts a burst of fresh streams at the click point.
 */
export default function MatrixRain({ onPointer }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const ACCENT = css.getPropertyValue("--accent-rgb").trim() || "0,255,156";
    const HOT = css.getPropertyValue("--text-rgb").trim() || "228,247,236";
    const font = css.getPropertyValue("--font-mono").trim() || "monospace";

    let w = 0, h = 0, cols = [], raf = 0, last = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${SIZE - 2}px ${font}`;
      ctx.textAlign = "center";
      const n = Math.ceil(w / SIZE);
      cols = Array.from({ length: n }, (_, i) => cols[i] ?? {
        y: Math.random() * (h / SIZE) - h / SIZE / 2,  // start spread across the screen
        speed: 0.3 + Math.random() * 0.6,      // cells per frame
      });
    }

    function draw(now) {
      raf = requestAnimationFrame(draw);
      if (now - last < 1000 / FPS) return;
      last = now;

      // fade previous frame toward transparent: leaves the trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.045)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < cols.length; i++) {
        const c = cols[i], x = i * SIZE + SIZE / 2, cell = Math.floor(c.y), y = cell * SIZE;
        let heat = 0;
        if (mouse.active) {
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d < REACH) heat = 1 - d / REACH;
          else if (Math.abs(x - mouse.x) < REACH * 0.5) heat = 0.25;   // whole column wakes a little
        }
        // Draw only when the head enters a new cell: the old head is overwritten in green, the new head in white.
        if (cell !== c.cell) {
          if (c.cell != null) {
            ctx.clearRect(x - SIZE / 2, (c.cell - 1) * SIZE, SIZE, SIZE + 2);
            ctx.fillStyle = `rgba(${ACCENT},${0.6 + heat * 0.4})`;
            ctx.fillText(pick(), x, c.cell * SIZE);
          }
          ctx.fillStyle = `rgba(${HOT},${heat > 0.3 ? 1 : 0.9})`;
          ctx.fillText(pick(), x, y);
          c.cell = cell;
        }

        c.y += c.speed * (1 + heat * 2.5);
        if (y > h && Math.random() > 0.9) { c.y = Math.random() * -8; c.speed = 0.3 + Math.random() * 0.6; }
      }
    }

    function staticFrame() {
      for (let i = 0; i < cols.length; i++) {
        for (let r = 0; r < h / SIZE; r++) {
          if (Math.random() > 0.12) continue;
          ctx.fillStyle = `rgba(${ACCENT},${0.15 + Math.random() * 0.35})`;
          ctx.fillText(pick(), i * SIZE + SIZE / 2, r * SIZE);
        }
      }
    }

    const move = e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; onPointer?.(e.clientX, e.clientY); };
    const leave = () => { mouse.active = false; onPointer?.(null); };
    const burst = e => {
      const center = Math.round((e.clientX - SIZE / 2) / SIZE), row = e.clientY / SIZE;
      for (let k = -6; k <= 6; k++) {
        const c = cols[center + k];
        if (c) { c.y = row - Math.abs(k) * 0.6; c.speed = 1.2 + Math.random(); }
      }
    };

    resize();
    addEventListener("resize", resize);
    if (reduceMotion) staticFrame();
    else {
      raf = requestAnimationFrame(draw);
      if (canHover) {
        addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
        addEventListener("pointerdown", burst, { passive: true });
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      removeEventListener("pointerdown", burst);
    };
  }, [onPointer]);

  return <canvas ref={ref} className="net" />;
}
