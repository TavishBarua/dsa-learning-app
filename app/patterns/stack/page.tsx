'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StackPattern() {
  const [stack, setStack] = useState<number[]>([]);
  const [input, setInput] = useState('5');
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState('🎯 Stack: Last In, First Out (LIFO)');
  const [operation, setOperation] = useState<'push' | 'pop' | null>(null);

  const maxStackSize = 8;

  const push = () => {
    if (stack.length >= maxStackSize) {
      setExplanation('❌ Stack Overflow! Cannot push more elements.');
      return;
    }
    const value = parseInt(input) || Math.floor(Math.random() * 100);
    setStack([...stack, value]);
    setOperation('push');
    setExplanation(`✅ PUSH(${value}): Added to the TOP of stack`);
    setTimeout(() => setOperation(null), 500);
  };

  const pop = () => {
    if (stack.length === 0) {
      setExplanation('❌ Stack Underflow! Cannot pop from empty stack.');
      return;
    }
    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setOperation('pop');
    setExplanation(`✅ POP(): Removed ${poppedValue} from the TOP`);
    setTimeout(() => setOperation(null), 500);
  };

  const peek = () => {
    if (stack.length === 0) {
      setExplanation('❌ Stack is empty! Nothing to peek.');
      return;
    }
    setExplanation(`👀 PEEK(): Top element is ${stack[stack.length - 1]}`);
  };

  const clear = () => {
    setStack([]);
    setExplanation('🗑️ Stack cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">📚 Stack Pattern</h1>
              <p className="text-sm text-gray-600">Last In, First Out (LIFO)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Explanation */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>Explain Like I&apos;m 5</span>
          </h2>
          <div className="text-orange-800 space-y-3">
            <p className="text-lg">
              <strong>Imagine a stack of plates in your kitchen...</strong>
            </p>
            <p>
              When you wash a plate, you put it on <strong>TOP</strong> of the stack. When you need a plate, you take the <strong>TOP</strong> one (the last one you added). You can&apos;t take a plate from the middle or bottom without removing the ones on top first!
            </p>
            <p>
              <strong>Why is this useful?</strong> Stacks help us remember <strong>where we came from</strong>. Like browser back button, undo in editors, or checking if brackets are balanced!
            </p>
            <div className="bg-white/50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-orange-900 mb-2">Real-world use cases:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Browser back/forward buttons</li>
                <li>Undo/Redo in text editors</li>
                <li>Function call stack in programming</li>
                <li>Balanced parentheses checking</li>
                <li>Expression evaluation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Interactive Stack Visualization
          </h3>

          {/* Explanation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-semibold text-center">{explanation}</p>
          </div>

          {/* Stack Visualization */}
          <div className="flex flex-col-reverse items-center gap-2 min-h-[400px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 border-4 border-gray-300 relative">
            {/* Bottom label */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-semibold">
              BOTTOM ⬇️
            </div>

            {/* Top label */}
            {stack.length > 0 && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-semibold animate-pulse">
                TOP ⬆️ (LIFO)
              </div>
            )}

            {stack.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg">Stack is empty 📭</p>
              </div>
            ) : (
              stack.map((value, index) => (
                <motion.div
                  key={`${value}-${index}`}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`w-48 h-16 flex items-center justify-center rounded-lg shadow-lg font-bold text-2xl border-4 ${
                    index === stack.length - 1
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-600 text-white scale-110'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-400 border-blue-600 text-white'
                  }`}
                >
                  {value}
                  {index === stack.length - 1 && (
                    <span className="ml-2 text-sm">← TOP</span>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Stack Info */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-600">Size</div>
              <div className="text-2xl font-bold text-purple-900">{stack.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-600">Top Element</div>
              <div className="text-2xl font-bold text-green-900">
                {stack.length > 0 ? stack[stack.length - 1] : 'N/A'}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-orange-600">Is Empty?</div>
              <div className="text-2xl font-bold text-orange-900">
                {stack.length === 0 ? 'Yes' : 'No'}
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
                onClick={push}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                PUSH (Add to Top)
              </button>
              <button
                onClick={pop}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                POP (Remove from Top)
              </button>
              <button
                onClick={peek}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                PEEK (View Top)
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
          <h3 className="text-xl font-bold text-gray-800 mb-6">Stack Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⬆️</span>
                <span>PUSH(x)</span>
              </h4>
              <p className="text-green-800 text-sm">Add element to the TOP of stack. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⬇️</span>
                <span>POP()</span>
              </h4>
              <p className="text-red-800 text-sm">Remove and return TOP element. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">👀</span>
                <span>PEEK() / TOP()</span>
              </h4>
              <p className="text-blue-800 text-sm">View TOP element without removing it. O(1) time complexity.</p>
            </div>
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <span>isEmpty()</span>
              </h4>
              <p className="text-purple-800 text-sm">Check if stack is empty. O(1) time complexity.</p>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>When to Use Stack?</span>
          </h3>
          <div className="space-y-3 text-emerald-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Keywords:</strong> &ldquo;reverse&rdquo;, &ldquo;undo&rdquo;, &ldquo;backtrack&rdquo;, &ldquo;nested&rdquo;, &ldquo;balanced&rdquo;
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Need to:</strong> Process items in reverse order or remember previous states
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <strong>Problems:</strong> Parentheses matching, expression evaluation, DFS, backtracking
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <strong>Pro Tip:</strong> If you need &ldquo;most recent&rdquo; or &ldquo;last added&rdquo;, think Stack!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
