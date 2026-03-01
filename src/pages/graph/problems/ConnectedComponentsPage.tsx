import { useState } from 'react';
import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { GraphView } from '../../../graph/GraphView';
import { bfsSteps } from '../../../algorithms/bfsSteps';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

// 2連結成分を持つサンプルグラフ
const DEMO_GRAPH: Graph = {
  n: 7, directed: false,
  edges: [
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 2 }, // 成分A
    { from: 3, to: 4 },                                           // 成分B
    { from: 5, to: 6 },                                           // 成分C
  ],
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#1a1a2e', borderBottom: '2px solid #e9ecef', paddingBottom: '0.3rem' }}>{title}</h2>
      {children}
    </section>
  );
}

function MiniViz() {
  const [startNode, setStartNode] = useState(0);
  const steps = bfsSteps(DEMO_GRAPH, startNode);
  const [stepIdx, setStepIdx] = useState(0);

  const run = (s: number) => {
    setStartNode(s);
    setStepIdx(0);
  };

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
      <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
        始点を選んで BFS。3つの連結成分があります。BFS は始点の成分しか訪問できません。
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {Array.from({ length: DEMO_GRAPH.n }, (_, i) => (
          <button
            key={i}
            onClick={() => run(i)}
            style={{
              padding: '0.25rem 0.6rem', border: '1px solid #ced4da', borderRadius: '4px',
              background: startNode === i ? '#4f8ef7' : '#fff', color: startNode === i ? '#fff' : '#495057',
              cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            頂点 {i}
          </button>
        ))}
      </div>
      <GraphView graph={DEMO_GRAPH} step={steps[Math.min(stepIdx, steps.length - 1)]} height={240} />
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} style={btnStyle} disabled={stepIdx === 0}>◀</button>
        <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} style={btnStyle} disabled={stepIdx >= steps.length - 1}>▶</button>
        <span style={{ fontSize: '0.82rem', color: '#6c757d' }}>{stepIdx + 1} / {steps.length}</span>
        <span style={{ fontSize: '0.85rem', marginLeft: '0.5rem', flex: 1 }}>{steps[Math.min(stepIdx, steps.length - 1)]?.message}</span>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: '0.3rem 0.7rem', border: '1px solid #ced4da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' };

export function ConnectedComponentsPage() {
  const meta = getPageById('connected-components')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        グラフが「いくつの塊に分かれるか」「頂点 u と v は繋がっているか」を判定する問題パターン。
      </p>

      <Section title="症状（見分け方）">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          {[
            '「頂点 u と v は連結ですか？」',
            '「グラフはいくつの連結成分に分かれますか？」',
            '「同じグループに属するノードの数を答えよ」',
            '「孤立した島の数を求めよ」（グリッド上の連結成分）',
          ].map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Section>

      <Section title="判定フロー">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 2 }}>
          グラフの種類を確認<br />
          ├─ <strong>無向グラフ</strong><br />
          │&nbsp;&nbsp;&nbsp;&nbsp;├─ クエリが少ない → BFS または DFS で全成分を列挙<br />
          │&nbsp;&nbsp;&nbsp;&nbsp;└─ 辺追加クエリあり → Union-Find（未作成）<br />
          └─ <strong>有向グラフ</strong><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ 弱連結（どちらかから到達） → 無向扱いで BFS/DFS<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ 強連結（互いに到達） → SCC（未作成）
        </div>
      </Section>

      <Section title="使う道具">
        <table style={tblStyle}>
          <thead><tr><Th>条件</Th><Th>推奨</Th></tr></thead>
          <tbody>
            {[
              ['無向グラフ・一括処理', 'BFS または DFS'],
              ['無向グラフ・辺追加クエリあり', 'Union-Find（未作成）'],
              ['有向グラフ・弱連結成分', '無向扱いで BFS/DFS'],
              ['有向グラフ・強連結成分', 'SCC（未作成）'],
            ].map(([c, r], i) => <tr key={i}><Td>{c}</Td><Td>{r}</Td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="実装メモ">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.88rem', lineHeight: 1.7 }}>
          <strong>非連結グラフの外側ループ（最頻ミス）</strong><br />
          <code style={{ background: '#e8f0fe', display: 'block', padding: '0.3em 0.6em', margin: '0.3em 0', borderRadius: 3 }}>
            {'for (int v = 0; v < V; v++) { if (!visited[v]) { bfs(v); cnt++; } }'}
          </code>
          この外側ループを忘れると、始点の成分しか探索せず残りを見落とす。
        </div>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>

      <Section title="ミニ可視化：BFS で連結成分を探索">
        <MiniViz />
      </Section>

      <Section title="例題枠">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          <li>例：H×W グリッドに '.' と '#' があり、'.' の連結成分の数と最大サイズを求める</li>
          <li>例：N 人の友人関係グラフで「同じグループになる人数の最大値」</li>
          <li>例：辺を順に追加していき、初めて全体が1つの成分になるタイミング（→ Union-Find）</li>
        </ul>
      </Section>

      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['Union-Find', 'SCC']} />
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
