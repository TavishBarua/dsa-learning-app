'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SlidingWindowPage() {
  const [array, setArray] = useState([3, 1, 4, 1, 5, 9, 2, 6]);
  const [windowSize, setWindowSize] = useState(3);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(2);
  const [currentSum, setCurrentSum] = useState(0);
  const [maxSum, setMaxSum] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Calculate current sum
  useEffect(() => {
    const sum = array.slice(leftPointer, rightPointer + 1).reduce((a, b) => a + b, 0);
    setCurrentSum(sum);
    if (sum > maxSum) {
      setMaxSum(sum);
    }
  }, [leftPointer, rightPointer, array, maxSum]);

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setRightPointer((prev) => {
          if (prev < array.length - 1) {
            setLeftPointer((l) => l + 1);
            setStep((s) => s + 1);
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, array.length]);

  // Update explanation based on step
  useEffect(() => {
    if (leftPointer === 0 && rightPointer === windowSize - 1) {
      setExplanation(`🚀 Start! We place our window on the first ${windowSize} numbers. Like looking through a window frame!`);
    } else if (rightPointer === array.length - 1) {
      setExplanation(`🎯 Done! We found the maximum sum: ${maxSum}. The window slid all the way across!`);
    } else {
      setExplanation(`📏 Slide! Remove left (${array[leftPointer - 1]}), add right (${array[rightPointer]}). Window keeps moving!`);
    }
  }, [leftPointer, rightPointer, windowSize, array, maxSum]);

  const reset = () => {
    setLeftPointer(0);
    setRightPointer(windowSize - 1);
    setMaxSum(0);
    setStep(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (rightPointer < array.length - 1) {
      setLeftPointer((prev) => prev + 1);
      setRightPointer((prev) => prev + 1);
      setStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (leftPointer > 0) {
      setLeftPointer((prev) => prev - 1);
      setRightPointer((prev) => prev - 1);
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              ← Back
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>🪟</span>
                <span>Sliding Window Pattern</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Interactive Visualization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-blue-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine you&apos;re looking at houses through a car window...</strong>
            </p>
            <p>
              You can see {windowSize} houses at a time through your window. Instead of stopping and counting houses again and again, you just <strong>slide your window</strong> forward—remove the house that goes out of view, add the new house that comes in!
            </p>
            <p>
              <strong>Why is this smart?</strong> Instead of counting {windowSize} houses every time (slow! 🐌), you just subtract one and add one (fast! 🚀).
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-blue-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Find the best N-day average stock price</li>
                <li>Maximum sales in any 7-day period</li>
                <li>Longest substring without repeating characters</li>
                <li>Minimum window to contain all required items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Problem: Find Maximum Sum of {windowSize} Consecutive Numbers</h3>
            <p className="text-gray-600">Array: {JSON.stringify(array)}</p>
          </div>

          {/* Array Visualization */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 justify-center">
            {array.map((num, index) => {
              const isInWindow = index >= leftPointer && index <= rightPointer;
              const isLeft = index === leftPointer;
              const isRight = index === rightPointer;

              return (
                <motion.div
                  key={index}
                  layout
                  animate={{
                    scale: isInWindow ? 1.1 : 1,
                    y: isInWindow ? -8 : 0,
                  }}
                  className={`
                    relative w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold
                    transition-all duration-300
                    ${isInWindow
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                    }
                  `}
                >
                  {num}
                  {isLeft && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-indigo-600 whitespace-nowrap">
                      ← Left
                    </div>
                  )}
                  {isRight && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                      Right →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Window Frame Visual */}
          <div className="mt-12 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={leftPointer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 border-4 border-indigo-400 rounded-xl p-6"
              >
                <div className="text-center">
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Current Window</div>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {array.slice(leftPointer, rightPointer + 1).map((num, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-indigo-600 shadow-md"
                      >
                        {num}
                      </motion.div>
                    ))}
                    <div className="text-2xl font-bold text-indigo-600">=</div>
                    <div className="w-16 h-12 md:w-20 md:h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {currentSum}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-xs text-green-600 font-semibold mb-1">Current Sum</div>
              <div className="text-2xl font-bold text-green-700">{currentSum}</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-600 font-semibold mb-1">Max Sum</div>
              <div className="text-2xl font-bold text-purple-700">{maxSum}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-xs text-blue-600 font-semibold mb-1">Window Size</div>
              <div className="text-2xl font-bold text-blue-700">{windowSize}</div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
              <div className="text-xs text-amber-600 font-semibold mb-1">Step</div>
              <div className="text-2xl font-bold text-amber-700">{step}</div>
            </div>
          </div>

          {/* Explanation Box */}
          <motion.div
            key={explanation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6"
          >
            <p className="text-amber-900 text-center font-medium">{explanation}</p>
          </motion.div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={stepBackward}
                disabled={leftPointer === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                ⏮ Back
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={rightPointer >= array.length - 1}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                onClick={stepForward}
                disabled={rightPointer >= array.length - 1}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next ⏭
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
                    speed === 1500 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐌 Slow
                </button>
                <button
                  onClick={() => setSpeed(1000)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 1000 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🚶 Normal
                </button>
                <button
                  onClick={() => setSpeed(500)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 500 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🏃 Fast
                </button>
              </div>
            </div>

            {/* Window Size Control */}
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Window Size:</label>
              <input
                type="range"
                min="2"
                max="5"
                value={windowSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  setWindowSize(newSize);
                  setRightPointer(newSize - 1);
                  setLeftPointer(0);
                  setMaxSum(0);
                  setStep(0);
                }}
                className="w-32"
              />
              <span className="text-lg font-bold text-indigo-600">{windowSize}</span>
            </div>
          </div>
        </div>

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
{`function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;

  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Time: O(n) - Only go through array once!
// Space: O(1) - No extra arrays needed!`}
          </pre>
        </div>

        {/* When to Use */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Sliding Window?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Keywords in problem:</strong> &ldquo;contiguous&rdquo;, &ldquo;subarray&rdquo;, &ldquo;substring&rdquo;, &ldquo;consecutive&rdquo;
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Looking for:</strong> maximum, minimum, longest, shortest within a window
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Has constraint:</strong> "size K", "at most K distinct", "with condition X"
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Naive approach:</strong> Would use nested loops (O(n²)) but sliding window makes it O(n)!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
