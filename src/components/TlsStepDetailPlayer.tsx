import type { CSSProperties } from 'react';
import { StepPlayer } from './StepPlayer';

export type TlsDetailMode =
  | 'client-local'
  | 'server-local'
  | 'client-to-server'
  | 'server-to-client';

export interface TlsDetailSection {
  heading: string;
  items: string[];
}

export interface TlsDetailStep {
  title: string;
  summary: string;
  mode: TlsDetailMode;
  transportLabel?: string;
  clientState: string;
  serverState: string;
  processLabel: string;
  sections: [TlsDetailSection, TlsDetailSection, TlsDetailSection];
  formula?: string;
  note?: string;
  clientBadgeLabel?: string;
  serverBadgeLabel?: string;
  localFocusLabel?: string;
}

interface TlsStepDetailPlayerProps {
  steps: TlsDetailStep[];
  sliderLabel: string;
}

type Actor = 'client' | 'server';
type ActorTone = 'idle' | 'client-active' | 'server-local' | 'server-send' | 'receiving';

export function TlsStepDetailPlayer({ steps, sliderLabel }: TlsStepDetailPlayerProps) {
  return (
    <StepPlayer
      totalSteps={steps.length}
      intervalMs={3000}
      autoPlay={false}
      labels={{
        slider: sliderLabel,
      }}
      renderStep={({ stepIndex, totalSteps }) => {
        const step = steps[stepIndex];

        return (
          <>
            <div style={sceneStyle}>
              <div style={badgeRowStyle}>
                <span style={modeBadgeStyle(step.mode)}>{modeLabel(step.mode)}</span>
                <span style={summaryBadgeStyle}>{step.summary}</span>
              </div>

              <div style={actorGridStyle}>
                <div style={actorCardStyle(actorTone(step.mode, 'client'))}>
                  <div style={actorHeaderStyle}>
                    <strong>Client</strong>
                    <span style={roleBadgeStyle(actorTone(step.mode, 'client'))}>
                      {badgeLabel(step, 'client')}
                    </span>
                  </div>
                  <div style={actorRoleStyle}>ブラウザ / API Client</div>
                  <div style={stateTitleStyle}>この時点の状態</div>
                  <div style={stateChipStyle(actorTone(step.mode, 'client'))}>{step.clientState}</div>
                </div>

                <div style={actorCardStyle(actorTone(step.mode, 'server'))}>
                  <div style={actorHeaderStyle}>
                    <strong>Server</strong>
                    <span style={roleBadgeStyle(actorTone(step.mode, 'server'))}>
                      {badgeLabel(step, 'server')}
                    </span>
                  </div>
                  <div style={actorRoleStyle}>Web / API Server</div>
                  <div style={stateTitleStyle}>この時点の状態</div>
                  <div style={stateChipStyle(actorTone(step.mode, 'server'))}>{step.serverState}</div>
                </div>
              </div>

              <div style={actionStageStyle}>
                {isTransportStep(step.mode) ? (
                  <>
                    <svg viewBox="0 0 100 32" width="100%" height="78" role="presentation" style={arrowSvgStyle}>
                      <defs>
                        <marker id="tls-detail-arrow-client" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8 z" fill="#0d6efd" />
                        </marker>
                        <marker id="tls-detail-arrow-server" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8 z" fill="#7c3aed" />
                        </marker>
                      </defs>
                      <line
                        x1={step.mode === 'client-to-server' ? 14 : 86}
                        y1={17}
                        x2={step.mode === 'client-to-server' ? 86 : 14}
                        y2={17}
                        stroke={transportColor(step.mode)}
                        strokeWidth={3}
                        strokeLinecap="round"
                        markerEnd={transportMarker(step.mode)}
                      />
                    </svg>
                    <div style={transportPillStyle(step.mode)}>{step.transportLabel}</div>
                  </>
                ) : (
                  <div style={localFocusStyle(step.mode)}>{localFocusLabel(step)}</div>
                )}

                <div style={actionCaptionStyle}>{step.processLabel}</div>
              </div>
            </div>

            <div aria-live="polite" style={statusPanelStyle}>
              <div style={statusMetaRowStyle}>
                <span>ステップ {stepIndex + 1} / {totalSteps}</span>
                <span>{modeLabel(step.mode)}</span>
              </div>
              <div style={statusTitleStyle}>{step.title}</div>

              <div style={detailGridStyle}>
                {step.sections.map((section) => (
                  <section key={section.heading} style={detailCardStyle}>
                    <div style={detailHeadingStyle}>{section.heading}</div>
                    <ul style={detailListStyle}>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {step.formula ? <pre style={formulaStyle}>{step.formula}</pre> : null}
              {step.note ? <p style={noteStyle}>{step.note}</p> : null}
            </div>
          </>
        );
      }}
    />
  );
}

function modeLabel(mode: TlsDetailMode) {
  switch (mode) {
    case 'client-local':
      return 'Client 側の処理';
    case 'server-local':
      return 'Server 側の処理';
    case 'client-to-server':
      return 'Client -> Server';
    case 'server-to-client':
      return 'Server -> Client';
    default:
      return '';
  }
}

function isTransportStep(mode: TlsDetailMode) {
  return mode === 'client-to-server' || mode === 'server-to-client';
}

function actorTone(mode: TlsDetailMode, actor: Actor): ActorTone {
  if (actor === 'client') {
    switch (mode) {
      case 'client-local':
      case 'client-to-server':
        return 'client-active';
      case 'server-to-client':
        return 'receiving';
      case 'server-local':
      default:
        return 'idle';
    }
  }

  switch (mode) {
    case 'server-local':
      return 'server-local';
    case 'server-to-client':
      return 'server-send';
    case 'client-to-server':
      return 'receiving';
    case 'client-local':
    default:
      return 'idle';
  }
}

function badgeLabel(step: TlsDetailStep, actor: Actor) {
  if (actor === 'client') {
    if (step.clientBadgeLabel) return step.clientBadgeLabel;

    switch (step.mode) {
      case 'client-local':
        return '処理中';
      case 'client-to-server':
        return '送信側';
      case 'server-to-client':
        return '受信側';
      case 'server-local':
      default:
        return '待機';
    }
  }

  if (step.serverBadgeLabel) return step.serverBadgeLabel;

  switch (step.mode) {
    case 'server-local':
      return '処理中';
    case 'server-to-client':
      return '送信側';
    case 'client-to-server':
      return '受信側';
    case 'client-local':
    default:
      return '待機';
  }
}

function localFocusLabel(step: TlsDetailStep) {
  if (step.localFocusLabel) return step.localFocusLabel;
  return step.mode === 'client-local' ? 'Client が処理中' : 'Server が処理中';
}

function modeBadgeStyle(mode: TlsDetailMode): CSSProperties {
  switch (mode) {
    case 'client-local':
      return {
        ...badgeBaseStyle,
        background: '#e7f1ff',
        color: '#0b5ed7',
        borderColor: '#b6d4fe',
      };
    case 'server-local':
      return {
        ...badgeBaseStyle,
        background: '#eefbf3',
        color: '#198754',
        borderColor: '#b7dfc8',
      };
    case 'client-to-server':
      return {
        ...badgeBaseStyle,
        background: '#dbeafe',
        color: '#084298',
        borderColor: '#9ec5fe',
      };
    case 'server-to-client':
      return {
        ...badgeBaseStyle,
        background: '#f3e8ff',
        color: '#6f42c1',
        borderColor: '#d8b4fe',
      };
    default:
      return badgeBaseStyle;
  }
}

function actorCardStyle(tone: ActorTone): CSSProperties {
  const palette = actorPalette(tone);

  return {
    border: `1px solid ${palette.border}`,
    borderRadius: '12px',
    background: palette.background,
    padding: '0.85rem',
    minHeight: '7.8rem',
    boxShadow: tone === 'idle' ? 'none' : '0 10px 24px rgba(15, 23, 42, 0.08)',
    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
  };
}

function roleBadgeStyle(tone: ActorTone): CSSProperties {
  const palette = actorPalette(tone);

  return {
    padding: '0.16rem 0.5rem',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 800,
    background: palette.badgeBackground,
    color: palette.badgeColor,
  };
}

function stateChipStyle(tone: ActorTone): CSSProperties {
  const palette = actorPalette(tone);

  return {
    display: 'inline-block',
    marginTop: '0.35rem',
    padding: '0.34rem 0.52rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    lineHeight: 1.45,
    background: palette.chipBackground,
    color: palette.chipColor,
    border: `1px solid ${palette.chipBorder}`,
  };
}

function actorPalette(tone: ActorTone) {
  switch (tone) {
    case 'client-active':
      return {
        border: '#0d6efd',
        background: '#f4f8ff',
        badgeBackground: '#0d6efd',
        badgeColor: '#fff',
        chipBackground: '#eaf2ff',
        chipColor: '#084298',
        chipBorder: '#b6d4fe',
      };
    case 'server-local':
      return {
        border: '#198754',
        background: '#f4fcf7',
        badgeBackground: '#198754',
        badgeColor: '#fff',
        chipBackground: '#eaf7ee',
        chipColor: '#146c43',
        chipBorder: '#b7dfc8',
      };
    case 'server-send':
      return {
        border: '#7c3aed',
        background: '#faf5ff',
        badgeBackground: '#7c3aed',
        badgeColor: '#fff',
        chipBackground: '#f3e8ff',
        chipColor: '#6f42c1',
        chipBorder: '#d8b4fe',
      };
    case 'receiving':
      return {
        border: '#cbd5e1',
        background: '#f8fafc',
        badgeBackground: '#e2e8f0',
        badgeColor: '#475569',
        chipBackground: '#f1f5f9',
        chipColor: '#475569',
        chipBorder: '#cbd5e1',
      };
    case 'idle':
    default:
      return {
        border: '#d9e2ec',
        background: '#ffffff',
        badgeBackground: '#e9ecef',
        badgeColor: '#6c757d',
        chipBackground: '#f8f9fa',
        chipColor: '#495057',
        chipBorder: '#dee2e6',
      };
  }
}

function localFocusStyle(mode: TlsDetailMode): CSSProperties {
  const colorSet = mode === 'client-local'
    ? { border: '#b6d4fe', background: '#eef5ff', color: '#084298' }
    : { border: '#b7dfc8', background: '#eefbf3', color: '#146c43' };

  return {
    position: 'absolute',
    top: '34%',
    left: mode === 'client-local' ? '22%' : '78%',
    transform: 'translate(-50%, -50%)',
    padding: '0.45rem 0.8rem',
    borderRadius: '999px',
    border: `1px solid ${colorSet.border}`,
    background: colorSet.background,
    color: colorSet.color,
    fontWeight: 800,
    fontSize: '0.83rem',
    whiteSpace: 'nowrap',
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.1)',
  };
}

function transportColor(mode: TlsDetailMode) {
  return mode === 'client-to-server' ? '#0d6efd' : '#7c3aed';
}

function transportMarker(mode: TlsDetailMode) {
  return mode === 'client-to-server' ? 'url(#tls-detail-arrow-client)' : 'url(#tls-detail-arrow-server)';
}

function transportPillStyle(mode: TlsDetailMode): CSSProperties {
  const colorSet = mode === 'client-to-server'
    ? { border: '#9ec5fe', background: '#eaf2ff', color: '#084298' }
    : { border: '#d8b4fe', background: '#f3e8ff', color: '#6f42c1' };

  return {
    position: 'absolute',
    left: '50%',
    top: '28%',
    transform: 'translate(-50%, -50%)',
    padding: '0.44rem 0.76rem',
    borderRadius: '999px',
    border: `1px solid ${colorSet.border}`,
    background: colorSet.background,
    color: colorSet.color,
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.1)',
    fontSize: '0.83rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  };
}

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

const summaryBadgeStyle: CSSProperties = {
  ...badgeBaseStyle,
  background: '#f8f9fa',
  color: '#495057',
  borderColor: '#dee2e6',
};

const actorGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.9rem',
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

const actionStageStyle: CSSProperties = {
  position: 'relative',
  minHeight: '7.1rem',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  background: '#ffffff',
  overflow: 'hidden',
};

const arrowSvgStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
};

const actionCaptionStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: '0.85rem',
  transform: 'translateX(-50%)',
  width: 'min(90%, 680px)',
  fontSize: '0.84rem',
  fontWeight: 700,
  color: '#475569',
  textAlign: 'center',
  lineHeight: 1.5,
};

const statusPanelStyle: CSSProperties = {
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  background: '#f8f9fa',
  padding: '0.7rem 0.85rem',
  height: '16rem',
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
  marginTop: '0.16rem',
  fontWeight: 800,
  color: '#212529',
};

const detailGridStyle: CSSProperties = {
  marginTop: '0.55rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '0.65rem',
};

const detailCardStyle: CSSProperties = {
  border: '1px solid #dee2e6',
  borderRadius: '10px',
  background: '#fff',
  padding: '0.7rem 0.75rem',
};

const detailHeadingStyle: CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: '#1f2a37',
  marginBottom: '0.35rem',
};

const detailListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.1rem',
  color: '#495057',
  lineHeight: 1.55,
  fontSize: '0.86rem',
};

const formulaStyle: CSSProperties = {
  margin: '0.65rem 0 0',
  padding: '0.72rem',
  borderRadius: '10px',
  border: '1px solid #d8e2ee',
  background: '#f8fbff',
  color: '#243447',
  overflowX: 'auto',
  fontSize: '0.84rem',
  lineHeight: 1.6,
};

const noteStyle: CSSProperties = {
  margin: '0.65rem 0 0',
  color: '#5b6675',
  fontSize: '0.84rem',
  lineHeight: 1.55,
};
