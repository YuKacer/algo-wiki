import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. サーバーが共通条件を最終確定する',
    summary: '返す TLS 条件を確定する',
    mode: 'server-local',
    clientState: '返答待ち',
    serverState: 'version と cipher suite を確定',
    processLabel: 'ClientHello で見つかった共通条件の中から、Server が採用する TLS version と cipher suite を最終確定します。',
    serverBadgeLabel: '確定中',
    localFocusLabel: 'Server が条件を確定中',
    sections: [
      {
        heading: 'Server が見るもの',
        items: ['supported_versions', 'cipher_suites', 'Server のポリシー'],
      },
      {
        heading: 'ここで決めること',
        items: ['採用する TLS version', '採用する cipher suite', 'この接続で使う最終条件'],
      },
      {
        heading: 'この結果',
        items: ['返答に載せる方式が決まる'],
      },
    ],
  },
  {
    title: '2. サーバーが返す鍵交換材料を決める',
    summary: 'Server 側の key share を用意する',
    mode: 'server-local',
    clientState: '返答待ち',
    serverState: 'key share を準備',
    processLabel: '続行可能と判断した group に対して、Server は自分の key share を用意し、ServerHello に載せる内容を固めます。',
    serverBadgeLabel: '準備中',
    localFocusLabel: 'Server が key share を準備中',
    sections: [
      {
        heading: 'Server が確かめること',
        items: ['選んだ group で続行できるか', '返す key share がこの接続に合うか'],
      },
      {
        heading: 'Server が用意するもの',
        items: ['Server 側の key share', '返答に入れるランダム値', 'ServerHello の最終内容'],
      },
      {
        heading: 'この結果',
        items: ['ServerHello を送る準備が整う'],
      },
    ],
  },
  {
    title: '3. ServerHello を送る',
    summary: 'Server から Client へ採用条件を返す',
    mode: 'server-to-client',
    transportLabel: 'ServerHello',
    clientState: '採用条件を受信',
    serverState: '採用条件を送信',
    processLabel: 'ServerHello は、ClientHello への正式な返答です。採用した TLS version、cipher suite、key share を Client に返します。',
    sections: [
      {
        heading: 'ServerHello に入るもの',
        items: ['採用した TLS version', '採用した cipher suite', 'Server 側の key share'],
      },
      {
        heading: 'Client が受信後に見ること',
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
    summary: 'Client 側でも使う条件が確定する',
    mode: 'client-local',
    clientState: '選ばれた条件を確定',
    serverState: '後続送信の準備',
    processLabel: 'Client は ServerHello を受け取り、候補一覧だった情報を、この接続で実際に使う値へ絞り込みます。',
    clientBadgeLabel: '確定中',
    localFocusLabel: 'Client が採用条件を確定中',
    sections: [
      {
        heading: 'Client が確定すること',
        items: ['採用された TLS version', '採用された cipher suite', 'Server の key share'],
      },
      {
        heading: 'Client が確認すること',
        items: ['自分が送った候補に含まれていたか', 'この条件で鍵導出に進めるか'],
      },
      {
        heading: 'この結果',
        items: ['Client 側でも handshake 条件が固定される'],
      },
    ],
  },
  {
    title: '5. handshake keys の導出を始める',
    summary: '以後の handshake を保護する準備に入る',
    mode: 'client-local',
    clientState: 'handshake keys を導出',
    serverState: '保護付き送信の準備完了',
    processLabel: 'ServerHello までの情報を使って双方が handshake keys を導出し始めます。次の EncryptedExtensions 以降はこの鍵で保護されます。',
    clientBadgeLabel: '導出中',
    localFocusLabel: '鍵導出を開始',
    sections: [
      {
        heading: '導出に使う材料',
        items: ['双方の key share', 'これまでの handshake 情報', '確定した TLS 条件'],
      },
      {
        heading: 'ここで起きる変化',
        items: ['以後の handshake は平文でなくなる', 'Server は保護付きメッセージ送信に進める'],
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
