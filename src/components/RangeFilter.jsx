// # 2026-11-05 | 최소·최대 손잡이 슬라이더와 숫자 입력. 역전되는 범위는 허용하지 않음
import { useId } from 'react';
export default function RangeFilter({ label, unit, min, max, step = 1, value, onChange }) {
  const id = useId();
  function update(index, raw) {
    if (raw === '' || !Number.isFinite(Number(raw))) return;
    const snapped = min + Math.round((Number(raw) - min) / step) * step;
    const number = Number(Math.max(min, Math.min(max, snapped)).toFixed(2));
    onChange(index === 0 ? [Math.min(number, value[1]), value[1]] : [value[0], Math.max(number, value[0])]);
  }
  return <fieldset className="range-filter">
    <legend>{label} <span>{unit}</span></legend>
    <div className="range-values">
      <label htmlFor={`${id}-min`}>최소<input id={`${id}-min`} type="number" min={min} max={value[1]} step={step} value={value[0]} onChange={e => update(0,e.target.value)} aria-label={`${label} 최소값`} /></label>
      <span aria-hidden="true">—</span>
      <label htmlFor={`${id}-max`}>최대<input id={`${id}-max`} type="number" min={value[0]} max={max} step={step} value={value[1]} onChange={e => update(1,e.target.value)} aria-label={`${label} 최대값`} /></label>
    </div>
    <div className="dual-range" style={{'--range-start':`${(value[0]-min)/(max-min)*100}%`,'--range-end':`${(value[1]-min)/(max-min)*100}%`}}>
      <div className="dual-range-track" />
      <input type="range" min={min} max={max} step={step} value={value[0]} onChange={e=>update(0,e.target.value)} aria-label={`${label} 최소 슬라이더`} style={{zIndex:value[0]===max?4:2}} />
      <input type="range" min={min} max={max} step={step} value={value[1]} onChange={e=>update(1,e.target.value)} aria-label={`${label} 최대 슬라이더`} />
    </div>
    <div className="range-limits"><span>{min}</span><span>{max}</span></div>
  </fieldset>;
}
