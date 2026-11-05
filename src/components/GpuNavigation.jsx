// # 2026-11-05 | 5PU5 로고와 GPU 모델 탭 표시 및 선택·키보드 이동 처리
const models = ['B300', 'GB300 NVL72', 'VR200 NVL72', 'GB200 NVL72', 'H100', 'H200'];

export default function GpuNavigation({ selectedGpu, onGpuChange, onHome }) {
  function handleKeyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % models.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + models.length) % models.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = models.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    onGpuChange(models[next]);
    event.currentTarget.parentElement.children[next].focus();
  }

  return (
    <header className="gpu-navigation">
      <button className="gpu-navigation-brand" type="button" aria-label="5PU5 홈" onClick={onHome}>
        <img src="/assets/5PU5-master.svg" alt="5PU5" width="76" height="32" />
      </button>
      <div className="gpu-navigation-tabs" role="tablist" aria-label="GPU 모델">
        {models.map((model, index) => (
          <button key={model} type="button" role="tab" aria-selected={selectedGpu === model}
            aria-controls="main-content" tabIndex={selectedGpu === model || (!models.includes(selectedGpu) && index === 0) ? 0 : -1}
            className={`gpu-navigation-tab${selectedGpu === model ? ' active' : ''}`}
            onClick={() => onGpuChange(model)} onKeyDown={event => handleKeyDown(event, index)}>
            {model}
          </button>
        ))}
      </div>
    </header>
  );
}
