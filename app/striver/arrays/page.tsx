'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sources: string[];
  pattern: string;
  description: string;
}

export default function ArraysCategory() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const problems: Problem[] = [
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      sources: ['Striver', 'NeetCode', 'Blind75', 'LeetCode'],
      pattern: 'Hash Map',
      description: 'Given an array of integers and a target, find two numbers that add up to the target.'
    },
    {
      id: 'best-time-to-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      sources: ['Striver', 'NeetCode', 'Blind75'],
      pattern: 'Sliding Window / Greedy',
      description: 'Find the maximum profit you can achieve from buying and selling a stock once.'
    },
    {
      id: 'contains-duplicate',
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      sources: ['Striver', 'NeetCode', 'Blind75'],
      pattern: 'Hash Set',
      description: 'Determine if an array contains any duplicate values.'
    },
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray (Kadane&apos;s)',
      difficulty: 'Medium',
      sources: ['Striver', 'NeetCode', 'Blind75'],
      pattern: 'Dynamic Programming / Greedy',
      description: 'Find the contiguous subarray with the largest sum.'
    },
    {
      id: 'product-except-self',
      title: 'Product of Array Except Self',
      difficulty: 'Medium',
      sources: ['Striver', 'NeetCode', 'Blind75'],
      pattern: 'Prefix/Suffix Arrays',
      description: 'Return an array where each element is the product of all other elements except itself.'
    },
    {
      id: 'merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      sources: ['Striver', 'NeetCode', 'Blind75'],
      pattern: 'Sorting + Merging',
      description: 'Merge all overlapping intervals and return non-overlapping intervals.'
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
    'two-sum': [
      { level: 1, text: 'Think about what information you need to "remember" as you iterate through the array.' },
      { level: 2, text: 'For each number, what are you looking for? (Hint: target - current number)' },
      { level: 3, text: 'Can you store seen numbers and their indices in a data structure for O(1) lookup?' },
      { level: 4, text: 'Pattern Recognition: This is a Hash Map problem! Store numbers as keys, indices as values.' }
    ],
    'best-time-to-buy-sell-stock': [
      { level: 1, text: 'You want to buy low and sell high. What do you need to track?' },
      { level: 2, text: 'As you scan prices, keep track of the minimum price seen so far.' },
      { level: 3, text: 'For each price, calculate: current_price - minimum_price_so_far' },
      { level: 4, text: 'Pattern Recognition: This is a Greedy/Sliding Window problem with one pass!' }
    ],
    'contains-duplicate': [
      { level: 1, text: 'How can you remember if you&apos;ve seen a number before?' },
      { level: 2, text: 'What data structure allows you to check existence in O(1) time?' },
      { level: 3, text: 'As you iterate, add each number to this data structure. If it already exists, return true.' },
      { level: 4, text: 'Pattern Recognition: This is a Hash Set problem for duplicate detection!' }
    ],
    'maximum-subarray': [
      { level: 1, text: 'At each position, you have two choices: extend the current subarray or start fresh.' },
      { level: 2, text: 'Keep track of the "current sum" and the "best sum seen so far"' },
      { level: 3, text: 'If current sum becomes negative, reset it to 0 (start fresh)' },
      { level: 4, text: 'Pattern Recognition: This is Kadane&apos;s Algorithm - a classic DP/Greedy approach!' }
    ],
    'product-except-self': [
      { level: 1, text: 'Brute force: for each position, multiply all other elements. But that&apos;s O(n²)...' },
      { level: 2, text: 'Think about breaking down the product: left side × right side' },
      { level: 3, text: 'First pass: calculate product of all elements to the LEFT. Second pass: multiply by product of all elements to the RIGHT.' },
      { level: 4, text: 'Pattern Recognition: This is a Prefix/Suffix Array problem!' }
    ],
    'merge-intervals': [
      { level: 1, text: 'What happens if intervals are sorted by start time?' },
      { level: 2, text: 'After sorting, overlapping intervals will be adjacent' },
      { level: 3, text: 'Compare current interval&apos;s start with previous interval&apos;s end. If overlap, merge them.' },
      { level: 4, text: 'Pattern Recognition: This is a Sorting + Merging problem!' }
    ]
  };

  const approaches = {
    'two-sum': {
      approach: 'Use a Hash Map to store numbers and their indices. For each number, check if (target - number) exists in the map.',
      complexity: 'Time: O(n), Space: O(n)'
    },
    'best-time-to-buy-sell-stock': {
      approach: 'Track minimum price seen so far. For each price, calculate profit if sold at current price. Update max profit.',
      complexity: 'Time: O(n), Space: O(1)'
    },
    'contains-duplicate': {
      approach: 'Use a Hash Set. Add each element to the set. If element already exists, return true. Otherwise, return false.',
      complexity: 'Time: O(n), Space: O(n)'
    },
    'maximum-subarray': {
      approach: 'Kadane&apos;s Algorithm: Keep current_sum and max_sum. Add each element to current_sum. If current_sum < 0, reset to 0.',
      complexity: 'Time: O(n), Space: O(1)'
    },
    'product-except-self': {
      approach: 'Two passes: (1) Calculate prefix products from left, (2) Calculate suffix products from right while building result.',
      complexity: 'Time: O(n), Space: O(1) excluding output array'
    },
    'merge-intervals': {
      approach: 'Sort intervals by start time. Iterate and merge overlapping intervals by comparing start and end times.',
      complexity: 'Time: O(n log n), Space: O(n)'
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/striver" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Categories
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎨 Arrays</h1>
              <p className="text-sm text-gray-600">Master array manipulation and optimization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Philosophy Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💪</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Focus on Your Solving Process</h2>
              <p className="text-amber-50">
                Don&apos;t rush to solutions. Use hints to guide your thinking. The goal is to <strong>train pattern recognition</strong>, not memorize answers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problems List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Problems ({problems.length})</h2>
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleProblemClick(problem)}
                className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 hover:shadow-lg ${
                  selectedProblem?.id === problem.id
                    ? 'border-indigo-500 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
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

                <div className="text-xs text-indigo-600 font-semibold mt-2">
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
                    <span className="text-indigo-600 font-semibold">
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
                      <p className="text-blue-900 mb-3">Ready to solve this problem?</p>
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
                          <p className="text-sm text-green-800 mb-3">Try implementing the solution yourself first!</p>
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
                      <span>Optimal Approach</span>
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
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-900 text-center">
                    <strong>Next Step:</strong> Try coding the solution on LeetCode or your IDE!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Problem</h3>
                <p className="text-gray-600">Choose a problem from the list to start practicing</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
