// Type definitions for ATS Resume Optimizer

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    duration: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    year: string;
    gpa?: string;
  }>;
  skills: {
    [category: string]: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

export interface ATSResult {
  score: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  formatIssues: string[];
  skillsFound: string[];
  experienceMatch: string;
}

export interface OptimizationResult {
  originalResume: string;
  optimizedResume: string;
  improvements: string[];
  keywordsAdded: string[];
  score: {
    before: number;
    after: number;
  };
}

export type OptimizationMode = 'analyze' | 'optimize';
