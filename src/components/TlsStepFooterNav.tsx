import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface FooterLink {
  to: string;
  label: string;
}

interface TlsStepFooterNavProps {
  leftLink?: FooterLink;
  rightLink?: FooterLink;
}

export function TlsStepFooterNav({ leftLink, rightLink }: TlsStepFooterNavProps) {
  if (!leftLink && !rightLink) return null;

  return (
    <nav
      aria-label="TLS 詳細ページ移動"
      style={{
        ...navStyle,
        justifyContent: leftLink && rightLink ? 'space-between' : 'flex-start',
      }}
    >
      {leftLink ? (
        <Link to={leftLink.to} style={footerLinkStyle}>
          {leftLink.label}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {rightLink ? (
        <Link to={rightLink.to} style={footerLinkStyle}>
          {rightLink.label}
        </Link>
      ) : null}
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  flexWrap: 'wrap',
  marginTop: '0.35rem',
};

const footerLinkStyle: CSSProperties = {
  display: 'inline-block',
  padding: '0.48rem 0.8rem',
  border: '1px solid #cfe2ff',
  borderRadius: '8px',
  background: '#f6f9ff',
  color: '#185ccf',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '0.9rem',
};
