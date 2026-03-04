import type { CSSProperties } from 'react';
import { StepPlayer } from '../../components/StepPlayer';

type PacketMode = 'plain-left' | 'pubkey-right-to-left' | 'cipher-left' | 'cipher-right' | 'plain-right';

interface DemoStep {
  title: string;
  description: string;
  packet: PacketMode;
  activeActor?: 'alice' | 'bob' | 'both';
}

interface VisualToken {
  style: CSSProperties;
  label: string;
}

const STEPS: DemoStep[] = [
  {
    title: '1. 平文メッセージを用意',
    description: 'Alice は送信したい平文メッセージを準備します。',
    packet: 'plain-left',
    activeActor: 'alice',
  },
  {
    title: '2. Bob が公開鍵を共有',
    description: 'Bob は公開鍵を Alice に渡します。公開鍵は配布しても問題ありません。ただし、その公開鍵が本当に Bob のものか（真正性）の確認は必要です。',
    packet: 'pubkey-right-to-left',
    activeActor: 'both',
  },
  {
    title: '3. 公開鍵で暗号化',
    description: 'Alice は Bob の公開鍵で平文を暗号文に変換します。',
    packet: 'cipher-left',
    activeActor: 'alice',
  },
  {
    title: '4. 暗号文を送信',
    description: '適切な方式と正しい公開鍵を前提に、暗号文をネットワーク上へ送信します。',
    packet: 'cipher-right',
    activeActor: 'both',
  },
  {
    title: '5. 秘密鍵で復号',
    description: 'Bob が秘密鍵で復号し、平文を取り出します。',
    packet: 'plain-right',
    activeActor: 'bob',
  },
];

export function PublicKeyCryptoPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>公開鍵暗号のアニメーション</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem' }}>
        公開鍵と秘密鍵を使った、安全なメッセージ共有の流れを追います。
      </p>

      <section
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '10px',
          background: '#fff',
          padding: '1rem',
        }}
      >
        <StepPlayer
          totalSteps={STEPS.length}
          intervalMs={2800}
          autoPlay={false}
          renderStep={({ stepIndex, totalSteps }) => {
            const step = STEPS[stepIndex];
            const dataToken = buildDataToken(step.packet);
            const keyToken = buildPublicKeyToken(step.packet);
            const privateKeyToken = buildPrivateKeyToken(step.packet);
            const active = step.activeActor;

            return (
              <>
                <div
                  style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
                    minHeight: '300px',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '1rem',
                  }}
                >
                  {/* Network channel */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '28%',
                      transform: 'translate(-50%, -50%)',
                      width: '68%',
                      borderTop: '2px dashed #adb5bd',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 'calc(28% + 6px)',
                      transform: 'translateX(-50%)',
                      fontSize: '0.72rem',
                      color: '#adb5bd',
                      background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
                      padding: '0 0.35rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    インターネット
                  </div>

                  {/* Alice */}
                  <div style={actorCard('left', active === 'alice' || active === 'both')}>
                    <strong>Alice</strong>
                    <div style={actorRole}>送信者</div>
                    <div style={{ ...actorHint, color: '#0b5ed7' }}>
                      Bob の公開鍵: {stepIndex >= 1 ? '受け取り済み' : '未取得'}
                    </div>
                  </div>

                  {/* Bob */}
                  <div style={actorCard('right', active === 'bob' || active === 'both')}>
                    <strong>Bob</strong>
                    <div style={actorRole}>受信者</div>
                    <div style={{ ...actorHint, color: '#198754' }}>秘密鍵: 非公開で保持</div>
                  </div>

                  {/* Tokens — always mounted so CSS transitions fire */}
                  <div style={dataToken.style}>{dataToken.label}</div>
                  <div style={keyToken.style}>{keyToken.label}</div>
                  <div style={privateKeyToken.style}>{privateKeyToken.label}</div>
                </div>

                <div
                  aria-live="polite"
                  style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    background: '#f8f9fa',
                    padding: '0.7rem 0.9rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>ステップ {stepIndex + 1} / {totalSteps}</div>
                  <div style={{ marginTop: '0.2rem', fontWeight: 700, color: '#212529' }}>{step.title}</div>
                  <p style={{ margin: '0.3rem 0 0', color: '#495057' }}>{step.description}</p>
                </div>
              </>
            );
          }}
        />
      </section>

      <section
        style={{
          marginTop: '1rem',
          border: '1px solid #dee2e6',
          borderRadius: '10px',
          background: '#fff',
          padding: '1rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#212529' }}>仕組みの補足</h2>
        <p style={{ margin: '0.5rem 0 0', color: '#495057', lineHeight: 1.7 }}>
          <strong>南京錠のアナロジー：</strong>公開鍵は「開いた南京錠」のようなものです。
          Bob は南京錠（公開鍵）を誰にでも配ります。Alice はその南京錠でメッセージを施錠（暗号化）できます。
          しかし南京錠を開けられる（復号できる）のは、鍵（秘密鍵）を持つ Bob だけです。
          南京錠をいくら持っていても、それで錠を開けることはできません。
        </p>
        <p style={{ margin: '0.75rem 0 0', color: '#495057', lineHeight: 1.7 }}>
          <strong>現実の使用例：</strong>ブラウザの <code>https://</code> 接続、SSH の鍵認証、PGP によるメール暗号化など、
          日常的に使われている多くのセキュリティ技術の基盤が公開鍵暗号です。
          実際の HTTPS では、公開鍵暗号で共通鍵を安全に共有し、通信本文は共通鍵暗号で高速に保護します。
          秘密鍵が漏れると安全性は失われるため厳重に管理します。
        </p>
        <p style={{ margin: '0.75rem 0 0', color: '#495057', lineHeight: 1.7, fontSize: '0.9rem' }}>
          <strong>発展：</strong>「Bob の公開鍵が本当に Bob のものか」を Alice はどう確認するのでしょうか？
          現実の HTTPS では認証局（CA）が発行する証明書がこの役割を担い、公開鍵の真正性を保証しています。
        </p>
      </section>
    </main>
  );
}

function tokenBase(): CSSProperties {
  return {
    position: 'absolute',
    top: '60%',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.9s ease, opacity 0.35s ease, background 0.25s ease, color 0.25s ease',
    padding: '0.5rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
}

// Always returns a style — never unmounts so CSS transitions fire correctly.
function buildDataToken(packet: PacketMode): VisualToken {
  const base = { ...tokenBase(), top: '56%' };
  const plainStyle = { background: '#e7f5ff', color: '#0b5ed7', borderColor: '#9ec5fe' };
  const cipherStyle = { background: '#212529', color: '#fff', borderColor: '#495057' };
  const decryptedStyle = { background: '#e9f7ef', color: '#1e7e34', borderColor: '#a3cfbb' };

  switch (packet) {
    case 'plain-left':
      return { label: '平文', style: { ...base, left: '16%', opacity: 1, ...plainStyle } };
    case 'pubkey-right-to-left':
      return { label: '平文', style: { ...base, left: '16%', opacity: 1, ...plainStyle } };
    case 'cipher-left':
      return { label: '暗号文', style: { ...base, left: '16%', opacity: 1, ...cipherStyle } };
    case 'cipher-right':
      // Slides from 16% → 84% (CSS transition fires because element stays mounted)
      return { label: '暗号文', style: { ...base, left: '84%', opacity: 1, ...cipherStyle } };
    case 'plain-right':
      return { label: '平文', style: { ...base, left: '84%', opacity: 1, ...decryptedStyle } };
  }
}

function buildPublicKeyToken(packet: PacketMode): VisualToken {
  const base = { ...tokenBase(), top: '72%' };
  const emphasize = packet === 'cipher-left';
  const keyStyle = {
    background: emphasize ? '#e4dcff' : '#ede9fe',
    color: '#5b21b6',
    borderColor: emphasize ? '#a78bfa' : '#c4b5fd',
    boxShadow: emphasize ? '0 0 0 5px rgba(124, 58, 237, 0.16)' : 'none',
  };

  switch (packet) {
    case 'plain-left':
      // Bob side: public key (left) and private key (right) are shown side-by-side.
      return { label: '公開鍵', style: { ...base, left: '78%', opacity: 1, ...keyStyle } };
    case 'pubkey-right-to-left':
      // Slides from 84% → 16% (CSS transition fires because element stays mounted)
      return { label: '公開鍵', style: { ...base, left: '16%', opacity: 1, ...keyStyle } };
    default:
      // Keep key visible on Alice side after delivery to reinforce usage in step 3+.
      return { label: '公開鍵', style: { ...base, left: '16%', opacity: 1, ...keyStyle } };
  }
}

function buildPrivateKeyToken(packet: PacketMode): VisualToken {
  const base = { ...tokenBase(), top: '72%', left: '90%' };
  const emphasize = packet === 'plain-right';
  return {
    label: '秘密鍵',
    style: {
      ...base,
      opacity: 1,
      background: emphasize ? '#d1e7dd' : '#edf7f1',
      color: emphasize ? '#0f5132' : '#2f6f44',
      borderColor: emphasize ? '#75b798' : '#b7dfc8',
      boxShadow: emphasize ? '0 0 0 5px rgba(25, 135, 84, 0.15)' : 'none',
    },
  };
}

function actorCard(side: 'left' | 'right', active: boolean): CSSProperties {
  return {
    position: 'absolute',
    ...(side === 'left' ? { left: '6%' } : { right: '6%' }),
    top: '8%',
    width: '26%',
    border: `1px solid ${active ? (side === 'left' ? '#0b5ed7' : '#198754') : '#dee2e6'}`,
    borderRadius: '10px',
    background: active ? (side === 'left' ? '#f0f6ff' : '#f0fff4') : '#fff',
    padding: '0.8rem',
    transition: 'border-color 0.3s ease, background 0.3s ease',
  };
}

const actorRole: CSSProperties = {
  marginTop: '0.4rem',
  fontSize: '0.85rem',
  color: '#495057',
};

const actorHint: CSSProperties = {
  marginTop: '0.45rem',
  fontSize: '0.78rem',
};
