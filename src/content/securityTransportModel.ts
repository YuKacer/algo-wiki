export type TransportMethodId = 'tls' | 'ipsec' | 'ssh' | 'wireguard' | 'dnssec' | 'dot-doh';

export interface TransportMethod {
  id: TransportMethodId;
  title: string;
  layer: string;
  protects: string;
  usage: string;
  strengths: string;
  cautions: string;
  mapNodes: string[];
  mapLinks: string[];
  secondaryMapLinks?: string[];
}

export const TRANSPORT_METHODS: TransportMethod[] = [
  {
    id: 'tls',
    title: 'TLS 1.3',
    layer: 'Web / API の接続終端',
    protects: 'アプリ通信の内容と接続相手',
    usage: 'Web サイト、API、アプリ通信',
    strengths: 'ブラウザ標準で導入しやすい',
    cautions: '証明書運用と終端後の区間に注意',
    mapNodes: ['client', 'edge', 'api', 'app', 'idp'],
    mapLinks: ['l1', 'l2', 'l3', 'l13'],
    secondaryMapLinks: ['l7'],
  },
  {
    id: 'ipsec',
    title: 'IPsec + IKEv2',
    layer: '拠点間・ネットワーク境界',
    protects: 'IP パケット単位の通信経路',
    usage: '拠点間接続、機器間トンネル',
    strengths: 'アプリ非依存でまとめて保護できる',
    cautions: '設計と鍵管理が複雑になりやすい',
    mapNodes: ['client', 'edge', 'api', 'app', 'db', 'storage', 'kms'],
    mapLinks: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
  },
  {
    id: 'ssh',
    title: 'SSH',
    layer: '管理接続の終端',
    protects: '管理操作とログイン通信',
    usage: 'サーバーログイン、運用作業',
    strengths: '鍵認証と運用実績が豊富',
    cautions: '鍵管理や踏み台設計が重要',
    mapNodes: ['client', 'app', 'db', 'cicd'],
    mapLinks: ['l3', 'l4', 'l10'],
  },
  {
    id: 'wireguard',
    title: 'WireGuard',
    layer: '端末間・拠点間のトンネル',
    protects: '端末と内部網の通信経路',
    usage: 'リモートアクセス、軽量 VPN',
    strengths: '構成が比較的シンプルで高速',
    cautions: '認証設計や経路制御は別途必要',
    mapNodes: ['client', 'edge', 'api', 'app', 'db', 'storage', 'kms'],
    mapLinks: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
  },
  {
    id: 'dnssec',
    title: 'DNSSEC',
    layer: '権威 DNS と検証リゾルバ',
    protects: '名前解決結果の正しさ',
    usage: '正しい名前解決の検証',
    strengths: '偽の DNS 応答を見抜きやすい',
    cautions: '署名運用を誤ると到達障害になり得る',
    mapNodes: ['client', 'edge', 'api', 'idp'],
    mapLinks: ['l1', 'l7'],
  },
  {
    id: 'dot-doh',
    title: 'DoT / DoH',
    layer: '端末とリゾルバの間',
    protects: 'DNS 問い合わせ通信',
    usage: 'リゾルバ通信の盗聴・改ざん対策',
    strengths: '問い合わせ経路を暗号化できる',
    cautions: '名前解決結果の正しさは別途確認が必要',
    mapNodes: ['client', 'edge', 'api', 'idp'],
    mapLinks: ['l1', 'l2', 'l13'],
  },
];

export function getTransportMethodById(id: string): TransportMethod | undefined {
  return TRANSPORT_METHODS.find((m) => m.id === id);
}

