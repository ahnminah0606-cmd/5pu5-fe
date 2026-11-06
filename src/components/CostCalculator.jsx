// # 2026-11-06 | GPU 1장 기준 최저 단가 × 입력 시간으로 예상 이용요금 즉시 계산
import { useId, useState } from 'react';

export default function CostCalculator({ minimumPrice }) {
  const [hours, setHours] = useState('1');
  const id = useId();
  const numericHours = Number(hours);
  const valid = hours.trim() !== '' && Number.isFinite(numericHours) && numericHours >= 0;
  const total = valid && Number.isFinite(minimumPrice) ? minimumPrice * numericHours : null;
  const money = value => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <section className="cost-calculator" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>예상 이용요금</h3>
    <div className="cost-calculator-equation">
      <div className="cost-calculator-rate">
        <span className="cost-calculator-label">최저가 · GPU 1장</span>
        <strong>{Number.isFinite(minimumPrice) ? `$${money(minimumPrice)}` : '—'}</strong>
        <span className="cost-calculator-label">USD/GPU-hour</span>
      </div>
      <span className="cost-calculator-symbol" aria-hidden="true">×</span>
      <div className="cost-calculator-hours">
        <label htmlFor={`${id}-hours`}>사용 시간</label>
        <div><input id={`${id}-hours`} type="number" min="0" step="any" inputMode="decimal" value={hours}
          onChange={event => setHours(event.target.value)} aria-invalid={!valid && hours !== ''} /><span>시간</span></div>
      </div>
      <span className="cost-calculator-symbol" aria-hidden="true">=</span>
      <output className="cost-calculator-total" htmlFor={`${id}-hours`} aria-live="polite">
        <span className="cost-calculator-label">예상 이용요금</span>
        <strong>{total !== null && Number.isFinite(total) ? `$${money(total)}` : '—'}</strong>
        <span className="cost-calculator-label">USD</span>
      </output>
    </div>
  </section>;
}
