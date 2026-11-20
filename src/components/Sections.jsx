import { useEffect, useRef, useState } from "react";
import {
  certifications, education, experience, industries, marqueeIndustries, profile,
  regions, skills, stats, summary, tools,
} from "../data.js";
import { magnet, reduceMotion, sparks, useCountUp, useInView, useScrollFrame } from "../hooks.js";
import { Eyebrow, Icon, Reveal, SplitHeading } from "./ui.jsx";

export function Marquee() {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const track = hidden => (
    <div className="marquee-track" aria-hidden={hidden || undefined}>
      {marqueeIndustries.map(n => <span key={n}>{n}</span>)}
    </div>
  );
  return (
    <section ref={ref} className={`band${paused ? " paused" : ""}`} aria-label="Client industries">
      <div className="marquee">{track(false)}{track(true)}</div>
    </section>
  );
}

function Stat({ n, plus, text, i }) {
  const [ref, inView] = useInView();
  const value = useCountUp(n, inView);
  return (
    <Reveal card className="stat" i={i}>
      <div className="n" ref={ref}><span>{value}</span>{plus && <sup>+</sup>}</div>
      <p>{text}</p>
    </Reveal>
  );
}

export function Profile() {
  return (
    <section id="profile">
      <div className="wrap">
        <div className="stats">{stats.map((s, i) => <Stat key={i} {...s} i={i} />)}</div>
        <div className="split" style={{ marginTop: 96 }}>
          <div><Eyebrow>Profile</Eyebrow></div>
          <Reveal>
            <p className="profile-text">{summary.map((part, i) => (typeof part === "string" ? part : <em key={i}>{part.em}</em>))}</p>
            <div className="tools" aria-label="Toolkit">
              {tools.map(([name, note]) => <span className="tool" key={name}>{name} <small>{note}</small></span>)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const ladder = useRef(null);
  const [prog, setProg] = useState(1);
  useScrollFrame(() => {
    if (reduceMotion || !ladder.current) return;
    const r = ladder.current.getBoundingClientRect();
    setProg(Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height)));
  });
  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Experience · Genpact</Eyebrow>
          <SplitHeading text="Escalated from" grad="P5 to P1" />
          <Reveal as="p" className="sec-lede">Four roles, each owning higher-severity incidents and wider scope, from monitoring alerts to running the whole Major Incident, Problem and Change practice.</Reveal>
        </div>
        <ol className="ladder" ref={ladder}>
          <li className="rail" aria-hidden="true"><b style={{ "--prog": prog.toFixed(3) }} /></li>
          {experience.map(job => (
            <Reveal as="li" card key={job.title} className={`rung${job.current ? " current" : ""}`} style={{ "--c": `var(--${job.sev})` }}>
              <div className="rung-head">
                <span className="sev" style={{ "--c": `var(--${job.sev})` }}>{job.tag}</span>
                <span className="when">{job.current && <span className="live">● </span>}{job.when}</span>
              </div>
              <h3>{job.title}</h3>
              <div className="org">{job.org}</div>
              <ul>{job.points.map(p => <li key={p}>{p}</li>)}</ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Key skills</Eyebrow>
          <SplitHeading text="Detect. Command." grad="Prevent." />
        </div>
        <div className="bento">
          {skills.map((s, i) => (
            <Reveal as="article" card key={s.title} i={i} className={`tile ${s.size}${s.hot ? " hot" : ""}`}>
              <div className="ico"><Icon name={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.chips && <div className="chips">{s.chips.map(c => <span key={c}>{c}</span>)}</div>}
              {s.flow && (
                <div className="flow" aria-label="Change flow">
                  {s.flow.map((f, j) => <span key={f} style={{ display: "contents" }}>{j > 0 && <i>→</i>}<b>{f}</b></span>)}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clock({ tz }) {
  const fmt = () => {
    try { return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date()) + " local"; }
    catch { return ""; }
  };
  const [t, setT] = useState(fmt);
  useEffect(() => { const iv = setInterval(() => setT(fmt()), 30000); return () => clearInterval(iv); }, [tz]);
  return <div className="clock">{t}</div>;
}

export function Reach() {
  return (
    <section id="reach">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Client reach</Eyebrow>
          <SplitHeading text="Three continents," grad="one bridge." />
          <Reveal as="p" className="sec-lede">Projects for clients across America, Europe and Asia, in eleven industries.</Reveal>
        </div>
        <div className="regions">
          {regions.map((r, i) => (
            <Reveal card key={r.name} i={i} className="region">
              <span className="tz">{r.city}</span><h3>{r.name}</h3><Clock tz={r.tz} />
            </Reveal>
          ))}
        </div>
        <Reveal className="industry-list">{industries.map(n => <span key={n}>{n}</span>)}</Reveal>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Education &amp; certification</Eyebrow>
          <SplitHeading text="Credentials" />
        </div>
        <div className="edu-grid">
          <Reveal card className="edu-list">
            {education.map(e => (
              <div className="edu-row" key={e.title}>
                <div><h3>{e.title}</h3><p>{e.school}</p></div>
                <span className="when">{e.when}</span>
              </div>
            ))}
          </Reveal>
          <div className="certs">
            {certifications.map((c, i) => (
              <Reveal card key={c.title} i={i + 1} className="cert">
                <div className="seal-wrap"><div className="seal" /><b>{c.seal}</b></div>
                <div><h3>{c.title}</h3><p>{c.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyLine({ icon, value, copy, href, what, primary, notify }) {
  const [label, setLabel] = useState("Copy");
  const valRef = useRef(null);
  const onClick = e => {
    const btn = e.currentTarget, t0 = performance.now();
    const ok = () => {
      const r = btn.getBoundingClientRect();
      sparks(r.left + r.width / 2, r.top + r.height / 2);
      setLabel("Copied"); setTimeout(() => setLabel("Copy"), 1600);
      notify({ ok: true, text: `${what} copied · MTTR ${Math.max(1, Math.round(performance.now() - t0))} ms` });
    };
    const fallback = () => {
      const range = document.createRange(); range.selectNodeContents(valRef.current);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      notify({ text: `${what} selected. Press Ctrl+C to copy.` });
    };
    try { navigator.clipboard.writeText(copy).then(ok, fallback); } catch { fallback(); }
  };
  return (
    <div className="cline">
      <Icon name={icon} />
      <a className="val" href={href} ref={valRef}>{value}</a>
      <button className={`btn${primary ? " btn-primary magnet" : ""}`} type="button" onClick={onClick} {...(primary ? magnet : {})}>{label}</button>
    </div>
  );
}

export function Contact({ notify }) {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal card className="contact-card">
          <Eyebrow>Contact</Eyebrow>
          <SplitHeading text="Need someone" grad="on the bridge?" />
          <p className="sec-lede">Open to Major Incident, Problem and Change Management roles. Copy a detail below and get in touch.</p>
          <div className="contact-lines">
            <CopyLine icon="mail" value={profile.email} copy={profile.email} href={`mailto:${profile.email}`} what="Email" primary notify={notify} />
            <CopyLine icon="phone" value={profile.phone.display} copy={profile.phone.value} href={`tel:${profile.phone.value}`} what="Phone" notify={notify} />
            <div className="cline">
              <Icon name="linkedin" />
              <span className="val">{profile.linkedin.display}</span>
              <a className="btn" href={profile.linkedin.url} target="_blank" rel="noopener" aria-label="Open LinkedIn profile in a new tab">Open <Icon name="external" size={16} /></a>
            </div>
            <div className="cline"><Icon name="pin" /><span className="val">{profile.location}</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
