// # 2026-11-05 | GPU 선택 상태와 양쪽 여백·스크롤 인덱스를 구성하는 메인 화면
import { useEffect, useState } from 'react';
import GpuNavigation from './components/GpuNavigation.jsx';
import SectionIndex from './components/SectionIndex.jsx';
import Landing from './components/Landing.jsx';
import Footer from './components/Footer.jsx';
import Opening from './components/Opening.jsx';
import PriceSummary from './components/PriceSummary.jsx';
import { createDefaultFilters } from './utils/filterDefaults.js';

const sections = [
  { id: 'price-history', label: '가격 현황' },
  { id: 'price-comparison', label: '가격비교' },
  { id: 'comparison-guide', label: '비교기준' },
];

export default function App() {
  // # 2026-11-05 | 로그인 없이 랜딩과 메인 화면 사이를 전환
  const [dashboard, setDashboard] = useState(() => new URLSearchParams(window.location.search).get('landing') !== '1');
  const [opening, setOpening] = useState(true);
  const [selectedGpu, setSelectedGpu] = useState('B300');
  // # 2026-11-05 | 적용한 조건은 모델별로 부모에서 보관. 실제 가격 조회는 API 연결 후 구현
  const [filtersByModel, setFiltersByModel] = useState({});
  const [activeSection, setActiveSection] = useState(sections[0].id);

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
    if (!dashboard || opening) return;
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
  }, [dashboard, opening]);

  // # 2026-11-05 | 회전이 끝나면 소개 페이지를 거치지 않고 메인으로 바로 이동
  if (opening) return <Opening onComplete={showDashboard} />;

  if (!dashboard) {
    return (
      <>
      {/* # 2026-11-05 | 사업 소개와 메인이 같은 GPU 상단바 사용 */}
      <GpuNavigation
        selectedGpu={selectedGpu}
        onGpuChange={(gpu) => {
          setSelectedGpu(gpu);
          showDashboard();
        }}
        onHome={showDashboard}
        filtersByModel={filtersByModel}
        onApplyFilters={(model, filters) => {
          setSelectedGpu(model);
          setFiltersByModel(current => ({ ...current, [model]: filters }));
          showDashboard();
        }}
      />
      <div className="landing-view">
        <Landing opening={opening} dashboard={false} setOpening={setOpening}
          showDashboard={showDashboard} />
      </div>
      {/* # 2026-11-05 | 사업 소개에서도 메인과 동일한 공통 푸터 사용 */}
      <Footer onAbout={showLanding} onGpuChange={(gpu) => {
        setSelectedGpu(gpu);
        showDashboard();
      }} />
      </>
    );
  }

  return (
    <div className="gpu-preview-shell">
      <GpuNavigation
        selectedGpu={selectedGpu}
        onGpuChange={setSelectedGpu}
        onHome={showDashboard}
        filtersByModel={filtersByModel}
        onApplyFilters={(model, filters) => {
          setSelectedGpu(model);
          setFiltersByModel(current => ({...current, [model]: filters}));
        }}
      />
      <main id="main-content" className="gpu-preview-content" tabIndex={-1}>
        <SectionIndex sections={sections} activeSection={activeSection} />
        <div className="gpu-section-stack">
          {/* # 2026-11-05 | 클릭으로 선택한 GPU 모델명을 본문 상단에 크게 표시 */}
          <header className="gpu-product-heading">
            <h1>{selectedGpu}</h1>
            <p>GPU 클라우드 가격 비교</p>

          </header>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="gpu-content-section" aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.label}</h2>
              {/* # 2026-11-06 | 가격추이 상단에 선택 모델의 가격 요약 표시 */}
              {section.id === 'price-history' && <PriceSummary
                model={selectedGpu}
                billingType={filtersByModel[selectedGpu]?.billingType || 'on_demand'}
                onBillingTypeChange={billingType => setFiltersByModel(current => ({
                  ...current,
                  [selectedGpu]: {
                    ...(current[selectedGpu] || createDefaultFilters()),
                    billingType,
                    contractMonths: 'all',
                  },
                }))}
              />}
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
