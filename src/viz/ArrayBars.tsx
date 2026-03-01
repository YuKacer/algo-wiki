import type { Frame } from '../algorithms/types';

interface ArrayBarsProps {
  frame: Frame;
}

const BAR_COLOR = '#4f8ef7';
const HIGHLIGHT_COLOR = '#f7944f';
const SORTED_COLOR = '#4fcf70';
const BAR_GAP = 4;

export function ArrayBars({ frame }: ArrayBarsProps) {
  const arr = frame.array ?? [];
  const highlighted = new Set(frame.highlight?.indices ?? []);
  const sortedSet = new Set(frame.highlight?.sorted ?? []);

  if (arr.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
        配列データなし
      </div>
    );
  }

  const max = Math.max(...arr, 1);
  const svgHeight = 200;
  const svgPaddingBottom = 24; // バー下のラベル用
  const barAreaHeight = svgHeight - svgPaddingBottom;

  return (
    <svg
      viewBox={`0 0 ${arr.length * (40 + BAR_GAP)} ${svgHeight}`}
      style={{ width: '100%', maxHeight: '220px', display: 'block' }}
      aria-label="配列の棒グラフ"
    >
      {arr.map((val, idx) => {
        const barHeight = Math.max(4, (val / max) * barAreaHeight);
        const x = idx * (40 + BAR_GAP);
        const y = barAreaHeight - barHeight;
        const isHighlighted = highlighted.has(idx);
        const isSorted = sortedSet.has(idx);

        let fill = BAR_COLOR;
        if (isHighlighted) fill = HIGHLIGHT_COLOR;
        else if (isSorted) fill = SORTED_COLOR;

        return (
          <g key={idx}>
            <rect
              x={x + BAR_GAP / 2}
              y={y}
              width={40}
              height={barHeight}
              fill={fill}
              rx={3}
              style={{ transition: 'y 0.25s ease, height 0.25s ease, fill 0.15s ease' }}
              stroke={isHighlighted ? '#c06020' : 'none'}
              strokeWidth={isHighlighted ? 2 : 0}
            />
            {/* 値ラベル（上） */}
            <text
              x={x + BAR_GAP / 2 + 20}
              y={y - 4}
              textAnchor="middle"
              fontSize={11}
              fill={isHighlighted ? HIGHLIGHT_COLOR : '#333'}
              fontWeight={isHighlighted ? 'bold' : 'normal'}
            >
              {val}
            </text>
            {/* インデックスラベル（下） */}
            <text
              x={x + BAR_GAP / 2 + 20}
              y={svgHeight - 6}
              textAnchor="middle"
              fontSize={10}
              fill="#888"
            >
              {idx}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
