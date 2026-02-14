'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HashMapEntry {
  key: string;
  value: string;
}

export default function HashMapPattern() {
  const [hashMap, setHashMap] = useState<HashMapEntry[]>([]);
  const [keyInput, setKeyInput] = useState('apple');
  const [valueInput, setValueInput] = useState('red');
  const [searchKey, setSearchKey] = useState('');
  const [explanation, setExplanation] = useState('🎯 Hash Map: Key-Value pairs for O(1) lookups!');
  const [highlightKey, setHighlightKey] = useState<string | null>(null);

  const set = () => {
    if (!keyInput.trim()) {
      setExplanation('❌ Key cannot be empty!');
      return;
    }

    const existingIndex = hashMap.findIndex(entry => entry.key === keyInput);

    if (existingIndex !== -1) {
      const newMap = [...hashMap];
      newMap[existingIndex] = { key: keyInput, value: valueInput };
      setHashMap(newMap);
      setExplanation(`✅ SET: Updated "${keyInput}" → "${valueInput}"`);
    } else {
      setHashMap([...hashMap, { key: keyInput, value: valueInput }]);
      setExplanation(`✅ SET: Added "${keyInput}" → "${valueInput}"`);
    }

    setHighlightKey(keyInput);
    setTimeout(() => setHighlightKey(null), 1000);
  };

  const get = () => {
    if (!searchKey.trim()) {
      setExplanation('❌ Enter a key to search!');
      return;
    }

    const entry = hashMap.find(e => e.key === searchKey);

    if (entry) {
      setExplanation(`✅ GET("${searchKey}"): Found value "${entry.value}"`);
      setHighlightKey(searchKey);
      setTimeout(() => setHighlightKey(null), 1000);
    } else {
      setExplanation(`❌ GET("${searchKey}"): Key not found!`);
    }
  };

  const remove = () => {
    if (!searchKey.trim()) {
      setExplanation('❌ Enter a key to delete!');
      return;
    }

    const entry = hashMap.find(e => e.key === searchKey);

    if (entry) {
      setHashMap(hashMap.filter(e => e.key !== searchKey));
      setExplanation(`✅ DELETE("${searchKey}"): Removed successfully`);
    } else {
      setExplanation(`❌ DELETE("${searchKey}"): Key not found!`);
    }
  };

  const has = () => {
    if (!searchKey.trim()) {
      setExplanation('❌ Enter a key to check!');
      return;
    }

    const exists = hashMap.some(e => e.key === searchKey);

    if (exists) {
      setExplanation(`✅ HAS("${searchKey}"): Yes, key exists!`);
      setHighlightKey(searchKey);
      setTimeout(() => setHighlightKey(null), 1000);
    } else {
      setExplanation(`❌ HAS("${searchKey}"): No, key doesn&apos;t exist`);
    }
  };

  const clear = () => {
    setHashMap([]);
    setExplanation('🗑️ Hash Map cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🗺️ Hash Map Pattern</h1>
              <p className="text-sm text-gray-600">Key-Value Storage with O(1) Access</p>
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
              <strong>Imagine a magical dictionary that works super fast...</strong>
            </p>
            <p>
              You tell it a <strong>KEY</strong> (like &ldquo;apple&rdquo;), and it instantly shows you the <strong>VALUE</strong> (like &ldquo;red&rdquo;). You don&apos;t flip through pages - it just <strong>knows</strong> where everything is!
            </p>
            <p>
              <strong>Why is this useful?</strong> Hash maps let us <strong>find things instantly</strong>, no matter how much data we have. It&apos;s like magic!
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-cyan-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Phone contacts (name → phone number)</li>
                <li>Dictionary (word → definition)</li>
                <li>Caching frequently used data</li>
                <li>Counting frequency of elements</li>
                <li>Finding duplicates or unique items</li>
                <li>Two Sum problem and variants</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Interactive Hash Map Visualization
          </h3>

          {/* Explanation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-semibold text-center">{explanation}</p>
          </div>

          {/* Hash Map Visualization */}
          <div className="min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-4 border-gray-300">
            {hashMap.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg">Hash Map is empty 📭</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hashMap.map((entry, index) => (
                  <motion.div
                    key={entry.key}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`rounded-lg shadow-lg p-4 border-4 transition-all ${
                      highlightKey === entry.key
                        ? 'bg-gradient-to-r from-yellow-300 to-amber-300 border-yellow-500 scale-105'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-400 border-cyan-600'
                    }`}
                  >
                    <div className="text-white">
                      <div className="text-xs font-semibold mb-1 opacity-80">KEY</div>
                      <div className="font-bold text-lg mb-2 break-all">{entry.key}</div>
                      <div className="border-t-2 border-white/30 my-2"></div>
                      <div className="text-xs font-semibold mb-1 opacity-80">VALUE</div>
                      <div className="font-bold text-lg break-all">{entry.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Hash Map Info */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-600">Size</div>
              <div className="text-2xl font-bold text-purple-900">{hashMap.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-600">Keys Count</div>
              <div className="text-2xl font-bold text-green-900">{hashMap.length}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-orange-600">Is Empty?</div>
              <div className="text-2xl font-bold text-orange-900">
                {hashMap.length === 0 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* SET Controls */}
          <div className="mt-8 space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-3">SET (Add/Update Key-Value)</h4>
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 w-40 text-center font-bold"
                  placeholder="Key"
                />
                <span className="text-2xl">→</span>
                <input
                  type="text"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 w-40 text-center font-bold"
                  placeholder="Value"
                />
                <button
                  onClick={set}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                >
                  SET
                </button>
              </div>
            </div>

            {/* SEARCH Controls */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-3">Search Operations</h4>
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 w-48 text-center font-bold"
                  placeholder="Search Key"
                />
                <button
                  onClick={get}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
                >
                  GET
                </button>
                <button
                  onClick={has}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  HAS
                </button>
                <button
                  onClick={remove}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  DELETE
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={clear}
                className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl"
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        </div>

        {/* Operations Explanation */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Hash Map Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">➕</span>
                <span>SET(key, value)</span>
              </h4>
              <p className="text-green-800 text-sm">Add or update a key-value pair. Average O(1) time complexity.</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <span>GET(key)</span>
              </h4>
              <p className="text-blue-800 text-sm">Retrieve value for a key. Average O(1) time complexity.</p>
            </div>
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <span>HAS(key)</span>
              </h4>
              <p className="text-purple-800 text-sm">Check if key exists. Average O(1) time complexity.</p>
            </div>
            <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🗑️</span>
                <span>DELETE(key)</span>
              </h4>
              <p className="text-red-800 text-sm">Remove a key-value pair. Average O(1) time complexity.</p>
            </div>
          </div>
        </div>

        {/* Hash Function Explanation */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-violet-900 mb-4 flex items-center gap-2">
            <span>🔮</span>
            <span>How Does It Work? (Hash Function Magic)</span>
          </h3>
          <div className="space-y-3 text-violet-800">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-semibold mb-2">1. Hash Function converts KEY → INDEX</p>
              <p className="text-sm">Example: &ldquo;apple&rdquo; → hash → index 3</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-semibold mb-2">2. Store VALUE at that INDEX</p>
              <p className="text-sm">Store &ldquo;red&rdquo; at position 3</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-semibold mb-2">3. Lookup is instant!</p>
              <p className="text-sm">&ldquo;apple&rdquo; → hash → index 3 → get value &ldquo;red&rdquo;</p>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Hash Map?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Keywords:</strong> &ldquo;count&rdquo;, &ldquo;frequency&rdquo;, &ldquo;lookup&rdquo;, &ldquo;find pair&rdquo;, &ldquo;cache&rdquo;
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Need to:</strong> Store and retrieve data quickly using keys
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Problems:</strong> Two Sum, Group Anagrams, Frequency Counter, LRU Cache
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <strong>Pro Tip:</strong> If you see &ldquo;find in O(1)&rdquo; or &ldquo;count occurrences&rdquo;, think Hash Map!
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <strong>Common Pattern:</strong> Trade space (O(n)) for time (O(1)) - store data to access instantly
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
