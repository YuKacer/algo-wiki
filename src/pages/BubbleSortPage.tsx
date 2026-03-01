import { useState } from 'react';
import { Player } from '../viz/Player';
import { ArrayBars } from '../viz/ArrayBars';
import { bubbleSortFrames } from '../algorithms/bubbleSort';

const DEFAULT_INPUT = [64, 34, 25, 12, 22, 11, 90];

const PSEUDO_CODE = [
  { line: 0, code: 'procedure bubbleSort(arr)' },
  { line: 1, code: '  for i = 0 to n-2:' },
  { line: 2, code: '    for j = 0 to n-2-i:' },
  { line: 3, code: '      if arr[j] > arr[j+1]: swap(arr[j], arr[j+1])' },
  { line: 4, code: '  // パス完了' },
  { line: 5, code: 'end procedure' },
];

export function BubbleSortPage() {
  const [inputText, setInputText] = useState(DEFAULT_INPUT.join(', '));
  const [inputArray, setInputArray] = useState<number[]>(DEFAULT_INPUT);
  const [inputError, setInputError] = useState('');
  const [frames, setFrames] = useState(() => bubbleSortFrames(DEFAULT_INPUT));
  const [activeCodeLine, setActiveCodeLine] = useState<number | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleApply = () => {
    const parsed = inputText
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0 && n <= 999);

    if (parsed.length < 2 || parsed.length > 20) {
      setInputError('2〜20個の正の整数をカンマ区切りで入力してください');
      return;
    }
    setInputError('');
    setInputArray(parsed);
    setFrames(bubbleSortFrames(parsed));
  };

  return (
    <div style={pageStyles.root}>
      <div style={pageStyles.header}>
        <h1 style={pageStyles.title}>バブルソート</h1>
        <p style={pageStyles.subtitle}>隣接する要素を繰り返し比較・交換して整列するソートアルゴリズム</p>
        <div style={pageStyles.meta}>
          <span style={pageStyles.metaBadge}>時間計算量: O(n²)</span>
          <span style={pageStyles.metaBadge}>空間計算量: O(1)</span>
          <span style={pageStyles.metaBadge}>安定ソート</span>
        </div>
      </div>

      {/* 入力配列 */}
      <div style={pageStyles.inputSection}>
        <label style={pageStyles.label}>配列を入力（カンマ区切り、2〜20個、1〜999）</label>
        <div style={pageStyles.inputRow}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            style={pageStyles.input}
            placeholder="例: 64, 34, 25, 12, 22"
          />
          <button onClick={handleApply} style={pageStyles.applyBtn}>
            適用
          </button>
        </div>
        {inputError && <p style={pageStyles.error}>{inputError}</p>}
        <p style={pageStyles.hint}>入力: [{inputArray.join(', ')}]</p>
      </div>

      {/* メインコンテンツ：疑似コード + 可視化 */}
      <div style={pageStyles.mainLayout} className="main-layout">
        {/* 左：疑似コード */}
        <div style={pageStyles.pseudoPane}>
          <h2 style={pageStyles.paneTitle}>疑似コード</h2>
          <pre style={pageStyles.codeBlock}>
            {PSEUDO_CODE.map(({ line, code }) => (
              <div
                key={line}
                style={{
                  ...pageStyles.codeLine,
                  ...(activeCodeLine === line ? pageStyles.codeLineActive : {}),
                }}
              >
                <span style={pageStyles.lineNum}>{line + 1}</span>
                {code}
              </div>
            ))}
          </pre>
          <div style={pageStyles.legend}>
            <span style={{ ...pageStyles.legendDot, background: '#4fcf70' }} /> 確定済み
            <span style={{ ...pageStyles.legendDot, background: '#f7944f', marginLeft: '1rem' }} /> 比較中
          </div>
        </div>

        {/* 右：可視化 */}
        <div style={pageStyles.vizPane}>
          <h2 style={pageStyles.paneTitle}>可視化</h2>
          <Player frames={frames}>
            {(frame) => {
              // 描画のたびにactiveCodeLineを同期（副作用はuseEffectが必要だがここは軽量化のため直接）
              if (frame.codeLine !== activeCodeLine) {
                setTimeout(() => setActiveCodeLine(frame.codeLine), 0);
              }
              return <ArrayBars frame={frame} />;
            }}
          </Player>
        </div>
      </div>

      {/* 解説 */}
      <div style={pageStyles.description}>
        <h2 style={pageStyles.sectionTitle}>アルゴリズムの説明</h2>
        <p>
          バブルソートは最もシンプルなソートアルゴリズムの一つです。
          配列の先頭から隣接する2要素を比較し、大きい方を右に移動させることを繰り返します。
          1回のパスで最大値が末尾に「浮かび上がる（バブル）」ことが名前の由来です。
        </p>
        <h3>動作の流れ</h3>
        <ol>
          <li>先頭から隣接する要素ペアを比較する</li>
          <li>左の要素が右より大きければ交換する</li>
          <li>配列の末尾まで繰り返す（1パス完了、最大値が末尾に確定）</li>
          <li>確定済み要素を除いて同じ処理を繰り返す</li>
        </ol>
        <h3>計算量</h3>
        <ul>
          <li><strong>最悪・平均</strong>: O(n²) — 完全逆順の場合</li>
          <li><strong>最良</strong>: O(n) — すでにソート済みの場合（最適化版）</li>
          <li><strong>空間</strong>: O(1) — 追加メモリ不要（インプレース）</li>
        </ul>
      </div>
    </div>
  );
}

const pageStyles: Record<string, React.CSSProperties> = {
  root: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#212529',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: '0 0 0.25rem',
    color: '#1a1a2e',
  },
  subtitle: {
    color: '#6c757d',
    margin: '0 0 0.75rem',
    fontSize: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  metaBadge: {
    background: '#e8f0fe',
    color: '#3a7bd5',
    borderRadius: '99px',
    padding: '0.2rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  inputSection: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '0.95rem',
    fontFamily: 'monospace',
  },
  applyBtn: {
    padding: '0.5rem 1.25rem',
    background: '#4f8ef7',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  error: {
    color: '#dc3545',
    fontSize: '0.85rem',
    margin: '0.25rem 0 0',
  },
  hint: {
    color: '#6c757d',
    fontSize: '0.85rem',
    margin: '0.4rem 0 0',
    fontFamily: 'monospace',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 1fr) minmax(300px, 2fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
    alignItems: 'start',
  },
  pseudoPane: {
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1rem',
  },
  vizPane: {
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1rem',
  },
  paneTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: '0 0 0.75rem',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  codeBlock: {
    margin: 0,
    fontSize: '0.82rem',
    lineHeight: 1.7,
    background: 'transparent',
    overflow: 'auto',
  },
  codeLine: {
    display: 'block',
    padding: '0.1rem 0.5rem',
    borderRadius: '4px',
    fontFamily: "'Cascadia Code', 'Fira Code', monospace",
    whiteSpace: 'pre',
    transition: 'background 0.2s',
  },
  codeLineActive: {
    background: '#fff3cd',
    fontWeight: 600,
  },
  lineNum: {
    display: 'inline-block',
    width: '1.5rem',
    color: '#adb5bd',
    userSelect: 'none',
    marginRight: '0.5rem',
    fontSize: '0.75rem',
    textAlign: 'right',
  },
  legend: {
    marginTop: '1rem',
    fontSize: '0.8rem',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  legendDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '2px',
    marginRight: '4px',
    verticalAlign: 'middle',
  },
  description: {
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1.5rem',
    lineHeight: 1.7,
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginTop: 0,
    marginBottom: '0.75rem',
  },
};
