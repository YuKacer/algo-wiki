import type { Graph, StepState } from '../graph/GraphTypes';

export function dfsSteps(graph: Graph, start: number): StepState[] {
  const { n, directed, edges } = graph;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.from].push(e.to);
    if (!directed) adj[e.to].push(e.from);
  }

  const steps: StepState[] = [];
  const visited = Array<boolean>(n).fill(false);
  const color = Array<number>(n).fill(0); // 0=white,1=gray,2=black
  const parent: (number | null)[] = Array(n).fill(null);
  let hasCycle = false;

  steps.push({
    highlightNodes: [start],
    highlightEdges: [],
    visited: [...visited],
    parent: [...parent],
    message: `DFS 開始: 頂点 ${start}`,
    aux: { stack: [start], color: [...color], hasCycle },
  });

  // Iterative DFS with enter/exit events
  const ENTER = 0, EXIT = 1;
  type Task = [number, number, number | null]; // [node, event, parentNode]
  const stack: Task[] = [[start, ENTER, null]];

  while (stack.length > 0) {
    const [v, event, par] = stack.pop()!;

    if (event === ENTER) {
      if (color[v] !== 0) continue;
      color[v] = 1;
      visited[v] = true;
      parent[v] = par;
      stack.push([v, EXIT, par]);

      const stackView = stack.filter(([, e]) => e === ENTER).map(([nd]) => nd);
      steps.push({
        highlightNodes: [v],
        highlightEdges: par !== null ? [{ from: par, to: v }] : [],
        visited: [...visited],
        parent: [...parent],
        message: `${v} に入る（gray）`,
        aux: { stack: [...stackView, v], color: [...color], hasCycle },
      });

      for (const u of [...adj[v]].reverse()) {
        if (color[u] === 0) {
          stack.push([u, ENTER, v]);
        } else if (color[u] === 1 && directed) {
          hasCycle = true;
          steps.push({
            highlightNodes: [v, u],
            highlightEdges: [{ from: v, to: u }],
            visited: [...visited],
            parent: [...parent],
            message: `${v}→${u} は後退辺！サイクル検出`,
            aux: { stack: [], color: [...color], hasCycle },
          });
        } else if (!directed && u !== par) {
          hasCycle = true;
          steps.push({
            highlightNodes: [v, u],
            highlightEdges: [{ from: v, to: u }],
            visited: [...visited],
            parent: [...parent],
            message: `${v}-${u} で既訪問辺（無向）→ サイクル`,
            aux: { stack: [], color: [...color], hasCycle },
          });
        }
      }
    } else {
      color[v] = 2;
      const stackView = stack.filter(([, e]) => e === ENTER).map(([nd]) => nd);
      steps.push({
        highlightNodes: [v],
        highlightEdges: [],
        visited: [...visited],
        parent: [...parent],
        message: `${v} から戻る（black）`,
        aux: { stack: stackView, color: [...color], hasCycle },
      });
    }
  }

  steps.push({
    highlightNodes: [],
    highlightEdges: [],
    visited: [...visited],
    parent: [...parent],
    message: hasCycle ? 'DFS 完了（サイクルあり）' : 'DFS 完了（サイクルなし）',
    aux: { stack: [], color: [...color], hasCycle },
  });

  return steps;
}
