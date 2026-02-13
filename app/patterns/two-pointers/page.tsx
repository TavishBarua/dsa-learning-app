'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TwoPointersPage() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [target, setTarget] = useState(10);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(array.length - 1);
  const [currentSum, setCurrentSum] = useState(0);
  const [found, setFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [attempts, setAttempts] = useState<{left: number, right: number, sum: number}[]>([]);

  // Calculate current sum
  useEffect(() => {
    const sum = array[leftPointer] + array[rightPointer];
    setCurrentSum(sum);
    if (sum === target) {
      setFound(true);
      setExplanation(`🎉 FOUND IT! ${array[leftPointer]} + ${array[rightPointer]} = ${target}`);
    }
  }, [leftPointer, rightPointer, array, target]);

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !found) {
      interval = setInterval(() => {
        if (leftPointer >= rightPointer) {
          setIsPlaying(false);
          setExplanation('❌ No pair found that sums to target');
          return;
        }

        const sum = array[leftPointer] + array[rightPointer];
        setAttempts(prev => [...prev, {left: leftPointer, right: rightPointer, sum}]);

        if (sum === target) {
          setFound(true);
          setIsPlaying(false);
        } else if (sum < target) {
          setExplanation(`${sum} < ${target}. Too small! Move LEFT pointer right →`);
          setLeftPointer(prev => prev + 1);
        } else {
          setExplanation(`${sum} > ${target}. Too large! Move RIGHT pointer left ←`);
          setRightPointer(prev => prev - 1);
        }
        setStep(prev => prev + 1);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, leftPointer, rightPointer, array, target, found, speed]);

  const reset = () => {
    setLeftPointer(0);
    setRightPointer(array.length - 1);
    setFound(false);
    setStep(0);
    setIsPlaying(false);
    setAttempts([]);
    setExplanation('🎯 Start from both ends. Find two numbers that add up to the target!');
  };

  const stepForward = () => {
    if (leftPointer >= rightPointer || found) return;

    const sum = array[leftPointer] + array[rightPointer];
    setAttempts(prev => [...prev, {left: leftPointer, right: rightPointer, sum}]);

    if (sum === target) {
      setFound(true);
    } else if (sum < target) {
      setExplanation(`${sum} < ${target}. Too small! Move LEFT pointer right →`);
      setLeftPointer(prev => prev + 1);
    } else {
      setExplanation(`${sum} > ${target}. Too large! Move RIGHT pointer left ←`);
      setRightPointer(prev => prev - 1);
    }
    setStep(prev => prev + 1);
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-pink-600 hover:text-pink-800">
              ← Back
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>👈👉</span>
                <span>Two Pointers Pattern</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Interactive Visualization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Explanation */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-pink-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I'm 5</span>
          </h2>
          <div className="text-pink-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine you're trying to find two kids in a line whose ages add up to exactly 10...</strong>
            </p>
            <p>
              You put one finger on the <strong>youngest kid (left)</strong> and another on the <strong>oldest kid (right)</strong>. If their ages add up to <strong>more than 10</strong>, move your right finger to a younger kid (←). If it's <strong>less than 10</strong>, move your left finger to an older kid (→). Keep going until you find the pair!
            </p>
            <p>
              <strong>Why is this smart?</strong> Instead of checking every possible pair (slow! 🐌), you smartly eliminate bad options and move closer to the answer (fast! 🚀).
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-pink-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Find pair of items that match a budget</li>
                <li>Remove duplicates from sorted list</li>
                <li>Check if a string is a palindrome</li>
                <li>Merge two sorted lists</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Problem: Find Two Numbers That Add to Target</h3>
            <p className="text-gray-600">Array (sorted): {JSON.stringify(array)} | Target: {target}</p>
          </div>

          {/* Array Visualization */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 justify-center">
            {array.map((num, index) => {
              const isLeft = index === leftPointer;
              const isRight = index === rightPointer;
              const isBetween = index > leftPointer && index < rightPointer;

              return (
                <motion.div
                  key={index}
                  layout
                  animate={{
                    scale: (isLeft || isRight) ? 1.2 : 1,
                    y: (isLeft || isRight) ? -12 : 0,
                  }}
                  className={`
                    relative w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold
                    transition-all duration-300
                    ${isLeft
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-4 ring-blue-300'
                      : isRight
                      ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg ring-4 ring-orange-300'
                      : isBetween
                      ? 'bg-gray-200 text-gray-500 border-2 border-dashed border-gray-400'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                    }
                  `}
                >
                  {num}
                  {isLeft && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-blue-600 whitespace-nowrap flex items-center gap-1"
                    >
                      <span>👈</span>
                      <span>LEFT</span>
                    </motion.div>
                  )}
                  {isRight && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-orange-600 whitespace-nowrap flex items-center gap-1"
                    >
                      <span>RIGHT</span>
                      <span>👉</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Current Calculation */}
          <div className="mt-16 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${leftPointer}-${rightPointer}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-xl p-6 ${
                  found
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400'
                    : 'bg-gradient-to-r from-blue-100 to-orange-100 border-4 border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600 mb-3">Current Attempt</div>
                  <div className="flex items-center justify-center gap-3 flex-wrap text-2xl md:text-3xl font-bold">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      {array[leftPointer]}
                    </div>
                    <span className="text-gray-600">+</span>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      {array[rightPointer]}
                    </div>
                    <span className="text-gray-600">=</span>
                    <div className={`w-20 h-16 md:w-24 md:h-20 rounded-xl flex items-center justify-center shadow-lg ${
                      found ? 'bg-green-500' : currentSum === target ? 'bg-green-500' : currentSum < target ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {currentSum}
                    </div>
                    {found && <span className="text-4xl">🎉</span>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-xs text-blue-600 font-semibold mb-1">Left Index</div>
              <div className="text-2xl font-bold text-blue-700">{leftPointer}</div>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
              <div className="text-xs text-orange-600 font-semibold mb-1">Right Index</div>
              <div className="text-2xl font-bold text-orange-700">{rightPointer}</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-600 font-semibold mb-1">Target</div>
              <div className="text-2xl font-bold text-purple-700">{target}</div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-600 font-semibold mb-1">Attempts</div>
              <div className="text-2xl font-bold text-gray-700">{step}</div>
            </div>
          </div>

          {/* Explanation Box */}
          <motion.div
            key={explanation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 rounded-lg p-4 mb-6 ${
              found
                ? 'bg-green-50 border-green-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <p className={`text-center font-medium text-lg ${
              found ? 'text-green-900' : 'text-amber-900'
            }`}>
              {explanation || '🎯 Click "Play" or "Next Step" to start!'}
            </p>
          </motion.div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={found || leftPointer >= rightPointer}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                onClick={stepForward}
                disabled={found || leftPointer >= rightPointer}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next Step ⏭
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                🔄 Reset
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Speed:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSpeed(1500)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 1500 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐌 Slow
                </button>
                <button
                  onClick={() => setSpeed(1000)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 1000 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🚶 Normal
                </button>
                <button
                  onClick={() => setSpeed(500)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 500 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🏃 Fast
                </button>
              </div>
            </div>

            {/* Target Control */}
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Change Target:</label>
              <input
                type="number"
                min="3"
                max="18"
                value={target}
                onChange={(e) => {
                  setTarget(parseInt(e.target.value) || 10);
                  reset();
                }}
                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Attempts History */}
        {attempts.length > 0 && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Attempt History</h3>
            <div className="space-y-2">
              {attempts.map((attempt, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">#{idx + 1}</span>
                  <span className="font-mono">{array[attempt.left]} + {array[attempt.right]} = {attempt.sum}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    attempt.sum === target ? 'bg-green-100 text-green-700' :
                    attempt.sum < target ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {attempt.sum === target ? '✓ Found!' : attempt.sum < target ? '↑ Too small' : '↓ Too large'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Template */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>💻</span>
              <span>Code Template</span>
            </h3>
            <span className="text-xs text-gray-400">Copy this pattern!</span>
          </div>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) {
      return [left, right]; // Found it!
    } else if (sum < target) {
      left++;  // Need bigger sum, move left →
    } else {
      right--; // Need smaller sum, move right ←
    }
  }

  return []; // No pair found
}

// Time: O(n) - Only one pass through array!
// Space: O(1) - No extra storage!
// NOTE: Array must be SORTED for this to work!`}
          </pre>
        </div>

        {/* When to Use */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Two Pointers?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Array is SORTED</strong> (or you can sort it first)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Looking for:</strong> pairs, triplets that meet a condition
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Need to:</strong> remove duplicates in-place, reverse, or check palindrome
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Can eliminate:</strong> Bad options by moving pointers smartly
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <strong>Remember:</strong> Fast/Slow variant (same direction) for linked lists!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
