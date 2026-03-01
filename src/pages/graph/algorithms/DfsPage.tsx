import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { CodeBlock } from '../../../components/CodeBlock';
import { GraphPlayground } from '../../../graph/GraphPlayground';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

const DFS_CODE = `
// ① 基本形（連結成分カウント）
vector<bool> visited;
void dfs(int v, const vector<vector<int>>& g) {
    visited[v] = true;
    for (int u : g[v]) if (!visited[u]) dfs(u, g);
}
int countComponents(int V) {
    visited.assign(V, false);
    int cnt = 0;
    for (int v = 0; v < V; v++)
        if (!visited[v]) { dfs(v, graph); cnt++; }
    return cnt;
}

// ② 有向グラフのサイクル検出（3色塗り）
vector<int> color; // 0=white, 1=gray, 2=black
bool hasCycle = false;
void dfsCycle(int v) {
    color[v] = 1;
    for (int u : graph[v]) {
        if (color[u] == 1) { hasCycle = true; return; }
        if (color[u] == 0) dfsCycle(u);
    }
    color[v] = 2;
}

// ③ 帰りがけ順（トポソ前処理）
vector<int> order;
void dfsOrder(int v) {
    visited[v] = true;
    for (int u : graph[v]) if (!visited[u]) dfsOrder(u);
    order.push_back(v); // 帰りがけ
}
`.trim();

const samples = [
  {
    label: '木 (5頂点)',
    graph: {
      n: 5, directed: false,
      edges: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }],
    } as Graph,
    startNode: 0,
  },
  {
    label: '有向サイクル',
    graph: {
      n: 4, directed: true,
      edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 1 }],
    } as Graph,
    startNode: 0,
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#1a1a2e', borderBottom: '2px solid #e9ecef', paddingBottom: '0.3rem' }}>{title}</h2>
      {children}
    </section>
  );
}

export function DfsPage() {
  const meta = getPageById('dfs')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        1本の経路を終端まで深く追ってから戻る探索手法。再帰またはスタックで実装。
        <strong>連結成分</strong>・<strong>サイクル検出</strong>・<strong>トポソの前処理</strong>に使う。
      </p>

      <Section title="使える条件 / 使えない条件">
        <table style={tblStyle}>
          <thead><tr><Th>目的</Th><Th>使える？</Th><Th>備考</Th></tr></thead>
          <tbody>
            {[
              ['連結成分のカウント・列挙', '✅', 'BFS でも可'],
              ['有向グラフのサイクル検出', '✅', '3色塗り（white/gray/black）'],
              ['無向グラフのサイクル検出', '✅', '親を記録して逆辺を除外'],
              ['帰りがけ順取得（トポソ）', '✅', 'return 直前に push'],
              ['最短距離', '❌', '→ BFS を使う'],
            ].map(([c, o, n], i) => (
              <tr key={i}><Td>{c}</Td><Td>{o}</Td><Td>{n}</Td></tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="何を保持するか">
        <table style={tblStyle}>
          <thead><tr><Th>変数</Th><Th>役割</Th></tr></thead>
          <tbody>
            {[
              ['visited[]', '訪問済みフラグ（基本形）'],
              ['color[]', '0=未訪問, 1=処理中, 2=完了（有向サイクル検出用）'],
              ['parent[]', '親頂点（無向グラフのサイクル検出で逆辺を除外）'],
              ['order', '帰りがけ順の頂点列（トポソ用）'],
            ].map(([k, v], i) => (
              <tr key={i}><Td><code>{k}</code></Td><Td>{v}</Td></tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="サイクル検出：有向 vs 無向">
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <strong>有向グラフ</strong>：color[u] == 1（処理中）への辺 = 後退辺 = サイクル<br />
          <strong>無向グラフ</strong>：dfs(v, parent) で呼び、u != parent の訪問済み辺 = サイクル<br />
          <strong>この2つを混用すると誤検出になる！</strong>
        </div>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>
      <Section title="最小コード（C++）"><CodeBlock code={DFS_CODE} language="cpp" /></Section>
      <Section title="🎮 インタラクティブ可視化">
        <GraphPlayground algoId="dfs" defaultGraph={samples[0].graph} defaultStart={0} samples={samples} />
      </Section>
      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['Bipartite Check', 'SCC']} />
      </Section>
    </Layout>
  );
}

const tblStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', background: '#fff', border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' };
function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '0.5rem 0.75rem', background: '#f8f9fa', textAlign: 'left', fontSize: '0.8rem', color: '#6c757d', borderBottom: '1px solid #dee2e6' }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '0.45rem 0.75rem', borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' }}>{children}</td>;
}
