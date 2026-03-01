import type { Frame } from './types';

export function bubbleSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];

  // 初期状態
  frames.push({
    array: [...arr],
    highlight: { indices: [], sorted: [] },
    codeLine: 0,
    message: 'ソート開始',
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // 比較フレーム
      frames.push({
        array: [...arr],
        highlight: { indices: [j, j + 1], sorted: [...sorted] },
        codeLine: 2,
        message: `arr[${j}]=${arr[j]} と arr[${j + 1}]=${arr[j + 1]} を比較`,
      });

      if (arr[j] > arr[j + 1]) {
        // 交換
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        frames.push({
          array: [...arr],
          highlight: { indices: [j, j + 1], sorted: [...sorted] },
          codeLine: 3,
          message: `arr[${j}] と arr[${j + 1}] を交換`,
        });
      }
    }
    // パス終了 → 末尾が確定
    sorted.unshift(n - 1 - i);
    frames.push({
      array: [...arr],
      highlight: { indices: [], sorted: [...sorted] },
      codeLine: 4,
      message: `パス ${i + 1} 完了。arr[${n - 1 - i}]=${arr[n - 1 - i]} が確定`,
    });
  }

  // 最後の1要素も確定
  sorted.unshift(0);
  frames.push({
    array: [...arr],
    highlight: { indices: [], sorted: [...sorted] },
    codeLine: 5,
    message: 'ソート完了！',
  });

  return frames;
}
