import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. サーバが verify_data を計算する',
    summary: 'Finished に入れる検証値を作る',
    mode: 'server-local',
    clientState: 'Finished を待つ',
    serverState: 'verify_data を計算',
    processLabel: 'サーバは transcript hash と finished key を使って、Server Finished に入れる verify_data を計算します。',
    serverBadgeLabel: '計算中',
    localFocusLabel: 'サーバが検証値を計算中',
    sections: [
      {
        heading: 'サーバが使うもの',
        items: ['transcript hash', 'server finished key', 'ここまでのハンドシェイク状態'],
      },
      {
        heading: 'ここで行うこと',
        items: ['verify_data を計算する', 'Server Finished に載せる値を固める'],
      },
      {
        heading: 'この結果',
        items: ['ハンドシェイク完全性を示す材料が整う'],
      },
    ],
    formula: 'verify_data = HMAC(server_finished_key, transcript_hash(...))',
  },
  {
    title: '2. Server Finished を送る',
    summary: 'サーバが検証値を返す',
    mode: 'server-to-client',
    transportLabel: 'Server Finished',
    clientState: 'verify_data を受信',
    serverState: 'Finished を送信',
    processLabel: 'サーバは Finished メッセージとして verify_data を送り、ここまでのハンドシェイク履歴が整合していることを示します。',
    sections: [
      {
        heading: '送っているもの',
        items: ['Finished', 'verify_data'],
      },
      {
        heading: 'クライアントが受信後に見ること',
        items: ['Finished を受信できたか', '検証に必要な材料がそろっているか'],
      },
      {
        heading: 'この結果',
        items: ['クライアントがサーバ側の完全性検証に進める'],
      },
    ],
  },
  {
    title: '3. クライアントが期待値を計算する',
    summary: '同じ条件で verify_data を再計算する',
    mode: 'client-local',
    clientState: '期待値を計算',
    serverState: '検証待ち',
    processLabel: 'クライアントは自分が持つ transcript hash と finished key から、期待する verify_data を計算します。',
    clientBadgeLabel: '計算中',
    localFocusLabel: 'クライアントが期待値を計算中',
    sections: [
      {
        heading: 'クライアントが使うもの',
        items: ['同じ transcript hash', 'server finished key', '受信した Finished'],
      },
      {
        heading: 'ここで確かめる前提',
        items: ['同じ会話履歴を共有しているか', '同じ鍵素材を共有しているか'],
      },
      {
        heading: 'この結果',
        items: ['比較に使う期待値が用意できる'],
      },
    ],
    formula: 'expected_verify_data = HMAC(server_finished_key, transcript_hash(...))',
  },
  {
    title: '4. クライアントが Finished を検証する',
    summary: 'サーバ側の完全性を確かめる',
    mode: 'client-local',
    clientState: 'Finished を検証',
    serverState: '検証待ち',
    processLabel: 'クライアントは受信した verify_data と期待値を比較し、サーバ側のハンドシェイク内容が整合しているかを検証します。',
    clientBadgeLabel: '検証中',
    localFocusLabel: 'クライアントが検証中',
    sections: [
      {
        heading: '比較するもの',
        items: ['受信した verify_data', '自分で計算した期待値'],
      },
      {
        heading: '検証する点',
        items: ['ここまでの履歴に食い違いがないか', '正しい finished key が共有されているか'],
      },
      {
        heading: 'この結果',
        items: ['検証に成功すれば Client Finished へ進める', '失敗すればハンドシェイクは中断される'],
      },
    ],
  },
  {
    title: '5. クライアントが Client Finished を返す準備に入る',
    summary: '次の Finished を返す段階へ進む',
    mode: 'client-local',
    clientState: 'Client Finished を準備',
    serverState: '受信待ち',
    processLabel: 'Server Finished の検証に成功したクライアントは、自分の Finished を返してハンドシェイク完了へ進む準備に入ります。',
    clientBadgeLabel: '準備中',
    localFocusLabel: 'クライアントが次メッセージを準備中',
    sections: [
      {
        heading: 'この時点で確認できたこと',
        items: ['サーバ側の履歴が整合している', '鍵導出が一致している'],
      },
      {
        heading: '次に続くもの',
        items: ['Client Finished', 'サーバ側の最終検証', 'ハンドシェイク完了'],
      },
      {
        heading: 'この結果',
        items: ['クライアントが最終メッセージを返す段階へ進む'],
      },
    ],
  },
];

export function TlsServerFinishedStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="Server Finished ステップ選択" />;
}
