import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="パンくず" style={navStyle}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={segmentWrapStyle}>
          {i > 0 && <span style={separatorStyle}>/</span>}
          {crumb.to ? (
            <Link to={crumb.to} style={linkStyle}>
              {crumb.label}
            </Link>
          ) : (
            <span aria-current="page" style={currentStyle}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.35rem',
  marginBottom: '0.95rem',
  color: '#64748b',
  fontSize: '0.88rem',
};

const segmentWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
};

const separatorStyle: CSSProperties = {
  color: '#94a3b8',
};

const linkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 700,
};

const currentStyle: CSSProperties = {
  color: '#334155',
  fontWeight: 700,
};
