import { useState } from 'react';
import type { Graph, Edge } from './GraphTypes';

interface GraphEditorProps {
  graph: Graph;
  onChange: (g: Graph) => void;
  startNode: number;
  onStartChange: (n: number) => void;
  showWeight?: boolean;
  samples: { label: string; graph: Graph; startNode?: number }[];
}

export function GraphEditor({
  graph, onChange, startNode, onStartChange, showWeight = false, samples,
}: GraphEditorProps) {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [weight, setWeight] = useState(1);
  const [open, setOpen] = useState(false);

  const addEdge = () => {
    if (from === to) return;
    const dup = graph.edges.some(
      (e) => e.from === from && e.to === to || (!graph.directed && e.from === to && e.to === from)
    );
    if (dup) return;
    const newEdge: Edge = showWeight ? { from, to, weight } : { from, to };
    onChange({ ...graph, edges: [...graph.edges, newEdge] });
  };

  const removeEdge = (idx: number) => {
    onChange({ ...graph, edges: graph.edges.filter((_, i) => i !== idx) });
  };

  const changeN = (n: number) => {
    const edges = graph.edges.filter((e) => e.from < n && e.to < n);
    onChange({ ...graph, n, edges });
    if (startNode >= n) onStartChange(0);
  };

  const loadSample = (s: { graph: Graph; startNode?: number }) => {
    onChange(s.graph);
    onStartChange(s.startNode ?? 0);
  };

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', background: '#fff' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', padding: '0.6rem 1rem', background: 'none', border: 'none',
          textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
          color: '#495057', display: 'flex', justifyContent: 'space-between',
        }}
      >
        <span>グラフを編集</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Samples */}
          <div>
            <Label>サンプル</Label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {samples.map((s, i) => (
                <button key={i} onClick={() => loadSample(s)} style={btnStyle}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* N and directed */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <Label>頂点数 N = {graph.n}</Label>
              <input
                type="range" min={2} max={12} value={graph.n}
                onChange={(e) => changeN(Number(e.target.value))}
                style={{ width: '120px', accentColor: '#4f8ef7' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input
                type="checkbox" checked={graph.directed}
                onChange={(e) => onChange({ ...graph, directed: e.target.checked })}
              />
              有向グラフ
            </label>
          </div>

          {/* Start node */}
          <div>
            <Label>始点</Label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {Array.from({ length: graph.n }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onStartChange(i)}
                  style={{
                    ...btnStyle,
                    background: startNode === i ? '#4f8ef7' : '#fff',
                    color: startNode === i ? '#fff' : '#495057',
                    border: `1px solid ${startNode === i ? '#4f8ef7' : '#ced4da'}`,
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Add edge */}
          <div>
            <Label>辺を追加</Label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <NumInput label="from" value={from} max={graph.n - 1} onChange={setFrom} />
              <span style={{ color: '#6c757d' }}>→</span>
              <NumInput label="to" value={to} max={graph.n - 1} onChange={setTo} />
              {showWeight && (
                <>
                  <span style={{ color: '#6c757d' }}>w=</span>
                  <NumInput label="weight" value={weight} max={99} onChange={setWeight} />
                </>
              )}
              <button onClick={addEdge} style={{ ...btnStyle, background: '#4f8ef7', color: '#fff', border: 'none' }}>
                追加
              </button>
            </div>
          </div>

          {/* Edge list */}
          {graph.edges.length > 0 && (
            <div>
              <Label>辺一覧</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {graph.edges.map((e, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#f8f9fa', border: '1px solid #dee2e6',
                      borderRadius: '4px', padding: '0.15rem 0.5rem',
                      fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    {e.from}{graph.directed ? '→' : '-'}{e.to}
                    {e.weight !== undefined && `(w=${e.weight})`}
                    <button
                      onClick={() => removeEdge(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: 0, fontSize: '0.85rem' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.78rem', color: '#6c757d', marginBottom: '0.25rem' }}>{children}</div>;
}

function NumInput({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number" min={0} max={max} value={value}
      onChange={(e) => onChange(Math.max(0, Math.min(max, Number(e.target.value))))}
      title={label}
      style={{ width: '52px', padding: '0.3rem 0.4rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.88rem' }}
    />
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.3rem 0.7rem',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

import React from 'react';
