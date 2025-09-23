import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './LoadingOverlay';
import PremiumGate from './PremiumGate';
import { FEATURE_DESCRIPTIONS } from '../constants/subscription';
import LanguageSelectionSection from './sections/LanguageSelectionSection';
import { decodeId, encodeId } from '../utils/urlId';
import { getApiUrl, getApiAudience } from '../utils/api';

const ResumeApplicationForm: React.FC = () => {
  const { id: encodedResumeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently, user } = useAuth0();
  
  const [jobDescription, setJobDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Character limit for job description (3,200 characters)
  const JOB_DESCRIPTION_LIMIT = 3200;

  // Get language from navigation state or default to 'en'
  useEffect(() => {
    const resumeLanguage = location.state?.resumeLanguage || 'en';
    setSelectedLanguage(resumeLanguage);
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError('Job description is required.');
      toast.error('Job description is required.');
      return;
    }

    if (jobDescription.length > JOB_DESCRIPTION_LIMIT) {
      setError(`Job description is too long. Please keep it under ${JOB_DESCRIPTION_LIMIT.toLocaleString()} characters.`);
      toast.error(`Job description is too long. Please keep it under ${JOB_DESCRIPTION_LIMIT.toLocaleString()} characters.`);
      return;
    }

    if (!encodedResumeId) {
      setError('Resume ID is missing.');
      toast.error('Resume ID is missing.');
      return;
    }

    setLoading(true);

    try {
      const resumeId = await decodeId(encodedResumeId);
      const token = await getAccessTokenSilently({ 
        audience: getApiAudience() 
      } as any);

      const response = await axios.post(
        `${getApiUrl()}/api/resumes/${resumeId}/enhance-pdf`,
        {
          userId: user?.sub,
          resumeId,
          jobDescription: jobDescription.trim(),
          language: selectedLanguage
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      // Try to get ID of the newly created enhanced resume and redirect to its edit form
      const raw = response?.data;

      // Normalize possible string-encoded payloads
      const normalized = typeof raw === 'string'
        ? (() => { try { return JSON.parse(raw); } catch { return {}; } })()
        : raw;

      // Sometimes the server nests JSON under a data field which itself may be a JSON string
      const nestedData = typeof normalized?.data === 'string'
        ? (() => { try { return JSON.parse(normalized.data); } catch { return {}; } })()
        : (normalized?.data || {});

      const candidates = [
        normalized?.id,
        normalized?.resumeId,
        normalized?.resume?.id,
        normalized?.createdResumeId,
        normalized?.createdResume?.id,
        normalized?.newResumeId,
        normalized?.newResume?.id,
        normalized?.result?.id,
        normalized?.result?.resumeId,
        normalized?.result?.resume?.id,
        normalized?.enhanced?.id,
        normalized?.enhanced?.resumeId,
        nestedData?.id,
        nestedData?.resumeId,
        nestedData?.resume?.id,
      ].filter(Boolean);

      const newResumeId = candidates.length > 0 ? String(candidates[0]) : undefined;

      if (newResumeId) {
        const encodedNewId = await encodeId(newResumeId);
        toast.success('Resume enhanced! Opening editor...');
        navigate(`/my-resumes/${encodedNewId}`);
        return;
      }

      // Fallback: open builder with enhanced data in state if API didn't return a new ID
      toast.success('Resume enhanced! Opening in builder...');
      const enhancedData = normalized.enhanced || nestedData.enhanced || {};

      // Format dates for form inputs (YYYY-MM format)
      const formatDateToYYYYMM = (dateString: string | undefined | null) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 7); // Returns YYYY-MM format
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      // Format the enhanced data for the resume form
      const formattedData = {
        // Personal Information
        fullName: enhancedData.fullName || '',
        email: enhancedData.email || '',
        phone: enhancedData.phone || '',
        address: enhancedData.address || '',
        linkedIn: enhancedData.linkedIn || '',
        website: enhancedData.website || '',
        
        // Professional Summary
        summary: enhancedData.summary || '',
        
        // Work Experience
        workExperience: enhancedData.workExperience?.map((exp: any, index: number) => ({
          id: exp.id || Date.now() + index,
          jobTitle: exp.jobTitle || '',
          company: exp.company || '',
          location: exp.location || '',
          startDate: formatDateToYYYYMM(exp.startDate),
          endDate: exp.endDate === 'Present' ? 'Present' : formatDateToYYYYMM(exp.endDate),
          description: exp.description || '',
          responsibilities: exp.responsibilities || []
        })) || [],
        
        // Education
        education: enhancedData.education?.map((edu: any, index: number) => ({
          id: edu.id || Date.now() + index + 1000,
          institution: edu.institution || '',
          degree: edu.degree || '',
          major: edu.major || '', // fieldOfStudy in response is called major
          graduationYear: edu.graduationYear?.toString() || '',
          gpa: edu.gpa || '',
          description: edu.description || ''
        })) || [],
        
        // Certifications
        certifications: enhancedData.certifications?.map((cert: any, index: number) => ({
          id: cert.id || Date.now() + index + 2000,
          name: cert.name || '',
          issuer: cert.issuer || '', // issuingOrganization in response is called issuer
          issueDate: formatDateToYYYYMM(cert.issueDate),
          expirationDate: formatDateToYYYYMM(cert.expirationDate),
          credentialId: cert.credentialId || ''
        })) || [],
        
        // Skills - already in correct format
        skills: enhancedData.skills?.map((skill: any, index: number) => ({
          id: skill.id || Date.now() + index + 3000,
          name: skill.name || '',
          category: skill.category || 'Technical'
        })) || [],
        
        // Languages - already in correct format
        languages: enhancedData.languages?.map((lang: any, index: number) => ({
          id: lang.id || Date.now() + index + 4000,
          name: lang.name || '',
          proficiency: lang.proficiency || 'Fluent'
        })) || [],
        
        // Language
        language: selectedLanguage
      };
      
      setTimeout(() => {
        navigate('/my-resumes', { 
          state: { 
            selectedResume: formattedData,
            isEnhanced: true 
          } 
        });
      }, 800);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to enhance resume.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-resumes');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-2 sm:px-4 lg:px-8 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      
      <PremiumGate 
        feature="AI Resume Enhancement" 
        description={FEATURE_DESCRIPTIONS.RESUME_ENHANCEMENT}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
            >
              ← Back to Resumes
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
              Enhance Resume for Job Application
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Provide the job description to get an AI-enhanced version of your resume tailored for this specific position. The enhanced resume will open in the resume builder for review and editing.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800 dark:text-red-200">{error}</span>
                  </div>
                </div>
              )}

              {/* Job Description Field */}
              <div className="mb-6">
                <label 
                  htmlFor="jobDescription" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >
                  Job Description *
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here. Include requirements, responsibilities, and any specific skills or qualifications mentioned..."
                  rows={12}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical min-h-[200px] ${
                    jobDescription.length > JOB_DESCRIPTION_LIMIT 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    The more detailed the job description, the better the AI can tailor your resume.
                  </p>
                  <p className={`text-xs ${
                    jobDescription.length > JOB_DESCRIPTION_LIMIT 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {jobDescription.length.toLocaleString()} / {JOB_DESCRIPTION_LIMIT.toLocaleString()} characters
                  </p>
                </div>
                {jobDescription.length > JOB_DESCRIPTION_LIMIT && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Job description is too long. Please keep it under {JOB_DESCRIPTION_LIMIT.toLocaleString()} characters.
                  </p>
                )}
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Resume Language
                </label>
                <LanguageSelectionSection 
                  selectedLanguage={selectedLanguage} 
                  onLanguageChange={setSelectedLanguage}
                  compact={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !jobDescription.trim() || jobDescription.length > JOB_DESCRIPTION_LIMIT}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
                >
                  {loading ? 'Enhancing Resume...' : 'Enhance Resume'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Information Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 sm:p-8 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                How Resume Enhancement Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  AI analyzes the job description to identify key requirements and skills
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Your resume content is optimized to highlight relevant experience
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Keywords are strategically incorporated for ATS compatibility
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Enhanced resume opens in the builder for review and final editing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PremiumGate>
    </div>
  );
};

export default ResumeApplicationForm;
