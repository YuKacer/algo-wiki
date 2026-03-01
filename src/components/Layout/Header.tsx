import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Algorithms', to: '/graph/algorithms' },
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
      <nav style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
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
    </header>
  );
}
