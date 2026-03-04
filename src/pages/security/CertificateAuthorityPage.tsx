import type { CSSProperties } from 'react';
import { StepPlayer } from '../../components/StepPlayer';

type CaFlow = 'bob-keygen' | 'ca-issues-cert' | 'bob-sends-cert' | 'alice-verifies' | 'alice-trusts-key';

interface CaStep {
  title: string;
  description: string;
  flow: CaFlow;
  activeActor?: 'alice' | 'bob' | 'ca' | 'all';
}

interface VisualToken {
  label: string;
  style: CSSProperties;
}

const STEPS: CaStep[] = [
  {
    title: '1. Bob が鍵ペアを作成',
    description: 'Bob は公開鍵と秘密鍵を生成します。',
    flow: 'bob-keygen',
    activeActor: 'bob',
  },
  {
    title: '2. CA が証明書を発行',
    description: 'CA は Bob の公開鍵とドメイン情報を証明書として署名します。',
    flow: 'ca-issues-cert',
    activeActor: 'ca',
  },
  {
    title: '3. Bob が証明書を送信',
    description: 'Bob は Alice に証明書を提示します。',
    flow: 'bob-sends-cert',
    activeActor: 'all',
  },
  {
    title: '4. Alice が証明書を検証',
    description: 'Alice は CA の公開鍵で証明書の署名を検証します。',
    flow: 'alice-verifies',
    activeActor: 'alice',
  },
  {
    title: '5. Bob の公開鍵を信頼',
    description: '検証が通れば、Alice は証明書内の公開鍵を Bob のものとして信頼します。',
    flow: 'alice-trusts-key',
    activeActor: 'alice',
  },
];

export function CertificateAuthorityPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1a1a2e' }}>認証局（CA）のアニメーション</h1>
      <p style={{ color: '#6c757d', marginTop: '0.45rem', marginBottom: '1rem' }}>
        CA が公開鍵の真正性を保証し、Alice が Bob の公開鍵を安全に信頼する流れを示します。
      </p>

      <section style={{ border: '1px solid #dee2e6', borderRadius: '10px', background: '#fff', padding: '1rem' }}>
        <StepPlayer
          totalSteps={STEPS.length}
          intervalMs={2800}
          autoPlay={false}
          renderStep={({ stepIndex, totalSteps }) => {
            const step = STEPS[stepIndex];
            const certToken = buildCertToken(step.flow);
            const trustToken = buildTrustToken(step.flow);
            const bobKeyToken = buildBobPublicKeyToken(step.flow);

            return (
              <>
                <div
                  style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
                    minHeight: '320px',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '1rem',
                  }}
                >
                  <div style={linkLineStyle(28, 28)} />
                  <div style={linkLineStyle(28, 72)} />

                  <div style={actorCard('left', step.activeActor === 'alice' || step.activeActor === 'all')}>
                    <strong>Alice</strong>
                    <div style={roleStyle}>クライアント</div>
                    <div style={{ ...hintStyle, color: '#0b5ed7' }}>証明書を検証して公開鍵を信頼</div>
                  </div>

                  <div style={actorCard('right', step.activeActor === 'bob' || step.activeActor === 'all')}>
                    <strong>Bob</strong>
                    <div style={roleStyle}>サーバー</div>
                    <div style={{ ...hintStyle, color: '#198754' }}>証明書を提示</div>
                  </div>

                  <div style={actorCard('center', step.activeActor === 'ca' || step.activeActor === 'all')}>
                    <strong>CA</strong>
                    <div style={roleStyle}>認証局</div>
                    <div style={{ ...hintStyle, color: '#7c3aed' }}>証明書に署名</div>
                  </div>

                  <div style={certToken.style}>{certToken.label}</div>
                  <div style={bobKeyToken.style}>{bobKeyToken.label}</div>
                  <div style={trustToken.style}>{trustToken.label}</div>
                </div>

                <div
                  aria-live="polite"
                  style={{ border: '1px solid #dee2e6', borderRadius: '8px', background: '#f8f9fa', padding: '0.7rem 0.9rem' }}
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
    transition: 'left 0.9s ease, top 0.9s ease, opacity 0.35s ease, box-shadow 0.25s ease',
    padding: '0.45rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 700,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
}

function buildCertToken(flow: CaFlow): VisualToken {
  const base = tokenBase();
  const cert = { background: '#ede9fe', color: '#5b21b6', borderColor: '#c4b5fd' };

  switch (flow) {
    case 'bob-keygen':
      return { label: '証明書(未発行)', style: { ...base, left: '72%', top: '72%', opacity: 0.2, ...cert } };
    case 'ca-issues-cert':
      return { label: '証明書(署名済み)', style: { ...base, left: '50%', top: '72%', opacity: 1, ...cert, boxShadow: '0 0 0 5px rgba(124, 58, 237, 0.16)' } };
    case 'bob-sends-cert':
      return { label: '証明書', style: { ...base, left: '28%', top: '72%', opacity: 1, ...cert } };
    default:
      return { label: '証明書', style: { ...base, left: '28%', top: '72%', opacity: 0.35, ...cert } };
  }
}

function buildBobPublicKeyToken(flow: CaFlow): VisualToken {
  const base = tokenBase();
  const key = { background: '#e7f5ff', color: '#0b5ed7', borderColor: '#9ec5fe' };

  if (flow === 'alice-trusts-key') {
    return {
      label: 'Bob 公開鍵(信頼済み)',
      style: { ...base, left: '28%', top: '82%', opacity: 1, ...key, boxShadow: '0 0 0 5px rgba(11, 94, 215, 0.14)' },
    };
  }

  return { label: 'Bob 公開鍵', style: { ...base, left: '72%', top: '82%', opacity: 1, ...key } };
}

function buildTrustToken(flow: CaFlow): VisualToken {
  const base = tokenBase();
  if (flow !== 'alice-verifies' && flow !== 'alice-trusts-key') {
    return {
      label: '検証OK',
      style: { ...base, left: '28%', top: '62%', opacity: 0, background: '#d1e7dd', color: '#0f5132', borderColor: '#a3cfbb' },
    };
  }

  return {
    label: '検証OK',
    style: {
      ...base,
      left: '28%',
      top: '62%',
      opacity: 1,
      background: '#d1e7dd',
      color: '#0f5132',
      borderColor: '#a3cfbb',
      boxShadow: '0 0 0 5px rgba(25, 135, 84, 0.15)',
    },
  };
}

function actorCard(pos: 'left' | 'center' | 'right', active: boolean): CSSProperties {
  const leftMap = { left: '6%', center: '39%', right: '72%' } as const;
  return {
    position: 'absolute',
    left: leftMap[pos],
    top: '8%',
    width: '22%',
    border: `1px solid ${active ? '#4f8ef7' : '#dee2e6'}`,
    borderRadius: '10px',
    background: active ? '#f0f6ff' : '#fff',
    padding: '0.75rem',
    transition: 'border-color 0.3s ease, background 0.3s ease',
  };
}

function linkLineStyle(leftPct: number, rightPct: number): CSSProperties {
  return {
    position: 'absolute',
    left: `${leftPct}%`,
    right: `${100 - rightPct}%`,
    top: '30%',
    borderTop: '2px dashed #adb5bd',
  };
}

const roleStyle: CSSProperties = {
  marginTop: '0.35rem',
  fontSize: '0.82rem',
  color: '#495057',
};

const hintStyle: CSSProperties = {
  marginTop: '0.4rem',
  fontSize: '0.75rem',
};
