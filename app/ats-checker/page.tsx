'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ATSResult, OptimizationMode } from './types';
import {
  optimizeResumeWithAI,
  checkRateLimit,
  recordRequest,
  getRemainingRequests,
  formatTimeUntilReset
} from './utils/geminiAPI';
import { getAPIKey, saveAPIKey, hasAPIKey, clearAPIKey } from './utils/apiKeyStorage';
import { extractTextFromPDF, validatePDFFile } from './utils/pdfParser';

export default function ATSChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [mode, setMode] = useState<OptimizationMode>('analyze');

  // API Key management
  const [apiKey, setApiKeyState] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Rate limiting
  const [rateLimit, setRateLimit] = useState(checkRateLimit());
  const [remainingRequests, setRemainingRequests] = useState(getRemainingRequests());

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');

  // Comparison view
  const [showComparison, setShowComparison] = useState(false);
  const [improvements, setImprovements] = useState<string[]>([]);

  // Load API key on mount
  useEffect(() => {
    const savedKey = getAPIKey();
    if (savedKey) {
      setApiKeyState(savedKey);
      setApiKeySaved(true);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // Update rate limit periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(checkRateLimit());
      setRemainingRequests(getRemainingRequests());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      saveAPIKey(apiKey.trim());
      setApiKeySaved(true);
      setShowApiKeyInput(false);
    }
  };

  const handleClearApiKey = () => {
    clearAPIKey();
    setApiKeyState('');
    setApiKeySaved(false);
    setShowApiKeyInput(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    const validation = validatePDFFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    try {
      const text = await extractTextFromPDF(file);
      setResume(text);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to extract PDF text');
    }
  };

  // Extract keywords from text (simple NLP)
  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
      'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
      'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
      'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with', 'have',
      'this', 'that', 'from', 'they', 'would', 'been', 'what', 'which', 'their',
      'said', 'each', 'about', 'than', 'them', 'these', 'other', 'were', 'your'
    ]);

    const keywords = [...new Set(words.filter(word => !stopWords.has(word)))];
    return keywords;
  };

  // Extract technical skills
  const extractTechSkills = (text: string): string[] => {
    const techKeywords = [
      'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
      'node', 'nodejs', 'express', 'django', 'flask', 'spring', 'aws', 'azure',
      'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'sql', 'mongodb', 'postgresql',
      'redis', 'graphql', 'rest', 'api', 'microservices', 'agile', 'scrum',
      'machine learning', 'ml', 'ai', 'data science', 'tensorflow', 'pytorch',
      'html', 'css', 'sass', 'tailwind', 'bootstrap', 'nextjs', 'next.js',
      'reactjs', 'react.js', 'vuejs', 'vue.js', 'angularjs', 'ci/cd', 'devops'
    ];

    const textLower = text.toLowerCase();
    const foundSkills = techKeywords.filter(skill => textLower.includes(skill));
    return [...new Set(foundSkills)];
  };

  // Check for formatting issues
  const checkFormatting = (text: string): string[] => {
    const issues: string[] = [];
    const hasExperience = /experience|work history|employment/i.test(text);
    const hasEducation = /education|degree|university|college/i.test(text);
    const hasSkills = /skills|technologies|technical skills/i.test(text);

    if (!hasExperience) issues.push('Missing "Experience" section');
    if (!hasEducation) issues.push('Missing "Education" section');
    if (!hasSkills) issues.push('Missing "Skills" section');

    const hasEmail = /@/.test(text);
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);

    if (!hasEmail) issues.push('Email address not found');
    if (!hasPhone) issues.push('Phone number not found');

    return issues;
  };

  const calculateScore = (resumeText: string): ATSResult => {
    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const keywordMatches = jdKeywords.filter(keyword => resumeKeywords.includes(keyword));
    const missingKeywords = jdKeywords.filter(keyword => !resumeKeywords.includes(keyword)).slice(0, 15);

    const jdSkills = extractTechSkills(jobDescription);
    const resumeSkills = extractTechSkills(resumeText);
    const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));

    const formatIssues = checkFormatting(resumeText);

    const keywordScore = (keywordMatches.length / Math.max(jdKeywords.length, 1)) * 40;
    const skillsScore = (matchedSkills.length / Math.max(jdSkills.length, 1)) * 10;
    const formatScore = Math.max(0, 30 - (formatIssues.length * 5));
    const experienceScore = 20;

    const totalScore = Math.min(100, Math.round(keywordScore + skillsScore + formatScore + experienceScore));

    const suggestions: string[] = [];
    if (keywordScore < 20) {
      suggestions.push('🎯 Add more keywords from the job description to your resume');
    }
    if (matchedSkills.length < jdSkills.length * 0.7) {
      suggestions.push('💻 Include more technical skills mentioned in the JD');
    }
    if (formatIssues.length > 0) {
      suggestions.push('📝 Fix resume structure - add missing sections');
    }
    if (missingKeywords.length > 10) {
      suggestions.push('🔑 You\'re missing many important keywords - review the JD carefully');
    }
    if (totalScore >= 80) {
      suggestions.push('✅ Great job! Your resume is well-optimized for this JD');
    }

    const experienceMatch = resumeSkills.length > 0
      ? 'Experience keywords found in resume'
      : 'No clear experience indicators found';

    return {
      score: totalScore,
      keywordMatches: keywordMatches.slice(0, 20),
      missingKeywords,
      suggestions,
      formatIssues,
      skillsFound: matchedSkills,
      experienceMatch
    };
  };

  const analyzeResume = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = calculateScore(resume);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const optimizeWithAI = async () => {
    if (!apiKeySaved || !apiKey) {
      alert('Please set your Gemini API key first');
      setShowApiKeyInput(true);
      return;
    }

    // Check rate limit
    const limit = checkRateLimit();
    if (limit.isLimited) {
      alert(`Rate limit reached. Please try again in ${formatTimeUntilReset(limit.timeUntilReset)}`);
      return;
    }

    setIsOptimizing(true);
    setImprovements([]);

    try {
      const optimized = await optimizeResumeWithAI(jobDescription, resume, apiKey);

      // Record the request
      recordRequest();
      setRateLimit(checkRateLimit());
      setRemainingRequests(getRemainingRequests());

      setOptimizedResume(optimized);

      // Calculate scores for comparison
      const originalScore = calculateScore(resume);
      const optimizedScore = calculateScore(optimized);

      setResult(optimizedScore);
      setShowComparison(true);

      // Generate improvement summary
      const improvementList: string[] = [];
      const scoreDiff = optimizedScore.score - originalScore.score;
      if (scoreDiff > 0) {
        improvementList.push(`📈 ATS score improved by ${scoreDiff} points`);
      }

      const newKeywords = optimizedScore.keywordMatches.filter(
        k => !originalScore.keywordMatches.includes(k)
      );
      if (newKeywords.length > 0) {
        improvementList.push(`🔑 Added ${newKeywords.length} relevant keywords`);
      }

      const newSkills = optimizedScore.skillsFound.filter(
        s => !originalScore.skillsFound.includes(s)
      );
      if (newSkills.length > 0) {
        improvementList.push(`💻 Highlighted ${newSkills.length} additional skills`);
      }

      const fixedIssues = originalScore.formatIssues.length - optimizedScore.formatIssues.length;
      if (fixedIssues > 0) {
        improvementList.push(`✅ Fixed ${fixedIssues} formatting issues`);
      }

      setImprovements(improvementList.length > 0 ? improvementList : ['✨ Resume optimized for ATS compatibility']);

    } catch (error) {
      console.error('Optimization error:', error);
      alert(error instanceof Error ? error.message : 'Failed to optimize resume. Please check your API key and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const reset = () => {
    setJobDescription('');
    setResume('');
    setOptimizedResume('');
    setResult(null);
    setShowComparison(false);
    setImprovements([]);
    setUploadError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Resume copied to clipboard!');
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Pattern Detective 🔍
              </Link>
              <p className="text-sm text-gray-600 mt-1">AI-Powered ATS Resume Optimizer</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-orange-600 pb-1">
                Patterns
              </Link>
              <Link href="/striver" className="text-sm font-semibold text-gray-600 hover:text-orange-600 pb-1">
                Striver A2Z
              </Link>
              <Link href="/git-visualizer" className="text-sm font-semibold text-gray-600 hover:text-orange-600 pb-1">
                🌳 Git
              </Link>
              <Link href="/ats-checker" className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-1">
                ATS Optimizer
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🤖 AI-Powered ATS Resume Optimizer
          </h2>
          <p className="text-lg md:text-xl mb-6 text-orange-100">
            Let AI optimize your resume for any job description. Beat the robots, land more interviews!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold mb-1">Upload Resume</div>
              <div className="text-sm text-orange-100">PDF or paste text</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-semibold mb-1">AI Optimization</div>
              <div className="text-sm text-orange-100">Smart keyword matching</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">✏️</div>
              <div className="font-semibold mb-1">Edit & Refine</div>
              <div className="text-sm text-orange-100">Full control over changes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">💾</div>
              <div className="font-semibold mb-1">Export PDF</div>
              <div className="text-sm text-orange-100">Download & apply</div>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <AnimatePresence>
          {showApiKeyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span>🔑</span>
                <span>Google Gemini API Key Setup</span>
              </h3>
              <p className="text-purple-800 mb-4">
                To use AI optimization, you need a free Google Gemini API key. Don't worry - it's completely free and takes 1 minute!
              </p>
              <div className="bg-white/50 rounded-lg p-4 mb-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-purple-900">
                  <li>
                    Visit{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline font-semibold"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Click "Create API Key"</li>
                  <li>Copy the key (starts with "AIza...")</li>
                  <li>Paste it below</li>
                </ol>
              </div>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  placeholder="Paste your API key here (AIza...)"
                  className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  Save Key
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-2">
                🔒 Your API key is stored locally in your browser only. We never send it to our servers.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Key Status & Rate Limit Info */}
        {apiKeySaved && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-bold text-green-900">API Key Active</div>
                <div className="text-sm text-green-700">
                  Remaining: {remainingRequests.perMinute}/min, {remainingRequests.perDay}/day
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-sm text-green-700 hover:text-green-900 underline"
              >
                Change Key
              </button>
              <button
                onClick={handleClearApiKey}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Rate Limit Warning */}
        {rateLimit.isLimited && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="font-bold text-red-900">Rate Limit Reached</div>
                <div className="text-sm text-red-700">
                  Please try again in {formatTimeUntilReset(rateLimit.timeUntilReset)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>Job Description</span>
            </h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. Experience with AWS, Docker, and microservices architecture is required..."
              className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-600">
              {jobDescription.length} characters
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📄</span>
              <span>Your Resume</span>
            </h3>

            {/* File Upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <span>📤</span>
                <span>Upload PDF Resume</span>
              </button>
              {uploadError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  ⚠️ {uploadError}
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500 mb-3">OR</div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer
Email: john@example.com | Phone: 555-1234

EXPERIENCE
Senior Developer at Tech Corp (2020-Present)
- Built scalable applications using React and TypeScript
- Implemented microservices with Node.js and Docker..."
              className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-600">
              {resume.length} characters
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={analyzeResume}
            disabled={!jobDescription || !resume || isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isAnalyzing ? '🔄 Analyzing...' : '📊 Analyze Only'}
          </button>

          <button
            onClick={optimizeWithAI}
            disabled={!jobDescription || !resume || !apiKeySaved || isOptimizing || rateLimit.isLimited}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isOptimizing ? '🤖 Optimizing...' : '🤖 Optimize with AI'}
          </button>

          <button
            onClick={reset}
            className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg"
          >
            🔄 Reset
          </button>
        </div>

        {/* Optimized Resume Display */}
        {optimizedResume && showComparison && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>✨</span>
              <span>AI-Optimized Resume</span>
            </h3>

            {/* Improvements Summary */}
            {improvements.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-green-900 mb-3">📈 Improvements Made:</h4>
                <ul className="space-y-2">
                  {improvements.map((imp, idx) => (
                    <li key={idx} className="text-green-800 flex items-start gap-2">
                      <span>•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-4">
              <textarea
                value={optimizedResume}
                onChange={(e) => setOptimizedResume(e.target.value)}
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-mono text-sm bg-white"
              />
              <div className="text-xs text-gray-500 mt-2">
                ✏️ Editable - Feel free to make any changes
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => copyToClipboard(optimizedResume)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={downloadPDF}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all"
              >
                💾 Download PDF
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 Your ATS Score
              </h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke={result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(result.score / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-5xl font-black ${
                      result.score >= 80 ? 'text-green-600' :
                      result.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.score}
                    </span>
                    <span className="text-gray-600 font-semibold">/ 100</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className={`text-xl font-bold mb-2 ${
                  result.score >= 80 ? 'text-green-600' :
                  result.score >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {result.score >= 80 ? '🎉 Excellent!' :
                   result.score >= 60 ? '👍 Good, but can improve' :
                   '⚠️ Needs work'}
                </p>
                <p className="text-gray-600">
                  {result.score >= 80
                    ? 'Your resume is well-optimized for ATS systems!'
                    : result.score >= 60
                    ? 'Your resume will pass most ATS, but optimization will help.'
                    : 'Your resume may get filtered out. Use AI optimization above!'}
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">💡 Recommendations</h3>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-blue-900">
                      <span className="text-xl">•</span>
                      <span className="font-semibold">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Matched Keywords */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  ✅ Matched Keywords ({result.keywordMatches.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywordMatches.map((keyword, idx) => (
                    <span key={idx} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">
                  ❌ Missing Keywords ({result.missingKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, idx) => (
                    <span key={idx} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Found */}
            {result.skillsFound.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  💻 Technical Skills Matched ({result.skillsFound.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillsFound.map((skill, idx) => (
                    <span key={idx} className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Format Issues */}
            {result.formatIssues.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">
                  ⚠️ Formatting Issues ({result.formatIssues.length})
                </h3>
                <ul className="space-y-2">
                  {result.formatIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-yellow-900 font-semibold">
                      <span>•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h4 className="text-lg font-bold text-orange-900 mb-2">How This Works</h4>
              <div className="text-orange-800 space-y-2 text-sm">
                <p>Our AI-powered optimizer uses Google Gemini to intelligently enhance your resume:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Keyword Optimization:</strong> Naturally integrates JD keywords into your resume</li>
                  <li><strong>Action Verbs:</strong> Strengthens bullet points with powerful action words</li>
                  <li><strong>Quantification:</strong> Emphasizes metrics and achievements</li>
                  <li><strong>ATS Compatibility:</strong> Ensures proper formatting for automated systems</li>
                  <li><strong>Truthfulness:</strong> Never fabricates - only reframes existing content</li>
                </ul>
                <p className="mt-3 font-semibold">🔒 Privacy: Your API key and resume data stay in your browser. We never see them!</p>
                <p className="mt-2 font-semibold">♻️ Rate Limiting: We protect you from exceeding Google's free tier limits automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Beat the ATS, land more interviews with AI 🚀</p>
          <p className="mt-2 text-xs text-gray-400">
            Powered by Google Gemini AI • 100% Free • Privacy-First
          </p>
        </div>
      </footer>

      {/* Print-specific styles for PDF export */}
      <style jsx global>{`
        @media print {
          header, footer, button, nav {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0.5in;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
          }
        }
      `}</style>
    </div>
  );
}
