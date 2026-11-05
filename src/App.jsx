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
  // # 2026-11-05 | 적용한 조건은 모델별로 부모에서 보관. 실제 가격 조회는 API 연결 후 구현
  const [filtersByModel, setFiltersByModel] = useState({});
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
            {filtersByModel[selectedGpu] && <p className="applied-filter-summary" role="status">
              적용 조건 · {({on_demand:'On-Demand',spot:'Spot',reserved:'Reserved'})[filtersByModel[selectedGpu].billingType]}
              {filtersByModel[selectedGpu].contractMonths !== 'all' ? ` ${filtersByModel[selectedGpu].contractMonths}개월` : ''}
              {' · '}{({all:'전체 리전','us-east':'US East','us-west':'US West',eu:'EU'})[filtersByModel[selectedGpu].region]}
              {' · '}{({all:'전체 사업자',runpod:'Runpod',seeweb:'Seeweb',daytona:'Daytona'})[filtersByModel[selectedGpu].provider]}
              {selectedGpu === 'H100' && <> · {filtersByModel[selectedGpu].memory.map(v => Math.max(80, Math.min(94, v))).join('–')} GB/GPU</>}
              {' · '}{filtersByModel[selectedGpu].gpuCount.join('–')}장
              {' · $'}{filtersByModel[selectedGpu].price.join('–$')} / GPU-hour · 시안용, 가격 조회 미연결
            </p>}
          </header>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="gpu-content-section" aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.label}</h2>
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
