import { Link } from 'react-router-dom';
import { getPagesByKind } from '../../content/pages';
import { Header } from '../../components/Layout/Header';
import { Chip } from '../../components/Chip';

export function ProblemsIndex() {
  const pages = getPagesByKind('problem');
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>
          Graph Problem Patterns
        </h1>
        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
          競プロの典型グラフ問題。問題軸から引く。
        </p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {pages.map((p) => (
            <Link key={p.id} to={p.route} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px',
                  padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#212529' }}>{p.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#6c757d' }}>
                  時間: {p.complexity.time}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {p.tags.slice(0, 3).map((t) => (
                    <Chip key={t} label={t} color="orange" />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
