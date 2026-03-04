import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/layout.css';

const STORAGE_KEY = 'sidebarCollapsed';

type NavItem = { to: string; icon: string; label: string; disabled?: boolean };
type NavSection = { heading: string; items: NavItem[] };

function buildNav(): NavSection[] {
  return [
    {
      heading: '',
      items: [{ to: '/', icon: 'HOME', label: 'ホーム' }],
    },
    {
      heading: '学習',
      items: [
        { to: '/algorithms', icon: 'ALG', label: 'アルゴリズム' },
        { to: '/security', icon: 'SEC', label: 'セキュリティ' },
        { to: '/network', icon: 'NET', label: 'ネットワーク', disabled: true },
        { to: '/database', icon: 'DB', label: 'データベース', disabled: true },
      ],
    },
  ];
}

export function AppShell() {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 768px)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/');

  const rootClass = [
    'aw-layout',
    !isMobile && collapsed ? 'is-collapsed' : '',
    isMobile && mobileOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const navSections = buildNav();

  const toggleLabel = isMobile
    ? mobileOpen
      ? 'サイドバーを閉じる'
      : 'サイドバーを開く'
    : collapsed
    ? 'サイドバーを展開'
    : 'サイドバーを折りたたむ';

  return (
    <div className={rootClass}>
      <aside className="aw-sidebar" aria-label="サイドバー">
        <div className="aw-sidebar-header">
          <button
            type="button"
            className="aw-sidebar-toggle"
            onClick={handleToggle}
            aria-label={toggleLabel}
            aria-expanded={isMobile ? mobileOpen : !collapsed}
          >
            =
          </button>
        </div>
        <nav className="aw-sidebar-nav" aria-label="サイドメニュー">
          {navSections.map((section, i) => (
            <div key={section.heading || i} className="aw-nav-section">
              {section.heading && (
                <div className="aw-nav-section-label">{section.heading}</div>
              )}
              {section.items.map((item) =>
                item.disabled ? (
                  <span
                    key={item.to}
                    title={item.label}
                    className="aw-nav-link aw-nav-link--disabled"
                  >
                    <span className="aw-nav-icon">{item.icon}</span>
                    <span className="aw-nav-label">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={item.label}
                    className={`aw-nav-link${isActive(item.to) ? ' active' : ''}`}
                  >
                    <span className="aw-nav-icon">{item.icon}</span>
                    <span className="aw-nav-label">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          ))}
        </nav>
      </aside>

      <button
        type="button"
        className="aw-overlay"
        onClick={() => setMobileOpen(false)}
        aria-label="サイドバーを閉じる"
      />

      <div className="aw-main">
        <header className="aw-topbar">
          <button
            type="button"
            className="aw-toggle-btn aw-topbar-toggle"
            onClick={handleToggle}
            aria-label={toggleLabel}
            aria-expanded={isMobile ? mobileOpen : !collapsed}
          >
            =
          </button>
          <Link to="/" className="aw-topbar-brand">AlgoWiki</Link>
        </header>

        <main className="aw-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
