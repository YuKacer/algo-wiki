import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type DomainId = 'auth' | 'transport' | 'data' | 'app' | 'ops' | 'supply';

interface Domain {
  id: DomainId;
  title: string;
  overviewAction: string;
  overviewPrevents: string;
  to?: string;
}

const DOMAINS: Domain[] = [
  {
    id: 'transport',
    title: '通信の保護',
    overviewAction: '通信中の内容を読まれたり変えられたりしないようにする',
    overviewPrevents: '盗聴、改ざん、中間者攻撃',
    to: '/security/transport-security',
  },
  {
    id: 'auth',
    title: '認証\u30fb認可',
    overviewAction: 'ログイン時や操作時に、本人確認と権限確認を行う',
    overviewPrevents: 'なりすまし、権限外操作',
    to: '/security/auth-security',
  },
  {
    id: 'data',
    title: 'データ保護',
    overviewAction: '保存データや鍵、バックアップを守る',
    overviewPrevents: '情報漏えい、消失、復元不能',
  },
  {
    id: 'app',
    title: 'アプリ防御',
    overviewAction: '公開画面や API の弱点を突かれにくくする',
    overviewPrevents: '不正入力、脆弱性悪用',
  },
  {
    id: 'ops',
    title: '運用\u30fb監視',
    overviewAction: '異常を早く見つけ、被害を抑えて復旧する',
    overviewPrevents: '検知遅れ、被害拡大',
  },
  {
    id: 'supply',
    title: '供給網対策',
    overviewAction: '開発から配布までの経路を安全に保つ',
    overviewPrevents: '汚染された依存物、改ざんされた配布物',
  },
];

const OVERVIEW_ORDER: DomainId[] = ['auth', 'transport', 'app', 'data', 'ops', 'supply'];
const OVERVIEW_ROWS = OVERVIEW_ORDER.map((id) => DOMAINS.find((domain) => domain.id === id)).filter(
  (domain): domain is Domain => domain !== undefined,
);

export function SecurityOverviewPage() {
  const navigate = useNavigate();
  const [interactiveRowId, setInteractiveRowId] = useState<DomainId | null>(null);

  const handleRowActivate = (to?: string) => {
    if (!to) return;
    navigate(to);
  };

  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem 2.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '2rem', color: '#18243a' }}>セキュリティ</h1>
      <p style={{ margin: '0.5rem 0 1rem', color: '#5f6b7a', lineHeight: 1.7 }}>
        各分野は役割を分担して全体を守っています。表で違いを比べ、気になる分野は詳細を確認してください。
      </p>

      <div style={overviewTableWrapStyle}>
        <table style={overviewTableStyle}>
          <thead>
            <tr>
              <th style={overviewHeaderStyle}>分野</th>
              <th style={overviewHeaderStyle}>何をするか</th>
              <th style={overviewHeaderStyle}>主に防ぐこと</th>
            </tr>
          </thead>
          <tbody>
            {OVERVIEW_ROWS.map((domain) => {
              const isInteractive = Boolean(domain.to);
              const isHighlighted = interactiveRowId === domain.id;

              return (
                <tr
                  key={domain.id}
                  role={isInteractive ? 'link' : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  aria-label={isInteractive ? `${domain.title} の詳細ページへ移動` : undefined}
                  onClick={isInteractive ? () => handleRowActivate(domain.to) : undefined}
                  onKeyDown={
                    isInteractive
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleRowActivate(domain.to);
                          }
                        }
                      : undefined
                  }
                  onMouseEnter={isInteractive ? () => setInteractiveRowId(domain.id) : undefined}
                  onMouseLeave={isInteractive ? () => setInteractiveRowId(null) : undefined}
                  onFocus={isInteractive ? () => setInteractiveRowId(domain.id) : undefined}
                  onBlur={isInteractive ? () => setInteractiveRowId(null) : undefined}
                  style={isInteractive ? (isHighlighted ? overviewRowInteractiveStyle : overviewRowLinkStyle) : undefined}
                >
                  <td style={overviewNameCellStyle}>
                    <div style={overviewNameInlineStyle}>
                      <span
                        style={
                          isInteractive
                            ? isHighlighted
                              ? overviewNameTitleInteractiveActiveStyle
                              : overviewNameTitleInteractiveStyle
                            : overviewNameTitleStyle
                        }
                      >
                        {domain.title}
                      </span>
                      {!isInteractive ? <span style={overviewNameMutedStyle}>準備中</span> : null}
                    </div>
                  </td>
                  <td style={overviewBodyCellStyle}>{domain.overviewAction}</td>
                  <td style={overviewBodyCellStyle}>{domain.overviewPrevents}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const overviewTableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid #e1e8f0',
  borderRadius: '12px',
  background: '#fbfdff',
};

const overviewTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '620px',
};

const overviewHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.7rem 0.82rem',
  fontSize: '0.8rem',
  fontWeight: 900,
  color: '#334559',
  background: '#e9f0f7',
  borderBottom: '1px solid #cfdbe8',
};

const overviewNameCellStyle: CSSProperties = {
  padding: '0.78rem 0.82rem',
  borderBottom: '1px solid #e8edf3',
  verticalAlign: 'top',
  width: '24%',
};

const overviewBodyCellStyle: CSSProperties = {
  padding: '0.78rem 0.82rem',
  borderBottom: '1px solid #e8edf3',
  color: '#55657a',
  fontSize: '0.88rem',
  lineHeight: 1.5,
  verticalAlign: 'top',
};

const overviewNameInlineStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.45rem',
  flexWrap: 'wrap',
};

const overviewRowLinkStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'background-color 0.16s ease',
};

const overviewRowInteractiveStyle: CSSProperties = {
  background: '#f7fbff',
  cursor: 'pointer',
};

const overviewNameTitleStyle: CSSProperties = {
  color: '#1f3146',
  fontSize: '0.9rem',
  fontWeight: 800,
  lineHeight: 1.4,
};

const overviewNameTitleInteractiveStyle: CSSProperties = {
  color: '#1f3146',
  fontSize: '0.9rem',
  fontWeight: 800,
  lineHeight: 1.4,
};

const overviewNameTitleInteractiveActiveStyle: CSSProperties = {
  color: '#1e5fd6',
  fontSize: '0.9rem',
  fontWeight: 800,
  lineHeight: 1.4,
};

const overviewNameMutedStyle: CSSProperties = {
  color: '#8a96a5',
  fontSize: '0.68rem',
};

