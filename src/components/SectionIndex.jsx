// # 2026-11-05 | 스크롤을 따라오며 본문 구역으로 이동하는 인덱스
export default function SectionIndex({ sections, activeSection }) {
  return (
    <nav className="section-index" aria-label="페이지 목차">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`}
          className={`section-index-link${activeSection === section.id ? ' active' : ''}`}
          aria-current={activeSection === section.id ? 'location' : undefined}>
          {section.label}
        </a>
      ))}
    </nav>
  );
}
