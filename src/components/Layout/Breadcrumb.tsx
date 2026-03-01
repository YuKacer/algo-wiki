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
    <nav style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '1rem' }}>
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 0.4rem' }}>›</span>}
          {crumb.to ? (
            <Link to={crumb.to} style={{ color: '#4f8ef7', textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: '#495057' }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
