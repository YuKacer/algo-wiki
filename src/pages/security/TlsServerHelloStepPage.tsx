import type { CSSProperties } from 'react';
import { TlsServerHelloStepPlayer } from '../../components/TlsServerHelloStepPlayer';
import { TlsStepBreadcrumbs } from '../../components/TlsStepBreadcrumbs';
import { TlsStepFooterNav } from '../../components/TlsStepFooterNav';

const SUMMARY = [
  'ServerHello は、Server がこの接続で採用する TLS 条件を Client へ正式に返すメッセージです。',
  'ここで TLS version、cipher suite、Server 側の key share が確定し、候補のやり取りが終わります。',
  'この返答を受けて双方が handshake keys を導出し始め、次の EncryptedExtensions 以降は保護付きで流れます。',
];

const FIXED_ROWS = [
  {
    term: 'TLS version',
    decide: 'この接続で使う TLS の世代を確定する',
    result: '以後の handshake は選ばれた version 前提で進む',
  },
  {
    term: 'cipher suite',
    decide: 'この接続で採用する暗号方式を確定する',
    result: '以後に使う保護方式の前提が固まる',
  },
  {
    term: 'server key share',
    decide: 'Server 側の鍵交換材料を返す',
    result: 'Client が共有秘密を導くための材料がそろう',
  },
  {
    term: 'handshake keys',
    decide: '双方が導出を始めるタイミングに入る',
    result: '次の EncryptedExtensions 以降を保護できるようになる',
  },
];

const NEXT_STATE = [
  {
    title: '候補の一覧から、実際に使う値へ変わる',
    body: 'ClientHello までは候補の提示でしたが、ServerHello で「この接続ではこれを使う」が確定します。',
  },
  {
    title: 'ここから後続の handshake は保護付きになる',
    body: 'ServerHello までは Hello のやりとりですが、この返答を境に handshake keys の導出が始まり、次メッセージから保護付きに切り替わります。',
  },
  {
    title: 'Server は EncryptedExtensions へ進める',
    body: 'ServerHello を返したあとは、Server が選んだ拡張条件を EncryptedExtensions で通知する段階に入ります。',
  },
];

const TERMS = [
  {
    term: 'TLS version',
    note: 'この接続で使う TLS の世代です。ServerHello で候補から 1 つに確定します。',
  },
  {
    term: 'cipher suite',
    note: 'この接続で採用する暗号方式です。ServerHello で実際に使う値が決まります。',
  },
  {
    term: 'key share',
    note: '鍵交換のために双方が持ち寄る公開値です。ServerHello では Server 側の値が返されます。',
  },
  {
    term: 'handshake keys',
    note: '後続の handshake メッセージを保護する一時鍵です。ServerHello を受けて導出が始まります。',
  },
  {
    term: 'EncryptedExtensions',
    note: 'ServerHello の次に来る、Server が選んだ拡張条件を伝えるメッセージです。handshake keys で保護されます。',
  },
];

export function TlsServerHelloStepPage() {
  return (
    <main style={pageStyle}>
      <TlsStepBreadcrumbs currentLabel="ServerHello" />

      <h1 style={pageTitleStyle}>ServerHello の詳細</h1>
      <p style={leadStyle}>
        ServerHello は、Server が ClientHello に対して「この条件で TLS を続ける」と正式に返答するメッセージです。
        ここで採用する TLS 条件が確定し、以後の handshake を保護するための鍵導出が始まります。
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
        <h2 style={sectionTitleStyle}>ここで確定すること</h2>
        <p style={sectionLeadStyle}>
          ServerHello は、候補の比較を終えて「実際に使う条件」を固定する場面です。何が確定するかを先に押さえると、その後の鍵導出が読みやすくなります。
        </p>
        <div style={decisionRowsStyle}>
          {FIXED_ROWS.map((row) => (
            <article key={row.term} style={decisionRowStyle}>
              <div style={decisionBlockStyle}>
                <div style={decisionLabelStyle}>確定する項目</div>
                <div style={decisionValueStyle}>
                  <code>{row.term}</code>
                </div>
              </div>
              <div style={decisionBlockStyle}>
                <div style={decisionLabelStyle}>ここで起こること</div>
                <div style={decisionTextStyle}>{row.decide}</div>
              </div>
              <div style={decisionBlockStyle}>
                <div style={decisionLabelStyle}>次に効く結果</div>
                <div style={decisionTextStyle}>{row.result}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>内部の流れ</h2>
        <p style={sectionLeadStyle}>
          Server が返す条件を固めるところから、Client がそれを受け取って handshake keys の導出に入るところまでを順に追います。
        </p>
        <TlsServerHelloStepPlayer />
      </section>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>この後どう変わるか</h2>
        <div style={nextStateGridStyle}>
          {NEXT_STATE.map((item) => (
            <article key={item.title} style={nextStateCardStyle}>
              <h3 style={subTitleStyle}>{item.title}</h3>
              <p style={cardBodyStyle}>{item.body}</p>
            </article>
          ))}
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
        leftLink={{ to: '/security/transport-security/tls/client-hello', label: 'ClientHelloへ' }}
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

const decisionRowsStyle: CSSProperties = {
  display: 'grid',
  gap: '0.7rem',
};

const decisionRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '0.75rem',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  background: '#fcfdff',
  padding: '0.9rem',
};

const decisionBlockStyle: CSSProperties = {
  display: 'grid',
  gap: '0.28rem',
};

const decisionLabelStyle: CSSProperties = {
  fontSize: '0.76rem',
  fontWeight: 800,
  letterSpacing: '0.02em',
  color: '#64748b',
};

const decisionValueStyle: CSSProperties = {
  color: '#1f2937',
  fontSize: '0.9rem',
  fontWeight: 800,
};

const decisionTextStyle: CSSProperties = {
  color: '#475569',
  fontSize: '0.9rem',
  lineHeight: 1.65,
};

const nextStateGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
};

const nextStateCardStyle: CSSProperties = {
  border: '1px solid #dbe7f3',
  borderRadius: '10px',
  background: '#f8fbff',
  padding: '0.9rem',
};

const subTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#1f2a37',
};

const cardBodyStyle: CSSProperties = {
  margin: '0.45rem 0 0',
  color: '#475569',
  fontSize: '0.9rem',
  lineHeight: 1.65,
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
