'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Cell = {
  row: number;
  col: number;
  isLand: boolean;
  visited: boolean;
  islandNumber: number | null;
  isCurrent: boolean;
};

export default function GraphIslandsPage() {
  // 5x5 Grid: 1 = land, 0 = water
  const initialGrid = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1]
  ];

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [islandCount, setIslandCount] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [explanation, setExplanation] = useState('Click "Start" to begin island detection');
  const [currentLine, setCurrentLine] = useState(0);
  const [stack, setStack] = useState<string[]>([]);
  const [inDFS, setInDFS] = useState(false);

  // Code lines for visualization (Java)
  const codeLines = [
    { line: 1, code: 'public int numIslands(char[][] grid) {', indent: 0 },
    { line: 2, code: 'int count = 0;', indent: 1 },
    { line: 3, code: '', indent: 0 },
    { line: 4, code: 'for (int r = 0; r < grid.length; r++) {', indent: 1 },
    { line: 5, code: 'for (int c = 0; c < grid[0].length; c++) {', indent: 2 },
    { line: 6, code: 'if (grid[r][c] == \'1\') {', indent: 3 },
    { line: 7, code: 'count++; // Found new island!', indent: 4 },
    { line: 8, code: 'dfs(grid, r, c); // Mark all connected land', indent: 4 },
    { line: 9, code: '}', indent: 3 },
    { line: 10, code: '}', indent: 2 },
    { line: 11, code: '}', indent: 1 },
    { line: 12, code: 'return count;', indent: 1 },
    { line: 13, code: '}', indent: 0 },
    { line: 14, code: '', indent: 0 },
    { line: 15, code: 'void dfs(char[][] grid, int r, int c) {', indent: 0 },
    { line: 16, code: 'if (r < 0 || c < 0 || r >= grid.length ||', indent: 1 },
    { line: 17, code: 'c >= grid[0].length || grid[r][c] == \'0\') return;', indent: 1 },
    { line: 18, code: 'grid[r][c] = \'0\'; // Mark as visited', indent: 1 },
    { line: 19, code: 'dfs(grid, r+1, c); dfs(grid, r-1, c);', indent: 1 },
    { line: 20, code: 'dfs(grid, r, c+1); dfs(grid, r, c-1);', indent: 1 },
    { line: 21, code: '}', indent: 0 },
  ];

  // Initialize grid
  useEffect(() => {
    const newGrid = initialGrid.map((row, r) =>
      row.map((cell, c) => ({
        row: r,
        col: c,
        isLand: cell === 1,
        visited: false,
        islandNumber: null,
        isCurrent: false
      }))
    );
    setGrid(newGrid);
  }, []);

  const reset = () => {
    const newGrid = initialGrid.map((row, r) =>
      row.map((cell, c) => ({
        row: r,
        col: c,
        isLand: cell === 1,
        visited: false,
        islandNumber: null,
        isCurrent: false
      }))
    );
    setGrid(newGrid);
    setIslandCount(0);
    setCurrentRow(0);
    setCurrentCol(0);
    setIsPlaying(false);
    setExplanation('Click "Start" to begin island detection');
    setCurrentLine(0);
    setStack([]);
    setInDFS(false);
  };

  const markCellAsVisited = (r: number, c: number, islandNum: number) => {
    setGrid(prev => {
      const newGrid = [...prev];
      if (newGrid[r] && newGrid[r][c]) {
        newGrid[r][c] = { ...newGrid[r][c], visited: true, islandNumber: islandNum, isCurrent: false };
      }
      return newGrid;
    });
  };

  const setCellCurrent = (r: number, c: number, isCurrent: boolean) => {
    setGrid(prev => {
      const newGrid = [...prev];
      if (newGrid[r] && newGrid[r][c]) {
        newGrid[r][c] = { ...newGrid[r][c], isCurrent };
      }
      return newGrid;
    });
  };

  const dfsMarkIsland = async (r: number, c: number, islandNum: number) => {
    if (r < 0 || r >= 5 || c < 0 || c >= 5) return;
    if (!grid[r] || !grid[r][c]) return;
    if (!grid[r][c].isLand || grid[r][c].visited) return;

    setInDFS(true);
    setCurrentLine(17);
    setCellCurrent(r, c, true);
    setStack(prev => [...prev, `(${r},${c})`]);
    setExplanation(`DFS: Visiting cell (${r}, ${c})`);

    await new Promise(resolve => setTimeout(resolve, speed / speedMultiplier / 2));

    markCellAsVisited(r, c, islandNum);

    // Explore neighbors
    setCurrentLine(18);
    await dfsMarkIsland(r + 1, c, islandNum); // Down
    await dfsMarkIsland(r - 1, c, islandNum); // Up
    setCurrentLine(19);
    await dfsMarkIsland(r, c + 1, islandNum); // Right
    await dfsMarkIsland(r, c - 1, islandNum); // Left

    setStack(prev => prev.slice(0, -1));
    setInDFS(false);
  };

  useEffect(() => {
    if (!isPlaying || grid.length === 0) return;

    const runIslandDetection = async () => {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (isPlaying) {
            setCurrentRow(r);
            setCurrentCol(c);
            setCurrentLine(5);
            setCellCurrent(r, c, true);
            setExplanation(`Checking cell (${r}, ${c})`);

            await new Promise(resolve => setTimeout(resolve, speed / speedMultiplier / 3));

            if (!grid[r][c].isLand) {
              setExplanation(`Cell (${r}, ${c}) is water - skip`);
              setCellCurrent(r, c, false);
            } else if (grid[r][c].visited) {
              setExplanation(`Cell (${r}, ${c}) already visited - skip`);
              setCellCurrent(r, c, false);
            } else {
              setCurrentLine(7);
              const newIslandNum = islandCount + 1;
              setIslandCount(newIslandNum);
              setExplanation(`🏝️ Found new island #${newIslandNum}! Running DFS to mark all connected land...`);

              await new Promise(resolve => setTimeout(resolve, speed / speedMultiplier / 2));

              setCurrentLine(8);
              await dfsMarkIsland(r, c, newIslandNum);
            }
          }
        }
      }

      setIsPlaying(false);
      setCurrentLine(12);
      setExplanation(`✅ Complete! Found ${islandCount} islands total.`);
    };

    runIslandDetection();
  }, [isPlaying]);

  const getIslandColor = (islandNum: number | null) => {
    const colors = [
      'bg-emerald-400 border-emerald-600',
      'bg-blue-400 border-blue-600',
      'bg-purple-400 border-purple-600',
      'bg-pink-400 border-pink-600',
      'bg-yellow-400 border-yellow-600'
    ];
    return islandNum !== null ? colors[(islandNum - 1) % colors.length] : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-teal-600 hover:text-teal-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🏝️ Graph - Number of Islands (DFS)</h1>
              <p className="text-sm text-gray-600">Find all connected components using DFS</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ELI5 Section */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-teal-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-teal-800 space-y-4">
            <p className="text-lg">
              <strong>🏝️ Real-Life Example: Counting Islands from a Helicopter</strong>
            </p>
            <p>
              You&apos;re flying over an ocean looking down at a grid map. Green squares 🟩 are land, blue squares 🟦 are water. An island is made of land squares that TOUCH each other (up, down, left, right - NOT diagonal corners).
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-bold text-blue-900 mb-2">🔍 Step 1: Scan the Map</p>
              <p className="text-sm">Start at top-left, go row by row, checking every square like reading a book.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-bold text-green-900 mb-2">🏝️ Step 2: When You Find New Land</p>
              <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                <li><strong>Say &quot;Found island #1!&quot;</strong> and increment counter</li>
                <li><strong>Paint it:</strong> Use DFS to explore and mark ALL connected land</li>
                <li><strong>How DFS Works:</strong> From current land, explore up, down, left, right recursively until you hit water or already-painted land</li>
              </ol>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="font-bold text-purple-900 mb-2">🎨 Step 3: Keep Scanning</p>
              <p className="text-sm">Continue scanning the grid. Already-painted land won&apos;t trigger a new island count. Each NEW unpainted land = new island!</p>
            </div>

            <p className="bg-cyan-100 border-l-4 border-cyan-500 p-3 rounded">
              <strong>💡 Key Insight:</strong> DFS explores deeply like following a trail in a maze - go as far as you can in one direction before backtracking. This ensures you find ALL connected land pieces in one island before moving to the next!
            </p>

            <p className="text-sm font-bold">
              ⚡ <strong>Why DFS?</strong> It naturally explores all connected components (islands) by exhaustively following each path until hitting a boundary (water)!
            </p>
          </div>
        </div>

        {/* Main Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Code Execution Panel */}
          <div className="bg-gray-900 rounded-xl shadow-xl p-4 text-white font-mono text-base">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">🔍 Code Debugger</h3>
              <div className="flex gap-2 text-xs">
                <span className="bg-teal-400 text-black px-3 py-1 rounded-lg font-bold">ISLANDS: {islandCount}</span>
              </div>
            </div>

            <div className="space-y-0.5 max-h-96 overflow-y-auto">
              {codeLines.map(({line, code, indent}) => (
                <div
                  key={line}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    currentLine === line
                      ? 'bg-yellow-400 text-black font-black text-lg shadow-2xl border-l-8 border-yellow-600'
                      : 'text-white hover:bg-gray-800 text-base font-medium'
                  }`}
                  style={{ paddingLeft: `${indent * 1.5 + 0.75}rem` }}
                >
                  <span className={`mr-3 font-bold ${currentLine === line ? 'text-black text-lg' : 'text-gray-400'}`}>{line}</span>
                  {code || <span className="text-gray-600">...</span>}
                </div>
              ))}
            </div>

            {/* Variable State */}
            <div className="mt-4 pt-3 border-t-2 border-yellow-500">
              <h4 className="text-base font-bold mb-3 text-yellow-400">📊 Variables:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-emerald-900 border-2 border-emerald-500 p-3 rounded-lg col-span-2">
                  <span className="text-emerald-300 font-bold">Island Count:</span>
                  <span className="text-emerald-100 font-black ml-2 text-xl">{islandCount}</span>
                </div>
                <div className="bg-blue-900 border-2 border-blue-500 p-3 rounded-lg">
                  <span className="text-blue-300 font-bold">row (r):</span>
                  <span className="text-blue-100 font-black ml-2 text-xl">{currentRow}</span>
                </div>
                <div className="bg-purple-900 border-2 border-purple-500 p-3 rounded-lg">
                  <span className="text-purple-300 font-bold">col (c):</span>
                  <span className="text-purple-100 font-black ml-2 text-xl">{currentCol}</span>
                </div>
              </div>

              {/* DFS Stack */}
              {stack.length > 0 && (
                <div className="mt-3 bg-pink-900 border-2 border-pink-500 p-3 rounded-lg">
                  <span className="text-pink-300 font-bold">DFS Stack:</span>
                  <div className="text-pink-100 font-mono text-sm mt-2">
                    {stack.join(' → ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid Visualization Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-6 border-4 border-gray-300">
            <h3 className="text-xl font-black text-gray-900 mb-4">🗺️ Island Grid</h3>

            {/* Grid */}
            <div className="flex justify-center mb-6">
              <div className="inline-grid grid-cols-5 gap-2">
                {grid.map((row, r) =>
                  row.map((cell, c) => (
                    <motion.div
                      key={`${r}-${c}`}
                      animate={{
                        scale: cell.isCurrent ? 1.1 : 1,
                      }}
                      className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg border-4 transition-all ${
                        cell.isCurrent
                          ? 'bg-yellow-300 border-yellow-600 shadow-2xl'
                          : cell.visited
                          ? `${getIslandColor(cell.islandNumber)} text-white shadow-lg`
                          : cell.isLand
                          ? 'bg-green-200 border-green-400 text-green-900'
                          : 'bg-blue-200 border-blue-400 text-blue-900'
                      }`}
                    >
                      {cell.visited && cell.islandNumber !== null
                        ? cell.islandNumber
                        : cell.isLand
                        ? '🌱'
                        : '💧'}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-3 mb-4 text-sm font-bold flex-wrap">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-400">
                <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
                <span className="text-green-900">Land (Unvisited)</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg border-2 border-blue-400">
                <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500 rounded"></div>
                <span className="text-blue-900">Water</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg border-2 border-yellow-400">
                <div className="w-4 h-4 bg-yellow-300 border-2 border-yellow-600 rounded"></div>
                <span className="text-yellow-900">Current Cell</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 px-3 py-2 rounded-lg border-2 border-emerald-400">
                <div className="w-4 h-4 bg-emerald-400 border-2 border-emerald-600 rounded"></div>
                <span className="text-emerald-900">Island (Visited)</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-teal-100 border-4 border-teal-400 rounded-lg p-4">
              <p className="text-base text-teal-900 font-bold">{explanation}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Speed Slider */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-teal-900">⚡ Speed Control:</label>
                <span className="text-teal-900 font-bold">{speedMultiplier.toFixed(1)}x ({(speed / speedMultiplier / 1000).toFixed(1)}s per step)</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2"
                step="0.1"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((speedMultiplier - 0.3) / 1.7) * 100}%, #ccfbf1 ${((speedMultiplier - 0.3) / 1.7) * 100}%, #ccfbf1 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-teal-700 mt-1">
                <span>🐌 0.3x (Very Slow)</span>
                <span>1.0x (Normal)</span>
                <span>🚀 2.0x (Fast)</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsPlaying(true)}
                disabled={isPlaying}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isPlaying ? '⏳ Running...' : '▶️ Start Detection'}
              </button>

              <button
                onClick={reset}
                className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Java Code Snippet */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-yellow-400">☕ Complete Java Solution</h3>
            <span className="text-xs text-gray-400 font-mono">DFS + Graph Pattern</span>
          </div>
          <pre className="text-green-400 font-mono text-sm overflow-x-auto">
            <code>{`public int numIslands(char[][] grid) {
    int count = 0;

    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;  // Found new island!
                dfs(grid, r, c);  // Mark all connected land
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    // Base case: out of bounds or water
    if (r < 0 || c < 0 || r >= grid.length ||
        c >= grid[0].length || grid[r][c] == '0') {
        return;
    }

    grid[r][c] = '0';  // Mark as visited (sink the land)

    // Explore all 4 directions
    dfs(grid, r + 1, c);  // Down
    dfs(grid, r - 1, c);  // Up
    dfs(grid, r, c + 1);  // Right
    dfs(grid, r, c - 1);  // Left
}

// Time: O(rows × cols), Space: O(rows × cols) for recursion`}</code>
          </pre>
        </div>

        {/* Algorithm Explanation */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">🎯 How Does This Algorithm Work?</h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">1️⃣</div>
              <div><strong>Scan the entire grid</strong> row by row, cell by cell (nested for loops)</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">2️⃣</div>
              <div><strong>When you find unvisited land (char &apos;1&apos;):</strong> Increment island counter and start DFS</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">3️⃣</div>
              <div><strong>DFS marks all connected land:</strong> Recursively visit all 4 neighbors (up, down, left, right) until hitting water (&apos;0&apos;) or grid boundary</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">4️⃣</div>
              <div><strong>Mark visited land as water:</strong> Change &apos;1&apos; to &apos;0&apos; to avoid revisiting (clever trick!)</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">5️⃣</div>
              <div><strong>Continue scanning:</strong> Already-visited land (now &apos;0&apos;) won&apos;t trigger a new island count</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div><strong>Time:</strong> O(m × n) - visit each cell at most twice. <strong>Space:</strong> O(m × n) for recursion stack in worst case (entire grid is one island)</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div><strong>Classic LeetCode Problems:</strong> #200 Number of Islands, #695 Max Area of Island, #733 Flood Fill, #547 Number of Provinces</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
