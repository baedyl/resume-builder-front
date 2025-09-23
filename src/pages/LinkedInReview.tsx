import { useState, useEffect } from 'react';
import { FaLinkedin, FaCheckCircle, FaExclamationTriangle, FaTimes, FaStar, FaEye, FaThumbsUp, FaShare, FaDownload, FaExternalLinkAlt, FaCrown, FaClock } from 'react-icons/fa';
import LoadingOverlay from '../components/LoadingOverlay';
import Breadcrumbs from '../components/Breadcrumbs';
import { linkedinService } from '../services/linkedinService';
import { LinkedInAnalysis, RateLimitInfo } from '../types/linkedin';

const LinkedInReview: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [analysisType, setAnalysisType] = useState<'basic' | 'premium'>('basic');

  useEffect(() => {
    // Load rate limit info on component mount
    loadRateLimitInfo();
  }, []);

  const loadRateLimitInfo = async () => {
    const info = await linkedinService.getRateLimitInfo();
    setRateLimitInfo(info);
  };

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileUrl.trim()) {
      setError('Please enter a LinkedIn profile URL');
      return;
    }

    if (!validateLinkedInUrl(profileUrl)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // For development, use mock data. In production, this would call the real API
      const useMockData = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('localhost');
      
      let result;
      if (useMockData) {
        // Use mock data for development
        result = {
          success: true,
          data: linkedinService.generateMockAnalysis(profileUrl, analysisType)
        };
      } else {
        // Use real API
        result = await linkedinService.analyzeProfile({
          profileUrl,
          analysisType
        });
      }

      if (result.success && result.data) {
        setAnalysis(result.data);
        // Refresh rate limit info
        await loadRateLimitInfo();
      } else {
        setError(result.error || 'Failed to analyze profile');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const formatTimeUntilReset = (resetTime: number) => {
    const now = Date.now();
    const diff = resetTime - now;
    if (diff <= 0) return 'Reset now';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaLinkedin className="text-blue-600 dark:text-blue-400 mr-3" />
                LinkedIn Profile Review
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Get AI-powered analysis of your LinkedIn profile to maximize your professional visibility
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="mt-8">
          {/* Rate Limit Info */}
          {rateLimitInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaClock className="text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    LinkedIn Analysis: {rateLimitInfo.linkedin.remaining} remaining
                  </span>
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Resets in {formatTimeUntilReset(rateLimitInfo.linkedin.resetTime)}
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Analyze Your LinkedIn Profile
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile URL
                </label>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      id="profileUrl"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <FaEye className="mr-2" />
                    {isLoading ? 'Analyzing...' : 'Analyze Profile'}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {error}
                  </p>
                )}
              </div>

              {/* Analysis Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Analysis Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      analysisType === 'basic' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setAnalysisType('basic')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="analysisType"
                        value="basic"
                        checked={analysisType === 'basic'}
                        onChange={() => setAnalysisType('basic')}
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Basic Analysis</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Free analysis with essential insights</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      analysisType === 'premium' 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setAnalysisType('premium')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="analysisType"
                        value="premium"
                        checked={analysisType === 'premium'}
                        onChange={() => setAnalysisType('premium')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">Premium Analysis</h3>
                          <FaCrown className="text-yellow-500 ml-2" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive analysis with industry insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                What we analyze:
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Profile URL structure and professionalism</li>
                <li>• Keyword optimization and SEO</li>
                <li>• Professional presentation quality</li>
                <li>• Industry alignment and trends</li>
                <li>• Career progression analysis</li>
                <li>• Competitive positioning insights</li>
              </ul>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Profile Analysis Complete
                  </h2>
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(analysis.overallScore)}`}>
                    <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
                    Overall Profile Score
                  </p>
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      analysis.analysisType === 'premium' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    }`}>
                      {analysis.analysisType === 'premium' ? (
                        <>
                          <FaCrown className="mr-1" />
                          Premium Analysis
                        </>
                      ) : (
                        'Basic Analysis'
                      )}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Expires: {new Date(analysis.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Presentation Scores */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Professional Presentation Analysis
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Headline</span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.professionalPresentation.headlineScore)}`}>
                        {analysis.professionalPresentation.headlineScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${analysis.professionalPresentation.headlineScore >= 80 ? 'bg-green-500' : analysis.professionalPresentation.headlineScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.professionalPresentation.headlineScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">About Section</span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.professionalPresentation.aboutScore)}`}>
                        {analysis.professionalPresentation.aboutScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${analysis.professionalPresentation.aboutScore >= 80 ? 'bg-green-500' : analysis.professionalPresentation.aboutScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.professionalPresentation.aboutScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.professionalPresentation.experienceScore)}`}>
                        {analysis.professionalPresentation.experienceScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${analysis.professionalPresentation.experienceScore >= 80 ? 'bg-green-500' : analysis.professionalPresentation.experienceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.professionalPresentation.experienceScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.professionalPresentation.skillsScore)}`}>
                        {analysis.professionalPresentation.skillsScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${analysis.professionalPresentation.skillsScore >= 80 ? 'bg-green-500' : analysis.professionalPresentation.skillsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.professionalPresentation.skillsScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Presentation</span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.professionalPresentation.overallPresentationScore)}`}>
                        {analysis.professionalPresentation.overallPresentationScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${analysis.professionalPresentation.overallPresentationScore >= 80 ? 'bg-green-500' : analysis.professionalPresentation.overallPresentationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.professionalPresentation.overallPresentationScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <FaStar className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <FaTimes className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaThumbsUp className="text-blue-500 mr-2" />
                  Recommendations
                </h3>
                <ul className="space-y-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keyword Analysis */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Current Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.currentKeywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Suggested Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.suggestedKeywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordOptimization.missingKeywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium Analysis Details */}
              {analysis.detailedAnalysis && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaCrown className="text-purple-500 mr-2" />
                    Premium Analysis Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Industry Alignment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Alignment Score</span>
                          <span className={`text-sm font-semibold ${getScoreColor(analysis.detailedAnalysis.industryAlignment)}`}>
                            {analysis.detailedAnalysis.industryAlignment}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${analysis.detailedAnalysis.industryAlignment >= 80 ? 'bg-green-500' : analysis.detailedAnalysis.industryAlignment >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${analysis.detailedAnalysis.industryAlignment}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Career Progression</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Progression Score</span>
                          <span className={`text-sm font-semibold ${getScoreColor(analysis.detailedAnalysis.careerProgression)}`}>
                            {analysis.detailedAnalysis.careerProgression}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${analysis.detailedAnalysis.careerProgression >= 80 ? 'bg-green-500' : analysis.detailedAnalysis.careerProgression >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${analysis.detailedAnalysis.careerProgression}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Position</h4>
                      <p className="text-gray-600 dark:text-gray-400">{analysis.detailedAnalysis.marketPosition}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Competitive Advantages</h4>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                        {analysis.detailedAnalysis.competitiveAdvantages.map((advantage, index) => (
                          <li key={index}>{advantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={analysis.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    View Profile on LinkedIn
                  </a>
                  <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FaDownload className="mr-2" />
                    Download Report
                  </button>
                  <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FaShare className="mr-2" />
                    Share Results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInReview;