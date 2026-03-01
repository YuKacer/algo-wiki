import React from 'react';

interface ChipProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  color?: 'blue' | 'orange' | 'green' | 'gray';
}

export function Chip({ label, disabled = false, onClick, color = 'blue' }: ChipProps) {
  const colors: Record<string, React.CSSProperties> = {
    blue: { background: '#e8f0fe', color: '#3a7bd5', border: '1px solid #4f8ef7' },
    orange: { background: '#fff3e0', color: '#e65100', border: '1px solid #f7944f' },
    green: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #4fcf70' },
    gray: { background: '#f5f5f5', color: '#9e9e9e', border: '1px solid #bdbdbd' },
  };

  return (
    <span
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.7rem',
        borderRadius: '99px',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.55 : 1,
        textDecoration: 'none',
        ...colors[color],
      }}
    >
      {label}
    </span>
  );
}
