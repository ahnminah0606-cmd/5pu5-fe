// # 2026-11-05 | 초기 시작·소개 화면. 시작 버튼은 로그인 없이 메인 화면으로 이동
import './landing.css';
export default function Landing({
  opening,
  dashboard,
  setOpening,
  showDashboard,
  openAuth,
}) {
  return (
    <>
      {' '}
      <div
        id="opening"
        aria-label="5PU5 오프닝"
        className={opening ? 'opening' : 'opening done'}
      >
        <svg className="opening-fan" viewBox="0 0 400 400" aria-hidden="true">
          <g>
            <circle cx="200" cy="200" r="154"></circle>
            <circle cx="200" cy="200" r="34"></circle>
            <path d="M204 164C230 76 324 66 342 119c13 39-42 87-107 92 81 28 99 121 48 146-38 18-91-31-99-99-24 82-116 105-144 57-21-36 25-94 93-106-84-20-112-109-66-141 34-24 95 18 111 84 5 20 19 29 26 12Z"></path>
          </g>
        </svg>
        <img src="assets/5PU5-master.svg" width="142" height="60" alt="5PU5" />
        <p>GPU CLOUD PRICE INTELLIGENCE</p>
        <button
          id="skip-opening"
          type="button"
          onClick={() => setOpening(false)}
        >
          오프닝 건너뛰기
        </button>
      </div>
      <section
        id="landing"
        aria-labelledby="landing-title"
        className={opening ? 'landing pre-reveal' : 'landing'}
        hidden={dashboard}
      >
        <header className="landing-header">
          <a className="landing-brand" href="#landing" aria-label="5PU5 홈">
            <img
              src="assets/5PU5-master.svg"
              width="92"
              height="38"
              alt="5PU5"
            />
          </a>
          <nav className="landing-nav" aria-label="랜딩 메뉴">
            <a href="#landing-benefits">가격 비교</a>
            <a href="#landing-benefits">변동 추적</a>
            <a href="#landing-benefits">AI 분석</a>
          </nav>
          <button
            className="nav-demo-button"
            id="nav-demo-button"
            type="button"
            onClick={showDashboard}
          >
            데모 열기 <span aria-hidden="true">↗</span>
          </button>
        </header>
        <div className="hero-content">
          <p className="hero-pill">
            <span aria-hidden="true"></span> GPU CLOUD PRICE INTELLIGENCE
          </p>
          <h1 id="landing-title">
            GPU 가격 비교.
            <br />
            <em>더 쉽고, 더 명확하게.</em>
          </h1>
          <p className="hero-copy">
            흩어진 클라우드 GPU 가격을 하나의 기준으로 비교하세요.
            <br />
            약정 할인부터 최근 변동까지, 필요한 판단만 선명하게.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button hero-primary"
              id="start-button"
              type="button"
              onClick={openAuth}
            >
              무료로 시작하기 <span aria-hidden="true">→</span>
            </button>
            <button
              className="secondary-button hero-secondary"
              id="demo-button"
              type="button"
              onClick={showDashboard}
            >
              대시보드 미리보기
            </button>
          </div>
          <p className="demo-note">
            외부 계정 · API 키 없이 실행되는 가상 데이터 데모
          </p>
        </div>
        <section
          className="feature-showcase"
          id="landing-benefits"
          aria-label="서비스 기능"
        >
          <article className="feature-overview">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16"></path>
                <path d="M9 4v16m6-16v16"></path>
              </svg>
            </div>
            <h2>흩어진 GPU 가격, 하나의 기준으로.</h2>
            <p>
              같은 세대의 GPU를 사업자와 계약기간별로 비교하고, 가격의 흐름까지
              확인하세요.
            </p>
            <div className="feature-metrics">
              <div>
                <strong>GPU 세대</strong>
                <span>동일 사양으로 비교</span>
              </div>
              <div>
                <strong>사업자</strong>
                <span>업체별 가격을 나란히</span>
              </div>
              <div>
                <strong>계약기간</strong>
                <span>온디맨드 · 1년 · 3년</span>
              </div>
              <div>
                <strong>가격 이력</strong>
                <span>변경 시점과 변동 폭</span>
              </div>
            </div>
          </article>
          <div className="feature-grid">
            <article className="feature-tile">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16"></path>
                  <path d="M9 4v16m6-16v16"></path>
                </svg>
              </div>
              <h3>조건에 맞춰 비교</h3>
              <p>
                GPU 세대와 지역을 고르면, 사업자별 가격과 약정 할인율이 한눈에
                펼쳐집니다.
              </p>
              <div className="feature-tags" aria-hidden="true">
                <span>GPU 세대</span>
                <span>사업자</span>
                <span>계약기간</span>
              </div>
            </article>
            <article className="feature-tile">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4v16h16M7 15l4-5 4 2 5-7"></path>
                </svg>
              </div>
              <h3>가격의 흐름을 읽다</h3>
              <p>
                시간순 차트에서 가격이 바뀐 시점과 금액, 변동률을 함께
                확인하세요.
              </p>
              <svg
                className="feature-spark"
                viewBox="0 0 300 85"
                aria-hidden="true"
              >
                <path
                  d="M5 20H95V38H180V65H295"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                ></path>
                <circle cx="180" cy="65" r="4" fill="currentColor"></circle>
              </svg>
            </article>
            <article className="feature-tile">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z"></path>
                  <path d="M7 9h10m-10 4h6"></path>
                </svg>
              </div>
              <h3>궁금한 건, 바로 질문</h3>
              <p>
                선택한 GPU와 조건을 바탕으로 AI에게 묻고, 비교표에서 답변의
                근거를 확인하세요.
              </p>
              <div className="feature-quote">
                “1년 약정이면 어디가 저렴할까?”<span aria-hidden="true">↗</span>
              </div>
            </article>
            <article className="feature-tile">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 2"></path>
                </svg>
              </div>
              <h3>관심 GPU를 이어서</h3>
              <p>
                최근 본 GPU의 최저가와 제공 업체를 모아 보고, 달라진 가격을
                빠르게 확인하세요.
              </p>
              <div className="feature-tags" aria-hidden="true">
                <span>H100</span>
                <span>A100</span>
                <span>H200</span>
              </div>
            </article>
          </div>
        </section>
        <section className="landing-final" aria-label="시작하기">
          <p className="final-eyebrow">LESS SEARCH. MORE CLARITY.</p>
          <h2>
            다음 GPU 선택을,
            <br />
            <em>더 명확하게.</em>
          </h2>
          <p>가격 비교부터 변동 추적까지. 5PU5에서 한 번에.</p>
          <button
            className="primary-button"
            type="button"
            data-open-dashboard
            onClick={showDashboard}
          >
            GPU 가격 비교하기 <span aria-hidden="true">↗</span>
          </button>
        </section>
        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#landing" aria-label="5PU5 처음으로">
                <img
                  src="assets/5PU5-master.svg"
                  width="105"
                  height="44"
                  alt="5PU5"
                />
              </a>
              <p>
                GPU 가격을 비교하는
                <br />더 명확한 기준.
              </p>
              <span className="footer-status">
                <i></i>프론트엔드 데모
              </span>
            </div>
            <div className="footer-column">
              <h3>서비스</h3>
              <button type="button" data-open-dashboard onClick={showDashboard}>
                GPU 가격 비교
              </button>
              <button type="button" data-open-dashboard onClick={showDashboard}>
                가격 변동 추이
              </button>
              <button type="button" data-open-dashboard onClick={showDashboard}>
                AI 질문
              </button>
            </div>
            <div className="footer-column">
              <h3>둘러보기</h3>
              <a href="#landing-benefits">주요 기능</a>
              <button type="button" data-open-dashboard onClick={showDashboard}>
                대시보드 열기
              </button>
              <a href="#landing">맨 위로 ↑</a>
            </div>
            <div className="footer-column footer-about">
              <h3>5PU5 · 오푸스</h3>
              <p>
                SKALA 팀 프로젝트
                <br />
                GPU 클라우드 가격 비교 서비스
              </p>
              <p className="footer-demo-note">
                현재 가격과 AI 답변은
                <br />
                시연용 가상 데이터입니다.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 5PU5</span>
            <span>GPU CLOUD PRICE INTELLIGENCE</span>
          </div>
        </footer>
      </section>{' '}
    </>
  );
}
