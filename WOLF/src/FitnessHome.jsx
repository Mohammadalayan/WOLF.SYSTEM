import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Workout from './WorkoutTimer.jsx';
import { getTodayTotals } from "./Wolfstorage.jsx";
import "./fitness.css";

/* ---------- Small inline icons ---------- */
const Flame = ({ size = 18, color = "#e8590c" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0 0 12 20a5 5 0 0 0 5-5c0-2-1-3.2-2-4.5-.4 1.2-1.1 1.8-1.8 2C13.6 9.5 13.5 5 12 2z" />
  </svg>
);

const Mic = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b1220" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="#0b1220" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
);

const Home = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" />
  </svg>
);

const Dumbbell = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 10v4M5 7v10M19 7v10M22 10v4M5 12h14M8 9v6M16 9v6" />
  </svg>
);

const Book = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#22e5ff" : "#9fb0c3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14" />
  </svg>
);

const User = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#22e5ff" : "#9fb0c3"} aria-hidden="true">
    <circle cx="12" cy="12" r="11" />
    <circle cx="12" cy="9.5" r="3.6" fill="#0d1626" />
    <path d="M5.5 19c1.3-3 3.8-4.4 6.5-4.4s5.2 1.4 6.5 4.4A10.8 10.8 0 0 1 12 23a10.8 10.8 0 0 1-6.5-4z" fill="#0d1626" />
  </svg>
);

const MuscleIcon = () => (
  <svg width="48" height="42" viewBox="0 0 52 46" fill="none" stroke="#8b7cf6" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <circle cx="26" cy="9" r="5" />
    <path d="M14 22c0-4 4-6 12-6s12 2 12 6v12H14z" />
    <path d="M14 22c-5-2-9 0-10 4 0 4 3 6 6 5M38 22c5-2 9 0 10 4 0 4-3 6-6 5" />
    <path d="M19 26h14M26 26v8M17 34v6h18v-6" />
  </svg>
);

const Sparkline = () => (
  <svg width="100%" height="48" viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden="true">
    <polyline fill="none" stroke="#9b6bff" strokeWidth="1.6" points="0,10 25,40 50,18 75,36 100,14 120,30" />
    <polyline fill="none" stroke="#cfd6e3" strokeWidth="1.2" opacity="0.6" points="0,34 25,22 50,44 75,24 100,40 120,32" />
  </svg>
);

/* ---------- Screen ---------- */
export default function FitnessHome({
  workout = { title: "CHEST & TRICEPS FOCUS", minutes: 45, exercises: 5 },
  calories = 1600, // الهدف اليومي (goal)
  streak = 10,
  volume = "14.2K",
  guidesViewed = 12,
  quote = {
    text: "Every action you take is a vote for the type of person you wish to become.",
    source: "From Atomic Habits by James Clear",
  },
  onStart = () => {},
  onAskFood = () => {},
  onNavigate = () => {},
  activeTab = "home",
}) {
  // نفس بيانات صفحة الأكل (WOLF): بتنقرأ كل ما الصفحة تنفتح
  const totals = getTodayTotals();

  // نسبة السعرات من الهدف (لشريط التقدم بالتصميم فقط)
  const percent = calories ? Math.min(100, Math.round(((Number(totals.calories) || 0) / calories) * 100)) : 0;

  const handleStartWorkout = () => {
    <Routes>
        <Route path="/workout" element={<Workout />} />
    </Routes>
     }
  return (
    <div className="fh-root">

      <div className="fh-screen">
        {/* Container for Desktop/Tablet centering */}
        <div className="fh-container">
          
          {/* Top bar */}
          <header className="fh-top">
            <div className="fh-avatar" aria-label="Profile photo" />
            <div className="fh-streak">
              <Flame size={20} color="#e8590c" />
              <span>{streak} DAYS<br />DISCIPLINE</span>
            </div>
          </header>

          <main className="fh-main">
            {/* Hero */}
            <section className="fh-card fh-hero">
              <h1>{workout.title}</h1>
              <p>{workout.minutes} Min / {workout.exercises} Exercises</p>
              <Link to="/workout" className="fh-cta flex items-center justify-center text-center">
                START WORKOUT
              </Link>
                
            </section>

            {/* Grid Area */}
            <div className="fh-layout-grid">
              
              {/* Primary Stats Grid */}
              <div className="fh-grid">
                <section className="fh-card fh-tile fh-orange">
                  <span className="fh-label">CALORIE GOAL</span>
                  <div className="fh-row">
                    <strong className="fh-big">{totals.calories}</strong>
                    <Flame size={34} color="#ff7a1a" />
                  </div>
                  <span className="fh-unit">KCAL TODAY / {calories} GOAL</span>
                  <div className="fh-progress">
                    <div className="fh-progress-bar" style={{ width: `${percent}%` }} />
                  </div>

                </section>

                <section className="fh-card fh-tile fh-teal" >
                  <span className="fh-label">CALORIE / FOOD AI</span>
                  <button className="fh-ask" onClick={onAskFood}>
                    <span className="fh-mic"><Mic /></span>
                   <Link to="./ai" className="fh-ask-link"> <span className="fh-ask-text">Enter your calorie intake</span></Link>
                  </button>
                </section>

                <section className="fh-card fh-tile fh-teal">
                  <span className="fh-label">VOLUME PUMPED</span>
                  <strong className="fh-big">{volume}</strong>
                  <Sparkline />
                </section>

                <section className="fh-card fh-tile fh-teal">
                  <span className="fh-label">MUSCLE GUIDE AI</span>
                  <div className="fh-guide">
                    <MuscleIcon />
                    <div className="fh-guide-count">
                      <strong>{guidesViewed}</strong>
                      <span>GUIDE<br />VIEWED</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar Quote on Desktop */}
              <section className="fh-card fh-quote">
                <span className="fh-quote-title">QUOTE OF THE DAY</span>
                <blockquote>"{quote.text}"</blockquote>
                <cite>{quote.source}</cite>
              </section>

            </div>
          </main>

          {/* Bottom nav: 4 icon buttons */}
          <nav className="fh-nav" aria-label="Main">
           <a href="/"> <button
              className="fh-tab"
              aria-label="Home"
              aria-current={activeTab === "home" ? "page" : undefined}
              onClick={() => onNavigate("home")}
            >
              <Home active={activeTab === "home"} />
            </button>
</a>
            <a href="/workout"> <button
              className="fh-tab"
              aria-label="Workout"
              aria-current={activeTab === "workout" ? "page" : undefined}
              onClick={() => onNavigate("workout")}
            >
              <Dumbbell active={activeTab === "workout"} />
            </button></a>

            <button
              className="fh-tab"
              aria-label="Guide"
              aria-current={activeTab === "guide" ? "page" : undefined}
              onClick={() => onNavigate("guide")}
            >
              <Book active={activeTab === "guide"} />
            </button>

            <button
              className="fh-tab"
              aria-label="Profile"
              aria-current={activeTab === "profile" ? "page" : undefined}
              onClick={() => onNavigate("profile")}
            >
              <User active={activeTab === "profile"} />
            </button>
          </nav>

        </div>
      </div>
    </div>
  );
}