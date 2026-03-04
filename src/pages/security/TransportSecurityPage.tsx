import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const TOPICS = [
  {
    title: '認証局（CA）',
    desc: '証明書で公開鍵の持ち主を証明し、相手の真正性を担保します。',
    to: '/security/certificate-authority',
  },
  {
    title: '公開鍵暗号',
    desc: '公開鍵と秘密鍵を使って安全に鍵共有し、通信の機密性を確保します。',
    to: '/security/public-key-crypto',
  },
  {
    title: 'デジタル署名',
    desc: '署名と検証で改ざん検知と送信者確認を行います。',
    to: '/security/digital-signature',
  },
];

export function TransportSecurityPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>通信の保護</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem', lineHeight: 1.7 }}>
        通信の保護では、TLS の基盤となる PKI と暗号技術を学びます。ここでは CA・公開鍵暗号・デジタル署名の3テーマを扱います。
      </p>

      <section
        style={{
          display: 'grid',
          gap: '0.8rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {TOPICS.map((topic) => (
          <article key={topic.title} style={cardStyle}>
            <h2 style={{ margin: 0, fontSize: '1.08rem', color: '#212529' }}>{topic.title}</h2>
            <p style={cardTextStyle}>{topic.desc}</p>
            <div>
              <Link to={topic.to} style={linkStyle}>
                アニメーションを見る
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: '10px',
  padding: '1.1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  color: '#495057',
  lineHeight: 1.6,
};

const linkStyle: CSSProperties = {
  display: 'inline-block',
  padding: '0.45rem 0.8rem',
  borderRadius: '6px',
  border: '1px solid #4f8ef7',
  background: '#4f8ef7',
  color: '#fff',
  fontWeight: 600,
  textDecoration: 'none',
};
