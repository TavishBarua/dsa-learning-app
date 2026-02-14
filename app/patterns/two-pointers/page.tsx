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
  const [speed, setSpeed] = useState(3000); // Default to slower speed
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.3x to 2x
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
    const actualSpeed = speed / speedMultiplier; // Apply speed multiplier
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
              }, actualSpeed / 4);
            }
          }, actualSpeed / 4);
        }, actualSpeed / 4);
      }, actualSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, leftPointer, rightPointer, found, array, target, speed, speedMultiplier]);

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
          <div className="bg-gray-900 rounded-xl shadow-xl p-4 text-white font-mono text-base">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">🔍 Code Debugger</h3>
              <div className="flex gap-2 text-xs">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold">→ EXECUTING</span>
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
                <div className="bg-green-900 border-2 border-green-500 p-3 rounded-lg">
                  <span className="text-green-300 font-bold">left:</span>
                  <span className="text-green-100 font-black ml-2 text-xl">{leftPointer}</span>
                </div>
                <div className="bg-blue-900 border-2 border-blue-500 p-3 rounded-lg">
                  <span className="text-blue-300 font-bold">right:</span>
                  <span className="text-blue-100 font-black ml-2 text-xl">{rightPointer}</span>
                </div>
                <div className="bg-purple-900 border-2 border-purple-500 p-3 rounded-lg">
                  <span className="text-purple-300 font-bold">sum:</span>
                  <span className="text-purple-100 font-black ml-2 text-xl">{currentSum}</span>
                </div>
                <div className="bg-orange-900 border-2 border-orange-500 p-3 rounded-lg">
                  <span className="text-orange-300 font-bold">target:</span>
                  <span className="text-orange-100 font-black ml-2 text-xl">{target}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Array Visualization Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-6 border-4 border-gray-300">
            <h3 className="text-xl font-black text-gray-900 mb-4">🎯 Array Visualization</h3>

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
            <div className="flex justify-center gap-4 mb-6 text-sm font-bold">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg border-2 border-green-400">
                <div className="w-4 h-4 bg-green-500 border-2 border-green-700 rounded"></div>
                <span className="text-green-900">Left = {leftPointer} (arr[{leftPointer}] = {array[leftPointer]})</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg border-2 border-blue-400">
                <div className="w-4 h-4 bg-blue-500 border-2 border-blue-700 rounded"></div>
                <span className="text-blue-900">Right = {rightPointer} (arr[{rightPointer}] = {array[rightPointer]})</span>
              </div>
            </div>

            {/* Current Sum */}
            <div className="bg-purple-100 border-4 border-purple-400 rounded-lg p-5 mb-4">
              <div className="text-center">
                <p className="text-base text-purple-900 font-bold mb-2">Current Sum:</p>
                <p className="text-3xl font-bold text-purple-900">
                  {array[leftPointer]} + {array[rightPointer]} = {currentSum}
                </p>
                <p className="text-lg text-purple-900 font-bold mt-2">
                  Target: {target} {currentSum === target ? '✅ MATCH!' : currentSum < target ? '⬆️ Too Low' : '⬇️ Too High'}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-100 border-4 border-blue-400 rounded-lg p-4">
              <p className="text-base text-blue-900 font-bold">{explanation}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 justify-center">
                <label className="font-bold text-gray-900 text-lg">Target Sum:</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => {
                    setTarget(parseInt(e.target.value) || 0);
                    reset();
                  }}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 w-24 text-center font-bold text-lg"
                />
              </div>

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
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
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
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-base">
                  <span className="font-mono font-bold text-gray-900">
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
