export type TransportMethodId = 'tls' | 'ipsec' | 'ssh' | 'vpn' | 'dns-protection';

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
    title: 'TLS',
    layer: '主にアプリ通信の保護（TCP上のTLS、QUICではTLS 1.3 を利用）',
    protects: 'Web/API などアプリ通信の機密性・完全性・真正性',
    usage: 'HTTPS、gRPC、メール転送など',
    strengths: 'ブラウザ標準、証明書基盤、導入しやすい',
    cautions: '証明書運用ミス、古い暗号スイート、設定不備',
    mapNodes: ['client', 'edge', 'api', 'app', 'idp'],
    mapLinks: ['l1', 'l2', 'l3', 'l13'],
    secondaryMapLinks: ['l7'],
  },
  {
    id: 'ipsec',
    title: 'IPsec',
    layer: 'L3（ネットワーク層）',
    protects: 'IPパケット単位の機密性・完全性',
    usage: '拠点間接続、閉域網相当のトンネル',
    strengths: 'アプリ非依存で広く保護できる',
    cautions: '設計と運用がやや複雑、NAT越えに配慮が必要',
    mapNodes: ['client', 'edge', 'api', 'app', 'db', 'storage', 'kms'],
    mapLinks: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
  },
  {
    id: 'ssh',
    title: 'SSH',
    layer: 'L7（リモート管理プロトコル）',
    protects: '管理系通信の機密性・認証',
    usage: 'サーバーログイン、運用操作、トンネル',
    strengths: '鍵認証が強力、運用での実績が多い',
    cautions: '鍵管理不備、踏み台設計不備、権限過多',
    mapNodes: ['client', 'app', 'db', 'cicd'],
    mapLinks: ['l3', 'l4', 'l10'],
  },
  {
    id: 'vpn',
    title: 'VPN',
    layer: 'L3-L4（方式により異なる）',
    protects: '端末-社内、拠点-拠点の通信経路',
    usage: 'リモートアクセス、拠点間接続',
    strengths: '広範囲を一括保護しやすい',
    cautions: '認証境界が粗くなりやすい、接続性依存',
    mapNodes: ['client', 'edge', 'api', 'app', 'db', 'storage', 'kms'],
    mapLinks: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
  },
  {
    id: 'dns-protection',
    title: 'DNS保護（DNSSEC / DoT / DoH）',
    layer: '名前解決層 + トランスポート',
    protects: '名前解決の改ざん防止・盗聴対策',
    usage: '正しい名前解決、リゾルバ通信保護',
    strengths: '偽応答耐性の向上、問い合わせ保護',
    cautions: 'DNSSEC導入難度、運用ミスで到達障害',
    mapNodes: ['client', 'edge', 'api', 'idp'],
    mapLinks: ['l1', 'l2', 'l7', 'l13'],
  },
];

export function getTransportMethodById(id: string): TransportMethod | undefined {
  return TRANSPORT_METHODS.find((m) => m.id === id);
}
