import { prices, catalog, contractMap, COLLECTED_AT } from './data.js';

const wait = (ms = 520) => new Promise((resolve) => setTimeout(resolve, ms));
const percent = (base, value) => Math.round((value / base - 1) * 100);

export async function fetchPrices(filters, options = {}) {
  if (!options.instant) await wait(360);
  if (options.fail) throw new Error('가상 가격 서버가 잠시 응답하지 않습니다.');
  return prices.filter(
    (item) =>
      item.gpu === filters.gpu &&
      item.region === filters.region &&
      (filters.provider === 'all' || item.provider === filters.provider),
  );
}

export async function demoAuth({ email, password }) {
  await wait(560);
  if (!email.includes('@') || password.length < 6)
    throw new Error('입력값을 다시 확인해 주세요.');
  return { name: '민아', mode: 'demo', token: null };
}

export function buildRecentCards() {
  return ['H100', 'A100', 'H200'].map((gpu) => {
    const candidates = prices.filter(
      (item) => item.gpu === gpu && item.region === '서울',
    );
    const best = candidates.reduce((a, b) => (a.year1 < b.year1 ? a : b));
    const history = best.history;
    return {
      gpu,
      label: catalog[gpu].label,
      best,
      change: percent(history[0].value, history.at(-1).value),
    };
  });
}

export async function askAssistant(question, filters, rows) {
  await wait(780);
  const q = question.trim().toLowerCase();
  const gpu = catalog[filters.gpu].label;
  const source = `가상 가격 비교 데이터 · ${COLLECTED_AT}`;
  if (!rows.length)
    return {
      text: '현재 조건에는 비교 가능한 가격이 없습니다. 사업자 또는 지역 필터를 변경해 주세요.',
      source,
    };
  if (/최저|저렴|싼|어디/.test(q)) {
    const key = filters.contract === 'all' ? 'onDemand' : filters.contract;
    const best = rows.reduce((a, b) => (a[key] < b[key] ? a : b));
    return {
      text: `${gpu} · ${filters.region}의 ${contractMap[key]} 최저가는 ${best.provider} $${best[key].toFixed(2)}입니다.`,
      source,
      provider: best.provider,
    };
  }
  if (/1년|할인/.test(q)) {
    const ranked = [...rows].sort(
      (a, b) => a.year1 / a.onDemand - b.year1 / b.onDemand,
    );
    const comparison = ranked
      .map(
        (row) =>
          `${row.provider} $${row.year1.toFixed(2)} (${Math.abs(percent(row.onDemand, row.year1))}% 할인)`,
      )
      .join(' · ');
    const best = ranked[0];
    return {
      text: `${gpu} · ${filters.region}의 1년 약정 비교입니다. ${comparison}. 할인율 기준으로는 ${best.provider}가 가장 큽니다.`,
      source,
      provider: best.provider,
    };
  }
  if (/최근|변동|변경|이력/.test(q)) {
    const changes = rows
      .flatMap((row) =>
        row.history
          .slice(1)
          .map((h, i) => ({
            provider: row.provider,
            date: h.date,
            from: row.history[i].value,
            to: h.value,
          })),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
    const last = changes[0];
    const rate = percent(last.from, last.to);
    return {
      text: `가장 최근 변경은 ${last.date} ${last.provider}의 $${last.from.toFixed(2)} → $${last.to.toFixed(2)} (${rate}%)입니다.`,
      source,
      provider: last.provider,
    };
  }
  return {
    text: '이 데모에서는 “최저 업체”, “1년 할인”, “최근 가격 변동”을 질문할 수 있어요. 현재 선택한 GPU·지역·사업자 조건에 맞춰 답합니다.',
    source,
  };
}
