import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { CodeBlock } from '../../../components/CodeBlock';
import { GraphPlayground } from '../../../graph/GraphPlayground';
import type { Graph } from '../../../graph/GraphTypes';

const BFS_CODE = `
#include <bits/stdc++.h>
using namespace std;

vector<int> bfs(const vector<vector<int>>& graph, int s, int V) {
    vector<int> dist(V, -1);
    queue<int> q;
    dist[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (dist[u] == -1) {  // 未訪問チェックはここで（キューに積む前）
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }
    return dist;  // 到達不可は -1
}
`.trim();

const sample1Graph: Graph = {
  n: 5, directed: false,
  edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
};

const sample2Graph: Graph = {
  n: 6, directed: false,
  edges: [
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
    { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 2, to: 5 },
  ],
};

const sample3Graph: Graph = {
  n: 7, directed: false,
  edges: [
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
    { from: 4, to: 5 },
  ],
};

const samples = [
  { label: 'パス (5頂点)', graph: sample1Graph, startNode: 0 },
  { label: 'ひし形', graph: sample2Graph, startNode: 0 },
  { label: '非連結グラフ', graph: sample3Graph, startNode: 0 },
];

export function BfsPage() {
  const meta = getPageById('bfs')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        始点から近い頂点から順に探索する。<strong>重みなし（または全辺同一コスト）</strong>なら
        最短ステップ数を O(V+E) で求められる。
      </p>

      <Section title="使える条件 / 使えない条件">
        <CondTable rows={[
          { cond: '重みなし（または全辺同一コスト c）', ok: true, note: 'まず辺数最短を求める。重み最短は c 倍で復元できる' },
          { cond: '辺の重みが 0 か 1 のみ', ok: false, note: '通常 BFS は不可。0-1 BFS（未作成）が必要' },
          { cond: '辺に異なる重みがある', ok: false, note: '→ Dijkstra' },
          { cond: '負辺がある', ok: false, note: '→ Bellman-Ford（未作成）' },
        ]} />
      </Section>

      <Section title="何を保持するか">
        <table style={tblStyle}>
          <thead><tr><Th>変数</Th><Th>型</Th><Th>役割</Th></tr></thead>
          <tbody>
            <tr><Td>dist[]</Td><Td>vector&lt;int&gt;</Td><Td>始点からの最短距離。未訪問は -1 で初期化</Td></tr>
            <tr><Td>queue</Td><Td>queue&lt;int&gt;</Td><Td>次に訪問する頂点を FIFO で保持</Td></tr>
            <tr><Td>graph[]</Td><Td>vector&lt;vector&lt;int&gt;&gt;</Td><Td>隣接リスト</Td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="手順">
        <ol style={olStyle}>
          <li>dist を全て -1（未訪問）で初期化</li>
          <li>始点 s を dist[s] = 0 にしてキューに追加</li>
          <li>キューが空になるまで繰り返す：キューから v を取り出し、隣接頂点 u それぞれに対して dist[u] == -1 なら dist[u] = dist[v] + 1 にしてキューに追加</li>
          <li>終了後、dist[t] が求めたい最短距離（到達不可なら -1）</li>
        </ol>
      </Section>

      <Section title="計算量">
        <p style={pStyle}>時間: O(V + E)、空間: O(V)。各頂点・辺を最大1回ずつ処理。</p>
      </Section>

      <Section title="よくある拡張（多始点 BFS）">
        <p style={pStyle}>
          複数の始点から最短距離を取りたいときは、各始点の dist を 0 にして
          最初から同時にキューへ入れる。BFS はそのままで、最初に到達した距離が最短になる。
        </p>
      </Section>

      <Section title="メタ情報">
        <MetaPanel meta={meta} />
      </Section>

      <Section title="最小コード（C++）">
        <CodeBlock code={BFS_CODE} language="cpp" />
      </Section>

      <Section title="🎮 インタラクティブ可視化">
        <GraphPlayground
          algoId="bfs"
          defaultGraph={sample1Graph}
          defaultStart={0}
          samples={samples}
        />
      </Section>

      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['0-1 BFS', '多始点 BFS']} />
      </Section>
    </Layout>
  );
}

// ---- shared helpers ----
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#1a1a2e', borderBottom: '2px solid #e9ecef', paddingBottom: '0.3rem' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function CondTable({ rows }: { rows: { cond: string; ok: boolean | null; note?: string }[] }) {
  return (
    <table style={{ ...tblStyle, marginBottom: 0 }}>
      <thead><tr><Th>条件</Th><Th>使える？</Th><Th>備考</Th></tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <Td>{r.cond}</Td>
            <Td>{r.ok === true ? '✅' : r.ok === false ? '❌' : '△'}</Td>
            <Td>{r.note ?? ''}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tblStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', background: '#fff', border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' };
const olStyle: React.CSSProperties = { margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' };
const pStyle: React.CSSProperties = { margin: 0, fontSize: '0.9rem', lineHeight: 1.7 };

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '0.5rem 0.75rem', background: '#f8f9fa', textAlign: 'left', fontSize: '0.8rem', color: '#6c757d', borderBottom: '1px solid #dee2e6' }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '0.45rem 0.75rem', borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' }}>{children}</td>;
}

import React from 'react';
