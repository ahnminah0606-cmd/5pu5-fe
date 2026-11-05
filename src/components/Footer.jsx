// # 2026-11-05 | 하단 모델 선택·데이터 안내·사업 소개와 오류 제보 안내
import { useRef, useState } from 'react';

const models = ['B300', 'GB300 NVL72', 'VR200 NVL72', 'GB200 NVL72', 'H100', 'H200'];
const notices = {
  source: {
    title: '데이터 출처',
    paragraphs: ['GPU Finder를 데이터 소스로 사용하는 방향으로 준비 중입니다. 현재 화면에는 실제 가격 API가 연결되어 있지 않습니다.', '실제 데이터 연결 후 각 가격의 출처 링크와 수집 시각을 비교표·상세 화면에 표시할 예정입니다.'],
  },
  pricing: {
    title: '가격·환산 기준',
    paragraphs: ['공개 게시가격 기준이며 실제 계약가격과 다를 수 있습니다.', '기본 비교 단위는 USD / GPU·시간입니다. GPU 1개당 시간 가격은 노드 전체의 시간당 가격을 포함 GPU 수로 나눠 계산합니다.', 'GPU당 단가가 같아도 CPU·RAM·메모리·리전·계약 조건이 동일하다는 의미는 아닙니다. 온디맨드·약정·스팟은 조건을 구분해 비교합니다.', '월·일 단위 가격과 다른 통화의 환산 기준은 실제 데이터 연동 시 확정해 안내합니다. 가격 미공개·견적 문의·누락은 0원으로 표시하지 않습니다.'],
  },
  report: {
    title: '오류 제보',
    paragraphs: ['오류 제보 접수 채널은 준비 중입니다. 현재 이 화면에서 제보가 전송되지는 않습니다.', '오류를 발견하면 GPU 모델, 사업자, 리전·계약 조건, 표시된 가격, 확인 시각과 화면 캡처를 기록해 주세요. 접수 채널이 정해지면 이곳에 연결하겠습니다.'],
  },
};

export default function Footer({ onAbout, onGpuChange }) {
  const dialogRef = useRef(null);
  const [notice, setNotice] = useState('source');

  // # 2026-11-05 | 항목 선택 시 안내 창을 열고 닫으면 원래 버튼으로 포커스 복귀
  function openNotice(key) {
    setNotice(key);
    dialogRef.current.showModal();
  }

  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-inner">
        <div className="dashboard-footer-columns">
          {/* # 2026-11-05 | 작은 5PU5 글자 로고를 GPU 모델 메뉴 왼쪽에 배치 */}
          <div className="dashboard-footer-brand">
            <img src="/assets/5PU5-master.svg" width="48" height="20" alt="5PU5" />
          </div>
          <nav aria-label="GPU 모델">
            <h2>GPU 모델</h2>
            {models.map(model => <button key={model} type="button" onClick={() => onGpuChange(model)}>{model}</button>)}
          </nav>
          <nav aria-label="데이터 안내">
            <h2>데이터 안내</h2>
            <button type="button" onClick={() => openNotice('source')}>데이터 출처</button>
            <button type="button" onClick={() => openNotice('pricing')}>가격·환산 기준</button>
          </nav>
          <nav aria-label="5PU5 소개">
            <h2>5PU5</h2>
            <button type="button" onClick={onAbout}>사업 소개</button>
            <button type="button" onClick={() => openNotice('report')}>오류 제보</button>
          </nav>
        </div>
        <div className="dashboard-footer-bottom">
          <span>© 2026 5PU5</span>
          {/* # 2026-11-05 | 정책 항목 이름만 표시하며 아직 링크는 연결하지 않음 */}
          <span>개인정보 처리방침 | 이용약관</span>
        </div>
      </div>
      <dialog className="footer-notice" ref={dialogRef} aria-labelledby="footer-notice-title">
        <div className="footer-notice-heading">
          <h2 id="footer-notice-title">{notices[notice].title}</h2>
          <button type="button" aria-label="안내 닫기" onClick={() => dialogRef.current.close()}>×</button>
        </div>
        {notices[notice].paragraphs.map(text => <p key={text}>{text}</p>)}
      </dialog>
    </footer>
  );
}
