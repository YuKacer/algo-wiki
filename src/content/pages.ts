export type PageKind = 'algorithm' | 'problem';

export interface PageMeta {
  id: string;
  title: string;
  kind: PageKind;
  domain: 'graph';
  route: string;
  category: string[];
  tags: string[];
  prerequisites: string[];
  constraints: string[];
  complexity: { time: string; space: string };
  pitfalls: string[];
  related: {
    algorithms: string[];
    problems: string[];
    concepts: string[];
  };
}

export const PAGES: PageMeta[] = [
  {
    id: 'bfs',
    title: 'BFS（幅優先探索）',
    kind: 'algorithm',
    domain: 'graph',
    route: '/graph/algorithms/bfs',
    category: ['traversal', 'shortest-path'],
    tags: ['bfs', 'shortest-path', 'graph', 'unweighted'],
    prerequisites: ['グラフ（頂点・辺・隣接リスト）', 'キュー（FIFO）'],
    constraints: [
      '辺の重みが全て同じ（または重みなし）',
      '重みなしグラフの最短ステップ数',
      'グリッドの最短移動距離',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pitfalls: [
      'キューに積む前でなく取り出した後に visited チェックすると TLE になる',
      'INF（INT_MAX）に重みを加算するとオーバーフロー。1e18 や -1 を使う',
      'グリッド探索で境界チェック（0≤nx<H, 0≤ny<W）を忘れて配列外参照',
      '非連結グラフで全頂点ループを忘れて一部成分を見落とす',
    ],
    related: {
      algorithms: ['dfs', 'dijkstra'],
      problems: ['connected-components', 'shortest-path'],
      concepts: ['グラフ', '頂点・辺', '隣接リスト', 'キュー', '最短距離'],
    },
  },
  {
    id: 'dfs',
    title: 'DFS（深さ優先探索）',
    kind: 'algorithm',
    domain: 'graph',
    route: '/graph/algorithms/dfs',
    category: ['traversal'],
    tags: ['dfs', 'graph', 'cycle-detection', 'connected-components'],
    prerequisites: ['グラフ（頂点・辺・隣接リスト）', '再帰関数またはスタック'],
    constraints: [
      '連結成分の列挙・カウント',
      '有向/無向グラフのサイクル検出',
      'DAG の帰りがけ順（トポソの前処理）',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pitfalls: [
      '有向/無向でサイクル検出の手法が違う（混用すると誤検出）',
      '再帰深さが V に達するとスタックオーバーフロー（V=10^5 前後で危険）',
      '非連結グラフで外側ループを忘れて一部成分を見落とす',
      '帰りがけ順（postorder）でなく行きがけ順で push してしまう',
    ],
    related: {
      algorithms: ['bfs', 'topological-sort'],
      problems: ['connected-components', 'cycle-detection', 'dag-ordering'],
      concepts: ['グラフ', '有向グラフ・無向グラフ', '閉路', '連結成分', 'DAG'],
    },
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra（ダイクストラ法）',
    kind: 'algorithm',
    domain: 'graph',
    route: '/graph/algorithms/dijkstra',
    category: ['shortest-path'],
    tags: ['dijkstra', 'shortest-path', 'graph', 'weighted', 'priority-queue'],
    prerequisites: ['グラフ（重み付き隣接リスト）', '優先度付きキュー（min-heap）'],
    constraints: [
      '辺の重みが全て非負（0以上）',
      '単一始点の最短路',
    ],
    complexity: { time: 'O((V + E) log V)', space: 'O(V + E)' },
    pitfalls: [
      '負辺があると誤った結果（Bellman-Ford を使う）',
      'pq から取り出した (d,v) が古いエントリなら skip しないと TLE',
      'INF = INT_MAX に重みを加算するとオーバーフロー（long long で 1e18 を使う）',
      '無向グラフで辺を両方向に追加し忘れる',
    ],
    related: {
      algorithms: ['bfs'],
      problems: ['shortest-path'],
      concepts: ['重み付きグラフ', '最短距離', '優先度付きキュー', '負閉路'],
    },
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort（トポロジカルソート）',
    kind: 'algorithm',
    domain: 'graph',
    route: '/graph/algorithms/topological-sort',
    category: ['ordering', 'dag'],
    tags: ['topological-sort', 'dag', 'graph', 'directed', 'ordering'],
    prerequisites: ['グラフ（有向グラフ）', 'DAG（有向非巡回グラフ）', 'DFS の基本'],
    constraints: [
      '有向非巡回グラフ（DAG）であること',
      '辺 (u→v) が存在するとき u を v より前に並べたい',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pitfalls: [
      '処理頂点数 < V で終了したらサイクルあり（確認忘れで誤判定）',
      '辺の向きを依存関係と逆に定義して順序が逆になる',
      '辞書順最小を要求されたとき通常キューでなく優先度付きキューが必要',
      'DFS 版で帰りがけ順でなく行きがけ順に push してしまう',
    ],
    related: {
      algorithms: ['dfs'],
      problems: ['dag-ordering', 'cycle-detection'],
      concepts: ['DAG', '入次数', '閉路', '有向グラフ'],
    },
  },
  {
    id: 'connected-components',
    title: '連結判定 / 連結成分数',
    kind: 'problem',
    domain: 'graph',
    route: '/graph/problems/connected-components',
    category: ['reachability', 'connectivity'],
    tags: ['connected-components', 'bfs', 'dfs', 'graph', 'union-find'],
    prerequisites: ['グラフ（頂点・辺）', '連結成分の定義'],
    constraints: [
      '無向グラフで「繋がっているか」「いくつの塊か」を問われる',
      '有向グラフの到達可能性（弱連結成分）',
    ],
    complexity: { time: 'O(V + E)（BFS/DFS）', space: 'O(V + E)' },
    pitfalls: [
      '有向グラフを無向扱いすると強連結成分の問題を誤って解く',
      '非連結グラフで外側ループを書かず一部の成分を見落とす',
      '頂点番号の indexing（1-indexed/0-indexed）の混在でカウント漏れ',
    ],
    related: {
      algorithms: ['bfs', 'dfs'],
      problems: [],
      concepts: ['連結成分', 'グラフ', '有向グラフ・無向グラフ'],
    },
  },
  {
    id: 'shortest-path',
    title: '最短経路（Shortest Path）',
    kind: 'problem',
    domain: 'graph',
    route: '/graph/problems/shortest-path',
    category: ['shortest-path'],
    tags: ['shortest-path', 'bfs', 'dijkstra', 'graph', 'weighted'],
    prerequisites: ['グラフ（頂点・辺・重み）', '最短距離の定義'],
    constraints: [
      '「最短距離 / 最小コスト / 最少ステップ」を求める問題',
      '有向・無向どちらでも適用できる',
    ],
    complexity: { time: 'BFS: O(V+E)、Dijkstra: O((V+E)log V)', space: 'O(V + E)' },
    pitfalls: [
      '辺の重みを確認せずに BFS を使い、重みが非均一で誤結果',
      'INF が小さすぎて「到達不可」頂点から +w した値が最短距離に見える',
      '経路復元が必要なのに parent[] を記録しておらず後から再構築できない',
      '多始点を単一始点で繰り返し実行して TLE（多始点 BFS を使う）',
    ],
    related: {
      algorithms: ['bfs', 'dijkstra'],
      problems: [],
      concepts: ['最短距離', '重み付きグラフ', '負閉路', '多始点'],
    },
  },
  {
    id: 'cycle-detection',
    title: 'サイクル検出（Cycle Detection）',
    kind: 'problem',
    domain: 'graph',
    route: '/graph/problems/cycle-detection',
    category: ['cycle', 'structural-analysis'],
    tags: ['cycle-detection', 'dfs', 'topological-sort', 'graph'],
    prerequisites: ['グラフ（頂点・辺・有向/無向）', 'DFS の基本', '閉路の定義'],
    constraints: [
      '有向グラフ・無向グラフどちらでもサイクルの有無を判定できる',
      'DAG かどうかを判定したい',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pitfalls: [
      '無向グラフで「親への逆辺」をサイクルと誤検出する（parent を記録して除外）',
      '有向グラフに無向用の手法を使うと誤った判定になる',
      'Kahn 法で処理済み頂点数 < V の確認を忘れる',
      '自己ループ（v→v）を特別扱いしていないと見落とす',
    ],
    related: {
      algorithms: ['dfs', 'topological-sort'],
      problems: [],
      concepts: ['閉路', 'DAG', '有向グラフ・無向グラフ', '入次数'],
    },
  },
  {
    id: 'dag-ordering',
    title: '依存関係を満たす順序（DAG / トポソ系）',
    kind: 'problem',
    domain: 'graph',
    route: '/graph/problems/dag-ordering',
    category: ['ordering', 'dag'],
    tags: ['dag-ordering', 'topological-sort', 'dfs', 'graph', 'directed'],
    prerequisites: ['DAG（有向非巡回グラフ）', '入次数の定義', 'Topological Sort の仕組み'],
    constraints: [
      '辺 (A→B) が「A は B より先に行う必要がある」を表す有向グラフ',
      'DAG が前提（サイクルなし）',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    pitfalls: [
      '辺の向きを依存関係と逆に定義して前後関係が逆の結果になる',
      'サイクルが存在するとき「impossible」を出力せず誤ったソートを返す',
      '辞書順最小を要求されているのに通常キューを使う',
      'DAG 上の DP をトポソ順でなく BFS 的に処理してしまう',
    ],
    related: {
      algorithms: ['topological-sort', 'dfs'],
      problems: [],
      concepts: ['DAG', '入次数', '有向グラフ', '閉路'],
    },
  },
];

export function getPageById(id: string): PageMeta | undefined {
  return PAGES.find((p) => p.id === id);
}

export function getPagesByKind(kind: PageKind): PageMeta[] {
  return PAGES.filter((p) => p.kind === kind);
}
