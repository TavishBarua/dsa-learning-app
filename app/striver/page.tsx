'use client';

import Link from 'next/link';

export default function StriverA2Z() {
  const categories = [
    {
      id: 'basics',
      name: 'Learn the Basics',
      emoji: '🎯',
      description: 'C++/Java/Python basics, Logic building, STL, Math, Recursion',
      topics: 6,
      problems: 45,
      difficulty: 'Easy',
      status: 'available'
    },
    {
      id: 'sorting',
      name: 'Sorting Techniques',
      emoji: '🔄',
      description: 'Selection, Bubble, Insertion, Merge, Quick Sort',
      topics: 2,
      problems: 12,
      difficulty: 'Easy',
      status: 'available'
    },
    {
      id: 'arrays',
      name: 'Arrays',
      emoji: '📊',
      description: 'Easy, Medium & Hard Array Problems',
      topics: 3,
      problems: 40,
      difficulty: 'Medium',
      status: 'available'
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      emoji: '🔍',
      description: 'BS on 1D/2D Arrays, BS on Answers',
      topics: 3,
      problems: 35,
      difficulty: 'Medium',
      status: 'coming-soon'
    },
    {
      id: 'strings',
      name: 'Strings',
      emoji: '📝',
      description: 'Basic, Easy & Medium String Problems',
      topics: 2,
      problems: 25,
      difficulty: 'Medium',
      status: 'coming-soon'
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      emoji: '🔗',
      description: 'Singly, Doubly LL, Medium & Hard Problems',
      topics: 4,
      problems: 30,
      difficulty: 'Medium',
      status: 'coming-soon'
    },
    {
      id: 'recursion',
      name: 'Recursion',
      emoji: '♻️',
      description: 'Get Strong Hold, Subsequences, Backtracking',
      topics: 3,
      problems: 25,
      difficulty: 'Hard',
      status: 'coming-soon'
    },
    {
      id: 'greedy',
      name: 'Greedy Algorithms',
      emoji: '💰',
      description: 'Easy, Medium/Hard Greedy Problems',
      topics: 2,
      problems: 20,
      difficulty: 'Hard',
      status: 'coming-soon'
    },
    {
      id: 'stacks-queues',
      name: 'Stacks & Queues',
      emoji: '📚',
      description: 'Learning, Pre/In/Post-fix, Monotonic, Implementation',
      topics: 4,
      problems: 30,
      difficulty: 'Medium',
      status: 'coming-soon'
    },
    {
      id: 'trees',
      name: 'Binary Trees',
      emoji: '🌳',
      description: 'Traversals, Medium & Hard Problems, BST',
      topics: 4,
      problems: 40,
      difficulty: 'Hard',
      status: 'coming-soon'
    },
    {
      id: 'graphs',
      name: 'Graphs',
      emoji: '🕸️',
      description: 'BFS, DFS, Topo Sort, MST, Shortest Path',
      topics: 8,
      problems: 50,
      difficulty: 'Hard',
      status: 'coming-soon'
    },
    {
      id: 'dp',
      name: 'Dynamic Programming',
      emoji: '🧩',
      description: '1D, 2D, DP on Grids, Subsequences, Strings, Stocks, LIS',
      topics: 10,
      problems: 60,
      difficulty: 'Hard',
      status: 'coming-soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pattern Detective 🔍
              </Link>
              <p className="text-sm text-gray-600 mt-1">Striver&apos;s A2Z DSA Sheet</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-purple-600 pb-1">
                Patterns
              </Link>
              <Link href="/striver" className="text-sm font-semibold text-purple-600 border-b-2 border-purple-600 pb-1">
                Striver A2Z
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Striver&apos;s A2Z DSA Sheet 📚
          </h2>
          <p className="text-lg md:text-xl mb-6 text-purple-100">
            Complete <span className="font-bold text-white">450+ problems</span> from basics to advanced. Track your progress with <span className="font-bold">visual learning</span>!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">📖</div>
              <div className="font-semibold mb-1">12 Categories</div>
              <div className="text-sm text-purple-100">From basics to advanced DP</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold mb-1">450+ Problems</div>
              <div className="text-sm text-purple-100">Curated by Striver</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="font-semibold mb-1">Source Tags</div>
              <div className="text-sm text-purple-100">Striver, NeetCode, Blind75</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📚</span>
            <span>All Categories</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  category.status === 'available'
                    ? 'border-purple-200 hover:border-purple-400 hover:-translate-y-1'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {category.status === 'available' ? (
                  <Link href={`/striver/${category.id}`}>
                    <div className="p-6 cursor-pointer">
                      <div className="text-5xl mb-4">{category.emoji}</div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {category.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {category.topics} topics
                        </span>
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          {category.problems} problems
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          category.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : category.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {category.difficulty}
                        </span>
                        <span className="text-purple-600 font-semibold text-sm">
                          Start Learning →
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-6">
                    <div className="text-5xl mb-4 grayscale">{category.emoji}</div>
                    <h4 className="text-xl font-bold text-gray-400 mb-2">
                      {category.name}
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        {category.topics} topics
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        {category.problems} problems
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h4 className="text-lg font-bold text-blue-900 mb-2">About Source Tags</h4>
              <div className="text-blue-800 space-y-2 text-sm">
                <p>Each problem is tagged with its source to help you track which lists you&apos;re completing:</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    🎯 Striver
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    🟢 NeetCode
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    🔥 Blind75
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    💎 LeetCode Top
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Striver&apos;s A2Z DSA Sheet with Visual Learning 🚀</p>
          <p className="mt-2 text-xs text-gray-400">
            Remember: Quality &gt; Quantity. Understand patterns, don&apos;t memorize!
          </p>
        </div>
      </footer>
    </div>
  );
}
