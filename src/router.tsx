import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { BubbleSortPage } from './pages/BubbleSortPage';
import { Header } from './components/Layout/Header';
import { BfsPage } from './pages/graph/algorithms/BfsPage';
import { DfsPage } from './pages/graph/algorithms/DfsPage';
import { DijkstraPage } from './pages/graph/algorithms/DijkstraPage';
import { TopologicalSortPage } from './pages/graph/algorithms/TopologicalSortPage';
import { AlgorithmsIndex } from './pages/graph/AlgorithmsIndex';
import { ProblemsIndex } from './pages/graph/ProblemsIndex';
import { ConnectedComponentsPage } from './pages/graph/problems/ConnectedComponentsPage';
import { ShortestPathPage } from './pages/graph/problems/ShortestPathPage';
import { CycleDetectionPage } from './pages/graph/problems/CycleDetectionPage';
import { DagOrderingPage } from './pages/graph/problems/DagOrderingPage';

function SimpleLayout() {
  return (
    <div>
      <Header />
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AlgoWiki</h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
        アルゴリズムをインタラクティブに学べる可視化Wiki
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/algorithms/bubble-sort" style={cardStyle}>
          <strong>バブルソート</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>O(n²) · 配列</span>
        </Link>
        <Link to="/graph/algorithms" style={cardStyle}>
          <strong>グラフアルゴリズム</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>BFS / DFS / Dijkstra / トポロジカルソート</span>
        </Link>
        <Link to="/graph/problems" style={cardStyle}>
          <strong>グラフ問題</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>連結判定 / 最短経路 / 閉路検出 / DAG順序</span>
        </Link>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SimpleLayout 配下: ヘッダーのみ、サイドバーなし */}
        <Route element={<SimpleLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms/bubble-sort" element={<BubbleSortPage />} />
        </Route>

        {/* グラフ系: 各ページが自前の Header + Sidebar を持つ */}
        <Route path="/graph/algorithms" element={<AlgorithmsIndex />} />
        <Route path="/graph/algorithms/bfs" element={<BfsPage />} />
        <Route path="/graph/algorithms/dfs" element={<DfsPage />} />
        <Route path="/graph/algorithms/dijkstra" element={<DijkstraPage />} />
        <Route path="/graph/algorithms/topological-sort" element={<TopologicalSortPage />} />
        <Route path="/graph/problems" element={<ProblemsIndex />} />
        <Route path="/graph/problems/connected-components" element={<ConnectedComponentsPage />} />
        <Route path="/graph/problems/shortest-path" element={<ShortestPathPage />} />
        <Route path="/graph/problems/cycle-detection" element={<CycleDetectionPage />} />
        <Route path="/graph/problems/dag-ordering" element={<DagOrderingPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 52px)',
  background: '#f5f7fa',
};
const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '1.25rem 2rem',
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#212529',
  transition: 'box-shadow 0.2s',
};
