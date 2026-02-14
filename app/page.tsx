'use client';

import Link from 'next/link';

export default function Home() {
  const patterns = [
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      emoji: '🪟',
      description: 'Like a window moving across an array - expand, shrink, slide!',
      difficulty: 'Easy',
      status: 'available',
      week: 1
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      emoji: '👈👉',
      description: 'Two fingers pointing at array elements - moving smartly!',
      difficulty: 'Easy',
      status: 'available',
      week: 1
    },
    {
      id: 'frequency-counting',
      name: 'Frequency Counting',
      emoji: '🔢',
      description: 'Count how many times things appear - like a tally chart!',
      difficulty: 'Easy',
      status: 'available',
      week: 1
    },
    {
      id: 'stack',
      name: 'Stack Pattern',
      emoji: '📚',
      description: 'Stack of books - last in, first out!',
      difficulty: 'Medium',
      status: 'available',
      week: 2
    },
    {
      id: 'queue',
      name: 'Queue Pattern',
      emoji: '🎫',
      description: 'Line at a ticket counter - first in, first out!',
      difficulty: 'Medium',
      status: 'available',
      week: 2
    },
    {
      id: 'hashmap',
      name: 'Hash Map',
      emoji: '🗺️',
      description: 'Magic dictionary - instant lookups!',
      difficulty: 'Medium',
      status: 'available',
      week: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Pattern Detective 🔍
              </h1>
              <p className="text-sm text-gray-600 mt-1">Stop grinding. Start recognizing.</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-1">
                Patterns
              </Link>
              <Link href="/striver" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 pb-1">
                Striver A2Z
              </Link>
              <Link href="/ats-checker" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 pb-1">
                ATS Checker
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            You&apos;re Not Bad at DSA. You&apos;re Untrained. 💪
          </h2>
          <p className="text-lg md:text-xl mb-6 text-indigo-100">
            Just like debugging production issues, DSA is about <span className="font-bold text-white">pattern recognition</span>, not memorization.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold mb-1">Visual Learning</div>
              <div className="text-sm text-indigo-100">See it, don&apos;t just read it</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🎮</div>
              <div className="font-semibold mb-1">Interactive</div>
              <div className="text-sm text-indigo-100">Play with code step-by-step</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold mb-1">ELI5 Style</div>
              <div className="text-sm text-indigo-100">Explained like you&apos;re 5</div>
            </div>
          </div>
        </div>

        {/* Week 1-2 Badge */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 mb-8 text-white text-center">
          <h3 className="text-xl font-bold mb-1">🎯 Week 1-2 Focus</h3>
          <p className="text-green-50 text-sm">Master these 6 patterns + Striver Basics/Arrays/Sorting. Don&apos;t rush - quality over quantity!</p>
        </div>

        {/* Pattern Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎨</span>
            <span>Week 1-2: Core Patterns (6 Patterns)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  pattern.status === 'available'
                    ? 'border-indigo-200 hover:border-indigo-400 hover:-translate-y-1'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {pattern.status === 'available' ? (
                  <Link href={`/patterns/${pattern.id}`}>
                    <div className="p-6 cursor-pointer">
                      <div className="text-5xl mb-4">{pattern.emoji}</div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {pattern.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {pattern.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          pattern.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {pattern.difficulty}
                        </span>
                        <span className="text-indigo-600 font-semibold text-sm">
                          Learn Now →
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-6">
                    <div className="text-5xl mb-4 grayscale">{pattern.emoji}</div>
                    <h4 className="text-xl font-bold text-gray-400 mb-2">
                      {pattern.name}
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {pattern.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                        Week {pattern.week}
                      </span>
                      <span className="text-gray-400 font-semibold text-sm">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="text-lg font-bold text-amber-900 mb-2">How to Use This</h4>
              <ul className="text-amber-800 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Click on a pattern to see the <strong>interactive visualization</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Play with the controls - <strong>slow down, speed up, step through</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Read the <strong>ELI5 explanation</strong> - no jargon, just simple words</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>Try the <strong>interactive code editor</strong> - modify and run instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">5.</span>
                  <span>Use it <strong>at office on your phone</strong> - fully responsive!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Built to conquer DSA fear, one pattern at a time 🚀</p>
          <p className="mt-2 text-xs text-gray-400">
            Remember: You&apos;re learning patterns, not memorizing solutions
          </p>
        </div>
      </footer>
    </div>
  );
}
