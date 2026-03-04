import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SecuritySystemMap } from '../../components/SecuritySystemMap';
import { TRANSPORT_METHODS } from '../../content/securityTransportModel';

type DomainId = 'auth' | 'transport' | 'data' | 'app' | 'ops' | 'supply';

interface Domain {
  id: DomainId;
  title: string;
  summary: string;
  risk: string;
  controls: string;
  activeNodes: string[];
  activeLinks: string[];
  to?: string;
}

const transportNodes = Array.from(new Set(TRANSPORT_METHODS.flatMap((m) => m.mapNodes)));
const transportLinks = Array.from(new Set(TRANSPORT_METHODS.flatMap((m) => m.mapLinks)));

const DOMAINS: Domain[] = [
  {
    id: 'transport',
    title: '通信の保護',
    summary: 'TLS / IPsec / SSH / VPN / DNS保護を用途別に使い分ける。',
    risk: '盗聴 / 改ざん / MITM / 偽DNS応答',
    controls: 'TLS、IPsec、SSH、VPN、DNSSEC/DoH/DoT',
    activeNodes: transportNodes,
    activeLinks: transportLinks,
    to: '/security/transport-security',
  },
  {
    id: 'auth',
    title: '認証・認可',
    summary: '誰がどこまで操作できるかを一貫して制御する。',
    risk: 'なりすまし / 権限昇格',
    controls: 'MFA、OIDC、RBAC、短命トークン',
    activeNodes: ['client', 'api', 'idp', 'app'],
    activeLinks: ['l2', 'l3', 'l7', 'l13'],
  },
  {
    id: 'data',
    title: 'データ保護',
    summary: '保存データとバックアップの機密性・可用性を守る。',
    risk: '漏えい / 消失 / ランサム被害',
    controls: '保存時暗号化、KMS、鍵ローテーション',
    activeNodes: ['app', 'db', 'storage', 'kms'],
    activeLinks: ['l4', 'l5', 'l6'],
  },
  {
    id: 'app',
    title: 'アプリ防御',
    summary: 'アプリ層の脆弱性を減らし侵入の起点を塞ぐ。',
    risk: 'XSS / SQLi / CSRF',
    controls: '入力検証、出力エスケープ、WAFルール',
    activeNodes: ['edge', 'api', 'app', 'db'],
    activeLinks: ['l2', 'l3', 'l4'],
  },
  {
    id: 'ops',
    title: '運用・監視',
    summary: '異常を早く検知し、封じ込めと復旧を迅速に行う。',
    risk: '検知遅れ / 被害拡大',
    controls: '監査ログ、SIEM、アラート、IR手順',
    activeNodes: ['api', 'monitor', 'siem', 'db'],
    activeLinks: ['l8', 'l9', 'l12'],
  },
  {
    id: 'supply',
    title: '供給網対策',
    summary: '依存関係と配布経路の改ざんを防ぐ。',
    risk: '依存関係汚染 / 不正リリース',
    controls: '署名付き配布、SBOM、脆弱性スキャン',
    activeNodes: ['cicd', 'registry', 'app'],
    activeLinks: ['l10', 'l11'],
  },
];

export function SecurityPage() {
  const [selectedId, setSelectedId] = useState<DomainId>('transport');
  const selected = useMemo(() => DOMAINS.find((d) => d.id === selectedId) ?? DOMAINS[0], [selectedId]);

  return (
    <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '2rem', color: '#18243a' }}>セキュリティ全体像</h1>
      <p style={{ margin: '0.5rem 0 1rem', color: '#5f6b7a' }}>
        システムのどの層を、どの分野で守るかを可視化しています。分野を選ぶと右の構成図が対応箇所を強調します。
      </p>

      <section style={shellStyle}>
        <aside style={leftPaneStyle}>
          <h2 style={title2Style}>分野</h2>
          <div style={{ display: 'grid', gap: '0.55rem' }}>
            {DOMAINS.map((domain) => {
              const active = domain.id === selectedId;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedId(domain.id)}
                  style={{
                    ...domainButtonStyle,
                    borderColor: active ? '#0d6efd' : '#d7dde5',
                    background: active ? 'linear-gradient(135deg, #edf4ff 0%, #ffffff 100%)' : '#ffffff',
                    boxShadow: active ? '0 8px 18px rgba(13, 110, 253, 0.14)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2a37' }}>{domain.title}</div>
                  <div style={{ marginTop: '0.2rem', fontSize: '0.82rem', color: '#617083' }}>{domain.summary}</div>
                </button>
              );
            })}
          </div>

          <div style={detailCardStyle}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1f2a37' }}>{selected.title}</h3>
            <p style={detailLineStyle}>
              <strong>主なリスク:</strong> {selected.risk}
            </p>
            <p style={detailLineStyle}>
              <strong>主な対策:</strong> {selected.controls}
            </p>
            {selected.to ? (
              <Link to={selected.to} style={ctaStyle}>
                この分野の詳細へ
              </Link>
            ) : (
              <span style={comingSoonStyle}>詳細ページは準備中</span>
            )}
          </div>
        </aside>

        <div style={rightPaneStyle}>
          <h2 style={title2Style}>システム地図</h2>
          <SecuritySystemMap activeNodes={selected.activeNodes} activeLinks={selected.activeLinks} />
        </div>
      </section>
    </main>
  );
}

const shellStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '0.9rem',
};

const leftPaneStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #d9e0e8',
  borderRadius: '14px',
  padding: '1rem',
  display: 'grid',
  gap: '0.75rem',
  alignContent: 'start',
};

const rightPaneStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #d9e0e8',
  borderRadius: '14px',
  padding: '1rem',
};

const title2Style: CSSProperties = {
  margin: 0,
  fontSize: '1.08rem',
  fontWeight: 800,
  color: '#1f2a37',
};

const domainButtonStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 0.8rem',
  borderRadius: '11px',
  border: '1px solid #d7dde5',
  cursor: 'pointer',
};

const detailCardStyle: CSSProperties = {
  border: '1px solid #dde5ee',
  borderRadius: '11px',
  padding: '0.85rem',
  background: '#fbfdff',
};

const detailLineStyle: CSSProperties = {
  margin: '0.5rem 0 0',
  color: '#536173',
  lineHeight: 1.65,
};

const ctaStyle: CSSProperties = {
  marginTop: '0.65rem',
  display: 'inline-block',
  textDecoration: 'none',
  background: '#0d6efd',
  color: '#fff',
  border: '1px solid #0d6efd',
  borderRadius: '8px',
  padding: '0.45rem 0.76rem',
  fontWeight: 700,
};

const comingSoonStyle: CSSProperties = {
  marginTop: '0.65rem',
  display: 'inline-block',
  color: '#6a7482',
  fontSize: '0.9rem',
};
