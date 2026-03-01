import type { Graph, StepState } from '../graph/GraphTypes';

export function toposortSteps(graph: Graph): StepState[] {
  const { n, edges } = graph;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const inDeg = Array<number>(n).fill(0);
  for (const e of edges) {
    adj[e.from].push(e.to);
    inDeg[e.to]++;
  }

  const steps: StepState[] = [];
  const visited = Array<boolean>(n).fill(false);
  const queue: number[] = [];
  const output: number[] = [];

  for (let i = 0; i < n; i++) {
    if (inDeg[i] === 0) queue.push(i);
  }

  steps.push({
    highlightNodes: [...queue],
    highlightEdges: [],
    visited: [...visited],
    message: `初期化: 入次数 0 の頂点 [${queue.join(', ')}] をキューに追加`,
    aux: { inDeg: [...inDeg], queue: [...queue], output: [...output] },
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a - b);
    const v = queue.shift()!;
    visited[v] = true;
    output.push(v);

    steps.push({
      highlightNodes: [v],
      highlightEdges: [],
      visited: [...visited],
      message: `${v} を dequeue して output に追加`,
      aux: { inDeg: [...inDeg], queue: [...queue], output: [...output] },
    });

    for (const u of adj[v]) {
      inDeg[u]--;
      steps.push({
        highlightNodes: [v, u],
        highlightEdges: [{ from: v, to: u }],
        visited: [...visited],
        message: `inDeg[${u}]-- → ${inDeg[u]}${inDeg[u] === 0 ? '、キューに追加' : ''}`,
        aux: { inDeg: [...inDeg], queue: [...queue], output: [...output] },
      });
      if (inDeg[u] === 0) {
        queue.push(u);
      }
    }
  }

  const hasCycle = output.length < n;
  steps.push({
    highlightNodes: [],
    highlightEdges: [],
    visited: [...visited],
    message: hasCycle
      ? `完了（出力 ${output.length} < ${n} → サイクルあり、位相順序なし）`
      : `完了。位相順序: [${output.join(' → ')}]`,
    aux: { inDeg: [...inDeg], queue: [], output: [...output] },
  });

  return steps;
}
