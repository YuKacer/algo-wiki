import { useState } from 'react';
import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { GraphView } from '../../../graph/GraphView';
import { dfsSteps } from '../../../algorithms/dfsSteps';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

const DIRECTED_WITH_CYCLE: Graph = {
  n: 4, directed: true,
  edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 1 }],
};
const DIRECTED_NO_CYCLE: Graph = {
  n: 4, directed: true,
  edges: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }],
};
const UNDIRECTED_WITH_CYCLE: Graph = {
  n: 4, directed: false,
  edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 }],
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
  const configs = [
    { label: '有向・サイクルあり', graph: DIRECTED_WITH_CYCLE, hasCycle: true },
    { label: '有向・サイクルなし', graph: DIRECTED_NO_CYCLE, hasCycle: false },
    { label: '無向・サイクルあり', graph: UNDIRECTED_WITH_CYCLE, hasCycle: true },
  ];
  const [sel, setSel] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const cfg = configs[sel];
  const steps = dfsSteps(cfg.graph, 0);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {configs.map((c, i) => (
          <button key={i} onClick={() => { setSel(i); setStepIdx(0); }}
            style={{ padding: '0.3rem 0.7rem', border: '1px solid #ced4da', borderRadius: '4px', background: sel === i ? '#4f8ef7' : '#fff', color: sel === i ? '#fff' : '#212529', cursor: 'pointer', fontSize: '0.82rem' }}>
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '4px', background: cfg.hasCycle ? '#ffebee' : '#e8f5e9', fontSize: '0.85rem', fontWeight: 600, color: cfg.hasCycle ? '#c62828' : '#2e7d32' }}>
        {cfg.hasCycle ? '⚠ サイクルあり' : '✅ サイクルなし（DAG）'}
      </div>
      <GraphView graph={cfg.graph} step={step} height={220} />
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} style={btnStyle} disabled={stepIdx === 0}>◀</button>
        <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} style={btnStyle} disabled={stepIdx >= steps.length - 1}>▶</button>
        <span style={{ fontSize: '0.82rem', color: '#6c757d' }}>{stepIdx + 1}/{steps.length}</span>
        <span style={{ fontSize: '0.85rem', marginLeft: '0.5rem', flex: 1 }}>{step?.message}</span>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: '0.3rem 0.7rem', border: '1px solid #ced4da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' };

export function CycleDetectionPage() {
  const meta = getPageById('cycle-detection')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        グラフに閉路が存在するかどうかを判定する。有向と無向で手法が異なる。
      </p>

      <Section title="症状（見分け方）">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          {[
            '「このグラフは DAG ですか？」',
            '「閉路（サイクル）は存在しますか？」',
            '「処理の依存関係が循環していないか確認せよ」',
            '「位相順序が存在するか判定せよ」',
          ].map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Section>

      <Section title="判定フロー">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 2 }}>
          グラフの種類<br />
          ├─ <strong>有向グラフ</strong><br />
          │&nbsp;&nbsp;&nbsp;&nbsp;├─ DFS 3色塗り（gray への辺 = 後退辺 = サイクル）<br />
          │&nbsp;&nbsp;&nbsp;&nbsp;└─ Kahn 法失敗（output.size() &lt; V → サイクルあり）<br />
          └─ <strong>無向グラフ</strong><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ DFS + parent 記録（親以外の訪問済みへの辺 = サイクル）
        </div>
      </Section>

      <Section title="⚠ 有向 vs 無向で手法が違う">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: '#e8f0fe', border: '1px solid #4f8ef7', borderRadius: '6px', padding: '0.75rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.88rem' }}>有向グラフ（3色塗り）</div>
            <code style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
              color[u] == 1（処理中）への辺<br />
              = 後退辺 = サイクル
            </code>
          </div>
          <div style={{ background: '#fff3e0', border: '1px solid #f7944f', borderRadius: '6px', padding: '0.75rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.88rem' }}>無向グラフ（parent 記録）</div>
            <code style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
              dfs(v, parent)<br />
              u != parent かつ visited[u] → サイクル
            </code>
          </div>
        </div>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>

      <Section title="ミニ可視化：DFS によるサイクル検出">
        <MiniViz />
      </Section>

      <Section title="例題枠">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          <li>例：N 個のタスクと依存関係が与えられ、実行可能（DAG か）かを判定</li>
          <li>例：有向グラフで「閉路が存在するか」判定し、存在すれば -1 を出力</li>
          <li>例：トポロジカルソートを実行し、失敗したら「impossible」</li>
        </ul>
      </Section>

      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['Union-Find（動的辺追加のサイクル検出）']} />
      </Section>
    </Layout>
  );
}
