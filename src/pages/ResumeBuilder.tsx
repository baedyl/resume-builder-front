import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ResumeList from '../components/ResumeList';
import ResumeForm from '../components/ResumeForm';
import { ResumeFormData } from '../types/resume';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResumeBuilder: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Cover letter form state
  const [showCoverForm, setShowCoverForm] = useState(false);
  const [coverForm, setCoverForm] = useState({
    jobDescription: '',
  });
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverResult, setCoverResult] = useState('');
  const [editableCover, setEditableCover] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const handleCoverInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCoverForm({ ...coverForm, [e.target.name]: e.target.value });
  };

  const handleCoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoverError(null);
    setCoverResult('');
    if (!coverForm.jobDescription.trim()) {
      setCoverError('Job description is required.');
      return;
    }
    setCoverLoading(true);
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/cover-letter`, coverForm, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setCoverResult(response.data.coverLetter || response.data.result || JSON.stringify(response.data));
      setEditableCover(response.data.coverLetter || response.data.result || JSON.stringify(response.data));
    } catch (err: any) {
      setCoverError(err.response?.data?.error || err.message || 'Failed to generate cover letter.');
    } finally {
      setCoverLoading(false);
    }
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900"></h1>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedResume({} as ResumeFormData)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Resume
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setShowCoverForm((v) => !v)}
              >
                Create Cover Letter
              </button>
            </div>
          </div>
          {showCoverForm && (
            <div className="mb-8 w-full bg-white p-6 rounded-lg shadow-lg border">
              <form onSubmit={handleCoverSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="jobDescription" className="block font-medium text-gray-700">Job Description<span className="text-red-500">*</span></label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={coverForm.jobDescription}
                    onChange={handleCoverInputChange}
                    required
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {coverError && <div className="text-red-600 text-sm">{coverError}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={coverLoading}
                >
                  {coverLoading ? 'Generating...' : 'Generate Cover Letter'}
                </button>
              </form>
              {coverResult && (
                <div className="mt-6">
                  <div className="flex items-center mb-2 gap-2">
                    <h4 className="font-semibold text-lg">Generated Cover Letter</h4>
                    <button
                      type="button"
                      aria-label="Copy cover letter"
                      className="ml-2 p-1 rounded hover:bg-gray-200 transition"
                      onClick={async () => {
                        await navigator.clipboard.writeText(editableCover);
                        toast.success('Cover letter copied to clipboard!');
                      }}
                    >
                      {/* Copy icon (SVG) */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6.75A2.25 2.25 0 0014.25 4.5h-6A2.25 2.25 0 006 6.75v10.5A2.25 2.25 0 008.25 19.5h1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 8.25h-6A2.25 2.25 0 0010.5 10.5v6A2.25 2.25 0 0012.75 18.75h6A2.25 2.25 0 0021 16.5v-6a2.25 2.25 0 00-2.25-2.25z" />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    className="whitespace-pre-wrap bg-gray-100 p-4 rounded border text-gray-800 text-sm overflow-x-auto w-full min-h-[200px] resize-vertical"
                    value={editableCover}
                    onChange={e => setEditableCover(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <ResumeList onSelectResume={setSelectedResume} />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResumeBuilder; 
