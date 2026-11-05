// # 2026-11-05 | 모델별 조건 초안 편집. 적용 버튼을 누를 때만 부모에게 전달
import { useState } from 'react';
import RangeFilter from './RangeFilter.jsx';
import { createDefaultFilters } from '../utils/filterDefaults.js';
export default function GpuFilterPanel({ model, appliedFilters, onApply }) {
  const [draft,setDraft] = useState(()=>appliedFilters || createDefaultFilters());
  const change=(key,value)=>setDraft(current=>({...current,[key]:value}));
  return <form className="gpu-filter-form" onSubmit={e=>{e.preventDefault();onApply(model,draft);}}>
    {/* # 2026-11-05 | 기본 조건은 같은 모양의 선택창 한 줄로 단순화 */}
    <div className="gpu-filter-heading"><h2>{model}</h2><button type="button" className="filter-reset" onClick={()=>setDraft(createDefaultFilters())}>초기화</button></div>
    <div className="gpu-filter-selects">
      <label>계약<select value={draft.billingType} onChange={e=>setDraft(current=>({...current,billingType:e.target.value,contractMonths:'all'}))}><option value="on_demand">On-Demand</option><option value="spot">Spot</option><option value="reserved">Reserved</option></select></label>
      <label>리전<select value={draft.region} onChange={e=>change('region',e.target.value)}><option value="all">전체 리전</option><option value="us-east">US East</option><option value="us-west">US West</option><option value="eu">EU</option></select></label>
      <label>사업자<select value={draft.provider} onChange={e=>change('provider',e.target.value)}><option value="all">전체 사업자</option><option value="runpod">Runpod</option><option value="seeweb">Seeweb</option><option value="daytona">Daytona</option></select></label>
      {draft.billingType==='reserved'&&<label>약정기간<select value={draft.contractMonths} onChange={e=>change('contractMonths',e.target.value)}><option value="all">전체 약정기간</option><option value="12">12개월</option><option value="36">36개월</option></select></label>}
    </div>
    <div className="gpu-filter-ranges">
      {/* # 2026-11-05 | 단일 용량 모델은 메모리 필터 생략. H100 시안은 80~94GB, API 연결 후 실제 용량 기준으로 판단 */}
      {model === 'H100' && <RangeFilter label="GPU 메모리" unit="GB / GPU" min={80} max={94}
        value={[Math.max(80, Math.min(94, draft.memory[0])), Math.max(80, Math.min(94, draft.memory[1]))]}
        onChange={v=>change('memory',v)}/>}
      <RangeFilter label="GPU 수량" unit="장 / 인스턴스" min={1} max={72} value={draft.gpuCount} onChange={v=>change('gpuCount',v)}/>
      <RangeFilter label="가격 범위" unit="USD / GPU-hour" min={0} max={50} step={0.1} value={draft.price} onChange={v=>change('price',v)}/>
    </div>
    <div className="gpu-filter-actions"><p>시안용 · 실제 데이터 미연결</p><button className="filter-apply" type="submit">적용</button></div>
  </form>;
}
