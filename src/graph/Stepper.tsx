import type { StepState } from './GraphTypes';

interface StepperProps {
  steps: StepState[];
  currentIndex: number;
  isPlaying: boolean;
  algoId: 'bfs' | 'dfs' | 'dijkstra' | 'toposort';
  onIndexChange: (i: number) => void;
  onPlayingChange: (p: boolean) => void;
}

export function Stepper({ steps, currentIndex, isPlaying, algoId, onIndexChange, onPlayingChange }: StepperProps) {
  const total = steps.length;
  const current = steps[currentIndex];

  if (steps.length === 0) return <div style={{ padding: '1rem', color: '#888' }}>グラフを設定して Run を押してください</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Message */}
      <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.6rem 0.9rem', fontSize: '0.9rem', minHeight: '2.5rem', color: '#212529' }}>
        <span style={{ color: '#6c757d', fontSize: '0.78rem', marginRight: '0.5rem' }}>Step {currentIndex + 1}/{total}</span>
        {current?.message}
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="range" min={0} max={total - 1} value={currentIndex}
          onChange={(e) => { onPlayingChange(false); onIndexChange(Number(e.target.value)); }}
          style={{ flex: 1, accentColor: '#4f8ef7' }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <Btn onClick={() => { onPlayingChange(false); onIndexChange(0); }} label="⏮ Reset" />
        <Btn onClick={() => { onPlayingChange(false); onIndexChange(Math.max(0, currentIndex - 1)); }} label="◀ Prev" disabled={currentIndex === 0} />
        <Btn
          onClick={() => {
            if (currentIndex >= total - 1) { onIndexChange(0); onPlayingChange(true); }
            else onPlayingChange(!isPlaying);
          }}
          label={isPlaying ? '⏸ Pause' : '▶ Auto'}
          primary
        />
        <Btn onClick={() => { onPlayingChange(false); onIndexChange(Math.min(total - 1, currentIndex + 1)); }} label="Next ▶" disabled={currentIndex === total - 1} />
      </div>

      {/* State panel */}
      {current && <StatePanel step={current} algoId={algoId} />}
    </div>
  );
}

function Btn({ onClick, label, disabled, primary }: { onClick: () => void; label: string; disabled?: boolean; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.4rem 0.8rem', border: '1px solid #ced4da', borderRadius: '5px',
        background: primary ? '#4f8ef7' : '#fff', color: primary ? '#fff' : '#212529',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        fontWeight: primary ? 'bold' : 'normal', fontSize: '0.85rem',
      }}
    >
      {label}
    </button>
  );
}

function StatePanel({ step, algoId }: { step: StepState; algoId: string }) {
  const aux = step.aux ?? {};
  return (
    <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '6px', padding: '0.75rem', fontSize: '0.82rem' }}>
      {algoId === 'bfs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Row label="queue">{JSON.stringify(aux['queue'] ?? [])}</Row>
          <Row label="dist">{step.dist ? step.dist.map((d) => (d === null ? '∞' : d)).join(', ') : '-'}</Row>
          <Row label="parent">{step.parent ? step.parent.map((p) => (p === null ? '-' : p)).join(', ') : '-'}</Row>
        </div>
      )}
      {algoId === 'dfs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Row label="stack">{JSON.stringify(aux['stack'] ?? [])}</Row>
          <Row label="color (0=白, 1=灰, 2=黒)">{(aux['color'] as number[] | undefined)?.join(', ') ?? '-'}</Row>
          <Row label="サイクル">{String(aux['hasCycle'] ?? false)}</Row>
        </div>
      )}
      {algoId === 'dijkstra' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Row label="pq (先頭5件)">{JSON.stringify(aux['pq'] ?? [])}</Row>
          <Row label="dist">{step.dist ? step.dist.map((d) => (d === null ? '∞' : d)).join(', ') : '-'}</Row>
          <Row label="parent">{step.parent ? step.parent.map((p) => (p === null ? '-' : p)).join(', ') : '-'}</Row>
        </div>
      )}
      {algoId === 'toposort' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Row label="inDeg">{(aux['inDeg'] as number[] | undefined)?.join(', ') ?? '-'}</Row>
          <Row label="queue">{JSON.stringify(aux['queue'] ?? [])}</Row>
          <Row label="output">{JSON.stringify(aux['output'] ?? [])}</Row>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', minWidth: 0 }}>
      <span style={{ color: '#6c757d', minWidth: '80px' }}>{label}:</span>
      <span style={{ fontFamily: 'monospace', color: '#212529', minWidth: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {children}
      </span>
    </div>
  );
}

import React from 'react';
