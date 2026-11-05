// # 2026-11-05 | 필터 시안의 기본값과 범위. 실제 API 연결 시 서버 제공 값으로 교체
export function createDefaultFilters() {
  return { billingType: 'on_demand', region: 'all', provider: 'all', contractMonths: 'all', memory: [0, 256], gpuCount: [1, 72], price: [0, 50] };
}
