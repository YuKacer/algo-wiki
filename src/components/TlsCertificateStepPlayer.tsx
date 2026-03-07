import { TlsStepDetailPlayer, type TlsDetailStep } from './TlsStepDetailPlayer';

const STEPS: TlsDetailStep[] = [
  {
    title: '1. 証明書チェーンを選ぶ',
    summary: 'SNI や仮想ホスト設定に合う証明書を選ぶ',
    mode: 'server-local',
    serverState: '返す leaf / intermediate を選定',
    clientState: '証明書を待つ',
    processLabel: 'Server が SNI と設定から返す証明書チェーンを選びます。',
    serverBadgeLabel: '選択中',
    localFocusLabel: 'Server が選択中',
    sections: [
      {
        heading: '選ぶもの',
        items: ['leaf certificate', 'intermediate certificates'],
      },
      {
        heading: 'Server が見る条件',
        items: ['SNI', '仮想ホスト設定', 'どの証明書チェーンを返すか'],
      },
      {
        heading: 'この結果',
        items: ['leaf 証明書と中間証明書の組み合わせが決まる'],
      },
    ],
  },
  {
    title: '2. 証明書チェーンを送る',
    summary: 'leaf 証明書と中間証明書をクライアントへ送る',
    mode: 'server-to-client',
    transportLabel: 'Certificate chain',
    serverState: '証明書チェーンを送信',
    clientState: 'チェーンを受信',
    processLabel: 'クライアントが検証できるよう、leaf 証明書だけでなく中間証明書も送ります。',
    sections: [
      {
        heading: '送っているもの',
        items: ['leaf certificate', 'intermediate certificates'],
      },
      {
        heading: 'Client が受信後に確認すること',
        items: ['チェーン全体を受信できたか', '検証に必要な証明書が揃っているか'],
      },
      {
        heading: 'この結果',
        items: ['クライアントがホスト名や CA 連鎖の確認を始められる'],
      },
    ],
  },
  {
    title: '3. クライアントがチェーンを検証する',
    summary: 'この公開鍵を誰のものとして信頼してよいかを確認する',
    mode: 'client-local',
    serverState: '送信済み',
    clientState: 'チェーンを検証',
    processLabel: 'Client が証明書チェーンを見て、接続先ホスト名と trust store に照らして妥当性を確認します。',
    clientBadgeLabel: '検証中',
    localFocusLabel: 'Client が検証中',
    sections: [
      {
        heading: 'Client が確認する項目',
        items: ['SAN / hostname', '有効期限', 'issuer / subject の連鎖', 'trust store への連鎖', 'serverAuth 用途'],
      },
      {
        heading: '信頼判断の基準',
        items: ['接続先ホスト名と一致するか', '信頼済み CA へ連なるか', 'サーバー証明書として使えるか'],
      },
      {
        heading: 'この結果',
        items: ['この公開鍵を接続先サーバーのものとして信頼してよいかが決まる'],
      },
    ],
  },
  {
    title: '4. サーバーが CertificateVerify を送る',
    summary: '証明書に対応する秘密鍵を持つことを示す',
    mode: 'server-to-client',
    transportLabel: 'CertificateVerify',
    serverState: '秘密鍵で署名',
    clientState: '署名を受信',
    processLabel: 'Server は transcript hash に署名し、証明書に対応する秘密鍵を今の接続相手が持つことを示します。',
    sections: [
      {
        heading: '送っているもの',
        items: ['CertificateVerify'],
      },
      {
        heading: 'Client が検証する点',
        items: ['署名対象は transcript hash か', 'leaf 証明書の公開鍵で検証できるか'],
      },
      {
        heading: 'この結果',
        items: ['秘密鍵保有の確認に必要な材料が届く'],
      },
    ],
    formula: `signature = Sign(server_private_key, transcript_hash(...))`,
  },
  {
    title: '5. クライアントが署名を検証する',
    summary: '証明書の持ち主と接続相手が一致するかを確かめる',
    mode: 'client-local',
    serverState: '検証待ち',
    clientState: '公開鍵で署名を検証',
    processLabel: 'Client は leaf 証明書の公開鍵で署名を検証し、証明書の持ち主と今の相手が一致すると確かめます。',
    clientBadgeLabel: '検証中',
    localFocusLabel: 'Client が検証中',
    sections: [
      {
        heading: 'Client が使う材料',
        items: ['leaf certificate の公開鍵', '受信した署名', '同じ transcript hash'],
      },
      {
        heading: '検証する点',
        items: ['公開鍵で署名が通るか', '今の会話履歴に対する署名か', '証明書の持ち主と接続相手が一致するか'],
      },
      {
        heading: 'この結果',
        items: ['サーバー本人性が成立し、Finished 検証へ進める'],
      },
    ],
    formula: `verify(signature, leaf_certificate_public_key, transcript_hash(...))`,
  },
];

export function TlsCertificateStepPlayer() {
  return <TlsStepDetailPlayer steps={STEPS} sliderLabel="Certificate ステップ選択" />;
}
