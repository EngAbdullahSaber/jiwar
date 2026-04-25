import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export const Loading = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 38);

    const phaseTimer1 = setTimeout(() => setPhase(1), 600);
    const phaseTimer2 = setTimeout(() => setPhase(2), 1200);
    const navTimer = setTimeout(() => {
      const nextPath = localStorage.getItem("nextPath") || "/login";
      localStorage.removeItem("nextPath");
      setLocation(nextPath);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(navTimer);
    };
  }, [setLocation]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Cairo:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        .loading-root {
          font-family: 'Inter', 'Cairo', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1008;
          position: relative;
          overflow: hidden;
        }

        /* Grain texture overlay */
        .loading-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
        }

        /* Warm radial glow */
        .bg-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .bg-glow-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(187,158,128,0.12) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          animation: glowDrift 8s ease-in-out infinite alternate;
        }

        .bg-glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(103,31,35,0.15) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          animation: glowDrift 10s ease-in-out infinite alternate-reverse;
        }

        @keyframes glowDrift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(30px, 20px) scale(1.1); }
        }

        /* Geometric corner ornaments */
        .corner {
          position: absolute;
          width: 60px;
          height: 60px;
          pointer-events: none;
        }
        .corner-tl { top: 32px; left: 32px; border-top: 1px solid rgba(187,158,128,0.4); border-left: 1px solid rgba(187,158,128,0.4); }
        .corner-tr { top: 32px; right: 32px; border-top: 1px solid rgba(187,158,128,0.4); border-right: 1px solid rgba(187,158,128,0.4); }
        .corner-bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(187,158,128,0.4); border-left: 1px solid rgba(187,158,128,0.4); }
        .corner-br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(187,158,128,0.4); border-right: 1px solid rgba(187,158,128,0.4); }

        /* Center content */
        .loading-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
          z-index: 10;
          position: relative;
        }

        /* Logo area */
        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-img {
          width: 130px;
          height: auto;
          filter: brightness(1.15) saturate(0.9);
        }

        .logo-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(187,158,128,0.6), transparent);
          opacity: 0;
          animation: fadeUp 0.6s ease 0.9s forwards;
        }

        /* Arabic-inspired tagline */
        .tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.2em;
          color: rgba(187,158,128,0.7);
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 0.6s ease 1s forwards;
        }

        /* Progress section */
        .progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 240px;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.5s forwards;
        }

        /* Thin geometric progress bar */
        .progress-track {
          width: 100%;
          height: 1px;
          background: rgba(187,158,128,0.15);
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, rgba(187,158,128,0.4), rgba(187,158,128,1), rgba(187,158,128,0.4));
          transition: width 0.1s linear;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #bb9e80;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(187,158,128,0.8);
        }

        /* Diamond tick marks */
        .tick-marks {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .tick {
          width: 4px;
          height: 4px;
          background: rgba(187,158,128,0.25);
          transform: rotate(45deg);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .tick.active {
          background: rgba(187,158,128,0.9);
          box-shadow: 0 0 6px rgba(187,158,128,0.5);
        }

        .status-text {
          font-family: 'Inter', 'Cairo', sans-serif;
          font-weight: 200;
          font-size: 11px;
          letter-spacing: 0.35em;
          color: rgba(187,158,128,0.5);
          text-transform: uppercase;
        }

        /* Pulsing ring ornament above logo */
        .ring-ornament {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(187,158,128,0.08);
          animation: ringPulse 3s ease-in-out infinite;
        }

        .ring-ornament-2 {
          width: 280px;
          height: 280px;
          border: 1px solid rgba(187,158,128,0.04);
          animation: ringPulse 3s ease-in-out infinite 0.5s;
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
      `}</style>

      <div className="loading-root">
        <div className="bg-glow bg-glow-1" />
        <div className="bg-glow bg-glow-2" />

        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        <div className="ring-ornament" style={{ position: 'absolute' }} />
        <div className="ring-ornament ring-ornament-2" style={{ position: 'absolute' }} />

        <div className="loading-center">
          <div className="logo-wrap">
            <img
              className="logo-img"
              alt="Jiwar Logo"
              src="/figmaAssets/layer-1.png"
            />
            <div className="logo-divider" />
            <span className="tagline">{t("loading.tagline")}</span>
          </div>

          <div className="progress-wrap">
            <div className="tick-marks">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`tick ${phase >= Math.floor(i * 0.4) ? 'active' : ''}`} />
              ))}
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <span className="status-text">
              {progress < 40 ? t("loading.initializing") : progress < 80 ? t("loading.loadingAssets") : t("loading.ready")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};