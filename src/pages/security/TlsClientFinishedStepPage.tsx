import type { CSSProperties } from 'react';
import { TlsClientFinishedStepPlayer } from '../../components/TlsClientFinishedStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  'Client Finished は、クライアントが自分側でも同じハンドシェイク状態を共有していると示す最後の Finished メッセージです。',
  'サーバは同じ transcript hash と finished key を使って verify_data を検証します。',
  '検証が通ると TLS handshake が完了し、application data のやり取りへ進めます。',
];

const COMPLETE_ROWS = [
  {
    term: 'Client Finished',
    decide: 'クライアントが verify_data を返します。',
    result: 'サーバは、クライアント側も同じハンドシェイク状態を共有しているか確かめられます。',
  },
  {
    term: 'サーバ側の検証',
    decide: 'サーバが transcript hash と finished key で検証します。',
    result: '履歴や鍵素材に食い違いがあれば、ハンドシェイクは完了できません。',
  },
  {
    term: 'ハンドシェイク完了',
    decide: '検証に成功すれば、この TLS handshake を完了として扱います。',
    result: '以後は application data を保護付きでやり取りできます。',
  },
];

const NEXT_STATE_ROWS = [
  {
    change: 'アプリケーションデータへ進む',
    effect: 'HTTP リクエストなどの通常データを、確立済みの TLS 接続として送受信できます。',
  },
  {
    change: 'ハンドシェイク用の状態が閉じる',
    effect: 'Finished までの確認が終わり、接続は通常の TLS 通信フェーズへ移ります。',
  },
  {
    change: '検証失敗なら中断する',
    effect: 'Client Finished が一致しなければ、サーバは接続を完了させません。',
  },
];

const TERMS = [
  {
    term: 'Finished',
    note: 'ハンドシェイク履歴に対する整合性確認用メッセージです。Server 側と Client 側の両方で送られます。',
  },
  {
    term: 'verify_data',
    note: 'finished key と transcript hash から計算される検証値です。Finished メッセージ本体に入ります。',
  },
  {
    term: 'transcript hash',
    note: 'ここまでのハンドシェイク履歴をまとめた要約値です。同じ会話履歴なら同じ値になります。',
  },
  {
    term: 'finished key',
    note: 'Finished の verify_data 計算に使う鍵です。双方が同じ handshake secrets から導きます。',
  },
  {
    term: 'application data',
    note: 'HTTP リクエストや API 通信など、ハンドシェイク完了後に送る通常データです。',
  },
];

export function TlsClientFinishedStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="Client Finished" />

      <h1 style={pageTitleStyle}>Client Finished の詳細</h1>
      <p style={leadStyle}>
        Client Finished は、クライアントが自分側でも同じハンドシェイク状態を共有していると示す最後の Finished メッセージです。
        サーバがこれを検証できれば TLS handshake は完了し、以後は application data を保護付きでやり取りできます。
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
        <h2 style={sectionTitleStyle}>ここで完了すること</h2>
        <p style={sectionLeadStyle}>
          Client Finished は、ハンドシェイクの最後にクライアント側の整合性確認を返す場面です。何を返し、サーバが何を検証すると完了になるかを先に押さえると、その後の通常通信とのつながりが見やすくなります。
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
                <th scope="col" style={decisionHeaderCellStyle}>ここで行うこと</th>
                <th scope="col" style={decisionHeaderCellStyle}>次に効く結果</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETE_ROWS.map((row, index) => (
                <tr key={row.term}>
                  <td style={index === COMPLETE_ROWS.length - 1 ? decisionTermCellLastStyle : decisionTermCellStyle}>
                    <code>{row.term}</code>
                  </td>
                  <td style={index === COMPLETE_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.decide}
                  </td>
                  <td style={index === COMPLETE_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
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
          クライアントが verify_data を計算するところから、サーバが最終検証を終えて application data へ進むところまでを順に追います。
        </p>
        <TlsClientFinishedStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>この後どう変わるか</h2>
        <p style={sectionLeadStyle}>
          Client Finished の検証が通ると、この TLS handshake は完了として扱われます。通常通信へ移るときの変化だけを並べて確認します。
        </p>
        <div style={nextStateTableWrapStyle}>
          <table style={nextStateTableStyle}>
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '68%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={nextStateHeaderCellStyle}>変化</th>
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
        leftLink={{ to: '/security/transport-security/tls/server-finished', label: 'Server Finished へ' }}
        rightLink={{ to: '/security/transport-security/tls', label: 'TLS 概要へ' }}
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
