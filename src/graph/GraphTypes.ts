export interface Edge { from: number; to: number; weight?: number; }
export interface Graph { n: number; directed: boolean; edges: Edge[]; }

export interface StepState {
  highlightNodes: number[];
  highlightEdges: { from: number; to: number }[];
  visited: boolean[];
  dist?: (number | null)[];
  parent?: (number | null)[];
  message: string;
  aux?: Record<string, unknown>;
}
