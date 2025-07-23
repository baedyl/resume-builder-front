import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import ResumeList from '../components/ResumeList';
import ResumeForm from '../components/ResumeForm';
import { ResumeFormData } from '../types/resume';

const ResumeBuilder: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  // Check if a resume was passed from navigation state
  useEffect(() => {
    if (location.state?.selectedResume) {
      setSelectedResume(location.state.selectedResume);
    }
  }, [location.state]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Resume Builder</h1>
          <p className="text-gray-600 mb-6">Please sign in to create and manage your resumes.</p>
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleBackToList = () => {
    setSelectedResume(null);
  };

  const isEnhanced = location.state?.isEnhanced;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 lg:px-4 md:px-0 transition-colors duration-300">
      {selectedResume ? (
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              ← Back to Resume List
            </button>
            {isEnhanced && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Resume Enhanced Successfully
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Your resume has been optimized for the job description you provided. Review the changes and save when ready.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ResumeForm initialData={selectedResume} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Resume Builder</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create and manage your professional resumes
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedResume({} as ResumeFormData)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Resume
              </button>
            </div>
          </div>
          <ResumeList onSelectResume={setSelectedResume} />
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder; 
