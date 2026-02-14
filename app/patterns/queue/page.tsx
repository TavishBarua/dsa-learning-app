'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function QueuePattern() {
  const [queue, setQueue] = useState<number[]>([]);
  const [input, setInput] = useState('5');
  const [explanation, setExplanation] = useState('🎯 Queue: First In, First Out (FIFO)');
  const [operation, setOperation] = useState<'enqueue' | 'dequeue' | null>(null);

  const maxQueueSize = 8;

  const enqueue = () => {
    if (queue.length >= maxQueueSize) {
      setExplanation('❌ Queue Overflow! Cannot enqueue more elements.');
      return;
    }
    const value = parseInt(input) || Math.floor(Math.random() * 100);
    setQueue([...queue, value]);
    setOperation('enqueue');
    setExplanation(`✅ ENQUEUE(${value}): Added to the REAR of queue`);
    setTimeout(() => setOperation(null), 500);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setExplanation('❌ Queue Underflow! Cannot dequeue from empty queue.');
      return;
    }
    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setOperation('dequeue');
    setExplanation(`✅ DEQUEUE(): Removed ${dequeuedValue} from the FRONT`);
    setTimeout(() => setOperation(null), 500);
  };

  const peek = () => {
    if (queue.length === 0) {
      setExplanation('❌ Queue is empty! Nothing to peek.');
      return;
    }
    setExplanation(`👀 PEEK(): Front element is ${queue[0]}`);
  };

  const clear = () => {
    setQueue([]);
    setExplanation('🗑️ Queue cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎫 Queue Pattern</h1>
              <p className="text-sm text-gray-600">First In, First Out (FIFO)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Explanation */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-purple-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine standing in line at a ticket counter...</strong>
            </p>
            <p>
              The person who came <strong>FIRST</strong> gets served first and leaves from the <strong>FRONT</strong>. New people join at the <strong>BACK</strong> of the line. Everyone waits their turn - no cutting in line!
            </p>
            <p>
              <strong>Why is this useful?</strong> Queues help us handle things <strong>fairly in order</strong>. Like printing documents, processing tasks, or managing requests!
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-purple-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Printer queue (print jobs)</li>
                <li>Customer service lines</li>
                <li>Breadth-First Search (BFS) algorithm</li>
                <li>Task scheduling in operating systems</li>
                <li>Message queues in distributed systems</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Interactive Queue Visualization
          </h3>

          {/* Explanation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-semibold text-center">{explanation}</p>
          </div>

          {/* Queue Visualization */}
          <div className="flex items-center gap-2 min-h-[200px] bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border-4 border-gray-300 relative overflow-x-auto">
            {/* Front label */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-purple-600 font-semibold animate-pulse">
              FRONT ➡️
            </div>

            {/* Rear label */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-pink-600 font-semibold animate-pulse">
              ⬅️ REAR
            </div>

            {queue.length === 0 ? (
              <div className="flex items-center justify-center w-full h-32">
                <p className="text-gray-400 text-lg">Queue is empty 📭</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mx-auto">
                {queue.map((value, index) => (
                  <motion.div
                    key={`${value}-${index}`}
                    initial={{ scale: 0, x: 50 }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`w-20 h-20 flex items-center justify-center rounded-lg shadow-lg font-bold text-xl border-4 flex-shrink-0 ${
                      index === 0
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 border-purple-600 text-white scale-110'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-400 border-blue-600 text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{value}</span>
                      {index === 0 && (
                        <span className="text-[10px] mt-1">FRONT</span>
                      )}
                      {index === queue.length - 1 && (
                        <span className="text-[10px] mt-1">REAR</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Queue Info */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-600">Size</div>
              <div className="text-2xl font-bold text-purple-900">{queue.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-600">Front Element</div>
              <div className="text-2xl font-bold text-green-900">
                {queue.length > 0 ? queue[0] : 'N/A'}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-orange-600">Is Empty?</div>
              <div className="text-2xl font-bold text-orange-900">
                {queue.length === 0 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-4">
            <div className="flex gap-4 items-center justify-center">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 w-32 text-center font-bold"
                placeholder="Value"
              />
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={enqueue}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                ENQUEUE (Add to Rear)
              </button>
              <button
                onClick={dequeue}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                DEQUEUE (Remove from Front)
              </button>
              <button
                onClick={peek}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                PEEK (View Front)
              </button>
              <button
                onClick={clear}
                className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Operations Explanation */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Queue Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">➡️</span>
                <span>ENQUEUE(x)</span>
              </h4>
              <p className="text-green-800 text-sm">Add element to the REAR of queue. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⬅️</span>
                <span>DEQUEUE()</span>
              </h4>
              <p className="text-red-800 text-sm">Remove and return FRONT element. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">👀</span>
                <span>PEEK() / FRONT()</span>
              </h4>
              <p className="text-blue-800 text-sm">View FRONT element without removing it. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <span>isEmpty()</span>
              </h4>
              <p className="text-purple-800 text-sm">Check if queue is empty. O(1) time complexity.</p>
            </div>
          </div>
        </div>

        {/* Stack vs Queue Comparison */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>⚖️</span>
            <span>Stack vs Queue</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-bold text-orange-900 mb-2">📚 Stack (LIFO)</h4>
              <p className="text-sm text-orange-800">Last In, First Out - like plates</p>
              <p className="text-xs text-orange-700 mt-1">Add &amp; Remove from SAME end (top)</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-2">🎫 Queue (FIFO)</h4>
              <p className="text-sm text-purple-800">First In, First Out - like a line</p>
              <p className="text-xs text-purple-700 mt-1">Add at REAR, Remove from FRONT</p>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Queue?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Keywords:</strong> &ldquo;order&rdquo;, &ldquo;first come first serve&rdquo;, &ldquo;level by level&rdquo;, &ldquo;BFS&rdquo;
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Need to:</strong> Process items in the order they arrived
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Problems:</strong> BFS traversal, level-order tree traversal, task scheduling
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <strong>Pro Tip:</strong> If you need &ldquo;fair ordering&rdquo; or &ldquo;first added&rdquo;, think Queue!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
