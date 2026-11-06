// # 2026-11-06 | 가격 표본을 정렬해 최저가·중앙값·최고가를 3열로 표시
import { demoPrices } from '../services/demoPrices.js';
import CostCalculator from './CostCalculator.jsx';

const billingTypes = [
  ['on_demand', 'On-Demand'], ['spot', 'Spot'], ['reserved', 'Reserved'],
];

export default function PriceSummary({ model, billingType, onBillingTypeChange }) {
  const sample = demoPrices[model];
  if (!sample) return null;

  // # 2026-11-06 | 계약 유형별 임시 표본에서 가격 요약 계산
  const offers = sample.billingType === billingType
    ? sample.offers
    : (sample.billingOffers?.[billingType] || []);
  const prices = offers.map(offer => offer.price).sort((a, b) => a - b);
  const middle = Math.floor(prices.length / 2);
  const median = prices.length % 2
    ? prices[middle]
    : (prices[middle - 1] + prices[middle]) / 2;
  const values = [
    { label: '최저가', value: prices[0] },
    { label: '중앙값', value: median },
    { label: '최고가', value: prices[prices.length - 1] },
  ];

  return <>
    <div className="price-billing-tabs" role="group" aria-label="가격 현황 계약 유형">
      {billingTypes.map(([key, label]) => <button key={key} type="button" aria-pressed={billingType === key} onClick={() => onBillingTypeChange(key)}>{label}</button>)}
    </div>
    <dl className="price-summary">
    {values.map(({ label, value }) => <div key={label} className="price-summary-item">
      <dt>{label}</dt>
      <dd>
        <span className="price-summary-value">{Number.isFinite(value) ? value.toFixed(2) : '—'}</span>
        <span className="price-summary-unit">{sample.unit}</span>
      </dd>
    </div>)}
  </dl>
    <CostCalculator minimumPrice={prices[0]} />
  </>;
}
