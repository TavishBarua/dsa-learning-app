'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TwoPointersPage() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [target, setTarget] = useState(10);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(array.length - 1);
  const [currentSum, setCurrentSum] = useState(0);
  const [found, setFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [explanation, setExplanation] = useState('Click "Start" to begin visualization');
  const [attempts, setAttempts] = useState<{left: number, right: number, sum: number}[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [executionStep, setExecutionStep] = useState(0);

  // Code lines for visualization
  const codeLines = [
    { line: 1, code: 'function twoSum(arr, target) {', indent: 0 },
    { line: 2, code: 'let left = 0;', indent: 1 },
    { line: 3, code: 'let right = arr.length - 1;', indent: 1 },
    { line: 4, code: '', indent: 0 },
    { line: 5, code: 'while (left < right) {', indent: 1 },
    { line: 6, code: 'const sum = arr[left] + arr[right];', indent: 2 },
    { line: 7, code: '', indent: 0 },
    { line: 8, code: 'if (sum === target) {', indent: 2 },
    { line: 9, code: 'return [left, right]; // Found!', indent: 3 },
    { line: 10, code: '} else if (sum < target) {', indent: 2 },
    { line: 11, code: 'left++; // Need larger sum', indent: 3 },
    { line: 12, code: '} else {', indent: 2 },
    { line: 13, code: 'right--; // Need smaller sum', indent: 3 },
    { line: 14, code: '}', indent: 2 },
    { line: 15, code: '}', indent: 1 },
    { line: 16, code: 'return null; // Not found', indent: 1 },
    { line: 17, code: '}', indent: 0 },
  ];

  // Calculate current sum
  useEffect(() => {
    const sum = array[leftPointer] + array[rightPointer];
    setCurrentSum(sum);
    if (sum === target && executionStep > 0) {
      setFound(true);
      setExplanation(`🎉 FOUND! arr[${leftPointer}] + arr[${rightPointer}] = ${array[leftPointer]} + ${array[rightPointer]} = ${target}`);
    }
  }, [leftPointer, rightPointer, array, target, executionStep]);

  // Auto-play animation with code execution tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !found) {
      interval = setInterval(() => {
        setExecutionStep(prev => prev + 1);

        if (leftPointer >= rightPointer) {
          setIsPlaying(false);
          setExplanation('❌ Pointers met - No pair found');
          setCurrentLine(16);
          return;
        }

        const sum = array[leftPointer] + array[rightPointer];

        // Line 5: while condition check
        setCurrentLine(5);
        setTimeout(() => {
          // Line 6: calculate sum
          setCurrentLine(6);
          setAttempts(prev => [...prev, {left: leftPointer, right: rightPointer, sum}]);

          setTimeout(() => {
            // Line 8-14: if-else logic
            if (sum === target) {
              setCurrentLine(8);
              setTimeout(() => {
                setCurrentLine(9);
                setFound(true);
                setIsPlaying(false);
              }, speed / 4);
            } else if (sum < target) {
              setCurrentLine(10);
              setTimeout(() => {
                setCurrentLine(11);
                setExplanation(`Line 11: sum=${sum} < target=${target}. Incrementing left pointer (${leftPointer} → ${leftPointer + 1})`);
                setLeftPointer(prev => prev + 1);
              }, speed / 4);
            } else {
              setCurrentLine(12);
              setTimeout(() => {
                setCurrentLine(13);
                setExplanation(`Line 13: sum=${sum} > target=${target}. Decrementing right pointer (${rightPointer} → ${rightPointer - 1})`);
                setRightPointer(prev => prev - 1);
              }, speed / 4);
            }
          }, speed / 4);
        }, speed / 4);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, leftPointer, rightPointer, found, array, target, speed]);

  const reset = () => {
    setLeftPointer(0);
    setRightPointer(array.length - 1);
    setFound(false);
    setIsPlaying(false);
    setExplanation('Click "Start" to begin visualization');
    setAttempts([]);
    setCurrentLine(0);
    setExecutionStep(0);
  };

  const stepForward = () => {
    if (found || leftPointer >= rightPointer) return;

    const sum = array[leftPointer] + array[rightPointer];
    setAttempts(prev => [...prev, {left: leftPointer, right: rightPointer, sum}]);

    if (sum === target) {
      setFound(true);
      setCurrentLine(9);
    } else if (sum < target) {
      setCurrentLine(11);
      setExplanation(`sum=${sum} < target=${target}. Moving left pointer →`);
      setLeftPointer(prev => prev + 1);
    } else {
      setCurrentLine(13);
      setExplanation(`sum=${sum} > target=${target}. Moving right pointer ←`);
      setRightPointer(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">👈👉 Two Pointers Pattern</h1>
              <p className="text-sm text-gray-600">Move smartly from both ends</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ELI5 Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-blue-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine you and a friend standing at opposite ends of a line of numbers...</strong>
            </p>
            <p>
              You both walk toward each other. At each step, you check if your numbers add up to what you want. If the sum is too small, the friend on the left moves right (to bigger numbers). If too big, the friend on the right moves left (to smaller numbers).
            </p>
            <p>
              <strong>Why does this work?</strong> Because the array is sorted! You intelligently skip unnecessary checks by moving the right pointer.
            </p>
          </div>
        </div>

        {/* Main Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Code Execution Panel */}
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 text-white font-mono text-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">🔍 Code Execution Debugger</h3>
              <div className="flex gap-2 text-xs">
                <span className="bg-yellow-500 text-black px-2 py-1 rounded">→ Executing</span>
              </div>
            </div>

            <div className="space-y-1">
              {codeLines.map(({line, code, indent}) => (
                <div
                  key={line}
                  className={`px-3 py-1 rounded transition-all ${
                    currentLine === line
                      ? 'bg-yellow-500 text-black font-bold scale-105'
                      : 'hover:bg-gray-800'
                  }`}
                  style={{ paddingLeft: `${indent * 1.5 + 0.75}rem` }}
                >
                  <span className="text-gray-500 mr-3">{line}</span>
                  {code || <span className="text-gray-700">...</span>}
                </div>
              ))}
            </div>

            {/* Variable State */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-bold mb-2 text-yellow-400">📊 Variables State:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">left:</span>
                  <span className="text-green-400 font-bold ml-2">{leftPointer}</span>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">right:</span>
                  <span className="text-blue-400 font-bold ml-2">{rightPointer}</span>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">sum:</span>
                  <span className="text-purple-400 font-bold ml-2">{currentSum}</span>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">target:</span>
                  <span className="text-orange-400 font-bold ml-2">{target}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Array Visualization Panel */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Array Visualization</h3>

            <div className="flex items-center justify-center gap-2 mb-6">
              {array.map((num, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    scale: idx === leftPointer || idx === rightPointer ? 1.2 : 1,
                    y: idx === leftPointer || idx === rightPointer ? -10 : 0
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg border-2 ${
                    idx === leftPointer && idx === rightPointer
                      ? 'bg-purple-400 border-purple-600 text-white'
                      : idx === leftPointer
                      ? 'bg-green-400 border-green-600 text-white'
                      : idx === rightPointer
                      ? 'bg-blue-400 border-blue-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                >
                  {num}
                </motion.div>
              ))}
            </div>

            {/* Pointer Labels */}
            <div className="flex justify-center gap-4 mb-6 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 border-2 border-green-600 rounded"></div>
                <span>Left = {leftPointer} (arr[{leftPointer}] = {array[leftPointer]})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 border-2 border-blue-600 rounded"></div>
                <span>Right = {rightPointer} (arr[{rightPointer}] = {array[rightPointer]})</span>
              </div>
            </div>

            {/* Current Sum */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-purple-600 mb-1">Current Sum:</p>
                <p className="text-2xl font-bold text-purple-900">
                  {array[leftPointer]} + {array[rightPointer]} = {currentSum}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Target: {target} {currentSum === target ? '✅' : currentSum < target ? '⬆️ Too Low' : '⬇️ Too High'}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900 font-semibold">{explanation}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 justify-center flex-wrap">
              <label className="font-semibold">Target Sum:</label>
              <input
                type="number"
                value={target}
                onChange={(e) => {
                  setTarget(parseInt(e.target.value) || 0);
                  reset();
                }}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 w-24 text-center font-bold"
              />

              <label className="font-semibold ml-4">Speed:</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="border-2 border-gray-300 rounded-lg px-4 py-2"
              >
                <option value={2000}>Slow</option>
                <option value={1000}>Normal</option>
                <option value={500}>Fast</option>
              </select>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={found}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Start Auto'}
              </button>

              <button
                onClick={stepForward}
                disabled={found || isPlaying}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                ⏭️ Step Forward
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

        {/* Attempt History */}
        {attempts.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📜 Execution History</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attempts.map((attempt, idx) => (
                <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                  <span className="font-mono">
                    Step {idx + 1}: arr[{attempt.left}] + arr[{attempt.right}] = {array[attempt.left]} + {array[attempt.right]} = {attempt.sum}
                    {attempt.sum === target ? ' ✅ FOUND!' : attempt.sum < target ? ' ⬆️ Too Low' : ' ⬇️ Too High'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* When to Use */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">🎯 When to Use Two Pointers?</h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div><strong>Keywords:</strong> &ldquo;sorted array&rdquo;, &ldquo;pair&rdquo;, &ldquo;opposite ends&rdquo;</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div><strong>Problems:</strong> Two Sum (sorted), Container With Most Water, Trapping Rain Water</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div><strong>Pro Tip:</strong> Reduces O(n²) brute force to O(n) by eliminating redundant checks!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
