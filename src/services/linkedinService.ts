import axios from 'axios';
import { 
  LinkedInAnalysis, 
  LinkedInAnalysisRequest, 
  LinkedInAnalysisResponse, 
  LinkedInAnalysisListResponse,
  RateLimitInfo 
} from '../types/linkedin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class LinkedInService {
  private cache = new Map<string, { data: LinkedInAnalysis; expiresAt: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_ENTRIES = 1000;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private generateCacheKey(profileUrl: string, analysisType: string = 'basic'): string {
    return `${analysisType}:${profileUrl}`;
  }

  private isCacheValid(expiresAt: number): boolean {
    return Date.now() < expiresAt;
  }

  private cleanupCache(): void {
    if (this.cache.size > this.MAX_CACHE_ENTRIES) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
      
      // Remove oldest 20% of entries
      const toRemove = Math.floor(this.MAX_CACHE_ENTRIES * 0.2);
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  private getCachedAnalysis(profileUrl: string, analysisType: string = 'basic'): LinkedInAnalysis | null {
    const cacheKey = this.generateCacheKey(profileUrl, analysisType);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.expiresAt)) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  private setCachedAnalysis(profileUrl: string, analysis: LinkedInAnalysis): void {
    const cacheKey = this.generateCacheKey(profileUrl, analysis.analysisType);
    this.cache.set(cacheKey, {
      data: analysis,
      expiresAt: new Date(analysis.expiresAt).getTime()
    });
    
    this.cleanupCache();
  }

  async analyzeProfile(request: LinkedInAnalysisRequest): Promise<LinkedInAnalysisResponse> {
    try {
      // Check cache first
      const cached = this.getCachedAnalysis(request.profileUrl, request.analysisType);
      if (cached) {
        return {
          success: true,
          data: cached
        };
      }

      const response = await axios.post<LinkedInAnalysisResponse>(
        `${API_BASE_URL}/api/linkedin/analyze`,
        request,
        {
          headers: this.getAuthHeaders(),
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data.success && response.data.data) {
        this.setCachedAnalysis(request.profileUrl, response.data.data);
      }

      return response.data;
    } catch (error: any) {
      console.error('LinkedIn analysis error:', error);
      
      if (error.response?.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          rateLimitInfo: {
            remaining: 0,
            resetTime: Date.now() + 60000 // 1 minute
          }
        };
      }

      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Authentication required. Please log in again.'
        };
      }

      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timeout. Please try again.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.error || 'Failed to analyze LinkedIn profile. Please try again.'
      };
    }
  }

  async getAnalysis(analysisId: string): Promise<LinkedInAnalysisResponse> {
    try {
      const response = await axios.get<LinkedInAnalysisResponse>(
        `${API_BASE_URL}/api/linkedin/analysis/${analysisId}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Get analysis error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to retrieve analysis.'
      };
    }
  }

  async getAnalyses(): Promise<LinkedInAnalysisListResponse> {
    try {
      const response = await axios.get<LinkedInAnalysisListResponse>(
        `${API_BASE_URL}/api/linkedin/analyses`,
        {
          headers: this.getAuthHeaders()
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Get analyses error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to retrieve analyses.'
      };
    }
  }

  async deleteAnalysis(analysisId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/linkedin/analysis/${analysisId}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      // Remove from cache
      for (const [key, value] of this.cache.entries()) {
        if (value.data.id === analysisId) {
          this.cache.delete(key);
          break;
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Delete analysis error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete analysis.'
      };
    }
  }

  async getRateLimitInfo(): Promise<RateLimitInfo | null> {
    try {
      const response = await axios.get<RateLimitInfo>(
        `${API_BASE_URL}/api/linkedin/rate-limits`,
        {
          headers: this.getAuthHeaders()
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Get rate limit info error:', error);
      return null;
    }
  }

  // Mock data for development/testing
  generateMockAnalysis(profileUrl: string, analysisType: 'basic' | 'premium' = 'basic'): LinkedInAnalysis {
    const username = profileUrl.split('/in/')[1]?.split('/')[0] || 'user';
    const hasGoodLength = username.length >= 5 && username.length <= 30;
    const hasNumbers = /\d/.test(username);
    const hasSpecialChars = /[^a-zA-Z0-9-]/.test(username);
    
    const baseScore = 60;
    const lengthBonus = hasGoodLength ? 15 : -10;
    const numberPenalty = hasNumbers ? -5 : 0;
    const specialCharPenalty = hasSpecialChars ? -15 : 0;
    
    const overallScore = Math.max(30, Math.min(95, baseScore + lengthBonus + numberPenalty + specialCharPenalty));
    
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    
    if (hasGoodLength) {
      strengths.push('Professional username length');
    } else {
      weaknesses.push('Username length could be optimized');
      recommendations.push('Consider adjusting username length to 5-30 characters');
    }
    
    if (!hasNumbers) {
      strengths.push('Clean, professional username');
    } else {
      weaknesses.push('Username contains numbers');
      recommendations.push('Consider using a cleaner username without numbers');
    }
    
    if (!hasSpecialChars) {
      strengths.push('Professional username format');
    } else {
      weaknesses.push('Username contains special characters');
      recommendations.push('Remove special characters for better readability');
    }
    
    // Add general recommendations
    recommendations.push('Ensure your profile is complete with all sections filled');
    recommendations.push('Use industry-specific keywords in your headline');
    recommendations.push('Add a professional profile picture');
    recommendations.push('Request recommendations from colleagues');
    recommendations.push('Regularly update your experience with achievements');
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_DURATION);
    
    return {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      profileUrl,
      overallScore,
      strengths,
      weaknesses,
      recommendations,
      keywordOptimization: {
        currentKeywords: ['leadership', 'management', 'strategy'],
        suggestedKeywords: ['project management', 'team building', 'data analysis'],
        missingKeywords: ['agile', 'scrum', 'stakeholder management']
      },
      professionalPresentation: {
        headlineScore: Math.max(40, overallScore - 5),
        aboutScore: Math.max(35, overallScore - 10),
        experienceScore: Math.max(45, overallScore),
        skillsScore: Math.max(30, overallScore - 15),
        overallPresentationScore: Math.max(35, overallScore - 8)
      },
      detailedAnalysis: analysisType === 'premium' ? {
        industryAlignment: Math.max(40, overallScore - 5),
        careerProgression: Math.max(35, overallScore - 10),
        skillGaps: ['Advanced analytics', 'Cloud technologies', 'Leadership development'],
        marketPosition: 'Mid-level professional with growth potential',
        competitiveAdvantages: ['Strong technical foundation', 'Good communication skills'],
        industryTrends: ['Remote work adaptation', 'Digital transformation', 'Sustainability focus']
      } : undefined,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      analysisType
    };
  }
}

export const linkedinService = new LinkedInService();
