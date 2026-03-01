import type { Graph, StepState } from './GraphTypes';

interface GraphViewProps {
  graph: Graph;
  step?: StepState;
  width?: number;
  height?: number;
}

const NODE_R = 18;
const ARROW_L = 10;

function nodePos(i: number, n: number, cx: number, cy: number, r: number) {
  if (n === 1) return { x: cx, y: cy };
  const angle = (2 * Math.PI * i) / n - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function edgePts(
  px: number, py: number, qx: number, qy: number, directed: boolean
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = qx - px, dy = qy - py;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len, ny = dy / len;
  return {
    x1: px + nx * NODE_R,
    y1: py + ny * NODE_R,
    x2: qx - nx * (NODE_R + (directed ? ARROW_L : 0)),
    y2: qy - ny * (NODE_R + (directed ? ARROW_L : 0)),
  };
}

function midpoint(x1: number, y1: number, x2: number, y2: number) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

export function GraphView({ graph, step, width = 380, height = 320 }: GraphViewProps) {
  const { n, directed, edges } = graph;
  const cx = width / 2, cy = height / 2;
  const r = Math.min(cx, cy) - NODE_R - 10;

  const positions = Array.from({ length: n }, (_, i) => nodePos(i, n, cx, cy, r));

  const highlightNodeSet = new Set(step?.highlightNodes ?? []);
  const visitedSet = new Set(
    step?.visited.map((v, i) => (v ? i : -1)).filter((i) => i >= 0) ?? []
  );
  const highlightEdgeSet = new Set(
    (step?.highlightEdges ?? []).map((e) => `${e.from}-${e.to}`)
  );
  const isEdgeHighlighted = (from: number, to: number) =>
    highlightEdgeSet.has(`${from}-${to}`) || (!directed && highlightEdgeSet.has(`${to}-${from}`));

  function nodeColor(i: number): string {
    if (highlightNodeSet.has(i)) return '#f7944f';
    if (visitedSet.has(i)) return '#4fcf70';
    return '#4f8ef7';
  }

  function edgeColor(from: number, to: number): string {
    return isEdgeHighlighted(from, to) ? '#f7944f' : '#adb5bd';
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', maxHeight: `${height}px`, background: '#fff', borderRadius: '6px', border: '1px solid #dee2e6' }}
    >
      <defs>
        <marker id="arrow-normal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#adb5bd" />
        </marker>
        <marker id="arrow-highlight" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f7944f" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((e, idx) => {
        const p = positions[e.from], q = positions[e.to];
        const { x1, y1, x2, y2 } = edgePts(p.x, p.y, q.x, q.y, directed);
        const color = edgeColor(e.from, e.to);
        const mid = midpoint(x1, y1, x2, y2);
        const highlighted = isEdgeHighlighted(e.from, e.to);
        return (
          <g key={idx}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth={highlighted ? 2.5 : 1.5}
              markerEnd={directed ? `url(#arrow-${highlighted ? 'highlight' : 'normal'})` : undefined}
            />
            {e.weight !== undefined && (
              <text
                x={mid.x} y={mid.y - 5}
                textAnchor="middle"
                fontSize={11}
                fill={highlighted ? '#f7944f' : '#6c757d'}
                fontWeight={highlighted ? 'bold' : 'normal'}
              >
                {e.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {positions.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={nodeColor(i)} stroke="#fff" strokeWidth={2} />
          <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#fff" fontWeight="bold">
            {i}
          </text>
          {step?.dist && step.dist[i] !== null && step.dist[i] !== undefined && (
            <text x={pos.x} y={pos.y + NODE_R + 12} textAnchor="middle" fontSize={11} fill="#495057">
              d={step.dist[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
