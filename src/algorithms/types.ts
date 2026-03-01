export interface Frame {
  array?: number[];
  highlight?: {
    indices?: number[];
    sorted?: number[]; // 確定済み要素のインデックス
  };
  codeLine?: number;
  message?: string;
}

export interface AlgorithmMeta {
  id: string;
  title: string;
  generateFrames: (input: number[]) => Frame[];
}
