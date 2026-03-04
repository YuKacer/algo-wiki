import type { CSSProperties, ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { type TransportMethodId, getTransportMethodById } from '../../content/securityTransportModel';

const ORDER: TransportMethodId[] = ['tls', 'ipsec', 'ssh', 'vpn', 'dns-protection'];

interface TlsFlowRow {
  step: string;
  client: ReactNode;
  server: ReactNode;
}

const INLINE_LINK_STYLE: CSSProperties = {
  color: '#185ccf',
  textDecoration: 'none',
  fontWeight: 700,
  margin: '0 0.18rem',
};

const TLS_FLOW: TlsFlowRow[] = [
  {
    step: '1. ClientHello（提案）',
    client: '対応バージョン候補・暗号スイート候補・SNI・（TLS1.3なら）鍵共有候補（key share）などを送る',
    server: '受信して採用する方式を選定する',
  },
  {
    step: '2. ServerHello（方式決定）',
    client: '採用方式とサーバーの鍵共有情報（key share）を受け取り、共有秘密を導出してハンドシェイク暗号化の鍵を作り始める',
    server: '採用バージョン・暗号スイートを返し、鍵共有情報（key share）を提示する',
  },
  {
    step: '3. 証明書提示 + CertificateVerify',
    client: (
      <>
        （以降は暗号化されたハンドシェイクとして）証明書チェーンと CertificateVerify を受け取る。証明書は SAN・期限・
        <Link to="/security/certificate-authority" style={INLINE_LINK_STYLE}>CA</Link>
        連鎖・署名を検証し、CertificateVerify はハンドシェイク内容に対する
        <Link to="/security/digital-signature" style={INLINE_LINK_STYLE}>デジタル署名</Link>
        として検証する
      </>
    ),
    server: '証明書チェーンと CertificateVerify を送る（サーバー本人性の証明）',
  },
  {
    step: '4. 証明書検証（真正性確認）',
    client: 'ホスト名（SAN）・期限・CA連鎖と、CertificateVerify の署名を検証する（OKなら Client Finished を送る）',
    server: 'Client Finished を受け取って初めて、検証が通りハンドシェイクが成立したと分かる',
  },
  {
    step: '5. 鍵導出 + Server Finished',
    client: (
      <>
        <Link to="/security/public-key-crypto" style={INLINE_LINK_STYLE}>公開鍵の仕組み</Link>
        を使う鍵交換（実運用では主にECDHE）で得た共有秘密から、アプリ通信の鍵を導出する。Server Finished を検証する
      </>
    ),
    server: '共有秘密からアプリ通信の鍵を導出し、（証明書提示/CertificateVerify の後に）Server Finished を先に送る',
  },
  {
    step: '6. Client Finished -> アプリ通信開始',
    client: 'Client Finished を送信し、以後のアプリデータ（HTTPなど）を共通鍵暗号で送る',
    server: 'Client Finished を受信してハンドシェイク完了と判断し、応答も共通鍵暗号で返す',
  },
];

const TLS_DIFFS = [
  {
    point: 'フルハンドシェイク',
    v12: '通常 2-RTT',
    v13: '通常 1-RTT',
  },
  {
    point: '鍵交換/暗号の整理',
    v12: '暗号スイートに要素が混在しやすい',
    v13: '鍵交換と暗号設定が整理され、誤設定リスクを下げやすい',
  },
  {
    point: 'Early Data',
    v12: 'なし',
    v13: '0-RTT が可能（リプレイ耐性の設計は別途必要）',
  },
];

const TLS_FAILURES = [
  {
    symptom: '証明書エラーで接続できない',
    cause: '期限切れ・ホスト名不一致・中間証明書不足',
    fix: '証明書更新、SAN確認、フルチェーン配布を実施する',
  },
  {
    symptom: '一部端末だけ通信失敗',
    cause: '中間証明書不足や非推奨TLS設定',
    fix: '中間証明書を揃え、互換ポリシーを定期見直しする',
  },
  {
    symptom: '運用中に設定差異で事故',
    cause: '環境ごとに TLS/証明書ポリシーが不統一',
    fix: 'TLS1.3優先、弱い設定無効化、IaCで設定統制する',
  },
];

const TLS_CHECKLIST = [
  'TLS1.3を優先し、TLS1.2は必要最小限の互換用途に限定する',
  '証明書期限の監視と自動更新を運用に組み込む',
  '中間証明書を含むフルチェーンを常に配布する',
  'ステージングで主要ブラウザ/主要クライアントの相互接続を確認する',
  '失敗ログ（ハンドシェイク失敗・証明書エラー）を監視し、原因を継続改善する',
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
        <h2 style={sectionTitleStyle}>TLSで何が守られるか</h2>
        <ul style={listStyle}>
          <li><strong>機密性:</strong> 第三者に平文で読まれない</li>
          <li><strong>完全性:</strong> 通信中に改ざんされにくい</li>
          <li><strong>真正性:</strong> 接続先サーバーの正当性を検証できる</li>
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>ハンドシェイクの流れ（TLS1.3）</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ステップ</th>
                <th style={thStyle}>クライアント側</th>
                <th style={thStyle}>サーバー側</th>
              </tr>
            </thead>
            <tbody>
              {TLS_FLOW.map((row) => (
                <tr key={row.step}>
                  <td style={tdStrongStyle}>{row.step}</td>
                  <td style={tdStyle}>{row.client}</td>
                  <td style={tdStyle}>{row.server}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={noteStyle}>
          注: TLS1.3ではバージョン互換の都合で <code>supported_versions</code> を使い、鍵交換は <code>key share</code> /{' '}
          <code>supported_groups</code> で提示します。
        </p>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLS1.2 と TLS1.3 の違い（RTT観点）</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>観点</th>
                <th style={thStyle}>TLS1.2</th>
                <th style={thStyle}>TLS1.3</th>
              </tr>
            </thead>
            <tbody>
              {TLS_DIFFS.map((row) => (
                <tr key={row.point}>
                  <td style={tdStrongStyle}>{row.point}</td>
                  <td style={tdStyle}>{row.v12}</td>
                  <td style={tdStyle}>{row.v13}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>よくある失敗パターン</h2>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>症状</th>
                <th style={thStyle}>原因</th>
                <th style={thStyle}>対策</th>
              </tr>
            </thead>
            <tbody>
              {TLS_FAILURES.map((row) => (
                <tr key={row.symptom}>
                  <td style={tdStrongStyle}>{row.symptom}</td>
                  <td style={tdStyle}>{row.cause}</td>
                  <td style={tdStyle}>{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLSが守らないもの</h2>
        <ul style={listStyle}>
          <li>端末やサーバー自体が侵害されている場合の情報漏えいは防げない</li>
          <li>宛先IP・通信量などの外形情報は見える（技術により一部緩和可能）</li>
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>運用チェックリスト</h2>
        <ul style={listStyle}>
          {TLS_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function TransportMethodPage() {
  const { methodId } = useParams();
  const method = getTransportMethodById(methodId ?? '');
  if (!method) return <Navigate to="/security/transport-security" replace />;

  const nav = nextPrev(method.id);
  const prevLabel = nav.prev ? `← 前の方式: ${getTransportMethodById(nav.prev)?.title ?? ''}` : '← 一覧に戻る';
  const nextLabel = nav.next ? `次の方式: ${getTransportMethodById(nav.next)?.title ?? ''} →` : '一覧に戻る →';
  const isTls = method.id === 'tls';

  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <div style={{ marginBottom: '0.85rem' }}>
        <Link to="/security/transport-security" style={backLinkStyle}>
          ← 通信保護の一覧に戻る
        </Link>
      </div>

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
        <Link to={methodLink(nav.prev)} style={pagerLinkStyle}>{prevLabel}</Link>
        <Link to={methodLink(nav.next)} style={pagerLinkStyle}>{nextLabel}</Link>
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

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '680px',
  background: '#fff',
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  padding: '0.5rem 0.55rem',
  color: '#495057',
  fontSize: '0.84rem',
};

const tdStyle: CSSProperties = {
  borderBottom: '1px solid #f1f3f5',
  padding: '0.5rem 0.55rem',
  color: '#343a40',
  lineHeight: 1.6,
  verticalAlign: 'top',
  fontSize: '0.9rem',
};

const tdStrongStyle: CSSProperties = {
  ...tdStyle,
  fontWeight: 700,
  color: '#1f2a37',
};

const noteStyle: CSSProperties = {
  margin: '0.5rem 0 0',
  color: '#6b7280',
  fontSize: '0.82rem',
  lineHeight: 1.55,
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
