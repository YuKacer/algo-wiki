import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. クライアントが接続条件を組み立てる',
    summary: '使いたい TLS 条件を手元で準備する',
    mode: 'client-local',
    clientState: '候補を組み立てる',
    serverState: '待機',
    processLabel: 'Client は対応 TLS バージョンや cipher suite 候補を、自分の実装とポリシーに基づいて並べます。',
    clientBadgeLabel: '準備中',
    localFocusLabel: 'Client が準備中',
    sections: [
      {
        heading: '組み立てる候補',
        items: ['対応する TLS バージョン候補', '許可する cipher suite 候補', 'この接続で必要な拡張'],
      },
      {
        heading: 'Client が見る条件',
        items: ['自分の実装で使えるか', 'ポリシー上許可してよいか', '古い方式を除外するか'],
      },
      {
        heading: 'この結果',
        items: ['ClientHello の基本条件が決まる'],
      },
    ],
  },
  {
    title: '2. SNI と key share を入れる',
    summary: '接続先名と鍵交換の材料を詰める',
    mode: 'client-local',
    clientState: 'SNI と key share を追加',
    serverState: '待機',
    processLabel: '接続先ホスト名が分かっていれば SNI を入れ、鍵交換のための key share も一緒に載せます。',
    clientBadgeLabel: '準備中',
    localFocusLabel: 'Client が準備中',
    sections: [
      {
        heading: '追加する情報',
        items: ['server_name (SNI)', 'key_share', '必要な拡張'],
      },
      {
        heading: 'Server が後で使う情報',
        items: ['接続先ホスト名', '鍵交換に使う group', 'どのホスト設定を使うかの判断材料'],
      },
      {
        heading: 'この結果',
        items: ['Server が仮想ホスト選択と鍵交換判断を始められる材料が揃う'],
      },
    ],
  },
  {
    title: '3. ClientHello を送る',
    summary: 'Client から Server へ提案を送る',
    mode: 'client-to-server',
    transportLabel: 'ClientHello',
    clientState: '提案を送信',
    serverState: '提案を受信',
    processLabel: 'ClientHello は「TLS バージョン候補、暗号方式候補、拡張、鍵交換材料」をまとめて送る最初の提案メッセージです。',
    sections: [
      {
        heading: '送っているもの',
        items: ['supported_versions', 'cipher_suites', 'SNI', 'key_share'],
      },
      {
        heading: 'Server が受信後に確認すること',
        items: ['メッセージ全体を受信できたか', '接続判断に必要な候補が入っているか'],
      },
      {
        heading: 'この結果',
        items: ['Server が接続条件の選別に進める'],
      },
    ],
  },
  {
    title: '4. サーバーが SNI と候補一覧を読む',
    summary: 'どのホスト設定で応答するかを決める',
    mode: 'server-local',
    clientState: '返答待ち',
    serverState: 'SNI と候補を評価',
    processLabel: 'Server は SNI に対応する設定を見つけつつ、TLS 1.3 で続行できる共通条件を探します。',
    serverBadgeLabel: '評価中',
    localFocusLabel: 'Server が評価中',
    sections: [
      {
        heading: 'Server が読む情報',
        items: ['SNI', 'supported_versions', 'cipher_suites'],
      },
      {
        heading: '評価するポイント',
        items: ['どのホスト設定で返すか', 'TLS 1.3 で続行できるか', '共通の cipher suite があるか'],
      },
      {
        heading: 'この結果',
        items: ['どの設定で応答するかが絞られる'],
      },
    ],
  },
  {
    title: '5. ServerHello か HelloRetryRequest を決める',
    summary: '次に返すメッセージを決める',
    mode: 'server-local',
    clientState: '応答待ち',
    serverState: '分岐条件を判定',
    processLabel: 'key share がそのまま使えるなら ServerHello へ進み、使えない group なら HelloRetryRequest で別の group を指定します。',
    serverBadgeLabel: '判定中',
    localFocusLabel: 'Server が判定中',
    sections: [
      {
        heading: 'Server が見る条件',
        items: ['key_share の group が使えるか', '共通の TLS 条件が揃っているか'],
      },
      {
        heading: '分岐の条件',
        items: ['続行できるなら ServerHello', 'key share をやり直すなら HelloRetryRequest', '条件が合わなければ接続失敗'],
      },
      {
        heading: 'この結果',
        items: ['次に返すメッセージが決まる', 'HelloRetryRequest の場合、Client は指定された group で ClientHello を作り直す'],
      },
    ],
  },
];

export function TlsClientHelloStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="ClientHello ステップ選択" />;
}
