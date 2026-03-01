import { useState } from 'react';
import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import { GraphView } from '../../../graph/GraphView';
import { toposortSteps } from '../../../algorithms/toposortSteps';
import type { Graph } from '../../../graph/GraphTypes';
import React from 'react';

const DEMO_GRAPH: Graph = {
  n: 6, directed: true,
  edges: [
    { from: 0, to: 2 }, { from: 1, to: 2 }, { from: 2, to: 3 },
    { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
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
  const steps = toposortSteps(DEMO_GRAPH);
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
      <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
        科目履修グラフ（0,1 → 2 → 3,4 → 5）。Kahn 法でトポロジカルソートをステップ実行。
      </div>
      <GraphView graph={DEMO_GRAPH} step={step} height={240} />
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setStepIdx(0)} style={btnStyle}>⏮</button>
        <button onClick={() => setStepIdx((p) => Math.max(0, p - 1))} style={btnStyle} disabled={stepIdx === 0}>◀</button>
        <button onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} style={btnStyle} disabled={stepIdx >= steps.length - 1}>▶</button>
        <span style={{ fontSize: '0.82rem', color: '#6c757d' }}>{stepIdx + 1}/{steps.length}</span>
        <span style={{ fontSize: '0.85rem', marginLeft: '0.5rem', flex: 1 }}>{step?.message}</span>
      </div>
      {step?.aux && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', fontFamily: 'monospace', background: '#f8f9fa', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
          <span style={{ color: '#6c757d' }}>inDeg: </span>{(step.aux['inDeg'] as number[] | undefined)?.join(', ')}&nbsp;&nbsp;
          <span style={{ color: '#6c757d' }}>queue: </span>{JSON.stringify(step.aux['queue'] ?? [])}&nbsp;&nbsp;
          <span style={{ color: '#6c757d' }}>output: </span>{JSON.stringify(step.aux['output'] ?? [])}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: '0.3rem 0.7rem', border: '1px solid #ced4da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' };

export function DagOrderingPage() {
  const meta = getPageById('dag-ordering')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        タスク・科目・ビルドなど「先にやるべきものがある」依存関係を、矛盾なく順序付けする問題。
        トポロジカルソートで解く。<strong>サイクルがあれば有効な順序は存在しない。</strong>
      </p>

      <Section title="症状（見分け方）">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          {[
            '「タスク A はタスク B より前に実行されなければならない」',
            '「科目 X を履修するには Y と Z を先に修了する必要がある」',
            '「有効な実行順序を1つ出力せよ。存在しない場合は -1 を出力」',
            '「処理順序が存在するか判定せよ」',
          ].map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Section>

      <Section title="判定フロー">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 2 }}>
          依存関係を有向グラフに変換（辺 A→B = A が B の前提）<br />
          ├─ サイクルが存在する？<br />
          │&nbsp;&nbsp;&nbsp;&nbsp;YES → 有効な順序なし（-1 / impossible を出力）<br />
          │&nbsp;&nbsp;&nbsp;&nbsp;NO → トポロジカルソートで順序を求める<br />
          └─ 追加の条件<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ 辞書順最小 → priority_queue（min-heap）<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ DAG 上の DP → トポソ順に DP を処理
        </div>
      </Section>

      <Section title="辺の向きの定義（最頻ミス）">
        <table style={tblStyle}>
          <thead><tr><Th>問題文の表現</Th><Th>グラフの辺</Th></tr></thead>
          <tbody>
            {[
              ['「A の後に B を行う」', 'A → B'],
              ['「B をやる前に A が必要」', 'A → B'],
              ['「A は B に依存する」', 'B → A（B が前提）'],
            ].map(([text, edge], i) => <tr key={i}><Td>{text}</Td><Td><code>{edge}</code></Td></tr>)}
          </tbody>
        </table>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>

      <Section title="ミニ可視化：Kahn 法のステップ実行">
        <MiniViz />
      </Section>

      <Section title="例題枠">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          <li>例：N 科目の履修関係が与えられ、全科目を履修できる順序を1つ出力（不可なら -1）</li>
          <li>例：ビルドシステムでファイルの依存関係グラフが与えられコンパイル順序を求める</li>
          <li>例：DAG 上の最長路（タスクの最小完了時間 = クリティカルパス）</li>
        </ul>
      </Section>

      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['DAG 上の DP', 'SCC（縮約後にトポソ）']} />
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
