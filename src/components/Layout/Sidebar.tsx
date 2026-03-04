import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPagesByKind } from '../../content/pages';

interface SidebarProps {
  id?: string;
  currentId?: string;
  collapsed?: boolean;
  mobile?: boolean;
  open?: boolean;
  onNavigate?: () => void;
  onToggle?: () => void;
}

export function Sidebar({
  id,
  currentId,
  collapsed = false,
  mobile = false,
  open = false,
  onNavigate,
  onToggle,
}: SidebarProps) {
  const { pathname } = useLocation();
  const algorithms = getPagesByKind('algorithm');
  const problems = getPagesByKind('problem');
  const desktopWidth = collapsed ? 56 : 220;
  const isDrawer = mobile;

  return (
    <nav
      id={id}
      aria-hidden={isDrawer ? !open : undefined}
      className={isDrawer ? `sidebar-drawer ${open ? 'open' : ''}` : ''}
      style={{
        width: `${desktopWidth}px`,
        minWidth: `${desktopWidth}px`,
        background: '#fff',
        borderRight: '1px solid #dee2e6',
        padding: '1rem 0',
        overflowY: 'auto',
        flexShrink: 0,
        transition: 'width 0.2s ease',
        position: isDrawer ? 'fixed' : 'relative',
        top: isDrawer ? 52 : undefined,
        left: isDrawer ? 0 : undefined,
        bottom: isDrawer ? 0 : undefined,
        zIndex: isDrawer ? 300 : undefined,
        transform: isDrawer ? (open ? 'translateX(0)' : 'translateX(-100%)') : undefined,
        boxShadow: isDrawer && open ? '2px 0 14px rgba(0,0,0,0.18)' : undefined,
      }}
    >
      {!isDrawer && onToggle && (
        <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', padding: '0 0.5rem 0.5rem' }}>
          <button
            type="button"
            onClick={onToggle}
            aria-label="サイドバーを開閉"
            style={{
              border: '1px solid #dee2e6',
              background: 'transparent',
              color: '#6c757d',
              padding: '0.2rem 0.45rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              lineHeight: 1.2,
              cursor: 'pointer',
            }}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <div style={sectionLabel}>{collapsed ? 'ALG' : 'Algorithms'}</div>
        {algorithms.map((p) => (
          <NavLink
            key={p.id}
            to={p.route}
            active={currentId === p.id || pathname === p.route}
            label={p.title}
            shortLabel={p.id.toUpperCase()}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <div>
        <div style={sectionLabel}>{collapsed ? 'PRB' : 'Problems'}</div>
        {problems.map((p) => (
          <NavLink
            key={p.id}
            to={p.route}
            active={currentId === p.id || pathname === p.route}
            label={p.title}
            shortLabel={p.id.toUpperCase()}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  to,
  active,
  label,
  shortLabel,
  collapsed,
  onNavigate,
}: {
  to: string;
  active: boolean;
  label: string;
  shortLabel: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      title={label}
      onClick={onNavigate}
      style={{
        display: 'block',
        padding: collapsed ? '0.4rem 0.35rem' : '0.35rem 1rem',
        fontSize: '0.85rem',
        color: active ? '#4f8ef7' : '#495057',
        textDecoration: 'none',
        background: active ? '#e8f0fe' : 'transparent',
        borderLeft: active ? '3px solid #4f8ef7' : '3px solid transparent',
        lineHeight: 1.4,
        textAlign: collapsed ? 'center' : 'left',
        whiteSpace: collapsed ? 'nowrap' : 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {collapsed ? shortLabel : label}
    </Link>
  );
}

const sectionLabel: React.CSSProperties = {
  padding: '0.4rem 1rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#adb5bd',
};
