const money = (n) => `$${n.toFixed(2)}`;
export default function GpuCard({ card, onCompare }) {
  const b = card.best;
  return (
    <article className="gpu-card">
      <div className="gpu-card-top">
        <span className="gpu-name">{card.label}</span>
        <span className="gpu-chip">{card.gpu}</span>
      </div>
      <div className="gpu-price-block">
        <strong className="gpu-price">{money(b.year1)}</strong>
        <span className="gpu-unit">USD / GPU · 시간</span>
      </div>
      <div className="gpu-change-block">
        <strong className={`change ${card.change === 0 ? 'flat' : ''}`}>
          {card.change === 0
            ? '— 유지'
            : `${card.change < 0 ? '▼' : '▲'} ${Math.abs(card.change)}%`}
        </strong>
        <span>최근 30일 변동률</span>
      </div>
      <div className="gpu-meta">
        <span>
          <strong>{b.provider}</strong> · {b.region} · 1년 약정
        </span>
        <span>수집 {b.collectedAt.replace('2026-', '')}</span>
      </div>
      <button
        className="compare-card-button"
        onClick={() => onCompare(card.gpu)}
      >
        업체별 비교 →
      </button>
    </article>
  );
}
