import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/Layout/Breadcrumb';
import {
  TRANSPORT_METHODS,
  type TransportMethodId,
} from '../../content/securityTransportModel';

export function TransportSecurityPage() {
  const navigate = useNavigate();
  const [interactiveRowId, setInteractiveRowId] = useState<TransportMethodId | null>(null);

  const handleRowActivate = (methodId: TransportMethodId) => {
    navigate(`/security/transport-security/${methodId}`);
  };

  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <Breadcrumb crumbs={[{ label: 'セキュリティ', to: '/security' }, { label: '通信の保護' }]} />

      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>通信の保護</h1>
      <p style={leadStyle}>
        通信を守る主な方式の違いを比較できます。用途や守る対象の違いを表で確認してください。
      </p>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>方式</th>
              <th style={thStyle}>主な用途</th>
              <th style={thStyle}>主な保護対象</th>
              <th style={thStyle}>主にどこで効くか</th>
            </tr>
          </thead>
          <tbody>
            {TRANSPORT_METHODS.map((method) => {
              const isHighlighted = interactiveRowId === method.id;

              return (
                <tr
                  key={method.id}
                  role="link"
                  tabIndex={0}
                  aria-label={`${method.title} の詳細ページへ移動`}
                  onClick={() => handleRowActivate(method.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleRowActivate(method.id);
                    }
                  }}
                  onMouseEnter={() => setInteractiveRowId(method.id)}
                  onMouseLeave={() => setInteractiveRowId(null)}
                  onFocus={() => setInteractiveRowId(method.id)}
                  onBlur={() => setInteractiveRowId(null)}
                  style={isHighlighted ? rowInteractiveStyle : rowLinkStyle}
                >
                  <td style={tdStrongStyle}>
                    <span style={isHighlighted ? methodTitleActiveStyle : methodTitleStyle}>{method.title}</span>
                  </td>
                  <td style={tdStyle}>{method.usage}</td>
                  <td style={tdStyle}>{method.protects}</td>
                  <td style={tdStyle}>{method.layer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const leadStyle: CSSProperties = {
  color: '#5f6b7a',
  marginTop: '0.45rem',
  marginBottom: '1rem',
  lineHeight: 1.72,
};

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid #e1e8f0',
  borderRadius: '12px',
  background: '#fbfdff',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '920px',
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.7rem 0.82rem',
  color: '#334559',
  fontSize: '0.8rem',
  fontWeight: 900,
  background: '#e9f0f7',
  borderBottom: '1px solid #cfdbe8',
};

const tdStyle: CSSProperties = {
  borderBottom: '1px solid #e8edf3',
  padding: '0.78rem 0.82rem',
  color: '#55657a',
  lineHeight: 1.5,
  verticalAlign: 'top',
  fontSize: '0.88rem',
};

const tdStrongStyle: CSSProperties = {
  ...tdStyle,
  fontWeight: 800,
  color: '#1f2a37',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const rowLinkStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'background-color 0.16s ease',
};

const rowInteractiveStyle: CSSProperties = {
  background: '#f7fbff',
  cursor: 'pointer',
};

const methodTitleStyle: CSSProperties = {
  color: '#1f2a37',
  fontWeight: 800,
};

const methodTitleActiveStyle: CSSProperties = {
  color: '#1e5fd6',
  fontWeight: 800,
};



