import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './LoadingOverlay';
import PremiumGate from './PremiumGate';

const ResumeApplicationForm: React.FC = () => {
  const { id: resumeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError('Job description is required.');
      toast.error('Job description is required.');
      return;
    }

    if (!resumeId) {
      setError('Resume ID is missing.');
      toast.error('Resume ID is missing.');
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessTokenSilently({ 
        audience: import.meta.env.VITE_API_AUDIENCE 
      } as any);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/${resumeId}/enhance-pdf`,
        {
          userId: user?.sub,
          resumeId,
          jobDescription: jobDescription.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      // Navigate to resume builder with enhanced data
      toast.success('Resume enhanced successfully! Redirecting to builder...');
      
      // Extract enhanced data from response and format dates
      const enhancedData = response.data.enhanced;
      
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
        ...enhancedData,
        workExperience: enhancedData.workExperience?.map((exp: any, index: number) => ({
          ...exp,
          id: exp.id || Date.now() + index, // Add temporary ID if missing
          startDate: formatDateToYYYYMM(exp.startDate),
          endDate: formatDateToYYYYMM(exp.endDate),
        })) || [],
        education: enhancedData.education?.map((edu: any, index: number) => ({
          ...edu,
          id: edu.id || Date.now() + index + 1000, // Add temporary ID if missing
          graduationYear: edu.graduationYear || '',
        })) || [],
        certifications: enhancedData.certifications?.map((cert: any, index: number) => ({
          ...cert,
          id: cert.id || Date.now() + index + 2000, // Add temporary ID if missing
          issueDate: formatDateToYYYYMM(cert.issueDate),
        })) || [],
        skills: enhancedData.skills?.map((skill: any, index: number) => ({
          ...skill,
          id: skill.id || Date.now() + index + 3000, // Add temporary ID if missing
        })) || [],
        languages: enhancedData.languages?.map((lang: any, index: number) => ({
          ...lang,
          id: lang.id || Date.now() + index + 4000, // Add temporary ID if missing
        })) || []
      };
      
      setTimeout(() => {
        navigate('/my-resumes', { 
          state: { 
            selectedResume: formattedData,
            isEnhanced: true 
          } 
        });
      }, 1500);

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
        description="Get your resume optimized by AI for specific job descriptions. Improve your chances with ATS-friendly keywords and tailored content."
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical min-h-[200px]"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The more detailed the job description, the better the AI can tailor your resume.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !jobDescription.trim()}
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
