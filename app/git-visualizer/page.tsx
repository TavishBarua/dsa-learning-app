'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { GitCommand, GitCommandCategory, GitState, Commit, Branch, File as GitFile } from './types';
import { gitCommands, commandsByCategory } from './data/gitCommands';

export default function GitVisualizerPage() {
  // UI State
  const [selectedCategory, setSelectedCategory] = useState<GitCommandCategory>('Daily');
  const [selectedCommand, setSelectedCommand] = useState<GitCommand | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [gitState, setGitState] = useState<GitState | null>(null);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || !selectedCommand || currentStep >= selectedCommand.steps.length) {
      return;
    }

    const stepDuration = (selectedCommand.steps[currentStep]?.duration || 1000) / speed;
    const timer = setTimeout(() => {
      if (currentStep < selectedCommand.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Animation complete - show final state
        setGitState(selectedCommand.scenario.afterState);
        setIsPlaying(false);
      }
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, selectedCommand, speed]);

  const handleCommandSelect = (command: GitCommand) => {
    setSelectedCommand(command);
    setGitState(command.scenario.beforeState);
    setCurrentStep(0);
    setIsPlaying(true); // Auto-play when command selected
  };

  const handlePlayPause = () => {
    if (!selectedCommand) return;

    if (currentStep >= selectedCommand.steps.length) {
      // Reset if completed
      handleReset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (!selectedCommand) return;
    if (currentStep < selectedCommand.steps.length) {
      setCurrentStep(currentStep + 1);
      if (currentStep === selectedCommand.steps.length - 1) {
        setGitState(selectedCommand.scenario.afterState);
      }
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 1 && selectedCommand) {
        setGitState(selectedCommand.scenario.beforeState);
      }
    }
  };

  const handleReset = () => {
    if (selectedCommand) {
      setGitState(selectedCommand.scenario.beforeState);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const categories: GitCommandCategory[] = ['Setup', 'Daily', 'Branching', 'Advanced', 'Troubleshooting'];

  const currentExplanation = selectedCommand?.steps[currentStep]?.description || selectedCommand?.scenario.explanation || 'Select a Git command to see how it works!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-3 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🌳 Git Visualizer
          </h1>
          <p className="text-gray-600 text-lg">
            Interactive visualization of Git commands - See how Git works under the hood!
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ELI5 Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">
              🎓 Explain Like I&apos;m 5: What is Git?
            </h2>
            <p className="text-blue-800 leading-relaxed text-lg">
              Git is like a <strong>time machine for your code</strong>! Imagine you&apos;re building with LEGO blocks. Git helps you:
              <br />• <strong>Save snapshots</strong> of your work at any point (commits)
              <br />• <strong>Try different ideas</strong> without breaking your main creation (branches)
              <br />• <strong>Share your work</strong> with friends and combine your builds (push/pull)
              <br />• <strong>Go back in time</strong> if you make a mistake
              <br /><br />
              Below, you&apos;ll see four zones showing how your code moves through Git: from your computer&apos;s files (Working Directory),
              to a waiting area (Staging), to your local save points (Local Repository), and finally to the cloud where teammates can access it (Remote Repository).
            </p>
          </div>
        </motion.div>

        {/* Category Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-white rounded-xl p-3 shadow-md border-2 border-indigo-100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Command Grid */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {selectedCategory} Commands
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commandsByCategory[selectedCategory].map((command) => (
              <motion.button
                key={command.id}
                onClick={() => handleCommandSelect(command)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-xl p-5 shadow-lg border-2 text-left transition-all ${
                  selectedCommand?.id === command.id
                    ? 'border-indigo-500 shadow-indigo-200'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
                } ${command.isDangerous ? 'border-red-300' : ''}`}
              >
                {command.isDangerous && (
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded mb-2">
                    ⚠️ DANGEROUS
                  </span>
                )}
                <h4 className="font-mono font-bold text-lg text-indigo-600 mb-1">
                  {command.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  {command.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Visualization Area */}
        {selectedCommand && gitState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Warning for dangerous commands */}
            {selectedCommand.isDangerous && selectedCommand.scenario.warnings && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  ⚠️ DANGER ZONE
                </h4>
                <ul className="space-y-1">
                  {selectedCommand.scenario.warnings.map((warning, idx) => (
                    <li key={idx} className="text-red-800 text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Current Step Explanation */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 shadow-md">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Current Step: {currentStep + 1} / {selectedCommand.steps.length}
              </h3>
              <p className="text-purple-800 text-lg font-medium">
                {currentExplanation}
              </p>
            </div>

            {/* Git Flow Visualization */}
            <div className="bg-white rounded-xl shadow-xl border-2 border-indigo-100 p-6 space-y-6">
              {/* Remote Repository */}
              <RepositoryZone
                title="Remote Repository (GitHub/GitLab)"
                repository={gitState.remoteRepository}
                color="purple"
                icon="☁️"
              />

              {/* Connection Indicator */}
              <ConnectionArrow direction="vertical" label="push / pull / fetch" />

              {/* Local Repository */}
              <RepositoryZone
                title="Local Repository (.git folder)"
                repository={gitState.localRepository}
                color="blue"
                icon="💾"
                currentBranch={gitState.currentBranch}
                head={gitState.HEAD}
              />

              {/* Connection Indicator */}
              <ConnectionArrow direction="vertical" label="commit" />

              {/* Staging Area */}
              <FileZone
                title="Staging Area (Index)"
                files={gitState.stagingArea}
                color="green"
                icon="📋"
              />

              {/* Connection Indicator */}
              <ConnectionArrow direction="vertical" label="add" />

              {/* Working Directory */}
              <FileZone
                title="Working Directory (Your Files)"
                files={gitState.workingDirectory}
                color="gray"
                icon="📁"
              />
            </div>

            {/* Interactive Controls */}
            <div className="bg-white rounded-xl shadow-xl border-2 border-indigo-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">
                🎮 Controls
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                >
                  {isPlaying ? '⏸️ Pause' : currentStep >= selectedCommand.steps.length ? '↻ Replay' : '▶️ Play'}
                </button>
                <button
                  onClick={handleStepBackward}
                  disabled={currentStep === 0}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏮️ Step Back
                </button>
                <button
                  onClick={handleStepForward}
                  disabled={currentStep >= selectedCommand.steps.length}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Step Forward ⏭️
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                >
                  ↻ Reset
                </button>
              </div>

              {/* Speed Control */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-indigo-900">⚡ Speed Control:</label>
                  <span className="text-indigo-900 font-bold">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-indigo-700 mt-1">
                  <span>🐌 0.3x (Very Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>🚀 2.0x (Fast)</span>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl shadow-xl border-2 border-gray-700 p-6">
              <h3 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
                <span>💻</span> Command
              </h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <code className="text-green-400 font-mono text-sm">
                  {selectedCommand.scenario.codeExample}
                </code>
              </pre>
              {selectedCommand.scenario.codeOutput && (
                <>
                  <h4 className="font-bold text-white mt-4 mb-2 text-sm">Output:</h4>
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-gray-300 font-mono text-xs">
                      {selectedCommand.scenario.codeOutput}
                    </code>
                  </pre>
                </>
              )}
            </div>

            {/* When to Use & Best Practices */}
            {(selectedCommand.whenToUse || selectedCommand.bestPractices) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCommand.whenToUse && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6">
                    <h3 className="font-bold text-teal-900 mb-3 text-lg flex items-center gap-2">
                      <span>🎯</span> When to Use
                    </h3>
                    <ul className="space-y-2">
                      {selectedCommand.whenToUse.map((item, idx) => (
                        <li key={idx} className="text-teal-800 flex items-start gap-2">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedCommand.bestPractices && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-3 text-lg flex items-center gap-2">
                      <span>✅</span> Best Practices
                    </h3>
                    <ul className="space-y-2">
                      {selectedCommand.bestPractices.map((item, idx) => (
                        <li key={idx} className="text-green-800 flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedCommand && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Select a Git Command to Begin
            </h2>
            <p className="text-gray-600">
              Choose a command from above to see an interactive visualization of how it works!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// ============= COMPONENTS =============

interface RepositoryZoneProps {
  title: string;
  repository: { branches: Branch[]; commits: Commit[] };
  color: 'purple' | 'blue';
  icon: string;
  currentBranch?: string;
  head?: string;
}

function RepositoryZone({ title, repository, color, icon, currentBranch, head }: RepositoryZoneProps) {
  const colorClasses = {
    purple: {
      bg: 'from-purple-50 to-violet-50',
      border: 'border-purple-300',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-800'
    },
    blue: {
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-lg p-5`}>
      <h4 className={`font-bold ${colors.text} mb-3 flex items-center gap-2 text-lg`}>
        <span className="text-2xl">{icon}</span>
        {title}
      </h4>

      {repository.branches.length > 0 ? (
        <div className="space-y-3">
          {repository.branches.map((branch) => (
            <div key={branch.name} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono font-bold ${branch.isActive ? 'text-indigo-600' : 'text-gray-600'}`}>
                  {branch.isActive && '→ '}{branch.name}
                </span>
                {branch.commitHash && (
                  <span className={`text-xs font-mono ${colors.badge} px-2 py-1 rounded`}>
                    {branch.commitHash.slice(0, 7)}
                  </span>
                )}
              </div>

              {/* Commit visualization */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {repository.commits
                  .filter(c => c.branch === branch.name || !branch.isRemote)
                  .map((commit, idx) => (
                    <motion.div
                      key={commit.hash}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex-shrink-0"
                    >
                      <CommitNode
                        commit={commit}
                        isHead={commit.hash === head}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No repository initialized</p>
      )}
    </div>
  );
}

interface CommitNodeProps {
  commit: Commit;
  isHead?: boolean;
}

function CommitNode({ commit, isHead }: CommitNodeProps) {
  return (
    <div className="relative group">
      {isHead && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded whitespace-nowrap"
        >
          HEAD
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${
          isHead
            ? 'from-yellow-400 to-amber-500'
            : 'from-indigo-500 to-purple-600'
        } flex items-center justify-center text-white font-bold shadow-lg cursor-pointer`}
      >
        <span className="text-xs">●</span>
      </motion.div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10 shadow-xl">
        <div className="font-mono font-bold">{commit.hash.slice(0, 7)}</div>
        <div className="text-gray-300">{commit.message}</div>
      </div>
    </div>
  );
}

interface FileZoneProps {
  title: string;
  files: GitFile[];
  color: 'green' | 'gray';
  icon: string;
}

function FileZone({ title, files, color, icon }: FileZoneProps) {
  const colorClasses = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-300',
      text: 'text-green-900'
    },
    gray: {
      bg: 'from-gray-50 to-slate-50',
      border: 'border-gray-300',
      text: 'text-gray-900'
    }
  };

  const colors = colorClasses[color];

  const getFileStatusColor = (status: string) => {
    switch (status) {
      case 'modified': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'added': case 'untracked': return 'bg-green-100 border-green-400 text-green-800';
      case 'deleted': return 'bg-red-100 border-red-400 text-red-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-lg p-5 min-h-[100px]`}>
      <h4 className={`font-bold ${colors.text} mb-3 flex items-center gap-2 text-lg`}>
        <span className="text-2xl">{icon}</span>
        {title}
      </h4>

      {files.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {files.map((file, idx) => (
              <motion.div
                key={file.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`px-3 py-2 rounded-lg border-2 font-mono text-sm font-semibold ${getFileStatusColor(file.status)}`}
              >
                {file.name}
                <span className="ml-2 text-xs opacity-75">({file.status})</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No files</p>
      )}
    </div>
  );
}

interface ConnectionArrowProps {
  direction: 'vertical';
  label: string;
}

function ConnectionArrow({ label }: ConnectionArrowProps) {
  return (
    <div className="flex flex-col items-center py-2">
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-400 text-3xl"
      >
        ↓
      </motion.div>
      <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border-2 border-gray-300">
        {label}
      </span>
    </div>
  );
}
