import type { CSSProperties } from 'react';
import { TlsEncryptedExtensionsStepPlayer } from '../../components/TlsEncryptedExtensionsStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  'EncryptedExtensions は、ServerHello のあとにサーバが追加の拡張条件を保護付きで伝えるメッセージです。',
  'ここでは ALPN など、この接続で有効になる拡張条件が通知されます。TLS バージョンや暗号スイートはここでは変わりません。',
  'このメッセージは handshake keys で保護されており、受信後は認証構成に応じた後続メッセージへ進みます。',
];

const EXTENSION_ROWS = [
  {
    term: 'ALPN',
    decide: 'HTTP/2 など、上位で使うアプリケーションプロトコルを必要に応じて返します。',
    result: 'クライアントとサーバで、後続のアプリケーション通信に使うプロトコルをそろえられます。',
  },
  {
    term: '追加の拡張条件',
    decide: 'サーバがこの接続で有効にする拡張条件を返します。',
    result: 'クライアントは、後続メッセージや通信の扱いをその条件に合わせられます。',
  },
];

const NEXT_STATE_ROWS = [
  {
    change: '後続の認証メッセージへ進む',
    effect: 'サーバ認証を行う構成では、次に Certificate と CertificateVerify を送ります。',
  },
  {
    change: '拡張条件を前提に処理が続く',
    effect: 'ALPN など、ここで通知された条件を前提に後続のハンドシェイクとアプリケーション処理が続きます。',
  },
  {
    change: '保護付きのハンドシェイクが続く',
    effect: 'Finished までの後続メッセージは handshake keys で保護されたまま進みます。',
  },
];

const TERMS = [
  {
    term: 'EncryptedExtensions',
    note: 'ServerHello のあとに来る、追加の拡張条件をまとめて送るメッセージです。handshake keys で保護されます。',
  },
  {
    term: 'ALPN',
    note: 'Application-Layer Protocol Negotiation の略です。HTTP/2 など、上位で使うプロトコルをサーバが選んで返します。',
  },
  {
    term: 'handshake keys',
    note: 'ServerHello をもとに双方が導出する一時鍵です。後続のハンドシェイクメッセージを保護します。',
  },
  {
    term: 'Certificate',
    note: 'サーバ認証を行う構成で、サーバ証明書チェーンを送るメッセージです。',
  },
  {
    term: 'CertificateVerify',
    note: '証明書に対応する秘密鍵をサーバが持つことを示す署名メッセージです。',
  },
];

export function TlsEncryptedExtensionsStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="EncryptedExtensions" />

      <h1 style={pageTitleStyle}>EncryptedExtensions の詳細</h1>
      <p style={leadStyle}>
        EncryptedExtensions は、ServerHello のあとにサーバが追加の拡張条件を保護付きで返すメッセージです。
        ここでは TLS の暗号条件そのものではなく、ALPN などこの接続で有効にする拡張条件が通知されます。
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
        <h2 style={sectionTitleStyle}>ここで伝えること</h2>
        <p style={sectionLeadStyle}>
          EncryptedExtensions は、ServerHello で暗号条件が確定したあとに、追加の拡張条件だけを保護付きで伝える場面です。何がここで通知されるかを先に押さえると、その後の認証メッセージや後続ハンドシェイクとのつながりが見やすくなります。
        </p>
        <div style={decisionTableWrapStyle}>
          <table style={decisionTableStyle}>
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '40%' }} />
              <col style={{ width: '40%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={decisionHeaderCellStyle}>見る項目</th>
                <th scope="col" style={decisionHeaderCellStyle}>ここで伝えること</th>
                <th scope="col" style={decisionHeaderCellStyle}>次に効く結果</th>
              </tr>
            </thead>
            <tbody>
              {EXTENSION_ROWS.map((row, index) => (
                <tr key={row.term}>
                  <td style={index === EXTENSION_ROWS.length - 1 ? decisionTermCellLastStyle : decisionTermCellStyle}>
                    <code>{row.term}</code>
                  </td>
                  <td style={index === EXTENSION_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.decide}
                  </td>
                  <td style={index === EXTENSION_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.result}
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
          サーバが返す拡張条件を整理するところから、クライアントがそれを受け取り、認証構成に応じた後続メッセージへ進むところまでを順に追います。
        </p>
        <TlsEncryptedExtensionsStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>この後どうつながるか</h2>
        <p style={sectionLeadStyle}>
          EncryptedExtensions は単独の通知ではなく、その後の認証メッセージと保護付きハンドシェイクの前提になります。後続の流れだけを並べて確認します。
        </p>
        <div style={nextStateTableWrapStyle}>
          <table style={nextStateTableStyle}>
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '68%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={nextStateHeaderCellStyle}>次の段階</th>
                <th scope="col" style={nextStateHeaderCellStyle}>何が起きるか</th>
              </tr>
            </thead>
            <tbody>
              {NEXT_STATE_ROWS.map((row, index) => (
                <tr key={row.change}>
                  <td style={index === NEXT_STATE_ROWS.length - 1 ? nextStateTermCellLastStyle : nextStateTermCellStyle}>
                    {row.change}
                  </td>
                  <td style={index === NEXT_STATE_ROWS.length - 1 ? nextStateBodyCellLastStyle : nextStateBodyCellStyle}>
                    {row.effect}
                  </td>
                </tr>
              ))}
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
        leftLink={{ to: '/security/transport-security/tls/server-hello', label: 'ServerHello へ' }}
        rightLink={{ to: '/security/transport-security/tls/certificate', label: 'Certificate へ' }}
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

const nextStateTableWrapStyle: CSSProperties = {
  overflowX: 'auto',
};

const nextStateTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dbe2ea',
  borderRadius: '10px',
  overflow: 'hidden',
  background: '#fff',
  tableLayout: 'fixed',
};

const nextStateHeaderCellStyle: CSSProperties = {
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

const nextStateTermCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#1f2937',
  fontSize: '0.87rem',
  fontWeight: 700,
  lineHeight: 1.38,
  verticalAlign: 'top',
};

const nextStateTermCellLastStyle: CSSProperties = {
  ...nextStateTermCellStyle,
  borderBottom: 'none',
};

const nextStateBodyCellStyle: CSSProperties = {
  padding: '0.62rem 0.72rem',
  borderBottom: '1px solid #e9eef5',
  color: '#475569',
  fontSize: '0.87rem',
  lineHeight: 1.48,
  verticalAlign: 'top',
};

const nextStateBodyCellLastStyle: CSSProperties = {
  ...nextStateBodyCellStyle,
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
