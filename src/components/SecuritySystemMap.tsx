import type { CSSProperties } from 'react';

interface NodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface LinkDef {
  id: string;
  from: string;
  to: string;
}

const NODES: NodeDef[] = [
  { id: 'client', label: '利用者', x: 110, y: 110 },
  { id: 'edge', label: 'WAF / LB', x: 270, y: 110 },
  { id: 'api', label: 'API', x: 430, y: 110 },
  { id: 'app', label: 'アプリ', x: 600, y: 110 },
  { id: 'idp', label: 'IdP', x: 760, y: 200 },
  { id: 'db', label: 'DB', x: 430, y: 290 },
  { id: 'storage', label: 'Object', x: 600, y: 290 },
  { id: 'kms', label: 'KMS', x: 770, y: 290 },
  { id: 'monitor', label: 'Monitor', x: 270, y: 430 },
  { id: 'siem', label: 'SIEM', x: 430, y: 430 },
  { id: 'cicd', label: 'CI/CD', x: 600, y: 430 },
  { id: 'registry', label: 'Registry', x: 770, y: 430 },
];

const LINKS: LinkDef[] = [
  { id: 'l1', from: 'client', to: 'edge' },
  { id: 'l2', from: 'edge', to: 'api' },
  { id: 'l3', from: 'api', to: 'app' },
  { id: 'l4', from: 'app', to: 'db' },
  { id: 'l5', from: 'app', to: 'storage' },
  { id: 'l6', from: 'app', to: 'kms' },
  { id: 'l7', from: 'api', to: 'idp' },
  { id: 'l8', from: 'api', to: 'monitor' },
  { id: 'l9', from: 'monitor', to: 'siem' },
  { id: 'l10', from: 'cicd', to: 'registry' },
  { id: 'l11', from: 'registry', to: 'app' },
  { id: 'l12', from: 'siem', to: 'db' },
  { id: 'l13', from: 'client', to: 'idp' },
];

const SVG_WIDTH = 880;
const SVG_HEIGHT = 520;

function centerOf(id: string) {
  const node = NODES.find((n) => n.id === id);
  if (!node) return { x: 0, y: 0 };
  return { x: node.x, y: node.y };
}

function linkPath(link: LinkDef) {
  const from = centerOf(link.from);
  const to = centerOf(link.to);
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

interface SecuritySystemMapProps {
  activeNodes: string[];
  activeLinks: string[];
  secondaryActiveLinks?: string[];
  ariaLabel?: string;
}

export function SecuritySystemMap({
  activeNodes,
  activeLinks,
  secondaryActiveLinks = [],
  ariaLabel = 'セキュリティシステム地図',
}: SecuritySystemMapProps) {
  return (
    <>
      <div style={legendStyle}>
        <span style={legendItemStyle}>
          <span style={{ ...legendDotStyle, background: '#0d6efd' }} />
          選択中の関連ノード
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...legendLineStyle, borderTopColor: '#0d6efd' }} />
          選択中の通信経路
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...legendLineStyle, borderTopColor: '#7fb4ff', borderTopStyle: 'dashed' }} />
          補助的な認証連携経路
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...legendLineStyle, borderTopColor: '#bcc7d4', borderTopStyle: 'dashed' }} />
          それ以外の経路
        </span>
      </div>

      <p style={noteStyle}>
        API は入口（API Gateway/Controller）、アプリは業務ロジック本体として表現しています。監視/SIEMへの線は代表例です。
      </p>

      <div style={canvasWrapStyle}>
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" role="img" aria-label={ariaLabel}>
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7fbff" />
              <stop offset="100%" stopColor="#fefefe" />
            </linearGradient>

            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#0d6efd" />
            </marker>
            <marker id="arrow-muted" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#bcc7d4" />
            </marker>
          </defs>

          <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} rx="16" fill="url(#bg)" />

          <rect x="36" y="36" width="808" height="118" rx="16" fill="#eef6ff" stroke="#cfe4ff" />
          <rect x="36" y="190" width="808" height="136" rx="16" fill="#f4fbf7" stroke="#d4efdf" />
          <rect x="36" y="352" width="808" height="132" rx="16" fill="#fff8ef" stroke="#ffe5c2" />
          <text x="52" y="60" fontSize="14" fill="#4d6b92" fontWeight="700">外部・入口層</text>
          <text x="52" y="214" fontSize="14" fill="#3e7d59" fontWeight="700">アプリ・データ層</text>
          <text x="52" y="376" fontSize="14" fill="#946b38" fontWeight="700">運用・供給網層</text>

          {LINKS.map((link) => {
            const active = activeLinks.includes(link.id);
            const secondary = !active && secondaryActiveLinks.includes(link.id);
            const stroke = active ? '#0d6efd' : secondary ? '#7fb4ff' : '#bcc7d4';
            const strokeWidth = active ? 3.2 : secondary ? 2.2 : 2;
            const strokeDasharray = active ? '10 6' : secondary ? '7 6' : '5 5';
            const markerEnd = active
              ? 'url(#arrow-active)'
              : secondary
                ? 'url(#arrow-active)'
                : 'url(#arrow-muted)';
            const opacity = active ? 1 : secondary ? 0.95 : 0.7;
            return (
              <g key={link.id}>
                <path
                  d={linkPath(link)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  opacity={opacity}
                  markerEnd={markerEnd}
                >
                  {active || secondary ? (
                    <animate attributeName="stroke-dashoffset" values="0;-32" dur="1.6s" repeatCount="indefinite" />
                  ) : null}
                </path>
              </g>
            );
          })}

          {NODES.map((node) => {
            const active = activeNodes.includes(node.id);
            return (
              <g key={node.id} transform={`translate(${node.x - 54}, ${node.y - 26})`}>
                <rect
                  width="108"
                  height="52"
                  rx="10"
                  fill={active ? '#ffffff' : '#f9fbfd'}
                  stroke={active ? '#0d6efd' : '#cbd5e1'}
                  strokeWidth={active ? 2.6 : 1.4}
                />
                <text
                  x="54"
                  y="32"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight={active ? 800 : 700}
                  fill={active ? '#0b4fb5' : '#344150'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}

const legendStyle: CSSProperties = {
  marginTop: '0.55rem',
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const legendItemStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  color: '#5d6a7a',
};

const legendDotStyle: CSSProperties = {
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  display: 'inline-block',
};

const legendLineStyle: CSSProperties = {
  width: '20px',
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  display: 'inline-block',
};

const noteStyle: CSSProperties = {
  margin: '0.45rem 0 0',
  color: '#6b7280',
  fontSize: '0.8rem',
  lineHeight: 1.5,
};

const canvasWrapStyle: CSSProperties = {
  marginTop: '0.55rem',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '0.45rem',
  background: '#fff',
  overflowX: 'auto',
};
