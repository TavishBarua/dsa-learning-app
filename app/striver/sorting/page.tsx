'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sources: string[];
  pattern: string;
  description: string;
}

export default function SortingCategory() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);

  const problems: Problem[] = [
    {
      id: 'selection-sort',
      title: 'Selection Sort',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Sorting',
      description: 'Find minimum element and swap with first position, repeat for remaining array.'
    },
    {
      id: 'bubble-sort',
      title: 'Bubble Sort',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Sorting',
      description: 'Compare adjacent elements and swap if in wrong order. Repeat until sorted.'
    },
    {
      id: 'insertion-sort',
      title: 'Insertion Sort',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Sorting',
      description: 'Build sorted array one element at a time by inserting elements in correct position.'
    },
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      difficulty: 'Medium',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Divide & Conquer',
      description: 'Divide array in half recursively, then merge sorted halves.'
    },
    {
      id: 'quick-sort',
      title: 'Quick Sort',
      difficulty: 'Medium',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Divide & Conquer',
      description: 'Pick pivot, partition array around pivot, recursively sort sub-arrays.'
    }
  ];

  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Striver': 'bg-purple-100 text-purple-700 border-purple-300',
      'NeetCode': 'bg-green-100 text-green-700 border-green-300',
      'Blind75': 'bg-orange-100 text-orange-700 border-orange-300',
      'LeetCode': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[source] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-700 border-green-300',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Hard': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const hints = {
    'selection-sort': [
      { level: 1, text: 'Think about finding the smallest element first. Where should it go?' },
      { level: 2, text: 'Find minimum in entire array, swap with first position. Then find minimum in remaining array.' },
      { level: 3, text: 'Use two loops: outer loop for each position, inner loop to find minimum in remaining array.' },
      { level: 4, text: 'Pattern Recognition: Selection Sort - select minimum repeatedly!' }
    ],
    'bubble-sort': [
      { level: 1, text: 'What if you repeatedly compare adjacent elements and swap if wrong order?' },
      { level: 2, text: 'After each pass, the largest element "bubbles up" to the end.' },
      { level: 3, text: 'Optimization: After each pass, last i elements are sorted, no need to check them.' },
      { level: 4, text: 'Pattern Recognition: Bubble Sort - bubble largest to the end!' }
    ],
    'insertion-sort': [
      { level: 1, text: 'Imagine sorting playing cards. You pick one card and insert it in the right position.' },
      { level: 2, text: 'Assume first element is sorted. Take next element and insert it in correct position.' },
      { level: 3, text: 'Compare with elements on left, shift them right until you find correct position.' },
      { level: 4, text: 'Pattern Recognition: Insertion Sort - insert each element in sorted position!' }
    ],
    'merge-sort': [
      { level: 1, text: 'Can you divide the problem into smaller sub-problems?' },
      { level: 2, text: 'Divide array into two halves, sort each half, then merge them.' },
      { level: 3, text: 'Base case: array of size 1 is already sorted. Merge two sorted arrays using two pointers.' },
      { level: 4, text: 'Pattern Recognition: Divide & Conquer - split, sort, merge! O(n log n)' }
    ],
    'quick-sort': [
      { level: 1, text: 'Pick a pivot element. Can you partition array around it?' },
      { level: 2, text: 'Partition: all elements < pivot on left, all elements > pivot on right.' },
      { level: 3, text: 'Recursively sort left and right sub-arrays. Base case: array size <= 1.' },
      { level: 4, text: 'Pattern Recognition: Divide & Conquer with partitioning! Average O(n log n)' }
    ]
  };

  const approaches = {
    'selection-sort': {
      approach: 'For each position, find minimum in remaining unsorted array and swap. Repeat n times.',
      complexity: 'Time: O(n²), Space: O(1) - Simple but inefficient'
    },
    'bubble-sort': {
      approach: 'Compare adjacent elements, swap if wrong order. Largest bubbles to end. Repeat n-1 times.',
      complexity: 'Time: O(n²), Space: O(1) - Can optimize with early exit'
    },
    'insertion-sort': {
      approach: 'Build sorted array one element at a time. Insert each element in correct position by shifting.',
      complexity: 'Time: O(n²), Space: O(1) - Efficient for small/nearly sorted arrays'
    },
    'merge-sort': {
      approach: 'Divide array recursively into halves until size 1. Merge sorted halves using two pointers.',
      complexity: 'Time: O(n log n), Space: O(n) - Stable, guaranteed performance'
    },
    'quick-sort': {
      approach: 'Pick pivot, partition array (smaller left, larger right). Recursively sort sub-arrays.',
      complexity: 'Time: O(n log n) average, O(n²) worst, Space: O(log n) - Fast in practice'
    }
  };

  const sortingAlgorithms = [
    { id: 'selection-sort', name: 'Selection Sort', color: 'from-red-400 to-pink-400' },
    { id: 'bubble-sort', name: 'Bubble Sort', color: 'from-blue-400 to-cyan-400' },
    { id: 'insertion-sort', name: 'Insertion Sort', color: 'from-green-400 to-emerald-400' },
    { id: 'merge-sort', name: 'Merge Sort', color: 'from-purple-400 to-indigo-400' },
    { id: 'quick-sort', name: 'Quick Sort', color: 'from-orange-400 to-amber-400' }
  ];

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setHintLevel(0);
    setShowSolution(false);
  };

  const nextHint = () => {
    if (selectedProblem && hintLevel < (hints[selectedProblem.id as keyof typeof hints]?.length || 0)) {
      setHintLevel(hintLevel + 1);
    }
  };

  const resetProblem = () => {
    setHintLevel(0);
    setShowSolution(false);
  };

  const shuffleArray = () => {
    const newArray = [...array].sort(() => Math.random() - 0.5);
    setArray(newArray);
  };

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/striver" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Categories
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🔄 Sorting Techniques</h1>
              <p className="text-sm text-gray-600">Master all sorting algorithms with visualizations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Philosophy Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Understand, Don&apos;t Memorize</h2>
              <p className="text-orange-50">
                Sorting algorithms teach you <strong>problem-solving patterns</strong>: loops, recursion, divide &amp; conquer. Focus on the <strong>logic</strong>, not the code!
              </p>
            </div>
          </div>
        </div>

        {/* Visual Sorting Demo */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            🎨 Visual Sorting Algorithms
          </h3>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {sortingAlgorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedSort(algo.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedSort === algo.id
                    ? `bg-gradient-to-r ${algo.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>

          {/* Array Visualization */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 border-4 border-gray-300 min-h-[200px]">
            <div className="flex items-end justify-center gap-2 h-48">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / 90) * 100}%` }}
                  className="w-16 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg flex items-end justify-center pb-2"
                >
                  <span className="text-white font-bold text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={shuffleArray}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
            >
              Shuffle Array
            </button>
            <button
              onClick={resetArray}
              className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-slate-600"
            >
              Reset
            </button>
          </div>

          {selectedSort && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-center">
                <strong>{sortingAlgorithms.find(a => a.id === selectedSort)?.name}</strong> selected!
                <br />
                <span className="text-sm">Choose the problem below to learn the algorithm step-by-step.</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problems List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sorting Algorithms ({problems.length})</h2>
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleProblemClick(problem)}
                className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 hover:shadow-lg ${
                  selectedProblem?.id === problem.id
                    ? 'border-orange-500 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">{problem.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{problem.description}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {problem.sources.map((source) => (
                    <span
                      key={source}
                      className={`text-xs px-2 py-1 rounded-md border ${getSourceColor(source)}`}
                    >
                      {source}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-orange-600 font-semibold mt-2">
                  Pattern: {problem.pattern}
                </div>
              </div>
            ))}
          </div>

          {/* Problem Solving Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            {selectedProblem ? (
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProblem.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedProblem.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      Pattern: {selectedProblem.pattern}
                    </span>
                  </div>
                </div>

                {/* Hint System */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">💡 Progressive Hints</h3>
                    <button
                      onClick={resetProblem}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Reset
                    </button>
                  </div>

                  {hintLevel === 0 ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-900 mb-3">Ready to learn this sorting algorithm?</p>
                      <button
                        onClick={nextHint}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600"
                      >
                        Get First Hint
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hints[selectedProblem.id as keyof typeof hints]?.slice(0, hintLevel).map((hint, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-4 border-2 ${
                            index === hintLevel - 1
                              ? 'bg-yellow-50 border-yellow-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-sm">Hint {hint.level}:</span>
                            <span className="text-sm">{hint.text}</span>
                          </div>
                        </div>
                      ))}

                      {hintLevel < (hints[selectedProblem.id as keyof typeof hints]?.length || 0) ? (
                        <button
                          onClick={nextHint}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600"
                        >
                          Next Hint ({hintLevel}/{hints[selectedProblem.id as keyof typeof hints]?.length})
                        </button>
                      ) : (
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                          <p className="text-green-900 font-semibold mb-2">All hints revealed! 🎉</p>
                          <p className="text-sm text-green-800 mb-3">Try implementing the algorithm yourself!</p>
                          <button
                            onClick={() => setShowSolution(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600"
                          >
                            Show Approach &amp; Complexity
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Solution/Approach */}
                {showSolution && approaches[selectedProblem.id as keyof typeof approaches] && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <span>✅</span>
                      <span>Algorithm Overview</span>
                    </h3>
                    <p className="text-purple-800 mb-4">
                      {approaches[selectedProblem.id as keyof typeof approaches].approach}
                    </p>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-purple-900">
                        ⚡ {approaches[selectedProblem.id as keyof typeof approaches].complexity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-900 text-center">
                    <strong>Next Step:</strong> Write the code and test with different arrays!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select an Algorithm</h3>
                <p className="text-gray-600">Choose a sorting algorithm to learn step-by-step</p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Sorting Algorithms Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Algorithm</th>
                  <th className="p-3 text-left">Time (Best)</th>
                  <th className="p-3 text-left">Time (Average)</th>
                  <th className="p-3 text-left">Time (Worst)</th>
                  <th className="p-3 text-left">Space</th>
                  <th className="p-3 text-left">Stable?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Selection Sort</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(1)</td>
                  <td className="p-3">❌ No</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-semibold">Bubble Sort</td>
                  <td className="p-3">O(n)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(1)</td>
                  <td className="p-3">✅ Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Insertion Sort</td>
                  <td className="p-3">O(n)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(1)</td>
                  <td className="p-3">✅ Yes</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-semibold">Merge Sort</td>
                  <td className="p-3">O(n log n)</td>
                  <td className="p-3">O(n log n)</td>
                  <td className="p-3">O(n log n)</td>
                  <td className="p-3">O(n)</td>
                  <td className="p-3">✅ Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Quick Sort</td>
                  <td className="p-3">O(n log n)</td>
                  <td className="p-3">O(n log n)</td>
                  <td className="p-3">O(n²)</td>
                  <td className="p-3">O(log n)</td>
                  <td className="p-3">❌ No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
