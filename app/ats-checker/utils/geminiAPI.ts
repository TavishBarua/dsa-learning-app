// Google Gemini API integration for resume optimization

export interface GeminiConfig {
  apiKey: string;
  model: string; // 'gemini-1.5-flash' for free tier
}

export interface RateLimitInfo {
  requestsPerMinute: number;
  requestsPerDay: number;
  lastMinuteReset: number;
  lastDayReset: number;
  isLimited: boolean;
  timeUntilReset: number; // milliseconds
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Call Google Gemini API with a prompt
 * @param prompt - The prompt to send to Gemini
 * @param config - API configuration (key and model)
 * @returns The generated text response
 */
export async function callGeminiAPI(
  prompt: string,
  config: GeminiConfig
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;

  const response = await fetch(`${endpoint}?key=${config.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data: GeminiResponse = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Build an optimization prompt for resume improvement
 * @param jd - Job description text
 * @param resume - Current resume text
 * @returns Structured prompt for Gemini
 */
export function buildOptimizationPrompt(jd: string, resume: string): string {
  return `You are an expert ATS resume optimizer and career coach with deep knowledge of applicant tracking systems.

TASK: Optimize the resume below to match the job description, maximizing ATS compatibility while maintaining complete truthfulness.

JOB DESCRIPTION:
${jd}

CURRENT RESUME:
${resume}

OPTIMIZATION RULES:
1. **Keywords**: Naturally integrate important keywords from the JD into the resume where truthful
2. **Action Verbs**: Use strong action verbs (Led, Implemented, Achieved, Developed, Designed, etc.)
3. **Quantification**: Emphasize metrics and quantifiable achievements (X% improvement, $Y saved, Z users)
4. **Relevance**: Reorder bullet points to emphasize experiences most relevant to this JD
5. **Skills**: Highlight JD-mentioned skills prominently in the skills section
6. **Truthfulness**: NEVER fabricate experience, companies, or achievements - only reframe existing content
7. **ATS Format**: Use standard section headers (EXPERIENCE, EDUCATION, SKILLS, SUMMARY, etc.)
8. **Structure**: Preserve the original resume's section structure and order
9. **Professional Tone**: Maintain professional language throughout
10. **Consistency**: Keep formatting consistent (dates, locations, etc.)

IMPORTANT:
- Do NOT add any experience or skills that aren't already in the original resume
- Do NOT change company names, job titles, or dates
- Only enhance how existing information is presented
- Focus on keyword optimization and stronger phrasing

OUTPUT FORMAT:
Return ONLY the optimized resume text with clear section headers. Do not include any explanations, commentary, or notes - just the resume itself.`;
}

/**
 * Optimize a resume using Gemini AI
 * @param jd - Job description
 * @param resume - Current resume text
 * @param apiKey - Gemini API key
 * @returns Optimized resume text
 */
export async function optimizeResumeWithAI(
  jd: string,
  resume: string,
  apiKey: string
): Promise<string> {
  const prompt = buildOptimizationPrompt(jd, resume);
  const config: GeminiConfig = {
    apiKey,
    model: 'gemini-1.5-flash'
  };

  return await callGeminiAPI(prompt, config);
}

// Rate Limiting Management
const RATE_LIMIT_STORAGE_KEY = 'gemini_rate_limits';
const MAX_REQUESTS_PER_MINUTE = 14; // Buffer: 15 is the limit, use 14 to be safe
const MAX_REQUESTS_PER_DAY = 1400; // Buffer: 1500 is the limit, use 1400 to be safe

interface RateLimitData {
  minuteRequests: number[];
  dayRequests: number[];
}

/**
 * Get current rate limit data from localStorage
 */
function getRateLimitData(): RateLimitData {
  if (typeof window === 'undefined') {
    return { minuteRequests: [], dayRequests: [] };
  }

  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  if (!stored) {
    return { minuteRequests: [], dayRequests: [] };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { minuteRequests: [], dayRequests: [] };
  }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: RateLimitData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Clean up old timestamps (older than 1 minute or 1 day)
 */
function cleanupTimestamps(timestamps: number[], maxAge: number): number[] {
  const now = Date.now();
  return timestamps.filter(ts => now - ts < maxAge);
}

/**
 * Check if we can make a request without exceeding rate limits
 */
export function checkRateLimit(): RateLimitInfo {
  const data = getRateLimitData();
  const now = Date.now();

  // Clean up old timestamps
  const minuteRequests = cleanupTimestamps(data.minuteRequests, 60 * 1000); // 1 minute
  const dayRequests = cleanupTimestamps(data.dayRequests, 24 * 60 * 60 * 1000); // 24 hours

  // Check limits
  const minuteLimitReached = minuteRequests.length >= MAX_REQUESTS_PER_MINUTE;
  const dayLimitReached = dayRequests.length >= MAX_REQUESTS_PER_DAY;

  let timeUntilReset = 0;
  if (minuteLimitReached && minuteRequests.length > 0) {
    const oldestRequest = Math.min(...minuteRequests);
    timeUntilReset = 60 * 1000 - (now - oldestRequest);
  } else if (dayLimitReached && dayRequests.length > 0) {
    const oldestRequest = Math.min(...dayRequests);
    timeUntilReset = 24 * 60 * 60 * 1000 - (now - oldestRequest);
  }

  return {
    requestsPerMinute: minuteRequests.length,
    requestsPerDay: dayRequests.length,
    lastMinuteReset: now,
    lastDayReset: now,
    isLimited: minuteLimitReached || dayLimitReached,
    timeUntilReset: Math.max(0, timeUntilReset)
  };
}

/**
 * Record a new API request
 */
export function recordRequest(): void {
  const data = getRateLimitData();
  const now = Date.now();

  // Clean up old requests
  const minuteRequests = cleanupTimestamps(data.minuteRequests, 60 * 1000);
  const dayRequests = cleanupTimestamps(data.dayRequests, 24 * 60 * 60 * 1000);

  // Add new request
  minuteRequests.push(now);
  dayRequests.push(now);

  saveRateLimitData({
    minuteRequests,
    dayRequests
  });
}

/**
 * Get remaining requests for display
 */
export function getRemainingRequests(): {
  perMinute: number;
  perDay: number;
} {
  const limit = checkRateLimit();
  return {
    perMinute: Math.max(0, MAX_REQUESTS_PER_MINUTE - limit.requestsPerMinute),
    perDay: Math.max(0, MAX_REQUESTS_PER_DAY - limit.requestsPerDay)
  };
}

/**
 * Format time until reset for display
 */
export function formatTimeUntilReset(milliseconds: number): string {
  if (milliseconds <= 0) return 'Now';

  const minutes = Math.floor(milliseconds / (60 * 1000));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}
