import type { CSSProperties } from 'react';
import { StepPlayer } from '../../components/StepPlayer';

type SignatureFlow = 'message-left' | 'hash-left' | 'signed-left' | 'signed-right' | 'verified-right';

interface SignatureStep {
  title: string;
  description: string;
  flow: SignatureFlow;
  activeActor?: 'alice' | 'bob' | 'both';
}

interface VisualToken {
  style: CSSProperties;
  label: string;
}

const STEPS: SignatureStep[] = [
  {
    title: '1. メッセージを準備',
    description: 'Alice が署名対象のメッセージを準備します。',
    flow: 'message-left',
    activeActor: 'alice',
  },
  {
    title: '2. ハッシュ値を計算',
    description: 'メッセージからハッシュ値を計算し、要約を作ります。',
    flow: 'hash-left',
    activeActor: 'alice',
  },
  {
    title: '3. 秘密鍵で署名を作成',
    description: 'Alice は秘密鍵で署名を作成し、メッセージに添付します。',
    flow: 'signed-left',
    activeActor: 'alice',
  },
  {
    title: '4. 署名付きメッセージを送信',
    description: '署名付きメッセージを Bob へ送信します。',
    flow: 'signed-right',
    activeActor: 'both',
  },
  {
    title: '5. 公開鍵で署名を検証',
    description: 'Bob は Alice の公開鍵で検証し、改ざんがないことを確認します。',
    flow: 'verified-right',
    activeActor: 'bob',
  },
];

export function DigitalSignaturePage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>デジタル署名のアニメーション</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem' }}>
        署名生成と検証の流れから、改ざん検知と送信者確認の仕組みを理解します。
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
            const dataToken = buildDataToken(step.flow);
            const privateKeyToken = buildPrivateKeyToken(step.flow);
            const publicKeyToken = buildPublicKeyToken(step.flow);
            const verifyToken = buildVerifyToken(step.flow);
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

                  <div style={actorCard('left', active === 'alice' || active === 'both')}>
                    <strong>Alice</strong>
                    <div style={actorRole}>署名者</div>
                    <div style={{ ...actorHint, color: '#198754' }}>秘密鍵で署名を作成</div>
                  </div>

                  <div style={actorCard('right', active === 'bob' || active === 'both')}>
                    <strong>Bob</strong>
                    <div style={actorRole}>検証者</div>
                    <div style={{ ...actorHint, color: '#0b5ed7' }}>公開鍵で署名を検証</div>
                  </div>

                  <div style={dataToken.style}>{dataToken.label}</div>
                  <div style={privateKeyToken.style}>{privateKeyToken.label}</div>
                  <div style={publicKeyToken.style}>{publicKeyToken.label}</div>
                  <div style={verifyToken.style}>{verifyToken.label}</div>
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
    </main>
  );
}

function tokenBase(): CSSProperties {
  return {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.9s ease, opacity 0.35s ease, transform 0.25s ease, box-shadow 0.25s ease',
    padding: '0.5rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
}

function buildDataToken(flow: SignatureFlow): VisualToken {
  const base = { ...tokenBase(), top: '56%' };

  switch (flow) {
    case 'message-left':
      return {
        label: 'メッセージ',
        style: {
          ...base,
          left: '16%',
          opacity: 1,
          background: '#f1f3f5',
          color: '#212529',
          borderColor: '#ced4da',
        },
      };
    case 'hash-left':
      return {
        label: 'ハッシュ値',
        style: {
          ...base,
          left: '16%',
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1.12)',
          boxShadow: '0 0 0 6px rgba(255, 193, 7, 0.18)',
          background: '#fff3cd',
          color: '#664d03',
          borderColor: '#ffec99',
        },
      };
    case 'signed-left':
      return {
        label: '署名付きメッセージ',
        style: {
          ...base,
          left: '16%',
          opacity: 1,
          background: '#dbeafe',
          color: '#084298',
          borderColor: '#9ec5fe',
        },
      };
    case 'signed-right':
    case 'verified-right':
      return {
        label: '署名付きメッセージ',
        style: {
          ...base,
          left: '84%',
          opacity: 1,
          background: '#dbeafe',
          color: '#084298',
          borderColor: '#9ec5fe',
        },
      };
  }
}

function buildPrivateKeyToken(flow: SignatureFlow): VisualToken {
  const emphasize = flow === 'signed-left';
  return {
    label: '秘密鍵',
    style: {
      ...tokenBase(),
      top: '72%',
      left: '16%',
      opacity: 1,
      background: emphasize ? '#d1e7dd' : '#edf7f1',
      color: emphasize ? '#0f5132' : '#2f6f44',
      borderColor: emphasize ? '#75b798' : '#b7dfc8',
      boxShadow: emphasize ? '0 0 0 5px rgba(25, 135, 84, 0.15)' : 'none',
    },
  };
}

function buildPublicKeyToken(flow: SignatureFlow): VisualToken {
  const emphasize = flow === 'verified-right';
  return {
    label: '公開鍵',
    style: {
      ...tokenBase(),
      top: '72%',
      left: '84%',
      opacity: 1,
      background: emphasize ? '#e4dcff' : '#ede9fe',
      color: '#5b21b6',
      borderColor: emphasize ? '#a78bfa' : '#c4b5fd',
      boxShadow: emphasize ? '0 0 0 5px rgba(124, 58, 237, 0.16)' : 'none',
    },
  };
}

function buildVerifyToken(flow: SignatureFlow): VisualToken {
  if (flow !== 'verified-right') {
    return {
      label: '検証OK',
      style: {
        ...tokenBase(),
        top: '84%',
        left: '84%',
        opacity: 0,
        background: '#d1e7dd',
        color: '#0f5132',
        borderColor: '#a3cfbb',
      },
    };
  }

  return {
    label: '検証OK',
    style: {
      ...tokenBase(),
      top: '84%',
      left: '84%',
      opacity: 1,
      background: '#d1e7dd',
      color: '#0f5132',
      borderColor: '#a3cfbb',
      boxShadow: '0 0 0 5px rgba(25, 135, 84, 0.15)',
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

