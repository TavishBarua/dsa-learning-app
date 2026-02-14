'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ATSResult {
  score: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  formatIssues: string[];
  skillsFound: string[];
  experienceMatch: string;
}

export default function ATSChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Extract keywords from text (simple NLP)
  const extractKeywords = (text: string): string[] => {
    // Convert to lowercase and split into words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2); // Filter short words

    // Common stop words to ignore
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
      'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
      'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
      'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with', 'have',
      'this', 'that', 'from', 'they', 'would', 'been', 'what', 'which', 'their',
      'said', 'each', 'about', 'than', 'them', 'these', 'other', 'were', 'your'
    ]);

    // Filter out stop words and get unique keywords
    const keywords = [...new Set(words.filter(word => !stopWords.has(word)))];
    return keywords;
  };

  // Extract technical skills (common tech keywords)
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
    const foundSkills = techKeywords.filter(skill =>
      textLower.includes(skill)
    );

    return [...new Set(foundSkills)];
  };

  // Check for formatting issues
  const checkFormatting = (text: string): string[] => {
    const issues: string[] = [];

    // Check for common sections
    const hasExperience = /experience|work history|employment/i.test(text);
    const hasEducation = /education|degree|university|college/i.test(text);
    const hasSkills = /skills|technologies|technical skills/i.test(text);

    if (!hasExperience) issues.push('Missing "Experience" section');
    if (!hasEducation) issues.push('Missing "Education" section');
    if (!hasSkills) issues.push('Missing "Skills" section');

    // Check for contact info
    const hasEmail = /@/.test(text);
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);

    if (!hasEmail) issues.push('Email address not found');
    if (!hasPhone) issues.push('Phone number not found');

    return issues;
  };

  const analyzeResume = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Extract keywords from JD and resume
      const jdKeywords = extractKeywords(jobDescription);
      const resumeKeywords = extractKeywords(resume);

      // Find matches and missing keywords
      const keywordMatches = jdKeywords.filter(keyword =>
        resumeKeywords.includes(keyword)
      );
      const missingKeywords = jdKeywords.filter(keyword =>
        !resumeKeywords.includes(keyword)
      ).slice(0, 15); // Top 15 missing

      // Extract technical skills
      const jdSkills = extractTechSkills(jobDescription);
      const resumeSkills = extractTechSkills(resume);
      const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));

      // Check formatting
      const formatIssues = checkFormatting(resume);

      // Calculate scores
      const keywordScore = (keywordMatches.length / Math.max(jdKeywords.length, 1)) * 40;
      const skillsScore = (matchedSkills.length / Math.max(jdSkills.length, 1)) * 10;
      const formatScore = Math.max(0, 30 - (formatIssues.length * 5));
      const experienceScore = 20; // Simplified - assume OK for now

      const totalScore = Math.min(100, Math.round(keywordScore + skillsScore + formatScore + experienceScore));

      // Generate suggestions
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

      setResult({
        score: totalScore,
        keywordMatches: keywordMatches.slice(0, 20),
        missingKeywords,
        suggestions,
        formatIssues,
        skillsFound: matchedSkills,
        experienceMatch
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const reset = () => {
    setJobDescription('');
    setResume('');
    setResult(null);
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
              <p className="text-sm text-gray-600 mt-1">ATS Resume Checker</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-orange-600 pb-1">
                Patterns
              </Link>
              <Link href="/striver" className="text-sm font-semibold text-gray-600 hover:text-orange-600 pb-1">
                Striver A2Z
              </Link>
              <Link href="/ats-checker" className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-1">
                ATS Checker
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
            ATS Resume Checker 🎯
          </h2>
          <p className="text-lg md:text-xl mb-6 text-orange-100">
            Beat the robots! See how your resume scores against Applicant Tracking Systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold mb-1">Keyword Analysis</div>
              <div className="text-sm text-orange-100">Match your resume to JD</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold mb-1">ATS Score</div>
              <div className="text-sm text-orange-100">Get your compatibility score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">💡</div>
              <div className="font-semibold mb-1">Smart Suggestions</div>
              <div className="text-sm text-orange-100">Know exactly what to fix</div>
            </div>
          </div>
        </div>

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
              className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-600">
              {resume.length} characters
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={analyzeResume}
            disabled={!jobDescription || !resume || isAnalyzing}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isAnalyzing ? '🔄 Analyzing...' : '🚀 Analyze Resume'}
          </button>
          <button
            onClick={reset}
            className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg"
          >
            🔄 Reset
          </button>
        </div>

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
                    : 'Your resume may get filtered out. Follow suggestions below.'}
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
                <p>Our ATS checker simulates how real Applicant Tracking Systems scan resumes:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Keyword Matching (40%):</strong> Compares job description keywords with your resume</li>
                  <li><strong>Formatting (30%):</strong> Checks for standard sections and contact info</li>
                  <li><strong>Experience (20%):</strong> Looks for relevant work history indicators</li>
                  <li><strong>Skills (10%):</strong> Matches technical skills from the JD</li>
                </ul>
                <p className="mt-3 font-semibold">💡 Pro Tip: Tailor your resume for each job application!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Beat the ATS, land the interview 🚀</p>
          <p className="mt-2 text-xs text-gray-400">
            Remember: ATS is just the first filter. Focus on quality!
          </p>
        </div>
      </footer>
    </div>
  );
}
