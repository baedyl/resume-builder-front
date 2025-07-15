import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ResumeList from '../components/ResumeList';
import ResumeForm from '../components/ResumeForm';
import { ResumeFormData } from '../types/resume';
import axios from 'axios';

const ResumeBuilder: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Cover letter form state
  const [showCoverForm, setShowCoverForm] = useState(false);
  const [coverForm, setCoverForm] = useState({
    jobDescription: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverResult, setCoverResult] = useState('');
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
            <div className="mb-8 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg border">
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
                <div>
                  <label htmlFor="fullName" className="block font-medium text-gray-700">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={coverForm.fullName}
                    onChange={handleCoverInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={coverForm.email}
                    onChange={handleCoverInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-medium text-gray-700">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={coverForm.phone}
                    onChange={handleCoverInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block font-medium text-gray-700">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={coverForm.address}
                    onChange={handleCoverInputChange}
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
                  <h4 className="font-semibold text-lg mb-2">Generated Cover Letter</h4>
                  <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded border text-gray-800 text-sm overflow-x-auto">{coverResult}</pre>
                </div>
              )}
            </div>
          )}
          <ResumeList onSelectResume={setSelectedResume} />
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder; 
