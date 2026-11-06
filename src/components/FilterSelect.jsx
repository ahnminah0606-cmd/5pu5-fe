// # 2026-11-05 | 입력칸 아래에 같은 너비로 펼쳐지는 필터 목록
import { useEffect, useId, useRef, useState } from 'react';

export default function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  return <div className="filter-select" ref={root}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current.focus(); } }}>
    <span id={`${id}-label`} className="filter-select-label">{label}</span>
    <button ref={trigger} type="button" className="filter-select-trigger" aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-controls={`${id}-options`} onClick={() => setOpen(current => !current)}>
      <span id={`${id}-value`}>{options.find(option => option[0] === value)?.[1]}</span>
      <span aria-hidden="true" className={`filter-select-chevron${open ? ' is-open' : ''}`}>⌄</span>
    </button>
    {open && <div id={`${id}-options`} className="filter-select-options" role="group" aria-labelledby={`${id}-label`}>
      {options.map(([key, text]) => <button key={key} type="button" aria-pressed={key === value} onClick={() => { onChange(key); setOpen(false); trigger.current.focus(); }}>
        <span>{text}</span><span aria-hidden="true">{key === value ? '✓' : ''}</span>
      </button>)}
    </div>}
  </div>;
}
