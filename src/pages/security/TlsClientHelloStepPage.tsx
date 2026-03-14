import type { CSSProperties } from 'react';
import { TlsClientHelloStepPlayer } from '../../components/TlsClientHelloStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  'ClientHello は、クライアントが今回の通信で使いたい TLS の条件を、最初にまとめてサーバーに伝えるメッセージです。',
  'ここでは、TLS バージョン、暗号スイート、SNI、key share、supported groups などを送ります。',
  'サーバーはその内容を見て、次に ServerHello を返すか HelloRetryRequest を返すかを判断します。',
];

const CONTENT_ROWS = [
  {
    term: 'supported_versions',
    sends: '対応できる TLS バージョンを送ります。',
    image: 'TLS 1.3',
    conveys: 'サーバーに、TLS 1.3 で続行できるかを伝える材料になります。',
  },
  {
    term: 'cipher_suites',
    sends: '使いたい暗号スイートの候補を送ります。',
    image: 'TLS_AES_128_GCM_SHA256',
    conveys: 'サーバーが共通に使える暗号方式を選ぶ材料になります。',
  },
  {
    term: 'SNI',
    sends: '接続したいホスト名を送ります。',
    image: 'example.com',
    conveys: 'サーバーがどのホスト設定や証明書候補で応答するかを判断する材料になります。',
  },
  {
    term: 'supported_groups',
    sends: '対応できる鍵交換グループの一覧を送ります。',
    image: 'x25519, secp256r1',
    conveys: '受け取った key_share が合わない場合に、再提案できる候補があるかを伝える材料になります。',
  },
  {
    term: 'key_share',
    sends: '今回使いたい鍵交換用の公開値を送ります。',
    image: 'x25519 用の公開値',
    conveys: 'サーバーがそのまま鍵交換に進めるかどうかを判断する材料になります。',
  },
];

type ConditionValue = 'はい' | 'いいえ' | '－';

interface BranchTableRow {
  condition1: ConditionValue;
  condition2: ConditionValue;
  response: string;
  nextState: string;
  tone: 'success' | 'retry' | 'failure';
}

const BRANCH_TABLE_ROWS: BranchTableRow[] = [
  {
    condition1: 'はい',
    condition2: 'はい',
    response: 'ServerHello',
    nextState: '通常のハンドシェイクを継続',
    tone: 'success',
  },
  {
    condition1: 'はい',
    condition2: 'いいえ',
    response: 'HelloRetryRequest',
    nextState: 'ClientHello の再送を促す',
    tone: 'retry',
  },
  {
    condition1: 'いいえ',
    condition2: '－',
    response: 'Alert',
    nextState: 'ハンドシェイクを中断',
    tone: 'failure',
  },
];

const TERMS = [
  {
    term: 'TLS バージョン',
    note: 'この接続で使う TLS の版です。TLS 1.3 では ClientHello の supported_versions と ServerHello の選択結果で確定します。',
  },
  {
    term: '暗号スイート',
    note: '通信を保護する方式の組み合わせです。クライアントは候補を出し、サーバが 1 つ選びます。',
  },
  {
    term: 'SNI',
    note: 'Server Name Indication の略です。接続先ホスト名を伝え、サーバがどの設定や証明書候補を使うか判断する材料になります。',
  },
  {
    term: 'supported_groups',
    note: 'クライアントが対応できる鍵交換グループの一覧です。key_share がそのまま使えないとき、サーバはこの情報を見て HelloRetryRequest で再提案を求めます。',
  },
  {
    term: 'key_share',
    note: '鍵交換に使う公開値です。サーバがそのまま使えるなら ServerHello に進み、合わなければ HelloRetryRequest で作り直しを求めます。',
  },
  {
    term: 'HelloRetryRequest',
    note: 'ClientHello をやり直してほしいとサーバが伝える応答です。失敗ではなく、指定した鍵交換グループで再提案してほしいという意味です。',
  },
];

export function TlsClientHelloStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="ClientHello" />

      <h1 style={pageTitleStyle}>ClientHello の詳細</h1>
      <p style={leadStyle}>
        ClientHello は、クライアントが「この条件で TLS を始めたい」と最初に提案するメッセージです。
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
        <h2 style={sectionTitleStyle}>ClientHello で送る主な内容</h2>
        <p style={sectionLeadStyle}>
          ClientHello には、クライアントがこの通信で使いたい条件がまとめて入っています。ここでは、主な項目と、それぞれで何を伝えているかを見ます。
        </p>
        <div style={decisionTableWrapStyle}>
          <table style={decisionTableStyle}>
            <colgroup>
              <col style={{ width: '17%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '33%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={decisionHeaderCellStyle}>項目</th>
                <th scope="col" style={decisionHeaderCellStyle}>クライアントが送る内容</th>
                <th scope="col" style={decisionHeaderCellStyle}>入りうる値のイメージ</th>
                <th scope="col" style={decisionHeaderCellStyle}>これで何が伝わるか</th>
              </tr>
            </thead>
            <tbody>
              {CONTENT_ROWS.map((row, index) => (
                <tr key={row.term}>
                  <td style={index === CONTENT_ROWS.length - 1 ? decisionTermCellLastStyle : decisionTermCellStyle}>
                    <code>{row.term}</code>
                  </td>
                  <td style={index === CONTENT_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.sends}
                  </td>
                  <td style={index === CONTENT_ROWS.length - 1 ? decisionImageCellLastStyle : decisionImageCellStyle}>
                    <code>{row.image}</code>
                  </td>
                  <td style={index === CONTENT_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.conveys}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>内部の流れ</h2>
        <p style={sectionLeadStyle}>
          クライアントが条件を組み立てて ClientHello を送り、サーバーがその内容を受け取るまでを段階ごとに追います。
        </p>
        <TlsClientHelloStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>ClientHello の後で起きる主な分岐</h2>
        <p style={sectionLeadStyle}>
          ClientHello を受けた後、サーバーは共通条件がそろうか、受け取った key_share をそのまま使えるかを見て、次に ServerHello、HelloRetryRequest、Alert のどれに進むかを判断します。
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={{ width: '24%' }} />
              <col style={{ width: '26%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '30%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={headerCellStyle}>共通条件がそろうか</th>
                <th scope="col" style={headerCellStyle}>受信した key_share をそのまま使えるか</th>
                <th scope="col" style={headerCellStyle}>サーバの応答</th>
                <th scope="col" style={headerCellStyle}>ハンドシェイクの扱い</th>
              </tr>
            </thead>
            <tbody>
              {BRANCH_TABLE_ROWS.map((row, index) => {
                const isLast = index === BRANCH_TABLE_ROWS.length - 1;

                return (
                  <tr key={`${row.condition1}-${row.condition2}-${row.response}`}>
                    <td style={conditionCellStyle(row.condition1, isLast)}>{row.condition1}</td>
                    <td
                      style={conditionCellStyle(row.condition2, isLast)}
                      aria-label={row.condition2 === '－' ? '判定不要' : row.condition2}
                    >
                      {row.condition2}
                    </td>
                    <td style={messageCellStyle(row.tone, isLast)}>{row.response}</td>
                    <td style={isLast ? bodyCellLastStyle : bodyCellStyle}>{row.nextState}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        leftLink={{ to: '/security/transport-security/tls', label: 'TLS 概要へ' }}
        rightLink={{ to: '/security/transport-security/tls/server-hello', label: 'ServerHello へ' }}
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

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.2rem',
  color: '#343a40',
  lineHeight: 1.72,
};

const decisionTableWrapStyle: CSSProperties = {
  overflowX: 'auto',
};

const decisionTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dbe2ea',
  borderRadius: '10px',
  overflow: 'hidden',
  background: '#fff',
  tableLayout: 'fixed',
};

const decisionHeaderCellStyle: CSSProperties = {
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

const decisionTermCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#1f2937',
  fontSize: '0.87rem',
  fontWeight: 700,
  lineHeight: 1.38,
  verticalAlign: 'top',
};

const decisionTermCellLastStyle: CSSProperties = {
  ...decisionTermCellStyle,
  borderBottom: 'none',
};

const decisionBodyCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#475569',
  fontSize: '0.87rem',
  lineHeight: 1.48,
  verticalAlign: 'top',
};

const decisionBodyCellLastStyle: CSSProperties = {
  ...decisionBodyCellStyle,
  borderBottom: 'none',
};

const decisionImageCellStyle: CSSProperties = {
  ...decisionBodyCellStyle,
  color: '#1f2937',
  fontWeight: 500,
};

const decisionImageCellLastStyle: CSSProperties = {
  ...decisionImageCellStyle,
  borderBottom: 'none',
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
  padding: '0.5rem 0.7rem',
  borderBottom: '1.5px solid #cbd5e1',
  background: '#eff4f8',
  color: '#1f2937',
  textAlign: 'center',
  verticalAlign: 'bottom',
  lineHeight: 1.28,
  fontSize: '0.8rem',
  fontWeight: 800,
};

const bodyCellStyle: CSSProperties = {
  padding: '0.52rem 0.7rem',
  borderBottom: '1px solid #e9eef5',
  color: '#334155',
  fontSize: '0.86rem',
  lineHeight: 1.34,
  verticalAlign: 'middle',
};

const bodyCellLastStyle: CSSProperties = {
  ...bodyCellStyle,
  borderBottom: 'none',
};

const conditionCellStyle = (value: ConditionValue, isLast: boolean): CSSProperties => ({
  ...(isLast ? bodyCellLastStyle : bodyCellStyle),
  color: value === '－' ? '#94a3b8' : '#475569',
  fontWeight: value === '－' ? 500 : 600,
  textAlign: 'center',
});

const messageCellStyle = (tone: 'success' | 'retry' | 'failure', isLast: boolean): CSSProperties => {
  if (tone === 'success') {
    return {
      ...(isLast ? bodyCellLastStyle : bodyCellStyle),
      background: '#eff6ff',
      color: '#1d4ed8',
      fontWeight: 800,
      fontSize: '0.9rem',
    };
  }

  if (tone === 'retry') {
    return {
      ...(isLast ? bodyCellLastStyle : bodyCellStyle),
      background: '#fffbeb',
      color: '#a16207',
      fontWeight: 800,
      fontSize: '0.9rem',
    };
  }

  return {
    ...(isLast ? bodyCellLastStyle : bodyCellStyle),
    background: '#fff1f2',
    color: '#b91c1c',
    fontWeight: 800,
    fontSize: '0.9rem',
  };
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
