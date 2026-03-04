import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface SecurityDomain {
  title: string;
  desc: string;
  to?: string;
}

const SECURITY_DOMAINS: SecurityDomain[] = [
  { title: '認証・認可', desc: 'ユーザーの本人確認とアクセス制御（AuthN/AuthZ）' },
  {
    title: '通信の保護',
    desc: 'TLS・証明書・鍵交換で盗聴や改ざんを防ぐ',
    to: '/security/transport-security',
  },
  { title: 'データ保護', desc: '保存データの暗号化、鍵管理、バックアップ保護' },
  { title: 'アプリ防御', desc: 'XSS / SQLi / CSRF などの脆弱性対策' },
  { title: '運用・監視', desc: '監査ログ、異常検知、インシデント対応' },
  { title: '供給網対策', desc: '依存関係の検証、署名付き配布、SBOM' },
];

export function SecurityPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ fontSize: '1.9rem', marginBottom: '0.4rem', color: '#1a1a2e' }}>セキュリティ</h1>
      <p style={{ marginTop: 0, color: '#6c757d', marginBottom: '1.2rem' }}>
        このページはセキュリティ分野の全体像をつかむためのトップページです。
      </p>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>セキュリティ分野の全体像</h2>
        <div style={domainGridStyle}>
          {SECURITY_DOMAINS.map((d) =>
            d.to ? (
              <Link key={d.title} to={d.to} style={{ ...domainCardStyle, ...domainLinkStyle }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#212529' }}>{d.title}</h3>
                <p style={{ margin: '0.35rem 0 0', color: '#495057', lineHeight: 1.6, fontSize: '0.9rem' }}>{d.desc}</p>
                <span style={domainCtaStyle}>詳細を見る</span>
              </Link>
            ) : (
              <article key={d.title} style={domainCardStyle}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#212529' }}>{d.title}</h3>
                <p style={{ margin: '0.35rem 0 0', color: '#495057', lineHeight: 1.6, fontSize: '0.9rem' }}>{d.desc}</p>
                <span style={domainSoonStyle}>準備中</span>
              </article>
            ),
          )}
        </div>
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
  marginBottom: '0.65rem',
  fontSize: '1.1rem',
  color: '#212529',
};

const domainGridStyle: CSSProperties = {
  display: 'grid',
  gap: '0.65rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const domainCardStyle: CSSProperties = {
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  background: '#fbfcff',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
};

const domainLinkStyle: CSSProperties = {
  textDecoration: 'none',
};

const domainCtaStyle: CSSProperties = {
  marginTop: '0.25rem',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#0b5ed7',
};

const domainSoonStyle: CSSProperties = {
  marginTop: '0.25rem',
  fontSize: '0.82rem',
  color: '#6c757d',
};
