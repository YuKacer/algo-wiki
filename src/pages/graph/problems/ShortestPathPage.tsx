import { useState } from 'react';
import { getPageById } from '../../../content/pages';
import { Layout } from '../../../components/Layout/Layout';
import { MetaPanel } from '../../../components/MetaPanel';
import { RelatedPanel } from '../../../components/RelatedPanel';
import React from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#1a1a2e', borderBottom: '2px solid #e9ecef', paddingBottom: '0.3rem' }}>{title}</h2>
      {children}
    </section>
  );
}

type WAnswer = boolean | null;

function AlgoWizard() {
  const [hasWeight, setHasWeight] = useState<WAnswer>(null);
  const [is01, setIs01] = useState<WAnswer>(null);
  const [hasNeg, setHasNeg] = useState<WAnswer>(null);
  const [allPairs, setAllPairs] = useState<WAnswer>(null);

  const reset = () => { setHasWeight(null); setIs01(null); setHasNeg(null); setAllPairs(null); };

  let result: { algo: string; note: string; color: string } | null = null;
  if (hasWeight === false) result = { algo: 'BFS', note: '辺の重みが全て同じ（または重みなし）。O(V+E)', color: '#4f8ef7' };
  else if (hasWeight === true && is01 === true) result = { algo: '0-1 BFS（未作成）', note: '重みが 0 か 1 のみ。deque を使う。O(V+E)', color: '#9c59d1' };
  else if (hasWeight === true && is01 === false && hasNeg === false && allPairs === false) result = { algo: 'Dijkstra', note: '非負重み・単一始点。O((V+E)logV)', color: '#4f8ef7' };
  else if (hasWeight === true && is01 === false && hasNeg === false && allPairs === true) result = { algo: 'Warshall-Floyd（未作成）または Dijkstra × V 回', note: '全点対。V が小さければ WF: O(V³)', color: '#9c59d1' };
  else if (hasWeight === true && is01 === false && hasNeg === true) result = { algo: 'Bellman-Ford（未作成）', note: '負辺あり。負閉路検出も可。O(VE)', color: '#dc3545' };

  function Ask({ q, value, onChange }: { q: string; value: WAnswer; onChange: (v: boolean) => void }) {
    return (
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>{q}</div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['YES', 'NO'] as const).map((label) => {
            const v = label === 'YES';
            return (
              <button
                key={label}
                onClick={() => onChange(v)}
                style={{
                  padding: '0.3rem 0.9rem', border: '1px solid #ced4da', borderRadius: '4px',
                  background: value === v ? '#4f8ef7' : '#fff',
                  color: value === v ? '#fff' : '#212529',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: value === v ? 'bold' : 'normal',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>アルゴリズム選択ウィザード</div>
      <Ask q="辺に重みがありますか？（全て同じ重みなら「NO」）" value={hasWeight} onChange={(v) => { setHasWeight(v); setIs01(null); setHasNeg(null); setAllPairs(null); }} />
      {hasWeight === true && <Ask q="重みは 0 か 1 のみですか？" value={is01} onChange={(v) => { setIs01(v); setHasNeg(null); setAllPairs(null); }} />}
      {hasWeight === true && is01 === false && <Ask q="負辺がありますか？" value={hasNeg} onChange={(v) => { setHasNeg(v); setAllPairs(null); }} />}
      {hasWeight === true && is01 === false && hasNeg === false && <Ask q="全点対最短路が必要ですか？" value={allPairs} onChange={setAllPairs} />}

      {result && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#e8f0fe', border: `2px solid ${result.color}`, borderRadius: '6px' }}>
          <div style={{ fontWeight: 700, color: result.color, fontSize: '1rem', marginBottom: '0.25rem' }}>→ {result.algo}</div>
          <div style={{ fontSize: '0.85rem', color: '#495057' }}>{result.note}</div>
        </div>
      )}
      {(hasWeight !== null) && (
        <button onClick={reset} style={{ marginTop: '0.75rem', padding: '0.25rem 0.7rem', border: '1px solid #ced4da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem' }}>
          リセット
        </button>
      )}
    </div>
  );
}

export function ShortestPathPage() {
  const meta = getPageById('shortest-path')!;
  return (
    <Layout meta={meta}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: '#1a1a2e' }}>{meta.title}</h1>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        「最短距離・最小コスト・最少ステップ」を求める問題の総称。
        辺の重みの性質でアルゴリズムが決まる。
      </p>

      <Section title="症状（見分け方）">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          {[
            '「頂点 s から頂点 t への最短距離を求めよ」',
            '「最少手数 / 最小コストで到達できるか」',
            '「グリッドを移動するとき、最短で何ステップかかるか」',
            '「到達できない場合は -1 を出力せよ」',
          ].map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Section>

      <Section title="🧭 アルゴリズム選択ウィザード">
        <AlgoWizard />
      </Section>

      <Section title="判定フロー（テキスト版）">
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 2 }}>
          辺に重みあり？<br />
          ├─ NO → <strong>BFS</strong>（O(V+E)）<br />
          └─ YES → 重みが 0/1 のみ？<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ YES → <strong>0-1 BFS</strong>（未作成）<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ NO → 負辺あり？<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ YES → <strong>Bellman-Ford</strong>（未作成）<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ NO → 全点対？<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ YES → <strong>Warshall-Floyd</strong>（未作成）<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ NO → <strong>Dijkstra</strong>（O((V+E)logV)）
        </div>
      </Section>

      <Section title="実装メモ">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <strong>INF のオーバーフロー：</strong>
            <code style={{ marginLeft: '0.4rem' }}>{'const ll INF = 1e18; // INT_MAX だと +w でオーバーフロー'}</code>
          </div>
          <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <strong>多始点 BFS：</strong> 全始点を dist=0 でキューに入れてから BFS を1回実行。始点ごとに BFS を回すと TLE。
          </div>
          <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <strong>経路復元：</strong> dist 更新時に <code>prev[u] = v</code> を記録。ゴールから prev[] を逆にたどる。
          </div>
        </div>
      </Section>

      <Section title="メタ情報"><MetaPanel meta={meta} /></Section>

      <Section title="例題枠">
        <ul style={{ margin: 0, paddingLeft: '1.4rem', lineHeight: 1.8, fontSize: '0.9rem' }}>
          <li>例：無向グラフで頂点 1 から N への最短距離（重みなし → BFS）</li>
          <li>例：都市間コストが各辺に付き最小コストで移動（非負重み → Dijkstra）</li>
          <li>例：グリッド最短ステップ（重みなし → BFS）</li>
          <li>例：辺コストが 0 か 1 のみ（→ 0-1 BFS）</li>
        </ul>
      </Section>

      <Section title="関連">
        <RelatedPanel meta={meta} extraUnimplemented={['0-1 BFS', 'Bellman-Ford', 'Warshall-Floyd']} />
      </Section>
    </Layout>
  );
}
