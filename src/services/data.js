export const COLLECTED_AT = '2026-10-30 09:00 KST';

export const catalog = {
  H100: { label: 'NVIDIA H100 80GB', memory: '80GB' },
  A100: { label: 'NVIDIA A100 80GB', memory: '80GB' },
  H200: { label: 'NVIDIA H200 141GB', memory: '141GB' },
};

const price = (gpu, provider, region, onDemand, year1, year3, history) => ({
  gpu,
  provider,
  region,
  currency: 'USD',
  unit: 'GPU · 시간',
  onDemand,
  year1,
  year3,
  history,
  collectedAt: COLLECTED_AT,
  source: `${provider}의 기능 시연용으로 직접 구성한 가상 가격 데이터`,
  conversion: 'GPU당 시간당 가격 = 가상 상품 시간당 가격 ÷ 포함 GPU 수(1개)',
});

export const prices = [
  price('H100', 'A회사', '서울', 3.0, 2.4, 1.8, [
    { date: '10/01', value: 3.4 },
    { date: '10/10', value: 3.2 },
    { date: '10/20', value: 3.0 },
  ]),
  price('H100', 'B회사', '서울', 3.5, 2.45, 2.1, [
    { date: '10/01', value: 3.7 },
    { date: '10/15', value: 3.5 },
  ]),
  price('H100', 'C회사', '서울', 3.26, 2.61, 1.96, [
    { date: '10/01', value: 3.42 },
    { date: '10/18', value: 3.26 },
  ]),
  price('H100', 'A회사', '도쿄', 3.14, 2.51, 1.88, [
    { date: '10/01', value: 3.36 },
    { date: '10/12', value: 3.22 },
    { date: '10/23', value: 3.14 },
  ]),
  price('H100', 'B회사', '도쿄', 3.62, 2.57, 2.17, [
    { date: '10/01', value: 3.78 },
    { date: '10/16', value: 3.62 },
  ]),
  price('A100', 'A회사', '서울', 1.48, 1.18, 0.89, [
    { date: '10/01', value: 1.6 },
    { date: '10/14', value: 1.52 },
    { date: '10/24', value: 1.48 },
  ]),
  price('A100', 'B회사', '서울', 1.56, 1.2, 0.94, [
    { date: '10/01', value: 1.66 },
    { date: '10/17', value: 1.56 },
  ]),
  price('A100', 'C회사', '서울', 1.44, 1.15, 0.86, [
    { date: '10/01', value: 1.55 },
    { date: '10/11', value: 1.44 },
  ]),
  price('A100', 'A회사', '싱가포르', 1.55, 1.24, 0.93, [
    { date: '10/01', value: 1.64 },
    { date: '10/19', value: 1.55 },
  ]),
  price('A100', 'B회사', '싱가포르', 1.62, 1.25, 0.97, [
    { date: '10/01', value: 1.72 },
    { date: '10/15', value: 1.62 },
  ]),
  price('H200', 'A회사', '서울', 4.42, 3.54, 2.65, [
    { date: '10/01', value: 4.7 },
    { date: '10/13', value: 4.55 },
    { date: '10/22', value: 4.42 },
  ]),
  price('H200', 'B회사', '서울', 4.68, 3.51, 2.81, [
    { date: '10/01', value: 4.9 },
    { date: '10/16', value: 4.68 },
  ]),
  price('H200', 'C회사', '서울', 4.55, 3.64, 2.73, [
    { date: '10/01', value: 4.76 },
    { date: '10/20', value: 4.55 },
  ]),
  price('H200', 'A회사', '도쿄', 4.58, 3.66, 2.75, [
    { date: '10/01', value: 4.8 },
    { date: '10/21', value: 4.58 },
  ]),
  price('H200', 'B회사', '도쿄', 4.81, 3.61, 2.89, [
    { date: '10/01', value: 5.02 },
    { date: '10/18', value: 4.81 },
  ]),
];

export const contractMap = {
  all: '전체 계약',
  onDemand: '온디맨드',
  year1: '1년 약정',
  year3: '3년 약정',
};
export const providerColors = {
  A회사: '#1464f4',
  B회사: '#009d91',
  C회사: '#764fd6',
};
