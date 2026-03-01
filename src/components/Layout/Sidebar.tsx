import { Link, useLocation } from 'react-router-dom';
import { getPagesByKind } from '../../content/pages';

interface SidebarProps {
  currentId?: string;
}

export function Sidebar({ currentId }: SidebarProps) {
  const { pathname } = useLocation();
  const algorithms = getPagesByKind('algorithm');
  const problems = getPagesByKind('problem');

  return (
    <nav
      style={{
        width: '200px',
        minWidth: '180px',
        background: '#fff',
        borderRight: '1px solid #dee2e6',
        padding: '1rem 0',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={sectionLabel}>Algorithms</div>
        {algorithms.map((p) => (
          <NavLink key={p.id} to={p.route} active={currentId === p.id || pathname === p.route} label={p.title} />
        ))}
      </div>
      <div>
        <div style={sectionLabel}>Problems</div>
        {problems.map((p) => (
          <NavLink key={p.id} to={p.route} active={currentId === p.id || pathname === p.route} label={p.title} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '0.35rem 1rem',
        fontSize: '0.85rem',
        color: active ? '#4f8ef7' : '#495057',
        textDecoration: 'none',
        background: active ? '#e8f0fe' : 'transparent',
        borderLeft: active ? '3px solid #4f8ef7' : '3px solid transparent',
        lineHeight: 1.4,
      }}
    >
      {label}
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

import React from 'react';
