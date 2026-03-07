import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. サーバが返す拡張条件を整理する',
    summary: 'どの拡張を返すか決める',
    mode: 'server-local',
    clientState: '受信待ち',
    serverState: '拡張条件を整理',
    processLabel: 'サーバは ClientHello と確定済みの TLS 条件を見て、EncryptedExtensions に載せる追加の拡張条件を整理します。',
    serverBadgeLabel: '整理中',
    localFocusLabel: 'サーバが拡張条件を整理中',
    sections: [
      {
        heading: 'サーバが見るもの',
        items: ['クライアントが送った拡張候補', '確定した TLS 条件', 'サーバの設定'],
      },
      {
        heading: 'ここで決めること',
        items: ['どの拡張を返すか', 'ALPN などを返すか', '後続処理に必要な条件'],
      },
      {
        heading: 'この結果',
        items: ['EncryptedExtensions に載せる内容が固まる'],
      },
    ],
  },
  {
    title: '2. handshake keys で保護して準備する',
    summary: '保護付きで送る準備をする',
    mode: 'server-local',
    clientState: '受信待ち',
    serverState: '暗号化して準備',
    processLabel: 'ServerHello のあとに使える handshake keys を使って、サーバは EncryptedExtensions を保護付きメッセージとして準備します。',
    serverBadgeLabel: '準備中',
    localFocusLabel: 'サーバが保護付き送信を準備中',
    sections: [
      {
        heading: '使う材料',
        items: ['確定した handshake keys', '返す拡張条件', '現在までのハンドシェイク状態'],
      },
      {
        heading: 'ここで起きること',
        items: ['平文ではなく保護付きになる', '内容を第三者に直接読まれない形で送る'],
      },
      {
        heading: 'この結果',
        items: ['EncryptedExtensions を送れる状態になる'],
      },
    ],
  },
  {
    title: '3. EncryptedExtensions を送る',
    summary: 'サーバから拡張条件を通知する',
    mode: 'server-to-client',
    transportLabel: 'EncryptedExtensions',
    clientState: '拡張条件を受信',
    serverState: '拡張条件を送信',
    processLabel: 'サーバは保護付きの EncryptedExtensions を送り、この接続で有効にする追加の拡張条件を通知します。',
    sections: [
      {
        heading: '入っているもの',
        items: ['ALPN などの追加拡張', 'この接続で有効な拡張条件'],
      },
      {
        heading: 'クライアントが受信後に行うこと',
        items: ['復号して内容を読む', '後続処理に必要な条件を反映する'],
      },
      {
        heading: 'この結果',
        items: ['双方が追加の拡張条件を共有する'],
      },
    ],
  },
  {
    title: '4. クライアントが内容を確認する',
    summary: '拡張条件を受け取って反映する',
    mode: 'client-local',
    clientState: '拡張条件を反映',
    serverState: '後続送信の準備',
    processLabel: 'クライアントは EncryptedExtensions を復号して、ALPN などの追加条件を確認し、以後の処理に反映します。',
    clientBadgeLabel: '確認中',
    localFocusLabel: 'クライアントが条件を反映中',
    sections: [
      {
        heading: 'クライアントが確認すること',
        items: ['どの拡張が有効になったか', '自分の候補と整合するか', '後続処理に必要な条件が揃ったか'],
      },
      {
        heading: 'ここで反映するもの',
        items: ['ALPN などの採用結果', '後続メッセージの前提条件'],
      },
      {
        heading: 'この結果',
        items: ['後続のサーバ認証メッセージを受ける準備が整う'],
      },
    ],
  },
  {
    title: '5. Certificate 以降へ進む',
    summary: 'サーバ認証の後続メッセージへ続く',
    mode: 'server-local',
    clientState: '後続メッセージ待ち',
    serverState: 'Certificate 送信を準備',
    processLabel: 'サーバ認証を行う通常の構成では、サーバは次に Certificate と CertificateVerify を送り、本人性の証明へ進みます。',
    serverBadgeLabel: '準備中',
    localFocusLabel: 'サーバが次メッセージを準備中',
    sections: [
      {
        heading: 'この時点で揃っていること',
        items: ['追加拡張の共有', '保護付きハンドシェイク状態', '後続認証に進める前提'],
      },
      {
        heading: '次に続くもの',
        items: ['Certificate', 'CertificateVerify', 'Server Finished'],
      },
      {
        heading: 'この結果',
        items: ['ハンドシェイクはサーバ認証の段階へ進む'],
      },
    ],
  },
];

export function TlsEncryptedExtensionsStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="EncryptedExtensions ステップ選択" />;
}
