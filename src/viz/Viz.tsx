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
  const playerKey = useMemo(() => `${algoId}:${input.join(',')}`, [algoId, input]);

  if (!meta) {
    return <p style={{ color: 'red' }}>アルゴリズム "{algoId}" が見つかりません</p>;
  }

  return (
    <Player key={playerKey} frames={frames}>
      {(frame) => <ArrayBars frame={frame} />}
    </Player>
  );
}
