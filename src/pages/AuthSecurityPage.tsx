import type { CSSProperties } from 'react';
import { Breadcrumb } from '../components/Layout/Breadcrumb';
import { AUTH_CONTROLS } from '../content/securityAuthModel';

const AUTH_ENTRY_ROWS = AUTH_CONTROLS.filter((control) => control.id === 'mfa' || control.id === 'oidc');
const AUTH_ACCESS_ROWS = AUTH_CONTROLS.filter(
  (control) =>
    control.id === 'session-token' || control.id === 'oauth2' || control.id === 'authorization',
);

export function AuthSecurityPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <Breadcrumb crumbs={[{ label: 'セキュリティ', to: '/security' }, { label: '認証・認可' }]} />

      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>認証・認可</h1>
      <p style={leadStyle}>
        認証と認可の主な仕組みを比較できます。ログイン時の本人確認と、ログイン後の利用制御を分けて確認してください。
      </p>

      <section style={blockStyle}>
        <h2 style={blockTitleStyle}>ログイン時の本人確認 / 認証連携</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>方式</th>
                <th style={thStyle}>主な用途</th>
                <th style={thStyle}>何をするか</th>
                <th style={thStyle}>主に効く場所</th>
              </tr>
            </thead>
            <tbody>
              {AUTH_ENTRY_ROWS.map((control) => (
                <tr key={control.id}>
                  <td style={tdStrongStyle}>{control.title}</td>
                  <td style={tdStyle}>{control.usage}</td>
                  <td style={tdStyle}>{control.role}</td>
                  <td style={tdStyle}>{control.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={blockStyle}>
        <h2 style={blockTitleStyle}>ログイン後の利用継続 / 権限制御</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>方式</th>
                <th style={thStyle}>主な用途</th>
                <th style={thStyle}>何をするか</th>
                <th style={thStyle}>主に効く場所</th>
              </tr>
            </thead>
            <tbody>
              {AUTH_ACCESS_ROWS.map((control) => (
                <tr key={control.id}>
                  <td style={tdStrongStyle}>{control.title}</td>
                  <td style={tdStyle}>{control.usage}</td>
                  <td style={tdStyle}>{control.role}</td>
                  <td style={tdStyle}>{control.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

const leadStyle: CSSProperties = {
  color: '#5f6b7a',
  marginTop: '0.45rem',
  marginBottom: '1rem',
  lineHeight: 1.72,
};

const blockStyle: CSSProperties = {
  marginTop: '1.2rem',
};

const blockTitleStyle: CSSProperties = {
  margin: '0 0 0.7rem',
  fontSize: '1.04rem',
  color: '#1f2a37',
  fontWeight: 800,
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
  whiteSpace: 'nowrap',
};
