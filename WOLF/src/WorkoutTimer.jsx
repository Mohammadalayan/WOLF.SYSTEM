import React, { useEffect, useRef, useState } from "react";
import "./workout.css";

/* ---------- Icons ---------- */
const BackArrow = () => (
  <svg width="38" height="30" viewBox="0 0 38 30" fill="none" stroke="#9fb0c3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M36 15H4M15 4L4 15l11 11" />
  </svg>
);
const Play = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" /></svg>
);
const Pause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.5" /><rect x="14" y="4" width="5" height="16" rx="1.5" /></svg>
);
const Reset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
);

/* ---------- Time format: MM:SS:CC ---------- */
const pad = (n) => String(n).padStart(2, "0");
const format = (ms) => {
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  return `${pad(m)}:${pad(s)}:${pad(cs)}`;
};

export default function WorkoutTimer({
  exercise = "INCLINE DUMBBELL PRESS",
  target = "Upper Chest",
  rest = 90,
  totalSets = 4,                 // number of set buttons under the timer
  gif = "/dumbbell_press.gif",   // put the GIF in /public
  onBack = () => {},
}) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);
  const [doneSets, setDoneSets] = useState(0);   // how many sets are finished
  const base = useRef(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (!running) return;
    t0.current = performance.now();
    const id = setInterval(() => {
      setElapsed(base.current + (performance.now() - t0.current));
    }, 10);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    if (running) return;
    base.current = elapsed;
    setRunning(true);
  };
  const stop = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    base.current = 0;
    setElapsed(0);
  };

  // Tap a set number: marks sets 1..n as done. Tap the last done set again to undo it.
  const toggleSet = (i) => setDoneSets(i + 1 === doneSets ? i : i + 1);

  // ---- values used only for the design ----
  const text = format(elapsed);                              // "MM:SS:CC"
  const status = running ? "running" : elapsed > 0 ? "paused" : "ready";
  const progress = (elapsed % 60000) / 60000;                // ring fills once per minute

  return (
    <div className="wt-root">
      <div className="wt-layout">

        {/* Top bar: back + status */}
        <header className="wt-top">
          <a href="/" className="wt-back" onClick={onBack} aria-label="Back">
            <BackArrow />
          </a>
          <span className="wt-status" data-status={status}>
            <i className="wt-dotlive" aria-hidden="true" />
            {status.toUpperCase()}
          </span>
        </header>

        {/* Exercise card */}
        <section className="wt-card">
          <h1>{exercise}</h1>
          <p>Target: {target} | Rest: {rest}s</p>
        </section>

        {/* GIF */}
        <div className="wt-figure">
          {gifFailed ? (
            <p className="wt-missing">GIF not found: {gif}</p>
          ) : (
            <img src={gif} alt={exercise} draggable="false" onError={() => setGifFailed(true)} />
          )}
        </div>

        {/* Big timer with progress ring */}
        <div className="wt-timer">
          <svg className="wt-ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="wt-ring-track" cx="60" cy="60" r="54" />
            <circle
              className="wt-ring-bar"
              cx="60" cy="60" r="54"
              pathLength="100"
              style={{ strokeDashoffset: 100 - progress * 100 }}
            />
          </svg>
          <time className="wt-time">
            <span className="wt-digits">{text.slice(0, 5)}</span>
            <span className="wt-cs">.{text.slice(6)}</span>
          </time>
        </div>

        {/* Sets */}
        <div className="wt-sets">
          <span className="wt-sets-label">SETS {doneSets}/{totalSets}</span>
          <div className="wt-dots">
            {Array.from({ length: totalSets }, (_, i) => (
              <button
                key={i}
                className={"wt-set" + (i < doneSets ? " is-done" : "")}
                onClick={() => toggleSet(i)}
                aria-label={`Set ${i + 1}`}
                aria-pressed={i < doneSets}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="wt-controls">
          <div className="wt-ctl">
            <button className="wt-btn wt-reset" onClick={reset} aria-label="Reset"><Reset /></button>
            <span>RESET</span>
          </div>
          <div className="wt-ctl wt-ctl-main">
            <button className="wt-btn wt-start" onClick={start} disabled={running} aria-label="Start"><Play /></button>
            <span>START</span>
          </div>
          <div className="wt-ctl">
            <button className="wt-btn wt-stop" onClick={stop} disabled={!running} aria-label="Stop"><Pause /></button>
            <span>STOP</span>
          </div>
        </div>

      </div>
    </div>
  );
}