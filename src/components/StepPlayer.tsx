import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface StepPlayerLabels {
  reset: string;
  prev: string;
  play: string;
  pause: string;
  next: string;
  slider: string;
  done: string;
}

interface StepRenderContext {
  stepIndex: number;
  isPlaying: boolean;
  isEnded: boolean;
  totalSteps: number;
}

interface StepPlayerProps {
  totalSteps: number;
  intervalMs?: number;
  autoPlay?: boolean;
  labels?: Partial<StepPlayerLabels>;
  renderStep: (ctx: StepRenderContext) => ReactNode;
  renderStatus?: (ctx: StepRenderContext) => ReactNode;
}

const DEFAULT_LABELS: StepPlayerLabels = {
  reset: 'リセット',
  prev: '前へ',
  play: '再生',
  pause: '停止',
  next: '次へ',
  slider: 'ステップ選択',
  done: '',
};

export function StepPlayer({
  totalSteps,
  intervalMs = 1600,
  autoPlay = false,
  labels,
  renderStep,
  renderStatus,
}: StepPlayerProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying || totalSteps < 2) return;

    const id = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, isPlaying, totalSteps]);

  const isEnded = !isPlaying && stepIndex === totalSteps - 1;
  const ctx: StepRenderContext = { stepIndex, isPlaying, isEnded, totalSteps };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      {renderStep(ctx)}

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={stepIndex}
        onChange={(e) => {
          setIsPlaying(false);
          setStepIndex(Number(e.target.value));
        }}
        aria-label={mergedLabels.slider}
        aria-valuetext={`ステップ ${stepIndex + 1} / ${totalSteps}`}
        style={{ width: '100%', accentColor: '#4f8ef7' }}
      />

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setStepIndex(0);
          }}
          style={btnStyle(false, false)}
        >
          {mergedLabels.reset}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setStepIndex((prev) => Math.max(0, prev - 1));
          }}
          style={btnStyle(false, stepIndex === 0)}
          disabled={stepIndex === 0}
        >
          {mergedLabels.prev}
        </button>

        <button
          type="button"
          onClick={() => {
            if (stepIndex >= totalSteps - 1) {
              setStepIndex(0);
            }
            setIsPlaying((prev) => !prev);
          }}
          style={btnStyle(true, false)}
        >
          {isPlaying ? mergedLabels.pause : mergedLabels.play}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
          }}
          style={btnStyle(false, stepIndex === totalSteps - 1)}
          disabled={stepIndex === totalSteps - 1}
        >
          {mergedLabels.next}
        </button>
      </div>

      {renderStatus ? (
        renderStatus(ctx)
      ) : isEnded && mergedLabels.done ? (
        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>{mergedLabels.done}</p>
      ) : null}
    </div>
  );
}

function btnStyle(primary: boolean, disabled: boolean): CSSProperties {
  return {
    padding: '0.45rem 0.85rem',
    borderRadius: '6px',
    border: `1px solid ${primary ? '#4f8ef7' : '#ced4da'}`,
    background: primary ? '#4f8ef7' : '#fff',
    color: primary ? '#fff' : '#212529',
    fontWeight: primary ? 700 : 500,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
