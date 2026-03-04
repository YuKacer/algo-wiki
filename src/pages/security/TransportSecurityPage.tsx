import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SecuritySystemMap } from '../../components/SecuritySystemMap';
import {
  TRANSPORT_METHODS,
  type TransportMethodId,
} from '../../content/securityTransportModel';

function shortUseCase(id: string) {
  switch (id) {
    case 'tls':
      return 'Web/API を安全に公開';
    case 'ipsec':
      return '拠点間ネットワーク接続';
    case 'ssh':
      return 'サーバー運用・管理接続';
    case 'vpn':
      return 'リモート端末の社内接続';
    case 'dns-protection':
      return '名前解決の改ざん・盗聴対策';
    default:
      return '';
  }
}

export function TransportSecurityPage() {
  const [selectedMethodId, setSelectedMethodId] = useState<TransportMethodId>('tls');
  const selectedMethod = useMemo(
    () => TRANSPORT_METHODS.find((m) => m.id === selectedMethodId) ?? TRANSPORT_METHODS[0],
    [selectedMethodId],
  );

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <div style={{ marginBottom: '0.85rem' }}>
        <Link to="/security" style={backLinkStyle}>
          ← セキュリティ全体像に戻る
        </Link>
      </div>

      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>通信の保護</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem', lineHeight: 1.72 }}>
        方式ごとの違いを、1つの比較ビューで把握します。表で全体を見て、方式を選んで地図で守る範囲を確認してください。
      </p>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>方式比較</h2>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>方式</th>
                <th style={thStyle}>使う場面</th>
                <th style={thStyle}>守る層</th>
              </tr>
            </thead>
            <tbody>
              {TRANSPORT_METHODS.map((m) => (
                <tr key={m.id}>
                  <td style={tdStrongStyle}>
                    <Link to={`/security/transport-security/${m.id}`} style={methodLinkStyle}>
                      {m.title}
                    </Link>
                  </td>
                  <td style={tdStyle}>{shortUseCase(m.id)}</td>
                  <td style={tdStyle}>{m.layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={chipWrapStyle}>
          {TRANSPORT_METHODS.map((m) => {
            const active = m.id === selectedMethodId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethodId(m.id)}
                style={{
                  ...chipButtonStyle,
                  borderColor: active ? '#0d6efd' : '#ced4da',
                  background: active ? '#eaf2ff' : '#fff',
                  color: active ? '#0d6efd' : '#495057',
                }}
              >
                {m.title}
              </button>
            );
          })}
        </div>

        <p style={mapHintStyle}>
          選択中: <strong>{selectedMethod.title}</strong> / {shortUseCase(selectedMethod.id)}
        </p>

        <SecuritySystemMap
          activeNodes={selectedMethod.mapNodes}
          activeLinks={selectedMethod.mapLinks}
          secondaryActiveLinks={selectedMethod.secondaryMapLinks ?? []}
          ariaLabel="通信の保護方式比較のシステム地図"
        />
      </section>
    </main>
  );
}

const panelStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: '10px',
  padding: '1rem',
  marginBottom: '0.9rem',
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: '0.7rem',
  fontSize: '1.08rem',
  color: '#212529',
};

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '680px',
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  padding: '0.55rem 0.6rem',
  color: '#495057',
  fontSize: '0.84rem',
};

const tdStyle: CSSProperties = {
  borderBottom: '1px solid #f1f3f5',
  padding: '0.55rem 0.6rem',
  color: '#343a40',
  lineHeight: 1.5,
  verticalAlign: 'top',
  fontSize: '0.9rem',
};

const tdStrongStyle: CSSProperties = {
  ...tdStyle,
  fontWeight: 800,
  color: '#1f2a37',
  whiteSpace: 'nowrap',
};

const chipWrapStyle: CSSProperties = {
  marginTop: '0.75rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const chipButtonStyle: CSSProperties = {
  border: '1px solid #ced4da',
  borderRadius: '999px',
  padding: '0.28rem 0.72rem',
  fontWeight: 700,
  fontSize: '0.84rem',
  cursor: 'pointer',
};

const mapHintStyle: CSSProperties = {
  margin: '0.55rem 0 0.2rem',
  color: '#495057',
};

const methodLinkStyle: CSSProperties = {
  color: '#185ccf',
  textDecoration: 'none',
  fontWeight: 800,
};

const backLinkStyle: CSSProperties = {
  display: 'inline-block',
  color: '#0d6efd',
  textDecoration: 'none',
  fontWeight: 700,
};
