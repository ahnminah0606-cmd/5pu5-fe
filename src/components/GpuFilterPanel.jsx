// # 2026-11-05 | 모델별 조건 초안 편집. 적용 버튼을 누를 때만 부모에게 전달
import { useState } from 'react';
import FilterSelect from './FilterSelect.jsx';
import RangeFilter from './RangeFilter.jsx';
import { createDefaultFilters } from '../utils/filterDefaults.js';
export default function GpuFilterPanel({ model, appliedFilters, onApply }) {
  const [draft,setDraft] = useState(()=>appliedFilters || createDefaultFilters());
  const change=(key,value)=>setDraft(current=>({...current,[key]:value}));
  return <form className="gpu-filter-form" onSubmit={e=>{e.preventDefault();onApply(model,draft);}}>
    {/* # 2026-11-05 | 기본 조건은 같은 모양의 선택창 한 줄로 단순화 */}
    <div className="gpu-filter-heading"><h2>{model}</h2><button type="button" className="filter-reset" onClick={()=>setDraft(createDefaultFilters())}>초기화</button></div>
    <div className="gpu-filter-selects">
      <FilterSelect label="계약" value={draft.billingType} options={[['on_demand','On-Demand'],['spot','Spot'],['reserved','Reserved']]} onChange={value=>setDraft(current=>({...current,billingType:value,contractMonths:'all'}))}/>
      <FilterSelect label="리전" value={draft.region} options={[['all','전체 리전'],['us-east','US East'],['us-west','US West'],['eu','EU']]} onChange={value=>change('region',value)}/>
      <FilterSelect label="사업자" value={draft.provider} options={[['all','전체 사업자'],['runpod','Runpod'],['seeweb','Seeweb'],['daytona','Daytona']]} onChange={value=>change('provider',value)}/>
      {draft.billingType==='reserved'&&<FilterSelect label="약정기간" value={draft.contractMonths} options={[['all','전체 약정기간'],['12','12개월'],['36','36개월']]} onChange={value=>change('contractMonths',value)}/>}
    </div>
    <div className="gpu-filter-ranges">
      {/* # 2026-11-05 | 단일 용량 모델은 메모리 필터 생략. H100 시안은 80~94GB, API 연결 후 실제 용량 기준으로 판단 */}
      {model === 'H100' && <RangeFilter label="GPU 메모리" unit="GB / GPU" min={80} max={94}
        value={[Math.max(80, Math.min(94, draft.memory[0])), Math.max(80, Math.min(94, draft.memory[1]))]}
        onChange={v=>change('memory',v)}/>}
      <RangeFilter label="GPU 수량" unit="장 / 인스턴스" min={1} max={72} value={draft.gpuCount} onChange={v=>change('gpuCount',v)}/>
      <RangeFilter label="가격 범위" unit="USD / GPU-hour" min={0} max={50} step={0.1} value={draft.price} onChange={v=>change('price',v)}/>
    </div>
    <div className="gpu-filter-actions"><button className="filter-apply" type="submit">적용</button></div>
  </form>;
}
