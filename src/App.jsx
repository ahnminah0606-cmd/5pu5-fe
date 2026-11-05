import { useEffect, useMemo, useRef, useState } from 'react';
import Landing from './components/Landing.jsx';
import GpuCard from './components/GpuCard.jsx';
import PriceChart, { historyChanges } from './components/PriceChart.jsx';
import {
  catalog,
  contractMap,
  providerColors,
  COLLECTED_AT,
} from './services/data.js';
import {
  fetchPrices,
  buildRecentCards,
  askAssistant,
  demoAuth,
} from './services/marketApi.js';
const money = (n) => `$${n.toFixed(2)}`;
const rate = (a, b) => ((b / a - 1) * 100).toFixed(1);
const storage = {
  get(key, fallback = '') {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Storage can be disabled by the browser. */
    }
  },
};
const viewLabels = {
  home: '홈',
  compare: 'GPU 비교',
  trend: '가격 추이',
  recent: '최근 본 GPU',
};
export default function App() {
  const [dashboard, setDashboard] = useState(() => {
    const q = new URLSearchParams(location.search);
    return (
      q.get('demo') === '1' ||
      (q.get('landing') !== '1' &&
        storage.get('5pu5-demo-session') === 'active')
    );
  });
  const [opening, setOpening] = useState(!dashboard);
  const [filters, setFilters] = useState({
    gpu: 'H100',
    provider: 'all',
    region: '서울',
    contract: 'all',
  });
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0),
    [status, setStatus] = useState('');
  const [historyRange, setHistoryRange] = useState(30),
    [view, setView] = useState('home'),
    [mobileLayer, setMobileLayer] = useState(null),
    [aiVisible, setAiVisible] = useState(true),
    [source, setSource] = useState(null),
    [highlight, setHighlight] = useState('');
  const [authMode, setAuthMode] = useState('login'),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [authError, setAuthError] = useState(''),
    [authBusy, setAuthBusy] = useState(false);
  const [question, setQuestion] = useState(''),
    [sending, setSending] = useState(false),
    [messages, setMessages] = useState([
      {
        role: 'assistant',
        text: '현재 선택 조건에 맞춰 가격을 비교해 드릴게요. 추천 질문을 선택하거나 직접 물어보세요.',
        source: '시연용 AI · 가상 데이터',
      },
    ]);
  const [recent, setRecent] = useState(() => {
    try {
      const v = JSON.parse(storage.get('5pu5-recent', '[]'));
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  });
  const authRef = useRef(null),
    sourceRef = useRef(null),
    chatEndRef = useRef(null),
    sendingRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 1900);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPrices(filters)
      .then((result) => {
        if (active) setRows(result);
      })
      .catch((e) => {
        if (active) {
          setRows([]);
          setStatus(e.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters, refresh]);
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(''), 3000);
    return () => clearTimeout(t);
  }, [status]);
  useEffect(() => {
    if (source && !sourceRef.current.open) sourceRef.current.showModal();
  }, [source]);
  useEffect(() => {
    const chat = chatEndRef.current?.parentElement;
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [messages, sending]);
  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') setMobileLayer(null);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
  useEffect(() => {
    if (dashboard) document.getElementById('main-content')?.focus();
  }, [dashboard]);
  const context = `${catalog[filters.gpu].label} · ${filters.region} · ${filters.provider === 'all' ? '전체 사업자' : filters.provider} · ${contractMap[filters.contract]}`;
  const changes = useMemo(
    () => historyChanges(rows, filters.contract, historyRange),
    [rows, filters.contract, historyRange],
  );
  const recentCards = useMemo(() => {
    const all = buildRecentCards();
    return [
      ...recent.map((key) => all.find((c) => c.gpu === key)).filter(Boolean),
      ...all.filter((c) => !recent.includes(c.gpu)),
    ].slice(0, 3);
  }, [recent]);
  function showDashboard() {
    setOpening(false);
    setDashboard(true);
    storage.set('5pu5-demo-session', 'active');
  }
  function showLanding() {
    setDashboard(false);
    setMobileLayer(null);
    storage.set('5pu5-demo-session', '');
    setOpening(false);
    document.getElementById('start-button')?.focus();
    window.scrollTo(0, 0);
  }
  function navigate(next) {
    setView(next);
    setMobileLayer(null);
    document
      .getElementById(
        {
          home: 'main-content',
          compare: 'compare-section',
          trend: 'trend-section',
          recent: 'recent-section',
        }[next],
      )
      ?.scrollIntoView({ behavior: 'smooth' });
  }
  function compareGpu(gpu) {
    setFilters((f) => ({ ...f, gpu }));
    setRecent((old) => {
      const next = [gpu, ...old.filter((x) => x !== gpu)].slice(0, 3);
      storage.set('5pu5-recent', JSON.stringify(next));
      return next;
    });
    document
      .getElementById('compare-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function highlightProvider(provider) {
    if (!rows.some((r) => r.provider === provider)) {
      setStatus('현재 필터에서 해당 사업자 행을 찾을 수 없습니다.');
      return;
    }
    setHighlight('');
    requestAnimationFrame(() => setHighlight(provider));
    setMobileLayer(null);
    document
      .querySelector(`[data-provider="${provider}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  async function submitAuth(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      setAuthError('아래 입력 항목을 확인해 주세요.');
      return;
    }
    setAuthError('');
    setAuthBusy(true);
    try {
      await demoAuth({ email, password });
      authRef.current.close();
      setPassword('');
      showDashboard();
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthBusy(false);
    }
  }
  async function sendQuestion(preset) {
    const q = (preset || question).trim();
    if (!q || sendingRef.current || loading) return;
    sendingRef.current = true;
    setQuestion('');
    setSending(true);
    setMessages((old) => [...old, { role: 'user', text: q }]);
    try {
      const answer = await askAssistant(q, filters, rows);
      setMessages((old) => [...old, { role: 'assistant', ...answer }]);
    } catch {
      setMessages((old) => [
        ...old,
        {
          role: 'assistant',
          text: '답변을 불러오지 못했어요. 다시 시도해 주세요.',
        },
      ]);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <Landing
        opening={opening}
        dashboard={dashboard}
        setOpening={setOpening}
        showDashboard={showDashboard}
        openAuth={() => {
          setAuthError('');
          setEmail('');
          setPassword('');
          authRef.current.showModal();
          document.getElementById('auth-email')?.focus();
        }}
      />
      <dialog
        className="auth-dialog"
        id="auth-dialog"
        aria-labelledby="auth-title"
        ref={authRef}
      >
        <button
          className="dialog-close"
          id="auth-close"
          type="button"
          aria-label="로그인 창 닫기"
          onClick={() => authRef.current.close()}
        >
          ×
        </button>
        <img src="assets/5PU5-master.svg" width="96" height="40" alt="5PU5" />
        <p className="eyebrow dark">DEMO SESSION</p>
        <h2 id="auth-title">대시보드 시작하기</h2>
        <p className="dialog-intro">
          입력값은 데모 세션 확인에만 사용되며 저장되지 않습니다. 실제
          비밀번호를 입력하지 마세요.
        </p>
        <div className="auth-tabs" role="tablist" aria-label="인증 방식">
          <button
            type="button"
            role="tab"
            data-auth="login"
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            aria-selected={authMode === 'login'}
            onClick={() => setAuthMode('login')}
          >
            로그인
          </button>
          <button
            type="button"
            role="tab"
            data-auth="signup"
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
            aria-selected={authMode === 'signup'}
            onClick={() => setAuthMode('signup')}
          >
            회원가입
          </button>
        </div>
        <form id="auth-form" noValidate onSubmit={submitAuth}>
          <div
            className="form-summary"
            id="form-summary"
            role="alert"
            hidden={!authError}
          >
            {authError}
          </div>
          <label htmlFor="auth-email">이메일</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="demo@5pu5.kr"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p
            className="field-error"
            id="email-error"
            hidden={!authError || /^\S+@\S+\.\S+$/.test(email)}
          >
            올바른 이메일 형식으로 입력해 주세요.
          </p>
          <label htmlFor="auth-password">데모 비밀번호</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete="off"
            placeholder="6자 이상 입력"
            minLength="6"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p
            className="field-error"
            id="password-error"
            hidden={!authError || password.length >= 6}
          >
            6자 이상 입력해 주세요. 실제 비밀번호는 사용하지 마세요.
          </p>
          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={authBusy}
          >
            {authBusy
              ? '데모 세션 준비 중…'
              : authMode === 'login'
                ? '데모 세션 시작'
                : '데모 계정 만들기'}
          </button>
        </form>
      </dialog>
      <div
        className={`app-shell ${aiVisible ? '' : 'ai-collapsed'}`}
        id="app-shell"
        hidden={!dashboard}
      >
        <div
          className="mobile-scrim"
          id="mobile-scrim"
          hidden={!mobileLayer}
          onClick={() => setMobileLayer(null)}
        ></div>
        <aside
          id="sidebar"
          aria-label="주요 메뉴"
          className={`sidebar ${mobileLayer === 'menu' ? 'open' : ''}`}
        >
          <div className="sidebar-top">
            <img
              className="sidebar-logo"
              src="assets/5PU5-master.svg"
              width="100"
              height="42"
              alt="5PU5"
            />
            <button
              className="mobile-close"
              id="menu-close"
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMobileLayer(null)}
            >
              ×
            </button>
          </div>
          <nav>
            <button
              type="button"
              data-view="home"
              className={`nav-item ${view === 'home' ? 'active' : ''}`}
              onClick={() => navigate('home')}
            >
              <span className="nav-icon" aria-hidden="true">
                ⌂
              </span>
              홈
            </button>
            <button
              type="button"
              data-view="compare"
              className={`nav-item ${view === 'compare' ? 'active' : ''}`}
              onClick={() => navigate('compare')}
            >
              <span className="nav-icon" aria-hidden="true">
                ▦
              </span>
              GPU 비교
            </button>
            <button
              type="button"
              data-view="trend"
              className={`nav-item ${view === 'trend' ? 'active' : ''}`}
              onClick={() => navigate('trend')}
            >
              <span className="nav-icon" aria-hidden="true">
                ↗
              </span>
              가격 추이
            </button>
            <button
              type="button"
              data-view="recent"
              className={`nav-item ${view === 'recent' ? 'active' : ''}`}
              onClick={() => navigate('recent')}
            >
              <span className="nav-icon" aria-hidden="true">
                ◷
              </span>
              최근 본 GPU
            </button>
          </nav>
          <div className="sidebar-account">
            <div className="profile-row">
              <span className="avatar">민</span>
              <span>
                <strong>민아</strong>
                <small>데모 사용자</small>
              </span>
            </div>
            <button
              className="logout-button"
              id="logout-button"
              type="button"
              onClick={showLanding}
            >
              <span aria-hidden="true">↪</span> 로그아웃
            </button>
          </div>
        </aside>

        <main className="workspace" id="main-content" tabIndex="-1">
          <header className="workspace-header">
            <button
              className="mobile-icon-button"
              id="menu-open"
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setMobileLayer('menu')}
            >
              ☰
            </button>
            <div>
              <p className="breadcrumb">
                5PU5 / <span id="section-label">{viewLabels[view]}</span>
              </p>
              <h1>GPU 가격 대시보드</h1>
            </div>
            <div className="header-meta">
              <span>
                최근 수집 <strong id="collected-header">{COLLECTED_AT}</strong>
              </span>
              <button
                className="icon-button"
                id="refresh-button"
                type="button"
                aria-label="가격 데이터 새로고침"
                onClick={() => {
                  setRefresh((n) => n + 1);
                  setStatus('가상 데이터를 다시 불러왔습니다.');
                }}
              >
                ↻
              </button>
              <button
                className="mobile-ai-button"
                id="ai-open"
                type="button"
                onClick={() => {
                  setAiVisible(true);
                  setMobileLayer('ai');
                }}
              >
                5PU5 AI
              </button>
            </div>
          </header>

          <section
            className="status-banner"
            id="status-banner"
            role="status"
            hidden={!status}
          >
            {status}
          </section>

          <section
            className="content-section"
            id="recent-section"
            aria-labelledby="recent-heading"
          >
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">RECENTLY VIEWED</p>
                <h2 id="recent-heading">최근 본 GPU</h2>
              </div>
              <span className="virtual-badge">● 가상 데이터</span>
            </div>
            <div className="gpu-card-grid" id="gpu-cards">
              {recentCards.map((card) => (
                <GpuCard key={card.gpu} card={card} onCompare={compareGpu} />
              ))}
            </div>
          </section>

          <section
            className="content-section"
            id="compare-section"
            aria-labelledby="compare-heading"
            aria-busy={loading}
          >
            <div className="section-heading-row align-end">
              <div>
                <p className="section-kicker">PRICE MATRIX</p>
                <h2 id="compare-heading">사업자 · 계약기간별 가격 비교</h2>
              </div>
              <span className="unit-label">USD / GPU · 시간</span>
            </div>
            <div className="filter-grid" aria-label="가격 비교 필터">
              <label>
                GPU 세대
                <select
                  id="gpu-filter"
                  value={filters.gpu}
                  disabled={loading}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, gpu: e.target.value }))
                  }
                >
                  {Object.keys(catalog).map((gpu) => (
                    <option key={gpu}>{gpu}</option>
                  ))}
                </select>
              </label>
              <label>
                사업자
                <select
                  id="provider-filter"
                  value={filters.provider}
                  disabled={loading}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, provider: e.target.value }))
                  }
                >
                  <option value="all">전체 사업자</option>
                  {['A회사', 'B회사', 'C회사'].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                지역
                <select
                  id="region-filter"
                  value={filters.region}
                  disabled={loading}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, region: e.target.value }))
                  }
                >
                  {['서울', '도쿄', '싱가포르'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label>
                계약기간
                <select
                  id="contract-filter"
                  value={filters.contract}
                  disabled={loading}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, contract: e.target.value }))
                  }
                >
                  {Object.entries(contractMap).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="filter-context" id="filter-context">
              {loading ? '가상 가격 데이터를 불러오는 중…' : context}
            </div>
            <div
              className="mascot-loading"
              id="price-loading"
              role="status"
              hidden={!loading}
            >
              <img
                src="assets/5pu5-loading.svg"
                alt=""
                width="144"
                height="84"
              />
              <span>GPU 가격을 살펴보고 있어요…</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">사업자</th>
                    <th scope="col">온디맨드</th>
                    <th scope="col">1년 약정</th>
                    <th scope="col">3년 약정</th>
                    <th scope="col">출처</th>
                  </tr>
                </thead>
                <tbody id="price-table-body">
                  {rows.map((row) => (
                    <tr
                      key={row.provider}
                      data-provider={row.provider}
                      className={highlight === row.provider ? 'highlight' : ''}
                    >
                      <td>
                        <span className="provider-name">{row.provider}</span>
                        <br />
                        <small>{row.region}</small>
                      </td>
                      {['onDemand', 'year1', 'year3'].map((key) => (
                        <td
                          key={key}
                          style={{
                            color:
                              filters.contract !== 'all' &&
                              filters.contract !== key
                                ? '#9aa3ad'
                                : undefined,
                          }}
                        >
                          {money(row[key])}{' '}
                          {key !== 'onDemand' && (
                            <span className="discount">
                              -{Math.round((1 - row[key] / row.onDemand) * 100)}
                              %
                            </span>
                          )}
                        </td>
                      ))}
                      <td>
                        <button
                          className="source-button"
                          onClick={() => setSource(row)}
                        >
                          출처 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className="empty-state"
                id="table-empty"
                hidden={rows.length > 0 || loading}
              >
                <strong>조건에 맞는 가격이 없습니다.</strong>
                <span>필터를 변경해 다시 확인해 주세요.</span>
              </div>
            </div>
          </section>

          <section className="analytics-grid" id="trend-section">
            <article
              className="content-section chart-card"
              aria-labelledby="trend-heading"
            >
              <div className="section-heading-row align-end">
                <div>
                  <p className="section-kicker">PRICE HISTORY</p>
                  <h2 id="trend-heading">가격 변동 추이</h2>
                  <p className="chart-context" id="chart-context">
                    {filters.gpu} · {contractMap[filters.contract]} · 최근{' '}
                    {historyRange}일
                  </p>
                </div>
                <div className="chart-controls">
                  <label htmlFor="history-range">조회 기간</label>
                  <select
                    id="history-range"
                    value={historyRange}
                    onChange={(e) => setHistoryRange(Number(e.target.value))}
                  >
                    <option value="7">최근 7일</option>
                    <option value="30">최근 30일</option>
                    <option value="90">최근 90일</option>
                  </select>
                  <div className="chart-legend" id="chart-legend">
                    {rows.map((row) => (
                      <span key={row.provider}>
                        <span
                          className="legend-dot"
                          style={{ background: providerColors[row.provider] }}
                        />
                        {row.provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="chart-shell">
                <svg
                  id="price-chart"
                  viewBox="0 0 760 300"
                  role="img"
                  aria-label="선택한 GPU의 사업자별 시간순 가격 차트"
                >
                  <PriceChart
                    rows={rows}
                    contract={filters.contract}
                    range={historyRange}
                  />
                </svg>
              </div>
            </article>
            <article
              className="content-section history-card"
              aria-labelledby="history-heading"
            >
              <div>
                <p className="section-kicker">CHANGE LOG</p>
                <h2 id="history-heading">최근 가격 변경</h2>
              </div>
              <div className="history-list" id="history-list">
                {changes.length ? (
                  changes.map((item, i) => (
                    <div className="history-item" key={i}>
                      <div className="history-top">
                        <span>{item.date}</span>
                        <strong>{item.provider}</strong>
                      </div>
                      <div className="history-change">
                        {money(item.from)} → {money(item.to)}{' '}
                        <strong>{rate(item.from, item.to)}%</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="history-empty">
                    최근 변경 이력이 없습니다.
                  </div>
                )}
              </div>
            </article>
          </section>

          <footer className="workspace-footer">
            <span>5PU5 GPU 가격 대시보드</span>
            <span>가상 데이터 · 화면 설계 데모</span>
          </footer>
        </main>

        <aside
          id="ai-panel"
          aria-label="5PU5 AI 채팅"
          className={`ai-panel ${mobileLayer === 'ai' ? 'open' : ''}`}
          hidden={!aiVisible}
        >
          <header className="ai-header">
            <div>
              <p className="section-kicker">DEMO ASSISTANT</p>
              <h2>5PU5 AI</h2>
            </div>
            <button
              className="icon-button"
              id="ai-collapse"
              type="button"
              aria-label="AI 패널 접기"
              onClick={() => {
                if (window.innerWidth > 1024) setAiVisible(false);
                setMobileLayer(null);
              }}
            >
              ›
            </button>
          </header>
          <div className="ai-context" id="ai-context">
            현재 조건: {filters.gpu} · {filters.region} ·{' '}
            {filters.provider === 'all' ? '전체 사업자' : filters.provider} ·{' '}
            {contractMap[filters.contract]}
          </div>
          <div className="chat-log" id="chat-log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                {m.role === 'assistant' ? (
                  <div className="assistant-row">
                    <span className="ai-avatar">5</span>
                    <div>
                      <div className="chat-bubble">{m.text}</div>
                      {m.source && <div className="chat-meta">{m.source}</div>}
                      {m.provider && (
                        <button
                          className="chat-action"
                          onClick={() => highlightProvider(m.provider)}
                        >
                          표에서 확인
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="chat-bubble">{m.text}</div>
                )}
              </div>
            ))}
            {sending && (
              <div className="chat-message assistant">
                <div className="chat-bubble">
                  <span className="chat-mascot-loading" role="status">
                    <img src="assets/5pu5-loading.svg" alt="" />
                    가격을 확인하고 있어요…
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-composer">
            <div className="suggestion-row" id="suggestion-row">
              {['최저 업체는 어디야?', '1년 할인 비교', '최근 가격 변동'].map(
                (q) => (
                  <button
                    key={q}
                    className="suggestion-chip"
                    disabled={sending || loading}
                    onClick={() => sendQuestion(q)}
                  >
                    {q}
                  </button>
                ),
              )}
            </div>
            <label htmlFor="chat-input">GPU 가격 질문</label>
            <div className="composer-row">
              <textarea
                id="chat-input"
                rows="2"
                placeholder="예: 1년 약정은 어디가 저렴해?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    sendQuestion();
                  }
                }}
              ></textarea>
              <button
                id="chat-send"
                type="button"
                aria-label="질문 보내기"
                disabled={sending || loading || !question.trim()}
                onClick={() => sendQuestion()}
              >
                ↑
              </button>
            </div>
            <p>실제 LLM이 아닌 규칙 기반 시연용 AI입니다.</p>
          </div>
        </aside>
        <button
          className="ai-restore"
          id="ai-restore"
          type="button"
          hidden={aiVisible}
          onClick={() => setAiVisible(true)}
        >
          5PU5 AI 열기
        </button>
      </div>
      <dialog
        className="source-dialog"
        id="source-dialog"
        aria-labelledby="source-title"
        ref={sourceRef}
        onClose={() => setSource(null)}
      >
        <button
          className="dialog-close"
          id="source-close"
          type="button"
          aria-label="출처 상세 닫기"
          onClick={() => sourceRef.current.close()}
        >
          ×
        </button>
        <p className="section-kicker">SOURCE DETAIL</p>
        <h2 id="source-title">가격 출처 상세</h2>
        <div id="source-content">
          {source && (
            <>
              <dl className="source-grid">
                <dt>GPU</dt>
                <dd>{catalog[source.gpu].label}</dd>
                <dt>사업자 / 지역</dt>
                <dd>
                  {source.provider} / {source.region}
                </dd>
                <dt>원가격</dt>
                <dd>
                  온디맨드 {money(source.onDemand)}, 1년 {money(source.year1)},
                  3년 {money(source.year3)}
                </dd>
                <dt>환산식</dt>
                <dd>{source.conversion}</dd>
                <dt>수집 시각</dt>
                <dd>{source.collectedAt}</dd>
                <dt>출처 설명</dt>
                <dd>{source.source}</dd>
              </dl>
              <p className="source-note">
                기능 시연용 가상 데이터 · 포함 GPU 수 1개 기준
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
