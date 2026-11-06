// # 2026-11-06 | GetDeploying에서 확인한 B300 1장·On-Demand 공개 가격 4개 표본.
// 화면 제작용 고정값이며 전체 시장 통계나 실시간 API 응답이 아님.
export const demoPrices = {
  B300: {
    sourceUrl: 'https://getdeploying.com/gpus/nvidia-b300',
    observedDate: '2026-11-06',
    billingType: 'on_demand',
    gpuCount: 1,
    unit: 'USD/GPU-hour',
    offers: [
      { provider: 'Daytona', configuration: 'GPU-only', price: 7.10 },
      { provider: 'Runpod', configuration: 'Secure Cloud', price: 8.99 },
      { provider: 'Daytona', configuration: 'B300', price: 9.15 },
      { provider: 'GPU.ai', configuration: 'B300 SXM', price: 11.24 },
    ],
    // # 2026-11-06 | 사용자가 제공한 스크린샷의 사업자별 시작 가격 표본.
    // 전체 상품 통계가 아니며 Reserved의 약정기간도 서로 다름. UI 확인용으로만 사용.
    billingOffers: {
      spot: [
        { provider: 'Spheron', price: 6.52 },
        { provider: 'Daytona', price: 4.08 },
        { provider: 'Lium', price: 6.80 },
        { provider: 'DigitalOcean', price: 6.17 },
        { provider: 'CoreWeave', price: 4.48 },
        { provider: 'Lyceum', price: 5.59 },
        { provider: 'UpCloud', price: 5.99 },
        { provider: 'Verda', price: 5.73 },
      ],
      reserved: [
        { provider: 'TheAI Cloud', contractMonths: 60, price: 4.50 },
        { provider: 'Impossible Cloud', contractMonths: 60, price: 4.53 },
        { provider: 'Seeweb', contractMonths: null, price: 4.74 },
        { provider: 'Bentaus', contractMonths: null, price: 4.25 },
        { provider: 'Cyfuture AI', contractMonths: 12, price: 5.51 },
        { provider: 'DigitalOcean', contractMonths: 12, price: 7.94 },
        { provider: 'Verda', contractMonths: null, price: 8.60 },
      ],
    },
  },
};
