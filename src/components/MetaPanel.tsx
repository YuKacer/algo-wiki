import type { PageMeta } from '../content/pages';

interface MetaPanelProps {
  meta: PageMeta;
}

export function MetaPanel({ meta }: MetaPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Complexity */}
      <Card title="計算量">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <tbody>
            <tr>
              <Td label="時間">
                <code style={{ background: '#e8f0fe', padding: '0.1em 0.4em', borderRadius: 3 }}>
                  {meta.complexity.time}
                </code>
              </Td>
            </tr>
            <tr>
              <Td label="空間">
                <code style={{ background: '#e8f0fe', padding: '0.1em 0.4em', borderRadius: 3 }}>
                  {meta.complexity.space}
                </code>
              </Td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Constraints */}
      {meta.constraints.length > 0 && (
        <Card title="適用条件">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
            {meta.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Prerequisites */}
      {meta.prerequisites.length > 0 && (
        <Card title="前提知識">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
            {meta.prerequisites.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Pitfalls */}
      <Card title="⚠ ミスりポイント">
        <ol style={{ margin: 0, paddingLeft: '1.4rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
          {meta.pitfalls.map((p, i) => (
            <li key={i} style={{ marginBottom: '0.3rem' }}>
              {p}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1rem',
      }}
    >
      <h3 style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Td({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td style={{ color: '#6c757d', paddingRight: '1rem', paddingBottom: '0.3rem', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ paddingBottom: '0.3rem' }}>{children}</td>
    </tr>
  );
}

import React from 'react';
