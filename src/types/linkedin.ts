export interface LinkedInAnalysis {
  id: string;
  profileUrl: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordOptimization: {
    currentKeywords: string[];
    suggestedKeywords: string[];
    missingKeywords: string[];
  };
  professionalPresentation: {
    headlineScore: number;
    aboutScore: number;
    experienceScore: number;
    skillsScore: number;
    overallPresentationScore: number;
  };
  detailedAnalysis?: {
    industryAlignment: number;
    careerProgression: number;
    skillGaps: string[];
    marketPosition: string;
    competitiveAdvantages: string[];
    industryTrends: string[];
  };
  createdAt: string;
  expiresAt: string;
  analysisType: 'basic' | 'premium';
}

export interface LinkedInAnalysisRequest {
  profileUrl: string;
  analysisType?: 'basic' | 'premium';
}

export interface LinkedInAnalysisResponse {
  success: boolean;
  data?: LinkedInAnalysis;
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

export interface LinkedInAnalysisListResponse {
  success: boolean;
  data?: LinkedInAnalysis[];
  error?: string;
}

export interface RateLimitInfo {
  linkedin: {
    remaining: number;
    resetTime: number;
  };
  general: {
    remaining: number;
    resetTime: number;
  };
}
