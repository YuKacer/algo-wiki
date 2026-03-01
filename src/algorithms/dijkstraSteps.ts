import type { Graph, StepState } from '../graph/GraphTypes';

const INF = 1e9;

export function dijkstraSteps(graph: Graph, start: number): StepState[] {
  const { n, directed, edges } = graph;
  const adj: { to: number; w: number }[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    const w = e.weight ?? 1;
    adj[e.from].push({ to: e.to, w });
    if (!directed) adj[e.to].push({ to: e.from, w });
  }

  const steps: StepState[] = [];
  const dist: number[] = Array(n).fill(INF);
  const parent: (number | null)[] = Array(n).fill(null);
  const visited = Array<boolean>(n).fill(false);
  // pq: array sorted as min-heap simulation [dist, node]
  const pq: [number, number][] = [];

  dist[start] = 0;
  pq.push([0, start]);

  steps.push({
    highlightNodes: [start],
    highlightEdges: [],
    visited: [...visited],
    dist: dist.map((d) => (d === INF ? null : d)),
    parent: [...parent],
    message: `初期化: dist[${start}] = 0`,
    aux: { pq: [[0, start]] },
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, v] = pq.shift()!;

    if (d > dist[v]) {
      steps.push({
        highlightNodes: [v],
        highlightEdges: [],
        visited: [...visited],
        dist: dist.map((x) => (x === INF ? null : x)),
        parent: [...parent],
        message: `(${d}, ${v}) は古いエントリ、skip`,
        aux: { pq: pq.slice(0, 5) },
      });
      continue;
    }

    visited[v] = true;
    steps.push({
      highlightNodes: [v],
      highlightEdges: [],
      visited: [...visited],
      dist: dist.map((x) => (x === INF ? null : x)),
      parent: [...parent],
      message: `(${d}, ${v}) を取り出し。dist[${v}] = ${d} 確定`,
      aux: { pq: pq.slice(0, 5) },
    });

    for (const { to: u, w } of adj[v]) {
      if (dist[v] + w < dist[u]) {
        dist[u] = dist[v] + w;
        parent[u] = v;
        pq.push([dist[u], u]);
        steps.push({
          highlightNodes: [v, u],
          highlightEdges: [{ from: v, to: u }],
          visited: [...visited],
          dist: dist.map((x) => (x === INF ? null : x)),
          parent: [...parent],
          message: `dist[${u}] を ${dist[u]} に更新（${v}→${u}, w=${w}）`,
          aux: { pq: pq.slice(0, 5) },
        });
      } else {
        steps.push({
          highlightNodes: [v, u],
          highlightEdges: [{ from: v, to: u }],
          visited: [...visited],
          dist: dist.map((x) => (x === INF ? null : x)),
          parent: [...parent],
          message: `${v}→${u}: dist[${u}]=${dist[u] === INF ? '∞' : dist[u]} は更新不要`,
          aux: { pq: pq.slice(0, 5) },
        });
      }
    }
  }

  steps.push({
    highlightNodes: [],
    highlightEdges: [],
    visited: [...visited],
    dist: dist.map((x) => (x === INF ? null : x)),
    parent: [...parent],
    message: 'Dijkstra 完了',
    aux: { pq: [] },
  });

  return steps;
}
