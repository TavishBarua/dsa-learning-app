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

export default function BasicsCategory() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const problems: Problem[] = [
    {
      id: 'reverse-number',
      title: 'Reverse a Number',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Math / Modulo',
      description: 'Given an integer, reverse its digits. Handle negative numbers and overflow.'
    },
    {
      id: 'palindrome-number',
      title: 'Palindrome Number',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Math / Two Pointers',
      description: 'Determine if an integer is a palindrome (reads same forwards and backwards).'
    },
    {
      id: 'armstrong-number',
      title: 'Armstrong Number',
      difficulty: 'Easy',
      sources: ['Striver'],
      pattern: 'Math',
      description: 'Check if a number equals sum of its digits raised to the power of number of digits.'
    },
    {
      id: 'count-digits',
      title: 'Count Digits',
      difficulty: 'Easy',
      sources: ['Striver'],
      pattern: 'Math / Logarithm',
      description: 'Count number of digits in a given integer.'
    },
    {
      id: 'gcd-lcm',
      title: 'GCD and LCM',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Euclidean Algorithm',
      description: 'Find Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of two numbers.'
    },
    {
      id: 'prime-number',
      title: 'Check Prime Number',
      difficulty: 'Easy',
      sources: ['Striver', 'LeetCode'],
      pattern: 'Math / Optimization',
      description: 'Determine if a number is prime. Optimize to check only up to sqrt(n).'
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
    'reverse-number': [
      { level: 1, text: 'Think about extracting digits one by one from right to left.' },
      { level: 2, text: 'Use modulo (%) to get last digit, then divide by 10 to remove it.' },
      { level: 3, text: 'Build reversed number: reversed = reversed * 10 + lastDigit' },
      { level: 4, text: 'Pattern Recognition: This is a Math/Modulo problem! Extract digits using % and /.' }
    ],
    'palindrome-number': [
      { level: 1, text: 'A palindrome reads the same forwards and backwards. How can you compare?' },
      { level: 2, text: 'You could reverse the entire number and check if it equals the original.' },
      { level: 3, text: 'Or compare digits from both ends: extract first and last digit, check if equal.' },
      { level: 4, text: 'Pattern Recognition: Math problem - reverse number or use two-pointer concept!' }
    ],
    'armstrong-number': [
      { level: 1, text: 'Example: 153 = 1³ + 5³ + 3³. What do you need to calculate?' },
      { level: 2, text: 'First, count total digits. Then extract each digit and raise to that power.' },
      { level: 3, text: 'Sum all powered digits. Compare sum with original number.' },
      { level: 4, text: 'Pattern Recognition: Math problem with power calculation!' }
    ],
    'count-digits': [
      { level: 1, text: 'How many times can you divide by 10 before reaching 0?' },
      { level: 2, text: 'Loop: while (n > 0) { count++; n = n / 10; }' },
      { level: 3, text: 'Alternative: Use logarithm - digits = floor(log10(n)) + 1' },
      { level: 4, text: 'Pattern Recognition: Math problem - iterative division or logarithm!' }
    ],
    'gcd-lcm': [
      { level: 1, text: 'GCD is the largest number that divides both numbers. How to find it efficiently?' },
      { level: 2, text: 'Use Euclidean Algorithm: GCD(a, b) = GCD(b, a % b), base case: b == 0' },
      { level: 3, text: 'Once you have GCD, calculate LCM: LCM = (a * b) / GCD' },
      { level: 4, text: 'Pattern Recognition: This is Euclidean Algorithm - a classic recursion pattern!' }
    ],
    'prime-number': [
      { level: 1, text: 'A prime has no divisors except 1 and itself. How to check?' },
      { level: 2, text: 'Brute force: check divisibility from 2 to n-1. But can we optimize?' },
      { level: 3, text: 'Optimization: only check from 2 to sqrt(n). If no divisor found, it&apos;s prime!' },
      { level: 4, text: 'Pattern Recognition: Math optimization - sqrt(n) trick reduces O(n) to O(√n)!' }
    ]
  };

  const approaches = {
    'reverse-number': {
      approach: 'Extract digits using modulo (%), build reversed number by multiplying by 10 and adding digit. Handle negative numbers and integer overflow.',
      complexity: 'Time: O(log n) - digits count, Space: O(1)'
    },
    'palindrome-number': {
      approach: 'Reverse the number completely and check if reversed == original. Alternative: compare digits from both ends.',
      complexity: 'Time: O(log n), Space: O(1)'
    },
    'armstrong-number': {
      approach: 'Count digits first. Extract each digit, raise to power of digit count, sum them. Compare sum with original.',
      complexity: 'Time: O(d) where d is digit count, Space: O(1)'
    },
    'count-digits': {
      approach: 'Method 1: Divide by 10 repeatedly and count iterations. Method 2: Use log10(n) + 1.',
      complexity: 'Time: O(log n), Space: O(1)'
    },
    'gcd-lcm': {
      approach: 'GCD using Euclidean Algorithm (recursive or iterative). LCM = (a * b) / GCD(a, b).',
      complexity: 'Time: O(log(min(a,b))), Space: O(1) iterative'
    },
    'prime-number': {
      approach: 'Check divisibility from 2 to sqrt(n). If any divisor found, not prime. Handle edge cases: n < 2.',
      complexity: 'Time: O(√n), Space: O(1)'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/striver" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Categories
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎯 Learn the Basics</h1>
              <p className="text-sm text-gray-600">Foundation: Math, Logic Building, Problem Solving</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Philosophy Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🌱</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Master the Fundamentals</h2>
              <p className="text-green-50">
                These basics are the foundation of all DSA. Don&apos;t skip them! Use hints to <strong>develop your problem-solving intuition</strong>.
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
                    ? 'border-green-500 shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
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

                <div className="text-xs text-green-600 font-semibold mt-2">
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
                    <span className="text-green-600 font-semibold">
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
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 text-center">
                    <strong>Next Step:</strong> Implement this in your favorite language and test it!
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
