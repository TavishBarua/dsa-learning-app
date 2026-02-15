'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type TreeNode = {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export default function BinaryTreeTraversalPage() {
  // Sample tree structure:      1
  //                            /   \
  //                           2     3
  //                          / \   / \
  //                         4   5 6   7
  const [tree] = useState<TreeNode>({
    value: 1,
    left: {
      value: 2,
      left: { value: 4, left: null, right: null },
      right: { value: 5, left: null, right: null }
    },
    right: {
      value: 3,
      left: { value: 6, left: null, right: null },
      right: { value: 7, left: null, right: null }
    }
  });

  const [mode, setMode] = useState<'BFS' | 'DFS'>('BFS');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [visited, setVisited] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [stack, setStack] = useState<number[]>([]);
  const [explanation, setExplanation] = useState('Click "Start" to begin visualization');
  const [currentLine, setCurrentLine] = useState(0);

  // BFS Code lines (Java)
  const bfsCodeLines = [
    { line: 1, code: 'public List<Integer> BFS(TreeNode root) {', indent: 0 },
    { line: 2, code: 'Queue<TreeNode> queue = new LinkedList<>();', indent: 1 },
    { line: 3, code: 'List<Integer> result = new ArrayList<>();', indent: 1 },
    { line: 4, code: 'queue.offer(root);', indent: 1 },
    { line: 5, code: 'while (!queue.isEmpty()) {', indent: 1 },
    { line: 6, code: 'TreeNode node = queue.poll();', indent: 2 },
    { line: 7, code: 'result.add(node.val);', indent: 2 },
    { line: 8, code: '', indent: 0 },
    { line: 9, code: 'if (node.left != null) queue.offer(node.left);', indent: 2 },
    { line: 10, code: 'if (node.right != null) queue.offer(node.right);', indent: 2 },
    { line: 11, code: '}', indent: 1 },
    { line: 12, code: 'return result;', indent: 1 },
    { line: 13, code: '}', indent: 0 },
  ];

  // DFS Code lines (Pre-order, Java)
  const dfsCodeLines = [
    { line: 1, code: 'public List<Integer> DFS(TreeNode root) {', indent: 0 },
    { line: 2, code: 'Stack<TreeNode> stack = new Stack<>();', indent: 1 },
    { line: 3, code: 'List<Integer> result = new ArrayList<>();', indent: 1 },
    { line: 4, code: 'stack.push(root);', indent: 1 },
    { line: 5, code: 'while (!stack.isEmpty()) {', indent: 1 },
    { line: 6, code: 'TreeNode node = stack.pop();', indent: 2 },
    { line: 7, code: 'result.add(node.val);', indent: 2 },
    { line: 8, code: '', indent: 0 },
    { line: 9, code: 'if (node.right != null) stack.push(node.right);', indent: 2 },
    { line: 10, code: 'if (node.left != null) stack.push(node.left);', indent: 2 },
    { line: 11, code: '}', indent: 1 },
    { line: 12, code: 'return result;', indent: 1 },
    { line: 13, code: '}', indent: 0 },
  ];

  const codeLines = mode === 'BFS' ? bfsCodeLines : dfsCodeLines;

  // Get all nodes as flat array for easy lookup
  const flatTree = [1, 2, 3, 4, 5, 6, 7];

  const getNodePosition = (value: number) => {
    const positions: { [key: number]: { x: number; y: number } } = {
      1: { x: 200, y: 40 },
      2: { x: 100, y: 120 },
      3: { x: 300, y: 120 },
      4: { x: 50, y: 200 },
      5: { x: 150, y: 200 },
      6: { x: 250, y: 200 },
      7: { x: 350, y: 200 },
    };
    return positions[value];
  };

  const reset = () => {
    setVisited([]);
    setCurrentNode(null);
    setQueue([]);
    setStack([]);
    setIsPlaying(false);
    setExplanation('Click "Start" to begin visualization');
    setCurrentLine(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const actualSpeed = speed / speedMultiplier;
    const interval = setInterval(() => {
      if (mode === 'BFS') {
        // BFS Logic
        setCurrentLine(5);
        if (queue.length === 0 && visited.length === 0) {
          // Initialize
          setCurrentLine(2);
          setTimeout(() => {
            setQueue([1]);
            setExplanation('Line 2: Initialize queue with root node (1)');
          }, actualSpeed / 3);
          return;
        }

        if (queue.length === 0) {
          setIsPlaying(false);
          setCurrentLine(12);
          setExplanation('✅ BFS Complete! Visited all nodes level by level.');
          return;
        }

        const nextNode = queue[0];
        setCurrentLine(6);
        setCurrentNode(nextNode);
        setExplanation(`Line 6: Dequeue node ${nextNode} from front`);

        setTimeout(() => {
          setCurrentLine(7);
          setVisited(prev => [...prev, nextNode]);
          setQueue(prev => prev.slice(1));
          setExplanation(`Line 7: Visit node ${nextNode}`);

          setTimeout(() => {
            // Add children to queue
            const children: number[] = [];
            if (nextNode === 1) children.push(2, 3);
            else if (nextNode === 2) children.push(4, 5);
            else if (nextNode === 3) children.push(6, 7);

            if (children.length > 0) {
              setCurrentLine(9);
              setQueue(prev => [...prev, ...children]);
              setExplanation(`Lines 9-10: Add children ${children.join(', ')} to queue`);
            }
          }, actualSpeed / 3);
        }, actualSpeed / 3);

      } else {
        // DFS Logic
        setCurrentLine(5);
        if (stack.length === 0 && visited.length === 0) {
          // Initialize
          setCurrentLine(2);
          setTimeout(() => {
            setStack([1]);
            setExplanation('Line 2: Initialize stack with root node (1)');
          }, actualSpeed / 3);
          return;
        }

        if (stack.length === 0) {
          setIsPlaying(false);
          setCurrentLine(12);
          setExplanation('✅ DFS Complete! Visited all nodes depth-first.');
          return;
        }

        const nextNode = stack[stack.length - 1];
        setCurrentLine(6);
        setCurrentNode(nextNode);
        setExplanation(`Line 6: Pop node ${nextNode} from stack`);

        setTimeout(() => {
          setCurrentLine(7);
          setVisited(prev => [...prev, nextNode]);
          setStack(prev => prev.slice(0, -1));
          setExplanation(`Line 7: Visit node ${nextNode}`);

          setTimeout(() => {
            // Add children to stack (right first for pre-order)
            const children: number[] = [];
            if (nextNode === 1) children.push(3, 2); // Right first!
            else if (nextNode === 2) children.push(5, 4);
            else if (nextNode === 3) children.push(7, 6);

            if (children.length > 0) {
              setCurrentLine(9);
              setStack(prev => [...prev, ...children]);
              setExplanation(`Lines 9-10: Push children ${children.reverse().join(', ')} to stack (right first!)`);
            }
          }, actualSpeed / 3);
        }, actualSpeed / 3);
      }
    }, actualSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, queue, stack, visited, mode, speed, speedMultiplier]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-green-600 hover:text-green-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🌳 Binary Tree Traversal (BFS/DFS)</h1>
              <p className="text-sm text-gray-600">Explore trees level by level or depth first</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ELI5 Section */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-green-800 space-y-4">
            <p className="text-lg">
              <strong>🏢 Real-Life Example: Exploring an Office Building</strong>
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-bold text-blue-900 mb-2">🌊 BFS (Breadth-First Search) = Floor by Floor</p>
              <p>You&apos;re searching for someone in a building. BFS means you check EVERY room on Floor 1 first, then EVERY room on Floor 2, then Floor 3, and so on.</p>
              <p className="mt-2 text-sm"><strong>Uses a Queue (Line):</strong> &ldquo;First come, first served&rdquo; - like waiting in line at a store!</p>
              <p className="mt-2 text-sm italic">Perfect for finding the SHORTEST path or CLOSEST nodes!</p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="font-bold text-purple-900 mb-2">🏔️ DFS (Depth-First Search) = One Path All the Way Down</p>
              <p>You pick one hallway and explore it COMPLETELY to the end (all rooms, all sub-hallways) before coming back to try another hallway.</p>
              <p className="mt-2 text-sm"><strong>Uses a Stack (Pile):</strong> &ldquo;Last in, first out&rdquo; - like a stack of plates!</p>
              <p className="mt-2 text-sm italic">Perfect for exploring ALL possibilities or backtracking problems!</p>
            </div>

            <p className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
              <strong>💡 Key Difference:</strong> BFS explores neighbors first (wide), DFS explores children first (deep)!
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-xl shadow-xl p-4 mb-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setMode('BFS'); reset(); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === 'BFS'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🌊 BFS (Level Order)
            </button>
            <button
              onClick={() => { setMode('DFS'); reset(); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === 'DFS'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🏔️ DFS (Depth First)
            </button>
          </div>
        </div>

        {/* Main Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Code Execution Panel */}
          <div className="bg-gray-900 rounded-xl shadow-xl p-4 text-white font-mono text-base">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">🔍 Code Debugger</h3>
              <div className="flex gap-2 text-xs">
                <span className={`px-3 py-1 rounded-lg font-bold ${
                  mode === 'BFS' ? 'bg-blue-400 text-black' : 'bg-purple-400 text-black'
                }`}>
                  {mode} MODE
                </span>
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

            {/* Data Structure State */}
            <div className="mt-4 pt-3 border-t-2 border-yellow-500">
              <h4 className="text-base font-bold mb-3 text-yellow-400">📊 {mode === 'BFS' ? 'Queue' : 'Stack'}:</h4>
              <div className="bg-blue-900 border-2 border-blue-500 p-3 rounded-lg mb-3">
                <span className="text-blue-300 font-bold">{mode === 'BFS' ? 'queue' : 'stack'}:</span>
                <span className="text-blue-100 font-black ml-2 text-xl">
                  [{(mode === 'BFS' ? queue : stack).join(', ')}]
                </span>
              </div>
              <div className="bg-green-900 border-2 border-green-500 p-3 rounded-lg">
                <span className="text-green-300 font-bold">visited:</span>
                <span className="text-green-100 font-black ml-2 text-xl">
                  [{visited.join(', ')}]
                </span>
              </div>
            </div>
          </div>

          {/* Tree Visualization Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-6 border-4 border-gray-300">
            <h3 className="text-xl font-black text-gray-900 mb-4">🎯 Tree Visualization</h3>

            <div className="relative h-64 mb-6">
              <svg className="w-full h-full">
                {/* Draw edges */}
                <line x1="200" y1="50" x2="100" y2="130" stroke="#cbd5e0" strokeWidth="3" />
                <line x1="200" y1="50" x2="300" y2="130" stroke="#cbd5e0" strokeWidth="3" />
                <line x1="100" y1="130" x2="50" y2="210" stroke="#cbd5e0" strokeWidth="3" />
                <line x1="100" y1="130" x2="150" y2="210" stroke="#cbd5e0" strokeWidth="3" />
                <line x1="300" y1="130" x2="250" y2="210" stroke="#cbd5e0" strokeWidth="3" />
                <line x1="300" y1="130" x2="350" y2="210" stroke="#cbd5e0" strokeWidth="3" />

                {/* Draw nodes */}
                {flatTree.map(value => {
                  const pos = getNodePosition(value);
                  const isVisited = visited.includes(value);
                  const isCurrent = currentNode === value;
                  const isInQueue = queue.includes(value) || stack.includes(value);

                  return (
                    <g key={value}>
                      <motion.circle
                        cx={pos.x}
                        cy={pos.y}
                        r="20"
                        animate={{
                          scale: isCurrent ? 1.3 : 1,
                          fill: isCurrent
                            ? '#fbbf24'
                            : isVisited
                            ? '#10b981'
                            : isInQueue
                            ? mode === 'BFS' ? '#3b82f6' : '#a855f7'
                            : '#e5e7eb'
                        }}
                        className="transition-all"
                        stroke={isCurrent ? '#f59e0b' : isVisited ? '#059669' : '#9ca3af'}
                        strokeWidth="3"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 5}
                        textAnchor="middle"
                        className="text-lg font-bold"
                        fill={isVisited || isCurrent ? 'white' : '#374151'}
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mb-4 text-sm font-bold flex-wrap">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border-2 border-gray-400">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-500 rounded-full"></div>
                <span className="text-gray-900">Unvisited</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg border-2 border-blue-400">
                <div className={`w-4 h-4 border-2 rounded-full ${
                  mode === 'BFS' ? 'bg-blue-500 border-blue-700' : 'bg-purple-500 border-purple-700'
                }`}></div>
                <span className={mode === 'BFS' ? 'text-blue-900' : 'text-purple-900'}>
                  In {mode === 'BFS' ? 'Queue' : 'Stack'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg border-2 border-yellow-400">
                <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
                <span className="text-yellow-900">Current</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-400">
                <div className="w-4 h-4 bg-green-500 border-2 border-green-700 rounded-full"></div>
                <span className="text-green-900">Visited</span>
              </div>
            </div>

            {/* Explanation */}
            <div className={`border-4 rounded-lg p-4 ${
              mode === 'BFS' ? 'bg-blue-100 border-blue-400' : 'bg-purple-100 border-purple-400'
            }`}>
              <p className={`text-base font-bold ${
                mode === 'BFS' ? 'text-blue-900' : 'text-purple-900'
              }`}>{explanation}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Speed Slider */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-blue-900">⚡ Speed Control:</label>
                <span className="text-blue-900 font-bold">{speedMultiplier.toFixed(1)}x ({(speed / speedMultiplier / 1000).toFixed(1)}s per step)</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2"
                step="0.1"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((speedMultiplier - 0.3) / 1.7) * 100}%, #dbeafe ${((speedMultiplier - 0.3) / 1.7) * 100}%, #dbeafe 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-blue-700 mt-1">
                <span>🐌 0.3x (Very Slow)</span>
                <span>1.0x (Normal)</span>
                <span>🚀 2.0x (Fast)</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Start Auto'}
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

        {/* Visited History */}
        {visited.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📜 Traversal Order</h3>
            <div className="flex gap-2 flex-wrap">
              {visited.map((node, idx) => (
                <div key={idx} className={`px-4 py-2 rounded-lg font-bold text-white ${
                  mode === 'BFS' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {node}
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              {mode === 'BFS' ? '🌊 BFS Order: 1 → 2 → 3 → 4 → 5 → 6 → 7' : '🏔️ DFS Order: 1 → 2 → 4 → 5 → 3 → 6 → 7'}
            </p>
          </div>
        )}

        {/* Java Code Snippets */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-400">🌊 BFS (Java)</h3>
              <span className="text-xs text-gray-400 font-mono">Queue-based</span>
            </div>
            <pre className="text-green-400 font-mono text-xs overflow-x-auto">
              <code>{`public List<Integer> BFS(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    List<Integer> result = new ArrayList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        result.add(node.val);

        if (node.left != null)
            queue.offer(node.left);
        if (node.right != null)
            queue.offer(node.right);
    }
    return result;
}

// Time: O(n), Space: O(w)`}</code>
            </pre>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-400">🏔️ DFS (Java)</h3>
              <span className="text-xs text-gray-400 font-mono">Stack-based</span>
            </div>
            <pre className="text-green-400 font-mono text-xs overflow-x-auto">
              <code>{`public List<Integer> DFS(TreeNode root) {
    Stack<TreeNode> stack = new Stack<>();
    List<Integer> result = new ArrayList<>();
    stack.push(root);

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.add(node.val);

        if (node.right != null)
            stack.push(node.right);
        if (node.left != null)
            stack.push(node.left);
    }
    return result;
}

// Time: O(n), Space: O(h)`}</code>
            </pre>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">🎯 When to Use BFS vs DFS?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 text-emerald-800">
              <h4 className="font-bold text-lg">🌊 BFS (Breadth-First):</h4>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div><strong>Use When:</strong> Finding shortest path, level-order traversal, closest nodes</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div><strong>Problems:</strong> Binary Tree Level Order, Minimum Depth, Zigzag Level Order</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div><strong>Space:</strong> O(w) where w is max width of tree</div>
              </div>
            </div>
            <div className="space-y-3 text-purple-800">
              <h4 className="font-bold text-lg">🏔️ DFS (Depth-First):</h4>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div><strong>Use When:</strong> Path finding, exploring all possibilities, backtracking</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div><strong>Problems:</strong> Path Sum, Maximum Depth, Validate BST, Inorder Traversal</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div><strong>Space:</strong> O(h) where h is height of tree (usually better!)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
