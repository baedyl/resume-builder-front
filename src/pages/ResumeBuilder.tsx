import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ResumeList from '../components/ResumeList';
import ResumeForm from '../components/ResumeForm';
import { ResumeFormData } from '../types/resume';

const ResumeBuilder: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {selectedResume ? (
        <ResumeForm initialData={selectedResume} />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900"></h1>
            <button
              onClick={() => setSelectedResume({} as ResumeFormData)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Resume
            </button>
          </div>
          <ResumeList onSelectResume={setSelectedResume} />
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder; 