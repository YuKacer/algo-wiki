import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { CodeBlock } from '../../../components/CodeBlock';
import { GraphPlayground } from '../../../graph/GraphPlayground';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

const DIJKSTRA_CODE = `
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using P = pair<ll, int>;
const ll INF = 1e18;

vector<ll> dijkstra(const vector<vector<pair<int,ll>>>& g, int s) {
    int V = g.size();
    vector<ll> dist(V, INF);
    priority_queue<P, vector<P>, greater<P>> pq;
    dist[s] = 0;
    pq.push({0, s});
    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;  // 古いエントリを skip（これが重要）
        for (auto [u, w] : g[v]) {
            if (dist[v] + w < dist[u]) {
                dist[u] = dist[v] + w;
                pq.push({dist[u], u});
            }
        }
    }
    return dist;
}
`.trim();

const samples = [
  {
    label: '重み付き (5頂点)',
    graph: {
      n: 5, directed: false,
      edges: [
        { from: 0, to: 1, weight: 2 }, { from: 0, to: 2, weight: 5 },
        { from: 1, to: 3, weight: 3 }, { from: 2, to: 3, weight: 1 }, { from: 3, to: 4, weight: 4 },
      ],
    } as Graph,
    startNode: 0,
  },
  {
    label: '最短路 (4頂点)',
    graph: {
      n: 4, directed: false,
      edges: [
        { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 10 },
        { from: 1, to: 2, weight: 3 }, { from: 2, to: 3, weight: 2 },
      ],
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

export function DijkstraPage() {
  const meta = getPageById('dijkstra')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        <strong>非負の重み</strong>を持つグラフで始点から全頂点への最短距離を求める。
        優先度付きキュー（min-heap）を使い、暫定最短距離が最小の頂点から貪欲に確定する。
      </p>

      <Section title="使える条件 / 使えない条件">
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
          <strong>⚠ 負辺が1本でもある場合は使えない。</strong>Dijkstra は「確定済み頂点の距離は以降更新されない」を前提とした貪欲法。負辺があるとこの前提が崩れる。
        </div>
        <table style={tblStyle}>
          <thead><tr><Th>条件</Th><Th>使える？</Th><Th>代替</Th></tr></thead>
          <tbody>
            {[
              ['辺の重みが全て非負', '✅', '—'],
              ['重みが 0 か 1 のみ', '✅（過剰）', '0-1 BFS（未作成）が速い'],
              ['重みが全て 1（無重み）', '✅（過剰）', 'BFS が速い'],
              ['負辺がある', '❌', 'Bellman-Ford（未作成）'],
              ['全点対最短路', '△', 'Warshall-Floyd（未作成）か V 回実行'],
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
              ['dist[]', '始点から各頂点への暫定最短距離。INF で初期化'],
              ['pq', '(dist, 頂点) を距離昇順で管理する min-heap'],
              ['parent[]', '経路復元が必要な場合。dist 更新時に記録'],
            ].map(([k, v], i) => (
              <tr key={i}><Td><code>{k}</code></Td><Td>{v}</Td></tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="「古いエントリの skip」が重要な理由">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.88rem', lineHeight: 1.7, fontFamily: 'monospace' }}>
          dist[u] を更新するたびに pq に新エントリを push する（lazy deletion）。<br />
          pq から取り出した d が dist[v] より大きければ古いエントリ → skip しないと TLE。<br />
          <br />
          <code style={{ background: '#e8f0fe', padding: '0.1em 0.4em' }}>{'if (d > dist[v]) continue;  // この1行が必須'}</code>
        </div>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>
      <Section title="最小コード（C++）"><CodeBlock code={DIJKSTRA_CODE} language="cpp" /></Section>
      <Section title="🎮 インタラクティブ可視化">
        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
          ※ 辺に重みを設定してください。未設定は w=1 扱いです。
        </p>
        <GraphPlayground algoId="dijkstra" defaultGraph={samples[0].graph} defaultStart={0} samples={samples} />
      </Section>
      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['0-1 BFS', 'Bellman-Ford', 'Warshall-Floyd']} />
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
