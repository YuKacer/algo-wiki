import type { Graph, StepState } from '../graph/GraphTypes';

export function bfsSteps(graph: Graph, start: number): StepState[] {
  const { n, directed, edges } = graph;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.from].push(e.to);
    if (!directed) adj[e.to].push(e.from);
  }

  const steps: StepState[] = [];
  const visited = Array<boolean>(n).fill(false);
  const dist: (number | null)[] = Array(n).fill(null);
  const parent: (number | null)[] = Array(n).fill(null);
  const queue: number[] = [];

  steps.push({
    highlightNodes: [start],
    highlightEdges: [],
    visited: [...visited],
    dist: [...dist],
    parent: [...parent],
    message: `初期化: dist[${start}] = 0、queue に ${start} を追加`,
    aux: { queue: [start] },
  });

  visited[start] = true;
  dist[start] = 0;
  queue.push(start);

  while (queue.length > 0) {
    const v = queue.shift()!;

    steps.push({
      highlightNodes: [v],
      highlightEdges: [],
      visited: [...visited],
      dist: [...dist],
      parent: [...parent],
      message: `${v} を dequeue、隣接頂点を探索`,
      aux: { queue: [...queue] },
    });

    for (const u of adj[v]) {
      const edgeKey = { from: v, to: u };
      if (!visited[u]) {
        visited[u] = true;
        dist[u] = (dist[v] as number) + 1;
        parent[u] = v;
        queue.push(u);
        steps.push({
          highlightNodes: [v, u],
          highlightEdges: [edgeKey],
          visited: [...visited],
          dist: [...dist],
          parent: [...parent],
          message: `${u} を発見。dist[${u}] = ${dist[u]}、queue に追加`,
          aux: { queue: [...queue] },
        });
      } else {
        steps.push({
          highlightNodes: [v, u],
          highlightEdges: [edgeKey],
          visited: [...visited],
          dist: [...dist],
          parent: [...parent],
          message: `${u} は訪問済み、スキップ`,
          aux: { queue: [...queue] },
        });
      }
    }
  }

  steps.push({
    highlightNodes: [],
    highlightEdges: [],
    visited: [...visited],
    dist: [...dist],
    parent: [...parent],
    message: 'BFS 完了',
    aux: { queue: [] },
  });

  return steps;
}
