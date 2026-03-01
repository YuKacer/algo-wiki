import type { AlgorithmMeta } from './types';
import { bubbleSortFrames } from './bubbleSort';

export const algorithmRegistry: Record<string, AlgorithmMeta> = {
  'bubble-sort': {
    id: 'bubble-sort',
    title: 'バブルソート',
    generateFrames: bubbleSortFrames,
  },
};
