import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  sidebarExpanded?: boolean;
  sidebarControlId?: string;
}

export function Header({
  showSidebarToggle = false,
  onSidebarToggle,
  sidebarExpanded,
  sidebarControlId,
}: HeaderProps) {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Algorithms', to: '/algorithms' },
    { label: 'Problems', to: '/graph/problems' },
    { label: 'Bubble Sort', to: '/algorithms/bubble-sort' },
  ];

  return (
    <header
      style={{
        background: '#1a1a2e',
        color: '#fff',
        padding: '0.65rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        borderBottom: '1px solid #2d2d50',
      }}
    >
      <Link
        to="/"
        style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap' }}
      >
        🧮 AlgoWiki
      </Link>
      <nav style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: pathname.startsWith(item.to) ? '#fff' : '#adb5bd',
              textDecoration: 'none',
              fontSize: '0.88rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              background: pathname.startsWith(item.to) ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {showSidebarToggle && (
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label="サイドバーを開閉"
          aria-expanded={sidebarExpanded}
          aria-controls={sidebarControlId}
          style={{
            border: '1px solid #45506e',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            padding: '0.22rem 0.45rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {sidebarExpanded ? '◀' : '☰'}
        </button>
      )}
    </header>
  );
}
