'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TwoSumUnsortedPage() {
  const [array, setArray] = useState([3, 7, 2, 11, 5, 15]);
  const [target, setTarget] = useState(9);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hashMap, setHashMap] = useState<{[key: number]: number}>({});
  const [found, setFound] = useState(false);
  const [foundPair, setFoundPair] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [explanation, setExplanation] = useState('Click "Start" to begin visualization');
  const [currentLine, setCurrentLine] = useState(0);
  const [complement, setComplement] = useState<number | null>(null);

  // Code lines for visualization (Java)
  const codeLines = [
    { line: 1, code: 'public int[] twoSum(int[] arr, int target) {', indent: 0 },
    { line: 2, code: 'HashMap<Integer, Integer> map = new HashMap<>();', indent: 1 },
    { line: 3, code: '', indent: 0 },
    { line: 4, code: 'for (int i = 0; i < arr.length; i++) {', indent: 1 },
    { line: 5, code: 'int complement = target - arr[i];', indent: 2 },
    { line: 6, code: '', indent: 0 },
    { line: 7, code: 'if (map.containsKey(complement)) {', indent: 2 },
    { line: 8, code: 'return new int[]{map.get(complement), i}; // Found!', indent: 3 },
    { line: 9, code: '}', indent: 2 },
    { line: 10, code: '', indent: 0 },
    { line: 11, code: 'map.put(arr[i], i); // Store value → index', indent: 2 },
    { line: 12, code: '}', indent: 1 },
    { line: 13, code: 'return new int[]{-1, -1}; // Not found', indent: 1 },
    { line: 14, code: '}', indent: 0 },
  ];

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const actualSpeed = speed / speedMultiplier;

    if (isPlaying && !found) {
      interval = setInterval(() => {
        if (currentIndex >= array.length) {
          setIsPlaying(false);
          setCurrentLine(13);
          setExplanation('❌ No pair found that sums to target');
          return;
        }

        const currentValue = array[currentIndex];
        const comp = target - currentValue;

        // Line 4: for loop
        setCurrentLine(4);
        setTimeout(() => {
          // Line 5: calculate complement
          setCurrentLine(5);
          setComplement(comp);
          setExplanation(`Line 5: complement = ${target} - ${currentValue} = ${comp}`);

          setTimeout(() => {
            // Line 7: check if complement exists in map
            setCurrentLine(7);
            if (hashMap[comp] !== undefined) {
              // Found!
              setCurrentLine(8);
              setFoundPair([hashMap[comp], currentIndex]);
              setFound(true);
              setIsPlaying(false);
              setExplanation(`🎉 FOUND! arr[${hashMap[comp]}] + arr[${currentIndex}] = ${array[hashMap[comp]]} + ${currentValue} = ${target}`);
            } else {
              // Not found, add to map
              setTimeout(() => {
                setCurrentLine(11);
                setHashMap(prev => ({...prev, [currentValue]: currentIndex}));
                setExplanation(`Line 11: Store map[${currentValue}] = ${currentIndex}`);
                setTimeout(() => {
                  setCurrentIndex(prev => prev + 1);
                  setComplement(null);
                }, actualSpeed / 4);
              }, actualSpeed / 4);
            }
          }, actualSpeed / 4);
        }, actualSpeed / 4);
      }, actualSpeed);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, found, array, target, hashMap, speed, speedMultiplier]);

  const reset = () => {
    setCurrentIndex(0);
    setHashMap({});
    setFound(false);
    setFoundPair(null);
    setIsPlaying(false);
    setExplanation('Click "Start" to begin visualization');
    setCurrentLine(0);
    setComplement(null);
  };

  const stepForward = () => {
    if (found || currentIndex >= array.length) return;

    const currentValue = array[currentIndex];
    const comp = target - currentValue;

    setCurrentLine(5);
    setComplement(comp);

    setTimeout(() => {
      setCurrentLine(7);
      if (hashMap[comp] !== undefined) {
        setCurrentLine(8);
        setFoundPair([hashMap[comp], currentIndex]);
        setFound(true);
        setExplanation(`🎉 FOUND! arr[${hashMap[comp]}] + arr[${currentIndex}] = ${array[hashMap[comp]]} + ${currentValue} = ${target}`);
      } else {
        setCurrentLine(11);
        setHashMap(prev => ({...prev, [currentValue]: currentIndex}));
        setExplanation(`Stored map[${currentValue}] = ${currentIndex}`);
        setCurrentIndex(prev => prev + 1);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">➕ Two Sum (Unsorted Array)</h1>
              <p className="text-sm text-gray-600">Use HashMap for O(n) solution!</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ELI5 Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-orange-800 space-y-4">
            <p className="text-lg">
              <strong>🧩 Real-Life Example: Finding Your Lost Sock&apos;s Match</strong>
            </p>
            <p>
              Imagine you have a pile of random socks (unsorted!). You want to find two socks whose sizes add up to exactly 10.
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-bold text-red-900 mb-2">❌ Slow Way (Brute Force - O(n²)):</p>
              <p className="text-sm">Pick sock #1, compare with ALL other socks. Pick sock #2, compare with ALL other socks. Takes FOREVER!</p>
              <p className="text-xs italic mt-1">If you have 100 socks, you make 10,000 comparisons! 😰</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-bold text-green-900 mb-2">✅ Smart Way (HashMap - O(n)):</p>
              <ol className="list-decimal list-inside space-y-2 ml-2 text-sm">
                <li>Pick up sock with size 3. You need a sock of size 7 (10 - 3 = 7).</li>
                <li>Check your &quot;memory book&quot; (HashMap): &quot;Have I seen size 7?&quot;</li>
                <li>If YES → Found it! 🎉</li>
                <li>If NO → Write down &quot;I saw size 3 at position 0&quot; and move to next sock.</li>
              </ol>
              <p className="text-xs italic mt-2">You only touch each sock ONCE! Way faster! ⚡</p>
            </div>

            <p className="bg-amber-100 border-l-4 border-amber-500 p-3 rounded">
              <strong>💡 Key Insight:</strong> <code className="bg-amber-200 px-2 py-1 rounded">complement = target - current</code>
              <br/><span className="text-sm">We don&apos;t search for pairs. We search for the ONE number that completes the current number!</span>
            </p>

            <p className="text-sm font-bold">
              ⚡ <strong>Why HashMap is Magic:</strong> Looking up a value in HashMap takes O(1) time - instant! Like having a super-fast index in a book!
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
                <div className="bg-blue-900 border-2 border-blue-500 p-3 rounded-lg col-span-2">
                  <span className="text-blue-300 font-bold">i (current index):</span>
                  <span className="text-blue-100 font-black ml-2 text-xl">{currentIndex}</span>
                </div>
                <div className="bg-purple-900 border-2 border-purple-500 p-3 rounded-lg">
                  <span className="text-purple-300 font-bold">arr[i]:</span>
                  <span className="text-purple-100 font-black ml-2 text-xl">
                    {currentIndex < array.length ? array[currentIndex] : 'N/A'}
                  </span>
                </div>
                <div className="bg-pink-900 border-2 border-pink-500 p-3 rounded-lg">
                  <span className="text-pink-300 font-bold">complement:</span>
                  <span className="text-pink-100 font-black ml-2 text-xl">
                    {complement !== null ? complement : 'N/A'}
                  </span>
                </div>
                <div className="bg-orange-900 border-2 border-orange-500 p-3 rounded-lg col-span-2">
                  <span className="text-orange-300 font-bold">target:</span>
                  <span className="text-orange-100 font-black ml-2 text-xl">{target}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Array & HashMap Visualization Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-6 border-4 border-gray-300">
            <h3 className="text-xl font-black text-gray-900 mb-4">🎯 Array & HashMap</h3>

            {/* Array Visualization */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-700 mb-2">Array:</h4>
              <div className="flex items-center justify-center gap-2">
                {array.map((num, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx === currentIndex ? 1.2 : foundPair?.includes(idx) ? 1.15 : 1,
                      y: idx === currentIndex ? -10 : foundPair?.includes(idx) ? -5 : 0
                    }}
                    className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg border-2 ${
                      foundPair?.includes(idx)
                        ? 'bg-green-400 border-green-600 text-white shadow-lg'
                        : idx === currentIndex
                        ? 'bg-yellow-400 border-yellow-600 text-black'
                        : idx < currentIndex
                        ? 'bg-blue-100 border-blue-300 text-blue-900'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                {array.map((_, idx) => (
                  <div key={idx} className="w-14 text-center text-xs text-gray-500 font-mono">
                    [{idx}]
                  </div>
                ))}
              </div>
            </div>

            {/* HashMap Visualization */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-700 mb-2">HashMap (seen numbers):</h4>
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4 min-h-24">
                {Object.keys(hashMap).length === 0 ? (
                  <p className="text-gray-500 text-center italic">Empty - building as we go...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(hashMap).map(([value, index]) => (
                      <motion.div
                        key={value}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-4 py-2 rounded-lg font-bold border-2 ${
                          parseInt(value) === complement
                            ? 'bg-green-300 border-green-600 text-green-900 shadow-lg'
                            : 'bg-indigo-200 border-indigo-400 text-indigo-900'
                        }`}
                      >
                        {value} → {index}
                        {parseInt(value) === complement && <span className="ml-2">✓</span>}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Complement Check */}
            {complement !== null && (
              <div className="bg-purple-100 border-4 border-purple-400 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-base text-purple-900 font-bold mb-2">Looking for complement:</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {target} - {array[currentIndex]} = {complement}
                  </p>
                  <p className="text-lg text-purple-900 font-bold mt-2">
                    {hashMap[complement] !== undefined ? '✅ Found in HashMap!' : '❌ Not in HashMap yet'}
                  </p>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="bg-orange-100 border-4 border-orange-400 rounded-lg p-4">
              <p className="text-base text-orange-900 font-bold">{explanation}</p>
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-orange-900">⚡ Speed Control:</label>
                  <span className="text-orange-900 font-bold">{speedMultiplier.toFixed(1)}x ({(speed / speedMultiplier / 1000).toFixed(1)}s per step)</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((speedMultiplier - 0.3) / 1.7) * 100}%, #fed7aa ${((speedMultiplier - 0.3) / 1.7) * 100}%, #fed7aa 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-orange-700 mt-1">
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

        {/* Java Code Snippet */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-yellow-400">☕ Complete Java Solution</h3>
            <span className="text-xs text-gray-400 font-mono">HashMap Pattern</span>
          </div>
          <pre className="text-green-400 font-mono text-sm overflow-x-auto">
            <code>{`public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> map = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];

        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }

        map.put(nums[i], i);  // Store value → index
    }

    return new int[]{-1, -1};  // Not found
}

// Time Complexity: O(n) - single pass
// Space Complexity: O(n) - HashMap storage`}</code>
          </pre>
        </div>

        {/* Time Complexity Comparison */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">⚡ Why HashMap? Time Complexity Battle!</h3>
          <div className="grid md:grid-cols-2 gap-4 text-emerald-800">
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
              <h4 className="font-bold text-red-900 mb-2">❌ Brute Force (Two Nested Loops):</h4>
              <p className="text-red-800 mb-2"><strong>Time:</strong> O(n²) 🐌</p>
              <p className="text-red-800 mb-3 text-sm">For n=10,000 elements, that&apos;s 100 million comparisons!</p>
              <code className="text-xs text-red-900 bg-red-50 p-2 rounded block font-mono">
                {`for (int i = 0; i < n; i++) {
    for (int j = i+1; j < n; j++) {
        if (arr[i] + arr[j] == target)
            return new int[]{i, j};
    }
}`}
              </code>
            </div>
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-2">✅ HashMap Solution (One Pass):</h4>
              <p className="text-green-800 mb-2"><strong>Time:</strong> O(n) ⚡</p>
              <p className="text-green-800 mb-3 text-sm">For n=10,000 elements, only 10,000 operations!</p>
              <code className="text-xs text-green-900 bg-green-50 p-2 rounded block font-mono">
                {`for (int i = 0; i < n; i++) {
    if (map.containsKey(complement))
        return new int[]{map.get(...), i};
    map.put(nums[i], i);
}`}
              </code>
            </div>
          </div>
          <div className="mt-4 bg-blue-100 border-2 border-blue-400 rounded-lg p-4 text-center">
            <p className="text-blue-900 font-bold text-lg">
              💡 HashMap lookup/insert is O(1) - constant time!
            </p>
            <p className="text-blue-800 text-sm mt-2">
              That&apos;s why HashMap is 10,000x faster for large arrays! 🚀
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
