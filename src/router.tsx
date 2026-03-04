import type { CSSProperties } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { BubbleSortPage } from './pages/BubbleSortPage';
import { AlgorithmsPage } from './pages/AlgorithmsPage';
import { SecurityPage } from './pages/security/SecurityPage';
import { TransportSecurityPage } from './pages/security/TransportSecurityPage';
import { TransportMethodPage } from './pages/security/TransportMethodPage';
import { PublicKeyCryptoPage } from './pages/security/PublicKeyCryptoPage';
import { DigitalSignaturePage } from './pages/security/DigitalSignaturePage';
import { CertificateAuthorityPage } from './pages/security/CertificateAuthorityPage';
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

function HomePage() {
  return (
    <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AlgoWiki</h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
        アルゴリズムとセキュリティをインタラクティブに学べる学習ページ
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/algorithms/bubble-sort" style={cardStyle}>
          <strong>バブルソート</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>O(n^2) ・ 配列</span>
        </Link>
        <Link to="/graph/algorithms" style={cardStyle}>
          <strong>グラフアルゴリズム</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>BFS / DFS / Dijkstra / トポロジカルソート</span>
        </Link>
        <Link to="/security" style={cardStyle}>
          <strong>セキュリティ</strong>
          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>公開鍵暗号 / デジタル署名 / 認証局</span>
        </Link>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
          <Route path="/algorithms/bubble-sort" element={<BubbleSortPage />} />

          <Route path="/security" element={<SecurityPage />} />
          <Route path="/security/transport-security" element={<TransportSecurityPage />} />
          <Route path="/security/transport-security/:methodId" element={<TransportMethodPage />} />
          <Route path="/security/public-key-crypto" element={<PublicKeyCryptoPage />} />
          <Route path="/security/digital-signature" element={<DigitalSignaturePage />} />
          <Route path="/security/signature" element={<DigitalSignaturePage />} />
          <Route path="/security/certificate-authority" element={<CertificateAuthorityPage />} />
          <Route path="/security/ca" element={<CertificateAuthorityPage />} />

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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const cardStyle: CSSProperties = {
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
