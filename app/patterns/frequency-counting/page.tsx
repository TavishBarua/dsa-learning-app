'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function FrequencyCountingPage() {
  const [array, setArray] = useState([2, 3, 2, 5, 3, 2, 8, 5]);
  const [hashMap, setHashMap] = useState<{[key: number]: number}>({});
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [explanation, setExplanation] = useState('');
  const [mostFrequent, setMostFrequent] = useState<number | null>(null);

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentIndex < array.length) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < array.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentIndex, array.length]);

  // Update hash map when currentIndex changes
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < array.length) {
      const num = array[currentIndex];
      setHashMap((prev) => {
        const newMap = { ...prev };
        newMap[num] = (newMap[num] || 0) + 1;
        setExplanation(`Found ${num}! Count is now ${newMap[num]}. Added to our tally chart! 📊`);
        return newMap;
      });
    }
  }, [currentIndex, array]);

  // Find most frequent
  useEffect(() => {
    if (currentIndex === array.length - 1 || currentIndex >= array.length) {
      const maxEntry = Object.entries(hashMap).reduce((max, entry) =>
        entry[1] > max[1] ? entry : max, ['0', 0]);
      if (maxEntry[1] > 0) {
        setMostFrequent(parseInt(maxEntry[0]));
        setExplanation(`✨ Done! Most frequent number is ${maxEntry[0]} (appears ${maxEntry[1]} times)`);
      }
    }
  }, [currentIndex, hashMap, array.length]);

  const reset = () => {
    setCurrentIndex(-1);
    setHashMap({});
    setIsPlaying(false);
    setMostFrequent(null);
    setExplanation('🎯 Let&apos;s count how many times each number appears!');
  };

  const stepForward = () => {
    if (currentIndex < array.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentIndex > -1) {
      // Remove last entry from map
      const num = array[currentIndex];
      setHashMap((prev) => {
        const newMap = { ...prev };
        if (newMap[num] > 1) {
          newMap[num]--;
        } else {
          delete newMap[num];
        }
        return newMap;
      });
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueNumbers = [...new Set(array)].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-cyan-600 hover:text-cyan-800">
              ← Back
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>🔢</span>
                <span>Frequency Counting (Hash Map)</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Interactive Visualization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Explanation */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-cyan-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine you&apos;re counting how many candies of each color you have...</strong>
            </p>
            <p>
              You make a <strong>tally chart</strong> on paper. Every time you see a red candy, you add a mark next to &ldquo;Red&rdquo;. Blue candy? Mark next to &ldquo;Blue&rdquo;. At the end, you can quickly see which color you have the most of!
            </p>
            <p>
              <strong>Why is this smart?</strong> Instead of searching through all your candies every time someone asks &ldquo;How many red ones?&rdquo;, you just look at your chart. <strong>Super fast! O(1) lookup!</strong> 🚀
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-cyan-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Count word frequency in a document</li>
                <li>Find duplicates in a list</li>
                <li>Group items by category</li>
                <li>Find first unique character</li>
                <li>Check if two strings are anagrams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Problem: Find Most Frequent Number</h3>
            <p className="text-gray-600">Array: {JSON.stringify(array)}</p>
          </div>

          {/* Array Visualization */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Input Array</h4>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {array.map((num, index) => {
                const isProcessed = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={index}
                    layout
                    animate={{
                      scale: isCurrent ? 1.3 : 1,
                      y: isCurrent ? -16 : isProcessed ? 0 : 0,
                    }}
                    className={`
                      relative w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold
                      transition-all duration-300
                      ${isCurrent
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl ring-4 ring-cyan-300'
                        : isProcessed
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                      }
                    `}
                  >
                    {num}
                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-600 whitespace-nowrap"
                      >
                        ↑ Processing
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Hash Map Visualization */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Hash Map (Tally Chart) 📊</h4>
            {Object.keys(hashMap).length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                Empty - Start counting to fill this up!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uniqueNumbers.map((num) => {
                  if (hashMap[num] === undefined) return null;
                  const count = hashMap[num];
                  const isMax = num === mostFrequent;

                  return (
                    <AnimatePresence key={num}>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`rounded-xl p-4 border-2 ${
                          isMax
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 shadow-lg'
                            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-cyan-900 mb-2">{num}</div>
                          <div className="text-xs text-gray-600 mb-2">Count:</div>
                          <div className={`text-xl md:text-2xl font-bold ${
                            isMax ? 'text-green-700' : 'text-cyan-700'
                          }`}>
                            {count}
                          </div>
                          {/* Visual tally marks */}
                          <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
                            {Array.from({ length: count }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-2 h-6 rounded ${
                                  isMax ? 'bg-green-500' : 'bg-cyan-500'
                                }`}
                              />
                            ))}
                          </div>
                          {isMax && (
                            <div className="text-xs font-bold text-green-700 mt-2">
                              🏆 Most Frequent
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-4 text-center">
              <div className="text-xs text-cyan-600 font-semibold mb-1">Processed</div>
              <div className="text-2xl font-bold text-cyan-700">{currentIndex + 1}/{array.length}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-xs text-blue-600 font-semibold mb-1">Unique Numbers</div>
              <div className="text-2xl font-bold text-blue-700">{Object.keys(hashMap).length}</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-600 font-semibold mb-1">Map Size</div>
              <div className="text-2xl font-bold text-purple-700">{Object.keys(hashMap).length}</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-xs text-green-600 font-semibold mb-1">Most Frequent</div>
              <div className="text-2xl font-bold text-green-700">{mostFrequent || '—'}</div>
            </div>
          </div>

          {/* Explanation Box */}
          <motion.div
            key={explanation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6"
          >
            <p className="text-amber-900 text-center font-medium">
              {explanation || '🎯 Click "Play" or "Next" to start counting!'}
            </p>
          </motion.div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={stepBackward}
                disabled={currentIndex < 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                ⏮ Back
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentIndex >= array.length - 1}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                onClick={stepForward}
                disabled={currentIndex >= array.length - 1}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next ⏭
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
                    speed === 1500 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐌 Slow
                </button>
                <button
                  onClick={() => setSpeed(1000)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 1000 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🚶 Normal
                </button>
                <button
                  onClick={() => setSpeed(500)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    speed === 500 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🏃 Fast
                </button>
              </div>
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
{`function findMostFrequent(arr) {
  const hashMap = {}; // Our tally chart!

  // Count frequencies
  for (const num of arr) {
    hashMap[num] = (hashMap[num] || 0) + 1;
  }

  // Find maximum
  let maxNum = arr[0];
  let maxCount = 0;

  for (const [num, count] of Object.entries(hashMap)) {
    if (count > maxCount) {
      maxCount = count;
      maxNum = Number(num);
    }
  }

  return maxNum;
}

// Time: O(n) - Two passes through data
// Space: O(k) - k unique elements in hashMap
// Lookup: O(1) - Instant access by key!`}
          </pre>
        </div>

        {/* When to Use */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Hash Map / Frequency Counting?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Keywords:</strong> &ldquo;count&rdquo;, &ldquo;frequency&rdquo;, &ldquo;occurrences&rdquo;, &ldquo;duplicates&rdquo;
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Need to:</strong> Check if something exists quickly (O(1) lookup!)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Track:</strong> Seen elements, pairs, or mapping between items
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Group:</strong> Items by some property (like anagrams)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <strong>Pro Tip:</strong> Hash maps are like a phonebook - instant lookup instead of searching!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
