import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { getPagesByKind } from '../content/pages';
import type { PageMeta } from '../content/pages';
import { Chip } from '../components/Chip';

// Bubble Sort は PAGES 未登録のため、ここでローカル定義
const BUBBLE_SORT: PageMeta = {
  id: 'bubble-sort',
  title: 'Bubble Sort（バブルソート）',
  kind: 'algorithm',
  domain: 'graph',
  route: '/algorithms/bubble-sort',
  category: ['sort'],
  tags: ['sorting', 'array', 'stable'],
  prerequisites: [],
  constraints: [],
  complexity: { time: 'O(n²)', space: 'O(1)' },
  pitfalls: [],
  related: { algorithms: [], problems: [], concepts: [] },
};

export function AlgorithmsPage() {
  const [activeTab, setActiveTab] = useState<'theory' | 'problem'>('theory');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const theoryPages: PageMeta[] = [BUBBLE_SORT, ...getPagesByKind('algorithm')];
  const problemPages: PageMeta[] = getPagesByKind('problem');

  const currentPages = activeTab === 'theory' ? theoryPages : problemPages;

  const categories = Array.from(
    new Set(currentPages.flatMap((p) => p.category))
  ).sort();

  const filteredPages = activeCategory
    ? currentPages.filter((p) => p.category.includes(activeCategory))
    : currentPages;

  function switchTab(tab: 'theory' | 'problem') {
    setActiveTab(tab);
    setActiveCategory(null);
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>
        アルゴリズムとデータ構造
      </h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        理論（アルゴリズムの仕組み）と問題パターン（使いどころ）で引く。
      </p>

      {/* ── Tabs ── */}
      <div style={tabBarStyle}>
        <button style={tabBtnStyle(activeTab === 'theory')} onClick={() => switchTab('theory')}>
          理論
        </button>
        <button style={tabBtnStyle(activeTab === 'problem')} onClick={() => switchTab('problem')}>
          問題
        </button>
      </div>

      {/* ── Category filter chips ── */}
      <div style={chipBarStyle}>
        <button style={filterChipStyle(activeCategory === null)} onClick={() => setActiveCategory(null)}>
          すべて
        </button>
        {categories.map((cat) => (
          <button key={cat} style={filterChipStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Cards ── */}
      <div style={gridStyle}>
        {filteredPages.map((p) => (
          <Link key={p.id} to={p.route} style={{ textDecoration: 'none' }}>
            <div
              style={cardStyle}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={cardTitleStyle}>{p.title}</div>
              <div style={cardMetaStyle}>
                時間: {p.complexity.time} / 空間: {p.complexity.space}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {p.tags.slice(0, 3).map((t) => (
                  <Chip key={t} label={t} color={activeTab === 'theory' ? 'blue' : 'orange'} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const tabBarStyle: CSSProperties = {
  display: 'flex',
  borderBottom: '2px solid #dee2e6',
  marginBottom: '1rem',
};

function tabBtnStyle(active: boolean): CSSProperties {
  return {
    padding: '0.5rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: active ? '#4f8ef7' : '#6c757d',
    borderBottom: `2px solid ${active ? '#4f8ef7' : 'transparent'}`,
    marginBottom: '-2px',
    transition: 'color 0.15s, border-color 0.15s',
  };
}

const chipBarStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

function filterChipStyle(active: boolean): CSSProperties {
  return {
    padding: '0.25rem 0.75rem',
    fontSize: '0.78rem',
    fontWeight: 600,
    borderRadius: '999px',
    border: `1px solid ${active ? '#4f8ef7' : '#dee2e6'}`,
    background: active ? '#4f8ef7' : '#fff',
    color: active ? '#fff' : '#6c757d',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  };
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
};

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  padding: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  transition: 'box-shadow 0.15s',
  height: '100%',
};

const cardTitleStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: '1rem',
  color: '#212529',
};

const cardMetaStyle: CSSProperties = {
  fontSize: '0.82rem',
  color: '#6c757d',
};
