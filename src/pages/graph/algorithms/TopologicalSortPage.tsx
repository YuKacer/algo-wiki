import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { CodeBlock } from '../../../components/CodeBlock';
import { GraphPlayground } from '../../../graph/GraphPlayground';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

const TOPOSORT_CODE = `
// Kahn 法（BFS ベース）
vector<int> topologicalSort(const vector<vector<int>>& g, int V) {
    vector<int> inDeg(V, 0);
    for (int v = 0; v < V; v++)
        for (int u : g[v]) inDeg[u]++;

    queue<int> q;
    for (int v = 0; v < V; v++)
        if (inDeg[v] == 0) q.push(v);

    vector<int> order;
    while (!q.empty()) {
        int v = q.front(); q.pop();
        order.push_back(v);
        for (int u : g[v])
            if (--inDeg[u] == 0) q.push(u);
    }
    // order.size() != V ならサイクルあり
    return order;
}
`.trim();

const samples = [
  {
    label: '科目履修 (6頂点)',
    graph: {
      n: 6, directed: true,
      edges: [
        { from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 },
        { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
      ],
    } as Graph,
    startNode: 0,
  },
  {
    label: 'シンプルDAG (4頂点)',
    graph: {
      n: 4, directed: true,
      edges: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }],
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

export function TopologicalSortPage() {
  const meta = getPageById('topological-sort')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        <strong>DAG（有向非巡回グラフ）</strong> の頂点を、辺の向きに矛盾しない線形順序（位相順序）に並べる。
        辺 (u→v) があれば u が v より前に来ることを保証する。<strong>サイクルがあると位相順序は存在しない。</strong>
      </p>

      <Section title="使える条件 / 使えない条件">
        <table style={tblStyle}>
          <thead><tr><Th>条件</Th><Th>使える？</Th></tr></thead>
          <tbody>
            {[
              ['有向非巡回グラフ（DAG）', '✅'],
              ['サイクルを含む有向グラフ', '❌ 位相順序が存在しない。ただし Kahn 法の失敗でサイクルを検出できる'],
              ['無向グラフ', '❌ 方向性がないので位相順序は定義できない'],
            ].map(([c, o], i) => <tr key={i}><Td>{c}</Td><Td>{o}</Td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="Kahn 法の手順（BFS ベース）">
        <ol style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          <li>全頂点の入次数（inDeg）を計算する</li>
          <li>inDeg[v] == 0 の頂点を全てキューに追加</li>
          <li>キューが空になるまで：v を取り出し output に追加、v の隣接頂点 u の inDeg[u]-- をして 0 になったら queue に追加</li>
          <li>output.size() &lt; V なら<strong>サイクルあり</strong>（必ず確認！）</li>
        </ol>
      </Section>

      <Section title="何を保持するか">
        <table style={tblStyle}>
          <thead><tr><Th>変数</Th><Th>役割</Th></tr></thead>
          <tbody>
            {[
              ['inDeg[]', '各頂点の入次数（自分に入ってくる辺の数）'],
              ['queue', '現在 inDeg == 0 の頂点（処理待ち）'],
              ['output', '出来上がった位相順序'],
            ].map(([k, v], i) => <tr key={i}><Td><code>{k}</code></Td><Td>{v}</Td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>
      <Section title="最小コード（C++）"><CodeBlock code={TOPOSORT_CODE} language="cpp" /></Section>
      <Section title="🎮 インタラクティブ可視化">
        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
          ※ 有向グラフ（DAG）を設定してください。サイクルがあると位相順序なし。
        </p>
        <GraphPlayground algoId="toposort" defaultGraph={samples[0].graph} defaultStart={0} samples={samples} />
      </Section>
      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['SCC', 'DAG 上の DP']} />
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
