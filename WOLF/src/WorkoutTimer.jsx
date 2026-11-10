import React, { useEffect, useRef, useState } from "react";
import { Route } from "react-router-dom";
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
  video = "/dumbbell_press.mp4", // put the file in /public
  image = null,                  // optional: use an image instead of the video
  onBack = () => {},
}) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
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

  return (
    <div className="wt-root">
      <style>{css}</style>

      <div className="wt-layout">
        <header className="wt-top">
        <a href="/" >   <button className="wt-back" onClick={onBack} aria-label="Back">
             <BackArrow />
          </button></a>
          <time className="wt-time">{format(elapsed)}</time>
        </header>

        <section className="wt-card">
          <h1>{exercise}</h1>
          <p>Target: {target} | Rest: {rest}s</p>
        </section>

        <div className="wt-figure">
          {image ? (
            <img src={image} alt={exercise} />
          ) : videoFailed ? (
            <p className="wt-missing">Video not found: {video}</p>
          ) : (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label={exercise}
              onError={() => setVideoFailed(true)}
            />
          )}
        </div>

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

const css = `
/* Neutralise default Vite / CRA page styles so the screen can fill the window */
html,body,#root{margin:0;padding:0;width:100%;height:100%;max-width:none;display:block;text-align:left;background:#0a1322}

.wt-root{
  --bg:#0a1322; --card:#16223a; --edge:#1f4a5a; --muted:#9fb0c3;
  --gap:clamp(12px,2.4vh,28px);
  --btn:clamp(54px,14vmin,84px);
  --btn-main:clamp(74px,21vmin,112px);
  position:fixed; inset:0; overflow-y:auto; overflow-x:hidden;
  background:var(--bg); color:#fff;
  font-family:Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-text-size-adjust:100%;
}
.wt-root *{box-sizing:border-box;margin:0}

.wt-layout{
  min-height:100%; width:100%;
  display:flex; flex-direction:column; gap:var(--gap);
  padding:
    calc(clamp(12px,3vw,32px) + env(safe-area-inset-top,0px))
    calc(clamp(12px,3vw,40px) + env(safe-area-inset-right,0px))
    calc(clamp(16px,3vh,32px) + env(safe-area-inset-bottom,0px))
    calc(clamp(12px,3vw,40px) + env(safe-area-inset-left,0px));
}

.wt-top{grid-area:top;display:flex;justify-content:space-between;align-items:center}
.wt-back{background:none;border:0;cursor:pointer;padding:6px;display:grid;place-items:center}
.wt-time{font-size:clamp(17px,2.4vw,30px);font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:.3px}

.wt-card{
  grid-area:card;
  background:var(--card);border:1px solid var(--edge);border-radius:16px;
  padding:clamp(14px,2.4vh,26px) 14px;text-align:center;
}
.wt-card h1{font-size:clamp(18px,3.2vw,34px);font-weight:700;letter-spacing:.2px;line-height:1.2}
.wt-card p{margin-top:6px;font-size:clamp(12px,1.6vw,17px);color:var(--muted)}

.wt-figure{
  grid-area:figure;
  position:relative; flex:1; min-height:clamp(200px,34vh,520px);
  border-radius:16px; overflow:hidden;
}
.wt-figure video,.wt-figure img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:contain;
}
.wt-missing{position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);font-size:13px;text-align:center;padding:16px}

.wt-controls{
  grid-area:controls;
  display:flex; justify-content:center; align-items:flex-end;
  gap:clamp(18px,6vw,56px); margin-top:auto;
}
.wt-ctl{display:flex;flex-direction:column;align-items:center;gap:8px}
.wt-ctl span{font-size:clamp(10px,1.3vw,13px);font-weight:700;letter-spacing:1.4px;color:var(--muted)}
.wt-ctl-main span{color:#00f0ff}

.wt-btn{
  display:grid;place-items:center;
  width:var(--btn);height:var(--btn);border-radius:50%;border:0;cursor:pointer;color:#fff;
  background:linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.04));
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 8px 18px rgba(0,0,0,.45);
}
.wt-btn svg{width:42%;height:42%}
.wt-start{
  width:var(--btn-main);height:var(--btn-main);color:#041a21;
  background:linear-gradient(160deg,#5ff6ff 0%,#00d4e6 100%);
  box-shadow:0 0 0 6px rgba(0,240,255,.12),0 0 28px rgba(0,240,255,.55),0 10px 22px rgba(0,0,0,.5);
}
.wt-start svg{width:40%;height:40%;margin-left:4%}
.wt-stop{color:#ffb02e;box-shadow:inset 0 0 0 1.5px rgba(245,158,11,.75),0 0 18px rgba(245,158,11,.3),0 8px 18px rgba(0,0,0,.45)}
.wt-reset{color:#cfd6e3}
.wt-btn:disabled{opacity:.4;cursor:default;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.wt-start:disabled{background:linear-gradient(160deg,#2a8f99,#1a6a73);color:#0a2a30}
.wt-btn:focus-visible,.wt-back:focus-visible{outline:2px solid #fff;outline-offset:4px}
@media (prefers-reduced-motion:no-preference){
  .wt-btn{transition:transform .12s,filter .15s,box-shadow .2s}
  .wt-btn:not(:disabled):active{transform:scale(.92)}
  .wt-btn:not(:disabled):hover{filter:brightness(1.12)}
}

/* Wide screens and phones in landscape: video on the left, info + controls on the right */
@media (min-width:900px), (orientation:landscape) and (max-height:520px){
  .wt-layout{
    display:grid;
    grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);
    grid-template-rows:auto auto 1fr;
    grid-template-areas:"top top" "figure card" "figure controls";
    column-gap:clamp(16px,3vw,48px);
    height:100%;
  }
  .wt-figure{min-height:0}
  .wt-controls{margin-top:0;align-self:center}
}
`;