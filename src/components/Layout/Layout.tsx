import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { PageMeta } from '../../content/pages';

interface LayoutProps {
  meta: PageMeta;
  children: ReactNode;
}

export function Layout({ meta, children }: LayoutProps) {
  const kindLabel = meta.kind === 'algorithm' ? 'Algorithms' : 'Problems';
  const kindRoute = meta.kind === 'algorithm' ? '/graph/algorithms' : '/graph/problems';

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Graph', to: '/graph/algorithms' },
    { label: kindLabel, to: kindRoute },
    { label: meta.title },
  ];

  return (
    <div className="aw-page-body">
      <Breadcrumb crumbs={crumbs} />
      {children}
    </div>
  );
}
