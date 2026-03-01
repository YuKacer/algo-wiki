import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
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
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)' }}>
        <Sidebar currentId={meta.id} />
        <main style={{ flex: 1, padding: '1.5rem 2rem', overflowX: 'hidden', maxWidth: '860px' }}>
          <Breadcrumb crumbs={crumbs} />
          {children}
        </main>
      </div>
    </div>
  );
}
