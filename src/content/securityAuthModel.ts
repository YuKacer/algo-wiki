export type AuthControlId = 'mfa' | 'oidc' | 'session-token' | 'oauth2' | 'authorization';

export interface AuthControl {
  id: AuthControlId;
  title: string;
  role: string;
  usage: string;
  scope: string;
}

export const AUTH_CONTROLS: AuthControl[] = [
  {
    id: 'mfa',
    title: 'MFA',
    role: '追加要素や Passkeys / WebAuthn で本人確認を強める。',
    usage: '管理者ログイン、高リスク操作、社内 SSO',
    scope: '利用者と IdP の認証段階',
  },
  {
    id: 'oidc',
    title: 'OIDC / SSO',
    role: '認証を IdP に集約し、アプリへ本人情報を連携する。',
    usage: '社内ポータル、複数サービスの共通ログイン',
    scope: '利用者、IdP、アプリ間の認証連携',
  },
  {
    id: 'session-token',
    title: 'セッション / 短命トークン',
    role: 'ログイン後の利用継続を安全に保つ。',
    usage: 'Web セッション、SPA + API、モバイルアプリ',
    scope: 'クライアントから API / アプリまで',
  },
  {
    id: 'oauth2',
    title: 'OAuth 2.0',
    role: '外部 API を使うための権限委任を行う。',
    usage: '外部 API 連携、代理実行、サービス間連携',
    scope: 'クライアント、認可サーバ、API 間の委任フロー',
  },
  {
    id: 'authorization',
    title: '認可（RBAC / ABAC）',
    role: '操作ごとに許可範囲を判定する。',
    usage: '管理画面、業務 API、データ操作の制御',
    scope: 'API・アプリ・DB の権限境界',
  },
];
