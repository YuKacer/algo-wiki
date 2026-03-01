import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Frame } from '../algorithms/types';

interface PlayerProps {
  frames: Frame[];
  children: (frame: Frame, codeLine: number | undefined) => ReactNode;
}

const SPEED_OPTIONS = [0.5, 1, 2] as const;
type Speed = (typeof SPEED_OPTIONS)[number];

const BASE_INTERVAL_MS = 800;

export function Player({ frames, children }: PlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalFrames = frames.length;
  const maxIndex = Math.max(totalFrames - 1, 0);
  const effectiveIndex = Math.min(currentIndex, maxIndex);
  const currentFrame = frames[effectiveIndex] ?? null;

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const clampedPrev = Math.min(prev, Math.max(totalFrames - 1, 0));
        if (clampedPrev >= totalFrames - 1) {
          setIsPlaying(false);
          return clampedPrev;
        }
        return clampedPrev + 1;
      });
    }, BASE_INTERVAL_MS / speed);
  }, [speed, totalFrames, stopInterval]);

  useEffect(() => {
    if (isPlaying) {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [isPlaying, startInterval, stopInterval]);

  const handlePlayPause = () => {
    if (effectiveIndex >= totalFrames - 1 && !isPlaying) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((p) => Math.max(0, Math.min(p, maxIndex) - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((p) => Math.min(maxIndex, Math.min(p, maxIndex) + 1));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentIndex(Number(e.target.value));
  };

  if (totalFrames === 0) {
    return (
      <div style={styles.container}>
        <p style={{ textAlign: 'center', color: '#888' }}>フレームデータなし</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 描画エリア */}
      <div style={styles.renderArea}>
        {currentFrame ? children(currentFrame, currentFrame.codeLine) : null}
      </div>

      {/* メッセージ */}
      <div style={styles.message}>
        {currentFrame?.message ?? '\u00A0'}
      </div>

      {/* スライダー */}
      <div style={styles.sliderRow}>
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={effectiveIndex}
          onChange={handleSlider}
          style={styles.slider}
        />
        <span style={styles.frameCounter}>
          {effectiveIndex + 1} / {totalFrames}
        </span>
      </div>

      {/* コントロールボタン */}
      <div style={styles.controls}>
        <button onClick={handlePrev} disabled={effectiveIndex === 0} style={styles.btn} title="1ステップ戻る">
          ◀◀
        </button>
        <button onClick={handlePlayPause} style={{ ...styles.btn, ...styles.btnPrimary }} title={isPlaying ? '停止' : '再生'}>
          {isPlaying ? '⏸ 停止' : '▶ 再生'}
        </button>
        <button onClick={handleNext} disabled={effectiveIndex === totalFrames - 1} style={styles.btn} title="1ステップ進む">
          ▶▶
        </button>

        {/* 速度 */}
        <div style={styles.speedGroup}>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                ...styles.btn,
                ...styles.speedBtn,
                ...(speed === s ? styles.speedBtnActive : {}),
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  renderArea: {
    background: '#fff',
    borderRadius: '6px',
    padding: '1rem 0.5rem 0.25rem',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  message: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#495057',
    minHeight: '1.4em',
    fontStyle: 'italic',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  slider: {
    flex: 1,
    accentColor: '#4f8ef7',
    cursor: 'pointer',
  },
  frameCounter: {
    fontSize: '0.8rem',
    color: '#6c757d',
    whiteSpace: 'nowrap',
    minWidth: '4rem',
    textAlign: 'right',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btn: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.9rem',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s',
    minWidth: '2.5rem',
  },
  btnPrimary: {
    background: '#4f8ef7',
    color: '#fff',
    border: '1px solid #3a7bd5',
    fontWeight: 'bold',
    minWidth: '6rem',
  },
  speedGroup: {
    display: 'flex',
    gap: '0.25rem',
    marginLeft: 'auto',
  },
  speedBtn: {
    padding: '0.35rem 0.6rem',
    fontSize: '0.8rem',
    minWidth: '2.5rem',
  },
  speedBtnActive: {
    background: '#e8f0fe',
    borderColor: '#4f8ef7',
    color: '#4f8ef7',
    fontWeight: 'bold',
  },
};
