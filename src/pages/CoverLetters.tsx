import React, { useState } from 'react';
import CoverLetterList from '../components/CoverLetterList';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CoverLetters: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', fullName: '', jobDescription: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');
  const [editableCover, setEditableCover] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (coverLetter: any) => {
    setShowForm(true);
    setIsEdit(true);
    setForm({
      id: coverLetter.id,
      fullName: coverLetter.fullName || coverLetter.name || coverLetter.title || '',
      jobDescription: coverLetter.jobDescription || '',
    });
    setGenerated(coverLetter.content || '');
    setEditableCover(coverLetter.content || '');
    setSavedId(coverLetter.id);
    setFormError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setGenerated('');
    setEditableCover('');
    setSavedId(null);
    if (!form.jobDescription.trim()) {
      setFormError('Job description is required.');
      return;
    }
    setLoading(true);
    try {
      let response;
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      if (isEdit && form.id) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/cover-letter/${form.id}`, { ...form, content: editableCover }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/cover-letter`, form, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      const coverLetter = response.data.coverLetter || response.data.result || response.data.content || JSON.stringify(response.data);
      setGenerated(coverLetter);
      setEditableCover(coverLetter);
      setSavedId(response.data.record?.id || response.data.id || form.id);
    } catch (err: any) {
      setFormError(err.response?.data?.error || err.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableCover);
    toast.success('Cover letter copied to clipboard!');
  };

  const handleGeneratePDF = async () => {
    if (!savedId) return;
    setPdfLoading(true);
    setFormError(null);
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cover-letter/${savedId}/pdf`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.fullName || 'CoverLetter'}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setFormError(err.response?.data?.error || err.message || 'Failed to generate PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!savedId) return;
    setLoading(true);
    setFormError(null);
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cover-letter/${savedId}`, {
        ...form,
        content: editableCover,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Cover letter updated successfully!');
    } catch (err: any) {
      setFormError(err.response?.data?.error || err.message || 'Failed to update cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setForm({ id: '', fullName: '', jobDescription: '' });
    setFormError(null);
    setGenerated('');
    setEditableCover('');
    setSavedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-2 sm:px-4 lg:px-8 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Cover Letters</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Create New Cover Letter
            </button>
          )}
        </div>
        {showForm ? (
          <>
            <form onSubmit={handleGenerate} className="space-y-4 text-left w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <div>
                <label htmlFor="fullName" className="block font-medium text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors p-3 text-sm sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block font-medium text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">Job Description<span className="text-red-500">*</span></label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors p-3 text-sm sm:text-base"
                />
              </div>
              {formError && <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm transition-colors">{formError}</div>}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                <button type="button" onClick={handleCancel} className="px-3 sm:px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">Cancel</button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (isEdit ? 'Saving...' : 'Generating...') : (isEdit ? 'Save' : 'Generate')}
                </button>
              </div>
            </form>
            {generated && (
              <div className="mt-6 sm:mt-8 w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Generated Cover Letter</h3>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleCopy}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={handleGeneratePDF}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      disabled={pdfLoading || !savedId}
                    >
                      {pdfLoading ? 'Downloading PDF...' : 'Download PDF'}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <textarea
                    value={editableCover}
                    onChange={(e) => setEditableCover(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
                    placeholder="Your cover letter will appear here..."
                  />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    onClick={handleSaveChanges}
                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm sm:text-base"
                    disabled={loading || !savedId}
                  >
                    {loading ? 'Saving...' : 'Save Cover Letter'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 sm:px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm sm:text-base"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <CoverLetterList onSelectCoverLetter={handleEdit} />
        )}
      </div>
    </div>
  );
};

export default CoverLetters; 