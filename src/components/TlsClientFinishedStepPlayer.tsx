import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. クライアントが verify_data を計算する',
    summary: 'Client Finished に入れる検証値を作る',
    mode: 'client-local',
    clientState: 'verify_data を計算',
    serverState: 'Finished を待つ',
    processLabel: 'クライアントは transcript hash と client finished key を使って、Client Finished に入れる verify_data を計算します。',
    clientBadgeLabel: '計算中',
    localFocusLabel: 'クライアントが検証値を計算中',
    sections: [
      {
        heading: 'クライアントが使うもの',
        items: ['transcript hash', 'client finished key', 'ここまでのハンドシェイク状態'],
      },
      {
        heading: 'ここで行うこと',
        items: ['verify_data を計算する', 'Client Finished に載せる値を固める'],
      },
      {
        heading: 'この結果',
        items: ['クライアント側の完全性証明の材料が整う'],
      },
    ],
    formula: 'verify_data = HMAC(client_finished_key, transcript_hash(...))',
  },
  {
    title: '2. Client Finished を送る',
    summary: 'クライアントが最終の Finished を返す',
    mode: 'client-to-server',
    transportLabel: 'Client Finished',
    clientState: 'Finished を送信',
    serverState: 'verify_data を受信',
    processLabel: 'クライアントは Finished メッセージとして verify_data を返し、自分側でも同じハンドシェイク状態を共有していることを示します。',
    sections: [
      {
        heading: '送っているもの',
        items: ['Finished', 'verify_data'],
      },
      {
        heading: 'サーバが受信後に見ること',
        items: ['Finished を受信できたか', '検証に必要な材料がそろっているか'],
      },
      {
        heading: 'この結果',
        items: ['サーバが最終検証に進める'],
      },
    ],
  },
  {
    title: '3. サーバが期待値を計算して検証する',
    summary: '同じ条件で Client Finished を検証する',
    mode: 'server-local',
    clientState: '検証待ち',
    serverState: 'Finished を検証',
    processLabel: 'サーバは自分の transcript hash と client finished key を使って期待値を計算し、受信した verify_data と比較します。',
    serverBadgeLabel: '検証中',
    localFocusLabel: 'サーバが最終検証中',
    sections: [
      {
        heading: 'サーバが使うもの',
        items: ['同じ transcript hash', 'client finished key', '受信した verify_data'],
      },
      {
        heading: '検証する点',
        items: ['ここまでの履歴が一致しているか', 'クライアント側も正しい鍵素材を持つか'],
      },
      {
        heading: 'この結果',
        items: ['成功すればハンドシェイク完了', '失敗すれば接続は中断される'],
      },
    ],
    formula: 'expected_verify_data = HMAC(client_finished_key, transcript_hash(...))',
  },
  {
    title: '4. ハンドシェイクを完了として扱う',
    summary: 'TLS の確立が完了する',
    mode: 'server-local',
    clientState: '完了待ち',
    serverState: 'ハンドシェイク完了',
    processLabel: 'サーバが Client Finished の検証に成功すると、この TLS handshake は完了として扱われます。',
    serverBadgeLabel: '完了',
    localFocusLabel: 'サーバが完了を受理',
    sections: [
      {
        heading: 'ここで確定すること',
        items: ['双方が同じハンドシェイク状態を共有している', 'Finished までの完全性確認が終わる'],
      },
      {
        heading: '以後の扱い',
        items: ['ハンドシェイク用のやり取りは終わる', '通常の TLS 通信フェーズへ移る'],
      },
      {
        heading: 'この結果',
        items: ['アプリケーションデータを送受信できる状態になる'],
      },
    ],
  },
  {
    title: '5. Application Data へ進む',
    summary: '通常の暗号化通信が始まる',
    mode: 'client-to-server',
    transportLabel: 'Application Data',
    clientState: 'アプリデータ送信可能',
    serverState: 'アプリデータ受信可能',
    processLabel: 'Finished の確認が終わると、HTTP リクエストなどの application data を通常の暗号化通信として送受信できるようになります。',
    sections: [
      {
        heading: 'ここから送れるもの',
        items: ['HTTP リクエスト', 'API リクエスト', '通常のアプリケーションデータ'],
      },
      {
        heading: '通信の前提',
        items: ['TLS handshake は完了済み', '保護付きの通常通信に移る'],
      },
      {
        heading: 'この結果',
        items: ['接続は学習用の TLS フローから通常通信フェーズへ移る'],
      },
    ],
  },
];

export function TlsClientFinishedStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="Client Finished ステップ選択" />;
}
