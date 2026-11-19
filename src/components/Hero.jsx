import { Fragment, useEffect, useState } from "react";
import { consoleLog, profile } from "../data.js";
import { hms, magnet, reduceMotion, useScramble } from "../hooks.js";
import { Icon } from "./ui.jsx";

function DecryptLine({ text, delay }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }, [delay]);
  return <span className="line grad" aria-hidden="true">{useScramble(text, go, 1100)}</span>;
}

const strip = html => html.replace(/<[^>]+>/g, "");

/** Replays the sample P1 timeline: types each line while the restore clock ticks. */
function Console() {
  const done = { step: consoleLog.length, chars: Infinity };
  const [state, setState] = useState(reduceMotion ? done : { step: 0, chars: 0, started: false });

  useEffect(() => {
    if (reduceMotion) return;
    let timer;
    const typeLine = step => {
      if (step >= consoleLog.length) return;
      const len = strip(consoleLog[step].html).length;
      let chars = 0;
      const iv = setInterval(() => {
        chars += 2;
        setState({ step, chars, started: true });
        if (chars >= len) { clearInterval(iv); timer = setTimeout(() => typeLine(step + 1), 380); }
      }, 22);
      timer = iv;
    };
    timer = setTimeout(() => typeLine(0), 900);
    return () => { clearTimeout(timer); clearInterval(timer); };
  }, []);

  const { step, chars } = state;
  const finished = step >= consoleLog.length || (step === consoleLog.length - 1 && chars >= strip(consoleLog[step].html).length);
  const cur = consoleLog[Math.min(step, consoleLog.length - 1)];
  const prevMin = step ? consoleLog[step - 1].min : 0;
  const frac = Math.min(1, chars / strip(cur.html).length);
  const seconds = Math.round((prevMin + (cur.min - prevMin) * frac) * 60);
  const restored = consoleLog.findIndex(l => l.restored);
  const isRestored = step > restored || (step === restored && frac >= 1);
  const meter = Math.min(100, ((step + frac) / consoleLog.length) * 100);

  return (
    <aside className="console enter" style={{ "--i": 3 }} aria-label="Sample major incident timeline (illustration)">
      <div className="console-bar"><i /><i /><i /><span>bridge://major-incident</span></div>
      <div className="console-top">
        <div><span className="k">Time to restore</span><span className="v">{hms(seconds)}</span></div>
        <div>
          <span className="k">SLA status</span>
          <span className={`v${isRestored ? " ok" : ""}`}>{isRestored ? "Met" : "Tracking"}</span>
          <div className="meter"><b style={{ "--w": meter + "%" }} /></div>
        </div>
      </div>
      <ol className="log">
        {consoleLog.map((l, i) => {
          const visible = i < step || (i === step && state.started !== false) || reduceMotion;
          const full = i < step || (i === step && chars >= strip(l.html).length);
          return (
            <li key={i} style={{ visibility: visible ? "visible" : "hidden" }}>
              <span className="t">{l.t}</span>
              {full
                ? <span><span dangerouslySetInnerHTML={{ __html: l.html }} />{finished && i === consoleLog.length - 1 && <span className="caret" aria-hidden="true" />}</span>
                : <span>{i === step ? strip(l.html).slice(0, chars) : ""}</span>}
            </li>
          );
        })}
      </ol>
      <div className="console-foot">Illustrative timeline of a typical P1 bridge</div>
    </aside>
  );
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="status-pill enter" style={{ "--i": 0 }}><span className="pulse" aria-hidden="true" />All systems operational · Gurugram, India</span>
          <h1 className="enter" style={{ "--i": 1 }} aria-label={profile.name.join(" ")}>
            {profile.name.map((n, i) => <DecryptLine key={n} text={n} delay={250 + i * 180} />)}
          </h1>
          <p className="role-line enter" style={{ "--i": 2 }}>
            {profile.roles.map((r, i) => <Fragment key={r}>{i > 0 && <span className="sep" aria-hidden="true" />}{r}</Fragment>)}
          </p>
          <p className="lede enter" style={{ "--i": 3 }}>{profile.lede}</p>
          <div className="cta-row enter" style={{ "--i": 4 }}>
            <a className="btn btn-primary magnet" href="#contact" {...magnet}><Icon name="mail" />Get in touch</a>
            <a className="btn" href={profile.linkedin.url} target="_blank" rel="noopener"><Icon name="linkedin" />LinkedIn</a>
            <a className="btn" href="#experience">View experience<Icon name="down" /></a>
          </div>
        </div>
        <Console />
      </div>
    </header>
  );
}
