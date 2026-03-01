import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'cpp' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ position: 'relative', margin: '0.75rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#282c34',
          borderRadius: '6px 6px 0 0',
          padding: '0.3rem 0.75rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#abb2bf' }}>{language}</span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: '1px solid #555',
            color: '#abb2bf',
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ コピー済' : 'コピー'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          background: '#1e2127',
          color: '#abb2bf',
          padding: '1rem',
          borderRadius: '0 0 6px 6px',
          overflowX: 'auto',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
        }}
      >
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
