// # 2026-11-05 | GPU 선택 상태와 양쪽 여백·스크롤 인덱스를 구성하는 메인 화면
import { useEffect, useState } from 'react';
import GpuNavigation from './components/GpuNavigation.jsx';
import SectionIndex from './components/SectionIndex.jsx';
import Landing from './components/Landing.jsx';
import Footer from './components/Footer.jsx';

const sections = [
  { id: 'price-history', label: '가격추이' },
  { id: 'price-comparison', label: '가격비교' },
  { id: 'comparison-guide', label: '비교기준' },
];

export default function App() {
  // # 2026-11-05 | 로그인 없이 랜딩과 메인 화면 사이를 전환
  const [dashboard, setDashboard] = useState(() => new URLSearchParams(window.location.search).get('landing') !== '1');
  const [opening, setOpening] = useState(false);
  const [selectedGpu, setSelectedGpu] = useState('B300');
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const timer = setTimeout(() => setOpening(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  function showDashboard() {
    setOpening(false);
    setDashboard(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showLanding() {
    setOpening(false);
    setDashboard(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // # 2026-11-05 | 스크롤 위치에 맞춰 왼쪽 인덱스의 선택 표시 갱신
  useEffect(() => {
    if (!dashboard) return;
    function updateActiveSection() {
      let current = sections[0].id;
      for (const section of sections) {
        if (document.getElementById(section.id)?.getBoundingClientRect().top <= 140) {
          current = section.id;
        }
      }
      setActiveSection(current);
    }
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [dashboard]);

  if (!dashboard) {
    return (
      <div className="landing-view">
        <Landing opening={opening} dashboard={false} setOpening={setOpening}
          showDashboard={showDashboard} openAuth={showDashboard} />
      </div>
    );
  }

  return (
    <div className="gpu-preview-shell">
      <GpuNavigation
        selectedGpu={selectedGpu}
        onGpuChange={setSelectedGpu}
        onHome={showDashboard}
      />
      <main id="main-content" className="gpu-preview-content" tabIndex={-1}>
        <SectionIndex sections={sections} activeSection={activeSection} />
        <div className="gpu-section-stack">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="gpu-content-section" aria-labelledby={`${section.id}-title`}>
              <h1 id={`${section.id}-title`}>{section.label}</h1>
            </section>
          ))}
        </div>
      </main>
      <Footer onAbout={showLanding} onGpuChange={(gpu) => {
        setSelectedGpu(gpu);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
