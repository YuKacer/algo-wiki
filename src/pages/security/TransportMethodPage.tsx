import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TlsHandshakePlayer } from '../../components/TlsHandshakePlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { type TransportMethodId, getTransportMethodById } from '../../content/securityTransportModel';

const ORDER: TransportMethodId[] = ['tls', 'ipsec', 'ssh', 'vpn', 'dns-protection'];

interface TlsDecisionCard {
  title: string;
  items: string[];
}

const TLS_SUMMARY = [
  'TLS は主に Web/API などのアプリ通信を保護する標準方式です。',
  '守る中心は、通信の機密性・完全性・サーバーの本人性です。',
  '端末侵害や TLS 終端以降の区間は、自動では守られません。',
];

const TLS_DECISION_CARDS: TlsDecisionCard[] = [
  {
    title: 'TLS が向く場面',
    items: [
      '公開 Web サイトや API をブラウザやアプリから安全に使わせたい',
      'サービス間通信で、接続先サーバーの本人性と経路上の保護を確保したい',
      'HTTPS や gRPC など、標準的なアプリプロトコルの保護を行いたい',
    ],
  },
  {
    title: 'TLS だけでは足りない場面',
    items: [
      '拠点全体や社内ネットワーク全体の経路を守りたいなら IPsec / VPN を検討する',
      '管理者のログインや踏み台接続を守るなら SSH を使う',
      '名前解決の改ざん対策は DNS 保護系の方式を別途組み合わせる',
    ],
  },
];

function nextPrev(id: TransportMethodId) {
  const index = ORDER.indexOf(id);
  const prev = index > 0 ? ORDER[index - 1] : null;
  const next = index < ORDER.length - 1 ? ORDER[index + 1] : null;
  return { prev, next };
}

function methodLink(id: TransportMethodId | null) {
  return id ? `/security/transport-security/${id}` : '/security/transport-security';
}

function methodLeadText(id: TransportMethodId) {
  switch (id) {
    case 'tls':
      return 'Web/APIで最も広く使われる通信保護方式です。通信路の盗聴・改ざん・なりすまし対策を担います。';
    case 'ipsec':
      return 'ネットワーク層で通信路を保護する方式です。拠点間や組織間のネットワーク接続で使われます。';
    case 'ssh':
      return '管理系のリモート接続を保護する方式です。サーバー運用や保守作業で使われます。';
    case 'vpn':
      return '端末や拠点を安全に内部ネットワークへ接続する方式です。リモートアクセスでよく使われます。';
    case 'dns-protection':
      return 'DNS問い合わせの改ざんや盗聴を抑える方式です。名前解決の信頼性を高めます。';
    default:
      return '';
  }
}

function BasicSection(props: {
  layer: string;
  protects: string;
  usage: string;
  strengths: string;
  cautions: string;
}) {
  return (
    <section style={panelStyle}>
      <h2 style={sectionTitleStyle}>基本情報</h2>
      <ul style={listStyle}>
        <li><strong>レイヤー:</strong> {props.layer}</li>
        <li><strong>守るもの:</strong> {props.protects}</li>
        <li><strong>主な用途:</strong> {props.usage}</li>
        <li><strong>強み:</strong> {props.strengths}</li>
        <li><strong>注意点:</strong> {props.cautions}</li>
      </ul>
    </section>
  );
}

function TlsContent() {
  return (
    <>
      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>3行要約</h2>
        <ul style={listStyle}>
          {TLS_SUMMARY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLSで何が守られるか</h2>
        <ul style={listStyle}>
          <li><strong>機密性:</strong> 通信経路上の第三者に平文を読まれにくい</li>
          <li><strong>完全性:</strong> 途中改ざんがあれば検知できる</li>
          <li><strong>本人性:</strong> 証明書検証により、接続先サーバーの本人性を確認できる</li>
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLSが向く場面 / 向かない場面</h2>
        <div style={decisionGridStyle}>
          {TLS_DECISION_CARDS.map((card) => (
            <div key={card.title} style={decisionCardStyle}>
              <h3 style={miniTitleStyle}>{card.title}</h3>
              <ul style={listStyle}>
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>ハンドシェイクの流れ（TLS1.3）</h2>
        <TlsHandshakePlayer />
      </section>
    </>
  );
}

export function TransportMethodPage() {
  const { methodId } = useParams();
  const method = getTransportMethodById(methodId ?? '');
  if (!method) return <Navigate to="/security/transport-security" replace />;

  const nav = nextPrev(method.id);
  const isTls = method.id === 'tls';
  const prevLabel = isTls
    ? '← 一覧に戻る'
    : nav.prev
      ? `← 前の方式: ${getTransportMethodById(nav.prev)?.title ?? ''}`
      : '← 一覧に戻る';
  const prevTo = isTls ? '/security/transport-security' : methodLink(nav.prev);
  const nextLabel = isTls
    ? 'ClientHello へ →'
    : nav.next
      ? `次の方式: ${getTransportMethodById(nav.next)?.title ?? ''} →`
      : '一覧に戻る →';
  const nextTo = isTls ? '/security/transport-security/tls/client-hello' : methodLink(nav.next);

  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      {isTls ? (
        <TlsStepBreadcrumbs />
      ) : (
        <div style={{ marginBottom: '0.85rem' }}>
          <Link to="/security/transport-security" style={backLinkStyle}>
            ← 通信保護の一覧に戻る
          </Link>
        </div>
      )}

      <h1 style={{ margin: 0, fontSize: '1.88rem', color: '#1a1a2e' }}>{method.title}</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem', lineHeight: 1.75 }}>
        {methodLeadText(method.id)}
      </p>

      <BasicSection
        layer={method.layer}
        protects={method.protects}
        usage={method.usage}
        strengths={method.strengths}
        cautions={method.cautions}
      />

      {isTls ? <TlsContent /> : null}

      <section style={pagerStyle}>
        <Link to={prevTo} style={pagerLinkStyle}>{prevLabel}</Link>
        <Link to={nextTo} style={pagerLinkStyle}>{nextLabel}</Link>
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
  fontSize: '1.08rem',
  color: '#212529',
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.2rem',
  color: '#343a40',
  lineHeight: 1.72,
};

const decisionGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '0.75rem',
};

const decisionCardStyle: CSSProperties = {
  border: '1px solid #e3e8ef',
  borderRadius: '10px',
  padding: '0.85rem',
  background: '#fbfcff',
};

const miniTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: '0.45rem',
  fontSize: '0.98rem',
  color: '#1f2a37',
};

const pagerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.8rem',
};

const pagerLinkStyle: CSSProperties = {
  display: 'inline-block',
  padding: '0.45rem 0.75rem',
  border: '1px solid #cfe2ff',
  borderRadius: '7px',
  background: '#f6f9ff',
  color: '#185ccf',
  textDecoration: 'none',
  fontWeight: 700,
};

const backLinkStyle: CSSProperties = {
  display: 'inline-block',
  color: '#0d6efd',
  textDecoration: 'none',
  fontWeight: 700,
};
