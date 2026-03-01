import { Link } from 'react-router-dom';
import type { PageMeta } from '../content/pages';
import { PAGES } from '../content/pages';
import { Chip } from './Chip';

// 未作成ページの候補
const UNIMPLEMENTED: Record<string, string> = {
  '0-1 BFS': '0-1 BFS',
  'Bellman-Ford': 'Bellman-Ford',
  'Warshall-Floyd': 'Warshall-Floyd',
  'Union-Find': 'Union-Find',
  'Bipartite Check': 'Bipartite Check / 2-coloring',
  'SCC': 'Strongly Connected Components',
};

interface RelatedPanelProps {
  meta: PageMeta;
  extraUnimplemented?: string[];
}

export function RelatedPanel({ meta, extraUnimplemented = [] }: RelatedPanelProps) {
  const relAlgos = meta.related.algorithms
    .map((id) => PAGES.find((p) => p.id === id))
    .filter((p): p is PageMeta => p !== undefined);

  const relProblems = meta.related.problems
    .map((id) => PAGES.find((p) => p.id === id))
    .filter((p): p is PageMeta => p !== undefined);

  const allUnimpl = [...meta.related.concepts, ...extraUnimplemented];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1rem',
      }}
    >
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}>
        関連ページ
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {relAlgos.length > 0 && (
          <div>
            <div style={{ fontSize: '0.78rem', color: '#6c757d', marginBottom: '0.3rem' }}>アルゴリズム</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {relAlgos.map((p) => (
                <Link key={p.id} to={p.route} style={{ textDecoration: 'none' }}>
                  <Chip label={p.title} color="blue" />
                </Link>
              ))}
            </div>
          </div>
        )}
        {relProblems.length > 0 && (
          <div>
            <div style={{ fontSize: '0.78rem', color: '#6c757d', marginBottom: '0.3rem' }}>問題パターン</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {relProblems.map((p) => (
                <Link key={p.id} to={p.route} style={{ textDecoration: 'none' }}>
                  <Chip label={p.title} color="orange" />
                </Link>
              ))}
            </div>
          </div>
        )}
        {allUnimpl.length > 0 && (
          <div>
            <div style={{ fontSize: '0.78rem', color: '#6c757d', marginBottom: '0.3rem' }}>未作成ページ / 用語</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {allUnimpl.map((c, i) => {
                const label = UNIMPLEMENTED[c] ?? c;
                const isPage = Object.keys(UNIMPLEMENTED).includes(c);
                return (
                  <Chip
                    key={i}
                    label={isPage ? `${label}（未作成）` : label}
                    disabled={isPage}
                    color="gray"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
