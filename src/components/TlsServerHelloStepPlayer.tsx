import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. サーバが共通条件を最終確定する',
    summary: '返す TLS 条件を確定する',
    mode: 'server-local',
    clientState: '返答待ち',
    serverState: 'TLS バージョンと暗号スイートを確定',
    processLabel: 'ClientHello で見つかった共通候補の中から、サーバが採用する TLS バージョンと暗号スイートを最終確定します。',
    serverBadgeLabel: '確定中',
    localFocusLabel: 'サーバが条件を確定中',
    sections: [
      {
        heading: 'サーバが見るもの',
        items: ['supported_versions', 'cipher_suites', 'サーバのポリシー'],
      },
      {
        heading: 'ここで決めること',
        items: ['採用する TLS バージョン', '採用する暗号スイート', 'この接続で使う最終条件'],
      },
      {
        heading: 'この結果',
        items: ['返答に載せる方式が決まる'],
      },
    ],
  },
  {
    title: '2. サーバが返す鍵交換材料を決める',
    summary: 'サーバ側の key share を用意する',
    mode: 'server-local',
    clientState: '返答待ち',
    serverState: 'key share を準備',
    processLabel: '続行可能と判断した鍵交換グループに対して、サーバは自分の key share を用意し、ServerHello に載せる内容を固めます。',
    serverBadgeLabel: '準備中',
    localFocusLabel: 'サーバが key share を準備中',
    sections: [
      {
        heading: 'サーバが確かめること',
        items: ['選んだ鍵交換グループで続行できるか', '返す key share がこの接続に合うか'],
      },
      {
        heading: 'サーバが用意するもの',
        items: ['サーバ側の key share', '返答に入れるランダム値', 'ServerHello の最終内容'],
      },
      {
        heading: 'この結果',
        items: ['ServerHello を送る準備が整う'],
      },
    ],
  },
  {
    title: '3. ServerHello を送る',
    summary: 'サーバからクライアントへ採用条件を返す',
    mode: 'server-to-client',
    transportLabel: 'ServerHello',
    clientState: '採用条件を受信',
    serverState: '採用条件を送信',
    processLabel: 'ServerHello は、ClientHello への正式な返答です。採用した TLS バージョン、暗号スイート、key share をクライアントに返します。',
    sections: [
      {
        heading: 'ServerHello に入るもの',
        items: ['採用した TLS バージョン', '採用した暗号スイート', 'サーバ側の key share'],
      },
      {
        heading: 'クライアントが受信後に見ること',
        items: ['どの条件が選ばれたか', '自分の候補と整合するか', '鍵導出に進めるか'],
      },
      {
        heading: 'この結果',
        items: ['候補のやりとりが終わり、使う条件が確定する'],
      },
    ],
  },
  {
    title: '4. クライアントが採用条件を確定する',
    summary: 'クライアント側でも使う条件が確定する',
    mode: 'client-local',
    clientState: '選ばれた条件を確定',
    serverState: '後続送信の準備',
    processLabel: 'クライアントは ServerHello を受け取り、候補一覧だった情報を、この接続で実際に使う値へ絞り込みます。',
    clientBadgeLabel: '確定中',
    localFocusLabel: 'クライアントが採用条件を確定中',
    sections: [
      {
        heading: 'クライアントが確定すること',
        items: ['採用された TLS バージョン', '採用された暗号スイート', 'サーバの key share'],
      },
      {
        heading: 'クライアントが確認すること',
        items: ['自分が送った候補に含まれていたか', 'この条件で鍵導出に進めるか'],
      },
      {
        heading: 'この結果',
        items: ['クライアント側でもハンドシェイク条件が固定される'],
      },
    ],
  },
  {
    title: '5. handshake keys の導出を始める',
    summary: '以後のハンドシェイクを保護する準備に入る',
    mode: 'client-local',
    clientState: 'handshake keys を導出',
    serverState: '保護付き送信の準備完了',
    processLabel: 'ServerHello までの情報を使って双方が handshake keys の導出を始めます。次の EncryptedExtensions 以降はこの鍵で保護されます。',
    clientBadgeLabel: '導出中',
    localFocusLabel: '鍵導出を開始',
    sections: [
      {
        heading: '導出に使う材料',
        items: ['双方の key share', 'これまでのハンドシェイク情報', '確定した TLS 条件'],
      },
      {
        heading: 'ここで起きる変化',
        items: ['以後のハンドシェイクは平文でなくなる', 'サーバは保護付きメッセージ送信に進める'],
      },
      {
        heading: 'この結果',
        items: ['次の EncryptedExtensions から handshake keys で保護される'],
      },
    ],
  },
];

export function TlsServerHelloStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="ServerHello ステップ選択" />;
}
