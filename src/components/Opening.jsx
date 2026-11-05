// # 2026-11-05 | 첫 접속 시 회전 오프닝 재생 후 메인으로 자동 이동
import { useEffect } from 'react';
import './landing.css';

export default function Opening({ onComplete }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(onComplete, reducedMotion ? 0 : 2700);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="landing-view">
      <div id="opening" className="opening" aria-label="5PU5 오프닝">
        <svg className="opening-fan" viewBox="0 0 400 400" aria-hidden="true"
          onAnimationEnd={event => { if (event.animationName === 'openingSpin') onComplete(); }}>
          <g>
            <circle cx="200" cy="200" r="154" />
            <circle cx="200" cy="200" r="34" />
            <path d="M204 164C230 76 324 66 342 119c13 39-42 87-107 92 81 28 99 121 48 146-38 18-91-31-99-99-24 82-116 105-144 57-21-36 25-94 93-106-84-20-112-109-66-141 34-24 95 18 111 84 5 20 19 29 26 12Z" />
          </g>
        </svg>
        <img src="/assets/5PU5-master.svg" width="142" height="60" alt="5PU5" />
        <p>GPU CLOUD PRICE INTELLIGENCE</p>
      </div>
    </div>
  );
}
