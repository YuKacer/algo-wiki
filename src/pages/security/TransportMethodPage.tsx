import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TlsHandshakePlayer } from '../../components/TlsHandshakePlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';
import { type TransportMethodId, getTransportMethodById } from '../../content/securityTransportModel';

const ORDER: TransportMethodId[] = ['tls', 'ipsec', 'ssh', 'vpn', 'dns-protection'];

interface TlsProtectionRow {
  aspect: string;
  protects: string;
  caution: string;
}

interface TlsUsageRow {
  scene: string;
  stance: string;
}

interface TlsTerm {
  term: string;
  note: string;
}

const TLS_LEAD =
  'TLS は Web サイトや API で広く使われる通信保護方式です。通信途中の盗み見や改ざんを抑え、証明書検証を通じて接続先サーバが本物か確認できるようにします。一方で、端末自体が侵害されている場合や TLS 終端以降の内部区間は、自動では守れません。';

const TLS_SUMMARY = [
  'TLS は主に Web / API などのアプリケーション通信を保護する方式です。',
  '通信途中の盗み見や改ざんを抑え、接続先サーバが本物か確認できるようにします。',
  'ネットワーク全体の保護や管理接続は、別の方式と役割分担します。',
];

const TLS_PROTECTION_ROWS: TlsProtectionRow[] = [
  {
    aspect: '機密性',
    protects: '通信途中の第三者に内容を読まれないようにする。',
    caution: '端末上で見えている情報や、TLS 終端以降の内部区間は別途保護が必要な場合がある。',
  },
  {
    aspect: '完全性',
    protects: '通信途中で改ざんがあれば検知できる。',
    caution: '端末やアプリ自体が侵害されている場合は、TLS だけでは防げない。',
  },
  {
    aspect: 'サーバ認証',
    protects: '接続先サーバが本物か確認できる。',
    caution: '証明書運用や名前解決まわりの問題には、関連する対策も必要になる。',
  },
];

const TLS_USAGE_ROWS: TlsUsageRow[] = [
  {
    scene: '公開 Web サイト / API の保護',
    stance: 'TLS が向く。ブラウザやアプリからの通信を標準的に保護できる。',
  },
  {
    scene: '拠点間や社内ネットワーク全体の保護',
    stance: 'ネットワーク全体の接続保護は TLS よりも、VPN や IPsec の領域になる。',
  },
  {
    scene: '管理者ログインや踏み台接続',
    stance: 'サーバ管理の接続保護は、TLS よりも SSH の領域になる。',
  },
  {
    scene: 'DNS 改ざん対策',
    stance: '名前解決の保護は、DNS 保護系の方式を別途組み合わせる。',
  },
];

const TLS_TERMS: TlsTerm[] = [
  {
    term: 'TLS',
    note: 'Web / API で広く使われる通信保護方式です。通信途中の盗み見や改ざんを抑えます。',
  },
  {
    term: 'ハンドシェイク',
    note: '通信を始める前に、条件のすり合わせ・鍵共有・サーバ認証を行う手順です。',
  },
  {
    term: '証明書',
    note: '接続先サーバの公開鍵と名前の対応を示すデータです。クライアントはこれを検証して相手を確認します。',
  },
  {
    term: '暗号スイート',
    note: 'この接続で使う暗号方式の組み合わせです。TLS 1.3 では候補から 1 つ選ばれます。',
  },
  {
    term: 'TLS 終端',
    note: 'TLS を復号して中身を扱う境目です。ロードバランサやプロキシで終端する場合、その先の区間は別途保護が必要なことがあります。',
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
        <h2 style={sectionTitleStyle}>最初に押さえる 3 点</h2>
        <ul style={listStyle}>
          {TLS_SUMMARY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLS で守れること / 守れないこと</h2>
        <p style={sectionLeadStyle}>
          TLS が直接守るのは、通信経路上の内容と接続先サーバの確認です。守れる範囲と注意点を観点ごとに並べて見ます。
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={{ width: '18%' }} />
              <col style={{ width: '42%' }} />
              <col style={{ width: '40%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={headerCellStyle}>観点</th>
                <th scope="col" style={headerCellStyle}>TLS で守れること</th>
                <th scope="col" style={headerCellStyle}>注意点</th>
              </tr>
            </thead>
            <tbody>
              {TLS_PROTECTION_ROWS.map((row, index) => (
                <tr key={row.aspect}>
                  <td style={index === TLS_PROTECTION_ROWS.length - 1 ? termCellLastStyle : termCellStyle}>{row.aspect}</td>
                  <td style={index === TLS_PROTECTION_ROWS.length - 1 ? bodyCellLastStyle : bodyCellStyle}>{row.protects}</td>
                  <td style={index === TLS_PROTECTION_ROWS.length - 1 ? bodyCellLastStyle : bodyCellStyle}>{row.caution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLS が向く場面 / TLS だけでは足りない場面</h2>
        <p style={sectionLeadStyle}>
          TLS はアプリケーション通信の保護に向きますが、ネットワーク全体や管理接続まで 1 つで置き換える方式ではありません。場面ごとの位置づけを並べて見ます。
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={{ width: '34%' }} />
              <col style={{ width: '66%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={headerCellStyle}>場面</th>
                <th scope="col" style={headerCellStyle}>TLS の位置づけ</th>
              </tr>
            </thead>
            <tbody>
              {TLS_USAGE_ROWS.map((row, index) => (
                <tr key={row.scene}>
                  <td style={index === TLS_USAGE_ROWS.length - 1 ? termCellLastStyle : termCellStyle}>{row.scene}</td>
                  <td style={index === TLS_USAGE_ROWS.length - 1 ? bodyCellLastStyle : bodyCellStyle}>{row.stance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>ハンドシェイクの流れ（TLS 1.3）</h2>
        <p style={sectionLeadStyle}>
          TLS 1.3 では、ClientHello から始まり、条件のすり合わせ・鍵共有・サーバ認証を経て暗号化通信へ入ります。ここでは細部よりも全体の流れを俯瞰します。
        </p>
        <TlsHandshakePlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>TLS の基礎用語</h2>
        <div style={termGridStyle}>
          {TLS_TERMS.map((row) => (
            <div key={row.term} style={termRowStyle}>
              <div style={termKeyStyle}>{row.term}</div>
              <div style={termNoteStyle}>{row.note}</div>
            </div>
          ))}
        </div>
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
  const prevLabel = nav.prev
    ? `← 前の方式: ${getTransportMethodById(nav.prev)?.title ?? ''}`
    : '← 一覧に戻る';
  const prevTo = methodLink(nav.prev);
  const nextLabel = nav.next
    ? `次の方式: ${getTransportMethodById(nav.next)?.title ?? ''} →`
    : '一覧に戻る →';
  const nextTo = methodLink(nav.next);

  return (
    <main style={pageStyle}>
      {isTls ? (
        <TlsStepBreadcrumbs />
      ) : (
        <div style={backWrapStyle}>
          <Link to="/security/transport-security" style={backLinkStyle}>
            ← 通信保護の一覧に戻る
          </Link>
        </div>
      )}

      <h1 style={pageTitleStyle}>{method.title}</h1>
      <p style={leadStyle}>
        {isTls ? TLS_LEAD : methodLeadText(method.id)}
      </p>

      {!isTls ? (
        <BasicSection
          layer={method.layer}
          protects={method.protects}
          usage={method.usage}
          strengths={method.strengths}
          cautions={method.cautions}
        />
      ) : null}

      {isTls ? <TlsContent /> : null}

      {isTls ? (
        <TlsStepFooterNav
          leftLink={{ to: '/security/transport-security', label: '通信保護の一覧へ' }}
          rightLink={{ to: '/security/transport-security/tls/client-hello', label: 'ClientHello へ' }}
        />
      ) : (
        <section style={pagerStyle}>
          <Link to={prevTo} style={pagerLinkStyle}>{prevLabel}</Link>
          <Link to={nextTo} style={pagerLinkStyle}>{nextLabel}</Link>
        </section>
      )}
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
  marginTop: '0.45rem',
  marginBottom: '1rem',
  lineHeight: 1.78,
};

const backWrapStyle: CSSProperties = {
  marginBottom: '0.85rem',
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
  border: '1px solid #dbe2ea',
  borderRadius: '10px',
  overflow: 'hidden',
  background: '#fff',
  tableLayout: 'fixed',
};

const headerCellStyle: CSSProperties = {
  padding: '0.6rem 0.72rem',
  borderBottom: '1.5px solid #cbd5e1',
  background: '#eff4f8',
  color: '#1f2937',
  textAlign: 'left',
  fontSize: '0.8rem',
  fontWeight: 800,
  lineHeight: 1.28,
  verticalAlign: 'bottom',
};

const termCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#1f2937',
  fontSize: '0.87rem',
  fontWeight: 700,
  lineHeight: 1.38,
  verticalAlign: 'top',
};

const termCellLastStyle: CSSProperties = {
  ...termCellStyle,
  borderBottom: 'none',
};

const bodyCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#475569',
  fontSize: '0.87rem',
  lineHeight: 1.48,
  verticalAlign: 'top',
};

const bodyCellLastStyle: CSSProperties = {
  ...bodyCellStyle,
  borderBottom: 'none',
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

const pagerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.8rem',
  flexWrap: 'wrap',
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
