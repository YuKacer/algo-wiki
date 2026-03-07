import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface TlsStepBreadcrumbsProps {
  currentLabel?: string;
}

const SEGMENTS = [
  { label: 'セキュリティ', to: '/security' },
  { label: '通信保護', to: '/security/transport-security' },
  { label: 'TLS', to: '/security/transport-security/tls' },
];

export function TlsStepBreadcrumbs({ currentLabel }: TlsStepBreadcrumbsProps) {
  const linkedSegments = currentLabel ? SEGMENTS : SEGMENTS.slice(0, -1);
  const current = currentLabel ?? 'TLS';

  return (
    <nav aria-label="パンくず" style={navStyle}>
      {linkedSegments.map((segment, index) => (
        <span key={segment.to} style={segmentWrapStyle}>
          {index > 0 ? <span style={separatorStyle}>/</span> : null}
          <Link to={segment.to} style={linkStyle}>
            {segment.label}
          </Link>
        </span>
      ))}
      <span style={segmentWrapStyle}>
        {linkedSegments.length > 0 ? <span style={separatorStyle}>/</span> : null}
        <span aria-current="page" style={currentStyle}>
          {current}
        </span>
      </span>
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
