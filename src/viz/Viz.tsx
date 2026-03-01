import { useMemo } from 'react';
import { Player } from './Player';
import { ArrayBars } from './ArrayBars';
import { algorithmRegistry } from '../algorithms/registry';

interface VizProps {
  algoId: string;
  input: number[];
}

export function Viz({ algoId, input }: VizProps) {
  const meta = algorithmRegistry[algoId];

  const frames = useMemo(() => {
    if (!meta) return [];
    return meta.generateFrames(input);
  }, [meta, input]);

  if (!meta) {
    return <p style={{ color: 'red' }}>アルゴリズム "{algoId}" が見つかりません</p>;
  }

  return (
    <Player frames={frames}>
      {(frame) => <ArrayBars frame={frame} />}
    </Player>
  );
}
