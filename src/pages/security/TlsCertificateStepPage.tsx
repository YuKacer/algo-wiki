import type { CSSProperties } from 'react';
import { TlsCertificateStepPlayer } from '../../components/TlsCertificateStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  '証明書チェーンで、この公開鍵を誰のものとして信頼してよいかを確認します。',
  'CertificateVerify で、その公開鍵に対応する秘密鍵を相手が本当に持つかを確認します。',
  'この 2 つにより、サーバ認証の中核となる確認がそろいます。',
];

const TERMS = [
  { term: 'SAN', note: '証明書が有効なホスト名を示す拡張です。' },
  { term: 'trust store', note: 'クライアントが信頼する CA 証明書の一覧を保持する領域です。' },
  { term: 'leaf certificate', note: '実際のサーバに対応する末端の証明書です。' },
  { term: 'intermediate certificate', note: 'leaf 証明書とルート CA をつなぐ中間証明書です。' },
  { term: 'CertificateVerify', note: '証明書に対応する秘密鍵をサーバが持つことを示す署名メッセージです。' },
];

export function TlsCertificateStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="Certificate + CertificateVerify" />

      <h1 style={pageTitleStyle}>Certificate + CertificateVerify の詳細</h1>
      <p style={leadStyle}>
        このページでは、サーバ証明書を「誰のものとして信頼するか」と、
        その証明書に対応する秘密鍵を今の相手が本当に持っているかを順に見ます。
        Certificate と CertificateVerify が、サーバ認証の中核で何を担うかを整理します。
      </p>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>最初に押さえる 3 点</h2>
        <ul style={listStyle}>
          {SUMMARY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>内部の流れ</h2>
        <p style={sectionLeadStyle}>
          サーバの証明書提示から、クライアントが証明書チェーンと署名を検証してサーバ認証を進めるまでを順に見ます。
        </p>
        <TlsCertificateStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>用語メモ</h2>
        <div style={termGridStyle}>
          {TERMS.map((row) => (
            <div key={row.term} style={termRowStyle}>
              <div style={termKeyStyle}>
                <code>{row.term}</code>
              </div>
              <div style={termNoteStyle}>{row.note}</div>
            </div>
          ))}
        </div>
      </section>

      <TlsStepFooterNav
        leftLink={{ to: '/security/transport-security/tls/encrypted-extensions', label: 'EncryptedExtensions へ' }}
      />
    </main>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: '980px',
  margin: '0 auto',
  padding: '2rem 1rem 2.5rem',
};

const pageTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.88rem',
  color: '#1a1a2e',
};

const leadStyle: CSSProperties = {
  color: '#5f6b7a',
  marginTop: '0.5rem',
  marginBottom: '1rem',
  lineHeight: 1.78,
};

const panelStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: '10px',
  padding: '1rem',
  marginBottom: '0.9rem',
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: '0.65rem',
  fontSize: '1.08rem',
  color: '#212529',
};

const sectionLeadStyle: CSSProperties = {
  margin: '0 0 0.8rem',
  color: '#495057',
  lineHeight: 1.72,
};

const termGridStyle: CSSProperties = {
  display: 'grid',
  gap: '0.55rem',
};

const termRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(150px, 180px) 1fr',
  gap: '0.65rem',
  alignItems: 'start',
};

const termKeyStyle: CSSProperties = {
  color: '#334155',
  fontSize: '0.84rem',
  fontWeight: 800,
};

const termNoteStyle: CSSProperties = {
  color: '#475569',
  fontSize: '0.88rem',
  lineHeight: 1.5,
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.2rem',
  color: '#343a40',
  lineHeight: 1.72,
};
