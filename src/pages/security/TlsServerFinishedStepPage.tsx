import type { CSSProperties } from 'react';
import { TlsServerFinishedStepPlayer } from '../../components/TlsServerFinishedStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  'Server Finished は、サーバがここまでのハンドシェイク履歴に対して整合した検証値を返すメッセージです。',
  'クライアントは同じ transcript hash と finished key を使って verify_data を検証します。',
  '検証が通ると、サーバ側のハンドシェイク送信が正しく完了したと確認でき、次の Client Finished へ進めます。',
];

const CHECK_ROWS = [
  {
    term: 'Finished',
    decide: 'サーバが verify_data を返します。',
    result: 'クライアントは、サーバ側のハンドシェイク完全性を確かめられます。',
  },
  {
    term: 'transcript hash',
    decide: '双方が同じハンドシェイク履歴を要約した値を前提に計算します。',
    result: '途中の改ざんや履歴の食い違いがあれば、検証が通りません。',
  },
  {
    term: 'finished key',
    decide: '導出済みの finished key で verify_data を計算・検証します。',
    result: '正しい鍵素材を持つ相手だけが、正しく Finished を作れます。',
  },
];

const NEXT_STATE_ROWS = [
  {
    change: 'サーバ側の送信完了を確認する',
    effect: 'クライアントは、Certificate までのサーバ側メッセージが整合していると確認できます。',
  },
  {
    change: 'Client Finished の送信へ進む',
    effect: '検証に成功したクライアントは、自分の Finished を返す準備に入ります。',
  },
  {
    change: '検証失敗なら中断する',
    effect: 'verify_data が一致しなければ、ハンドシェイクはその場で中断されます。',
  },
];

const TERMS = [
  {
    term: 'Finished',
    note: 'ここまでのハンドシェイク履歴に対する整合性確認用メッセージです。',
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
    note: 'Finished の verify_data 計算に使う鍵です。handshake secrets から導かれます。',
  },
  {
    term: 'Client Finished',
    note: 'Server Finished の検証後にクライアントが返す、最後の Finished メッセージです。',
  },
];

export function TlsServerFinishedStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="Server Finished" />

      <h1 style={pageTitleStyle}>Server Finished の詳細</h1>
      <p style={leadStyle}>
        Server Finished は、サーバがここまでのハンドシェイク履歴に対して整合した検証値を返すメッセージです。
        クライアントはこれを検証し、サーバ側の送信内容と鍵導出が一致しているかを確かめます。
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
        <h2 style={sectionTitleStyle}>ここで確かめること</h2>
        <p style={sectionLeadStyle}>
          Server Finished は、新しい条件を提案する場面ではなく、ここまでのハンドシェイク履歴と鍵導出が整合しているかを確かめる場面です。何を使って検証するかを先に押さえると、次の Client Finished とのつながりが見やすくなります。
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
                <th scope="col" style={decisionHeaderCellStyle}>ここで確かめること</th>
                <th scope="col" style={decisionHeaderCellStyle}>次に効く結果</th>
              </tr>
            </thead>
            <tbody>
              {CHECK_ROWS.map((row, index) => (
                <tr key={row.term}>
                  <td style={index === CHECK_ROWS.length - 1 ? decisionTermCellLastStyle : decisionTermCellStyle}>
                    <code>{row.term}</code>
                  </td>
                  <td style={index === CHECK_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
                    {row.decide}
                  </td>
                  <td style={index === CHECK_ROWS.length - 1 ? decisionBodyCellLastStyle : decisionBodyCellStyle}>
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
          サーバが verify_data を計算するところから、クライアントが Finished を検証して Client Finished の準備に入るところまでを順に追います。
        </p>
        <TlsServerFinishedStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>この後どう変わるか</h2>
        <p style={sectionLeadStyle}>
          Server Finished の検証が通ると、サーバ側の送信フライトは受け入れられ、クライアントが最後の Finished を返す段階に進みます。後続の変化だけを並べて確認します。
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
        leftLink={{ to: '/security/transport-security/tls/certificate', label: 'Certificate へ' }}
        rightLink={{ to: '/security/transport-security/tls/client-finished', label: 'Client Finished へ' }}
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
