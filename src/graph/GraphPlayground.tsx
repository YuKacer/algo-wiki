import { useState, useEffect, useRef } from 'react';
import type { Graph, StepState } from './GraphTypes';
import { GraphEditor } from './GraphEditor';
import { GraphView } from './GraphView';
import { Stepper } from './Stepper';
import { bfsSteps } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import { dijkstraSteps } from '../algorithms/dijkstraSteps';
import { toposortSteps } from '../algorithms/toposortSteps';

export interface Sample {
  label: string;
  graph: Graph;
  startNode?: number;
}

interface GraphPlaygroundProps {
  algoId: 'bfs' | 'dfs' | 'dijkstra' | 'toposort';
  defaultGraph: Graph;
  defaultStart?: number;
  samples: Sample[];
}

function generateSteps(algoId: string, graph: Graph, start: number): StepState[] {
  if (algoId === 'bfs') return bfsSteps(graph, start);
  if (algoId === 'dfs') return dfsSteps(graph, start);
  if (algoId === 'dijkstra') return dijkstraSteps(graph, start);
  if (algoId === 'toposort') return toposortSteps(graph);
  return [];
}

export function GraphPlayground({ algoId, defaultGraph, defaultStart = 0, samples }: GraphPlaygroundProps) {
  const [graph, setGraph] = useState<Graph>(defaultGraph);
  const [startNode, setStartNode] = useState(defaultStart);
  const [steps, setSteps] = useState<StepState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const s = generateSteps(algoId, graph, startNode);
    setSteps(s);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, steps.length]);

  const handleIndexChange = (i: number) => setCurrentIndex(i);
  const handlePlayingChange = (p: boolean) => setIsPlaying(p);

  const showWeight = algoId === 'dijkstra';

  return (
    <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', overflow: 'hidden', background: '#f8f9fa' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #dee2e6', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.95rem' }}>🎮 可視化プレイグラウンド</strong>
        <button
          onClick={run}
          style={{ padding: '0.4rem 1.2rem', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
        >
          ▶ Run
        </button>
      </div>

      <div style={{ padding: '0.75rem' }}>
        <GraphEditor
          graph={graph}
          onChange={(g) => { setGraph(g); setSteps([]); }}
          startNode={startNode}
          onStartChange={(n) => { setStartNode(n); setSteps([]); }}
          showWeight={showWeight}
          samples={samples}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0 0.75rem 0.75rem' }}>
        <div>
          <GraphView graph={graph} step={steps[currentIndex]} />
        </div>
        <div>
          <Stepper
            steps={steps}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            algoId={algoId}
            onIndexChange={handleIndexChange}
            onPlayingChange={handlePlayingChange}
          />
        </div>
      </div>
    </div>
  );
}
