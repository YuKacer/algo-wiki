import type { CSSProperties } from 'react';
import { StepPlayer } from './StepPlayer';

type Direction = 'client-to-server' | 'server-to-client';
type ChannelState = 'plain-hello' | 'handshake-protected' | 'application-ready';

interface TlsHandshakeStep {
  id: string;
  title: string;
  direction: Direction;
  messageLabel: string;
  channelState: ChannelState;
  summary: string;
  description: string;
  clientState: string;
  serverState: string;
}

interface TlsTerm {
  term: string;
  note: string;
}

const STEPS: TlsHandshakeStep[] = [
  {
    id: 'client-hello',
    title: '1. ClientHello',
    direction: 'client-to-server',
    messageLabel: 'ClientHello',
    channelState: 'plain-hello',
    summary: '接続条件の提案',
    description: 'クライアントが対応 TLS バージョン、暗号スイート候補、SNI、key share を送り、接続条件を提案します。',
    clientState: 'TLS条件を送信',
    serverState: '候補を選ぶ',
  },
  {
    id: 'server-hello',
    title: '2. ServerHello',
    direction: 'server-to-client',
    messageLabel: 'ServerHello',
    channelState: 'plain-hello',
    summary: '方式確定と handshake keys 導出開始',
    description: 'サーバーが採用した方式と key share を返します。ここで双方が handshake keys を導出し始めます。',
    clientState: '鍵導出を開始',
    serverState: '採用方式を返答',
  },
  {
    id: 'encrypted-extensions',
    title: '3. EncryptedExtensions',
    direction: 'server-to-client',
    messageLabel: 'EncryptedExtensions',
    channelState: 'handshake-protected',
    summary: '拡張条件の通知',
    description: 'サーバーが選んだ拡張条件を通知します。ここから後続のハンドシェイクは handshake keys で保護されます。',
    clientState: '拡張条件を受信',
    serverState: '拡張条件を通知',
  },
  {
    id: 'certificate',
    title: '4. Certificate + CertificateVerify',
    direction: 'server-to-client',
    messageLabel: 'Certificate + CertificateVerify',
    channelState: 'handshake-protected',
    summary: 'サーバー本人性の証明',
    description: 'サーバーが証明書チェーンと CertificateVerify を送り、サーバー本人性を示します。クライアントはホスト名、期限、CA 連鎖、署名を確認します。',
    clientState: '証明書を確認',
    serverState: '本人性を証明',
  },
  {
    id: 'server-finished',
    title: '5. Server Finished',
    direction: 'server-to-client',
    messageLabel: 'Server Finished',
    channelState: 'handshake-protected',
    summary: 'サーバー側のハンドシェイク送信完了',
    description: 'サーバーが Finished を送り、ここまでのハンドシェイク完全性を示します。クライアントはこれを検証します。',
    clientState: 'Finished を検証',
    serverState: '送信側を完了',
  },
  {
    id: 'client-finished',
    title: '6. Client Finished',
    direction: 'client-to-server',
    messageLabel: 'Client Finished',
    channelState: 'application-ready',
    summary: 'ハンドシェイク完了',
    description: 'クライアントが Finished を返すとハンドシェイク完了です。以後はアプリケーションデータを暗号化します。',
    clientState: 'Finished を返す',
    serverState: 'アプリ通信開始',
  },
];

const TERMS: TlsTerm[] = [
  {
    term: 'TLS version',
    note: 'どの TLS 世代を使うかを示す情報です。',
  },
  {
    term: 'cipher suite',
    note: '使う暗号方式の候補です。',
  },
  {
    term: 'SNI',
    note: '接続したいサーバー名を伝える情報です。',
  },
  {
    term: 'key share',
    note: '鍵交換のために送る材料です。',
  },
  {
    term: 'handshake keys',
    note: 'ハンドシェイク中のメッセージを保護する一時鍵です。',
  },
  {
    term: 'CertificateVerify',
    note: 'サーバーが秘密鍵を持つことを示す署名です。',
  },
  {
    term: 'Finished',
    note: 'ここまでのハンドシェイク完全性を確かめるメッセージです。',
  },
];

export function TlsHandshakePlayer() {
  return (
    <div style={shellStyle}>
      <StepPlayer
        totalSteps={STEPS.length}
        intervalMs={2800}
        autoPlay={false}
        labels={{
          slider: 'TLSハンドシェイクのステップ選択',
        }}
        renderStep={({ stepIndex, totalSteps }) => {
          const step = STEPS[stepIndex];
          const sender = step.direction === 'client-to-server' ? 'client' : 'server';
          const receiver = sender === 'client' ? 'server' : 'client';

          return (
            <>
              <div style={sceneStyle}>
                <div style={badgeRowStyle}>
                  <span style={directionBadgeStyle(step.direction)}>{directionLabel(step.direction)}</span>
                  <span style={channelBadgeStyle(step.channelState)}>{channelLabel(step.channelState)}</span>
                </div>

                <div style={actorGridStyle}>
                  <div style={actorCardStyle(sender === 'client', receiver === 'client')}>
                    <div style={actorHeaderStyle}>
                      <strong>Client</strong>
                      <span style={roleBadgeStyle(sender === 'client', receiver === 'client')}>
                        {sender === 'client' ? '送信側' : '受信側'}
                      </span>
                    </div>
                    <div style={actorRoleStyle}>ブラウザ / API Client</div>
                    <div style={stateTitleStyle}>この時点の状態</div>
                    <div style={stateChipStyle(sender === 'client', receiver === 'client')}>{step.clientState}</div>
                  </div>

                  <div style={actorCardStyle(sender === 'server', receiver === 'server')}>
                    <div style={actorHeaderStyle}>
                      <strong>Server</strong>
                      <span style={roleBadgeStyle(sender === 'server', receiver === 'server')}>
                        {sender === 'server' ? '送信側' : '受信側'}
                      </span>
                    </div>
                    <div style={actorRoleStyle}>Web / API Server</div>
                    <div style={stateTitleStyle}>この時点の状態</div>
                    <div style={stateChipStyle(sender === 'server', receiver === 'server')}>{step.serverState}</div>
                  </div>
                </div>

                <div style={arrowStageStyle}>
                  <svg viewBox="0 0 100 30" width="100%" height="72" role="presentation" style={arrowSvgStyle}>
                    <defs>
                      <marker id="tls-arrow-plain" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
                      </marker>
                      <marker id="tls-arrow-protected" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 z" fill="#7c3aed" />
                      </marker>
                      <marker id="tls-arrow-ready" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 z" fill="#198754" />
                      </marker>
                    </defs>

                    <line
                      x1={step.direction === 'client-to-server' ? 14 : 86}
                      y1={16}
                      x2={step.direction === 'client-to-server' ? 86 : 14}
                      y2={16}
                      stroke={arrowColor(step.channelState)}
                      strokeWidth={3}
                      strokeLinecap="round"
                      markerEnd={arrowMarkerId(step.channelState)}
                    />
                  </svg>

                  <div style={messagePillStyle(step.channelState)}>{step.messageLabel}</div>
                  <div style={arrowCaptionStyle}>{step.summary}</div>
                </div>
              </div>

              <div aria-live="polite" style={statusPanelStyle}>
                <div style={statusMetaRowStyle}>
                  <span>ステップ {stepIndex + 1} / {totalSteps}</span>
                  <span>送信方向: {directionLabel(step.direction)}</span>
                </div>
                <div style={statusTitleStyle}>{step.title}</div>
                <p style={statusBodyStyle}>{step.description}</p>
              </div>
            </>
          );
        }}
      />

      <section style={termsWrapStyle}>
        <h3 style={termsTitleStyle}>用語メモ</h3>
        <div style={termsListStyle}>
          {TERMS.map((term) => (
            <div key={term.term} style={termRowStyle}>
              <div style={termKeyStyle}>
                <code>{term.term}</code>
              </div>
              <div style={termNoteStyle}>{term.note}</div>
            </div>
          ))}
        </div>
      </section>

      <p style={noteStyle}>
        注: ここでは一般的なサーバー認証付き TLS 1.3 を示しています。mTLS の <code>CertificateRequest</code> は省略しています。
      </p>
    </div>
  );
}

function directionLabel(direction: Direction) {
  return direction === 'client-to-server' ? 'Client -> Server' : 'Server -> Client';
}

function channelLabel(channelState: ChannelState) {
  switch (channelState) {
    case 'plain-hello':
      return '平文の Hello';
    case 'handshake-protected':
      return 'handshake keys で保護';
    case 'application-ready':
      return 'アプリ通信直前';
    default:
      return '';
  }
}

function arrowColor(channelState: ChannelState) {
  switch (channelState) {
    case 'plain-hello':
      return '#64748b';
    case 'handshake-protected':
      return '#7c3aed';
    case 'application-ready':
      return '#198754';
    default:
      return '#64748b';
  }
}

function arrowMarkerId(channelState: ChannelState) {
  switch (channelState) {
    case 'plain-hello':
      return 'url(#tls-arrow-plain)';
    case 'handshake-protected':
      return 'url(#tls-arrow-protected)';
    case 'application-ready':
      return 'url(#tls-arrow-ready)';
    default:
      return 'url(#tls-arrow-plain)';
  }
}

function directionBadgeStyle(direction: Direction): CSSProperties {
  return {
    ...badgeBaseStyle,
    background: direction === 'client-to-server' ? '#e7f1ff' : '#eefbf3',
    color: direction === 'client-to-server' ? '#0b5ed7' : '#198754',
    borderColor: direction === 'client-to-server' ? '#b6d4fe' : '#b7dfc8',
  };
}

function channelBadgeStyle(channelState: ChannelState): CSSProperties {
  switch (channelState) {
    case 'plain-hello':
      return {
        ...badgeBaseStyle,
        background: '#f8f9fa',
        color: '#495057',
        borderColor: '#dee2e6',
      };
    case 'handshake-protected':
      return {
        ...badgeBaseStyle,
        background: '#f3e8ff',
        color: '#6f42c1',
        borderColor: '#d8b4fe',
      };
    case 'application-ready':
      return {
        ...badgeBaseStyle,
        background: '#d1e7dd',
        color: '#0f5132',
        borderColor: '#a3cfbb',
      };
    default:
      return badgeBaseStyle;
  }
}

function actorCardStyle(sending: boolean, receiving: boolean): CSSProperties {
  const borderColor = sending ? '#0d6efd' : receiving ? '#198754' : '#d9e2ec';
  const background = sending ? '#f4f8ff' : receiving ? '#f3fff7' : '#ffffff';

  return {
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    background,
    padding: '0.85rem',
    minHeight: '7.8rem',
    boxShadow: sending || receiving ? '0 10px 24px rgba(15, 23, 42, 0.08)' : 'none',
    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
  };
}

function roleBadgeStyle(sending: boolean, receiving: boolean): CSSProperties {
  return {
    padding: '0.16rem 0.5rem',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 800,
    background: sending ? '#0d6efd' : receiving ? '#198754' : '#e9ecef',
    color: '#fff',
  };
}

function stateChipStyle(sending: boolean, receiving: boolean): CSSProperties {
  return {
    display: 'inline-block',
    marginTop: '0.35rem',
    padding: '0.34rem 0.52rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    lineHeight: 1.45,
    background: sending ? '#e7f1ff' : receiving ? '#e9f7ef' : '#f8f9fa',
    color: sending ? '#084298' : receiving ? '#146c43' : '#495057',
    border: `1px solid ${sending ? '#b6d4fe' : receiving ? '#b7dfc8' : '#dee2e6'}`,
  };
}

function messagePillStyle(channelState: ChannelState): CSSProperties {
  const colorSet = channelState === 'plain-hello'
    ? { background: '#fff', color: '#495057', borderColor: '#ced4da' }
    : channelState === 'handshake-protected'
      ? { background: '#f3e8ff', color: '#6f42c1', borderColor: '#d8b4fe' }
      : { background: '#d1e7dd', color: '#0f5132', borderColor: '#a3cfbb' };

  return {
    position: 'absolute',
    left: '50%',
    top: '28%',
    transform: 'translate(-50%, -50%)',
    padding: '0.44rem 0.76rem',
    borderRadius: '999px',
    border: `1px solid ${colorSet.borderColor}`,
    background: colorSet.background,
    color: colorSet.color,
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.1)',
    fontSize: '0.83rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  };
}

const shellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.95rem',
};

const sceneStyle: CSSProperties = {
  border: '1px solid #e9ecef',
  borderRadius: '12px',
  background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
  overflow: 'hidden',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
};

const badgeBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.28rem 0.62rem',
  borderRadius: '999px',
  border: '1px solid transparent',
  fontSize: '0.76rem',
  fontWeight: 800,
};

const badgeRowStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const actorGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.9rem',
};

const arrowStageStyle: CSSProperties = {
  position: 'relative',
  minHeight: '6.8rem',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  background: '#ffffff',
  overflow: 'hidden',
};

const arrowSvgStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
};

const arrowCaptionStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: '0.8rem',
  transform: 'translateX(-50%)',
  fontSize: '0.83rem',
  fontWeight: 700,
  color: '#475569',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const actorHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
};

const actorRoleStyle: CSSProperties = {
  marginTop: '0.35rem',
  fontSize: '0.82rem',
  color: '#5b6675',
};

const stateTitleStyle: CSSProperties = {
  marginTop: '0.65rem',
  fontSize: '0.76rem',
  fontWeight: 800,
  color: '#6b7280',
  letterSpacing: '0.02em',
};

const statusPanelStyle: CSSProperties = {
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  background: '#f8f9fa',
  padding: '0.65rem 0.8rem',
  height: '6.4rem',
  overflowY: 'auto',
};

const statusMetaRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
  fontSize: '0.8rem',
  color: '#6c757d',
};

const statusTitleStyle: CSSProperties = {
  marginTop: '0.14rem',
  fontWeight: 800,
  color: '#212529',
};

const statusBodyStyle: CSSProperties = {
  margin: '0.2rem 0 0',
  color: '#495057',
  lineHeight: 1.45,
  fontSize: '0.87rem',
};

const termsWrapStyle: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  background: '#fbfdff',
  padding: '0.9rem',
};

const termsTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: '0.65rem',
  fontSize: '0.98rem',
  color: '#1f2937',
};

const termsListStyle: CSSProperties = {
  display: 'grid',
  gap: '0.55rem',
};

const termRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(130px, 160px) 1fr',
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

const noteStyle: CSSProperties = {
  margin: 0,
  color: '#6b7280',
  fontSize: '0.83rem',
  lineHeight: 1.58,
};
