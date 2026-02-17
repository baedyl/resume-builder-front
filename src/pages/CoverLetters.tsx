import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoverLetterList from '../components/CoverLetterList';
import PremiumGate from '../components/PremiumGate';
import { FEATURE_DESCRIPTIONS } from '../constants/subscription';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { getApiUrl, getApiAudience } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '../components/Breadcrumbs';

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
  const navigate = useNavigate();
  const [subscriptionExpired, setSubscriptionExpired] = useState<null | { message: string; expiredDate?: string; upgradeUrl?: string }>(null);
  const { isPremium } = useSubscription();

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
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      if (isEdit && form.id) {
        response = await axios.put(`${getApiUrl()}/api/cover-letter/${form.id}`, { ...form, content: editableCover }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post(`${getApiUrl() || ''}/api/cover-letter`, form, {
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
      const data = err?.response?.data;
      if (data?.error === 'Your premium subscription has expired') {
        const details = data?.details || {};
        const upgradeUrl = data?.upgradeUrl || '/pricing';
        setSubscriptionExpired({ message: details?.message || data.error, expiredDate: details?.expiredDate, upgradeUrl });
        toast.error(details?.message || data.error);
      } else {
        setFormError(data?.error || err.message || 'Failed to generate cover letter.');
      }
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
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      const response = await axios.post(
        `${getApiUrl()}/api/cover-letter/${savedId}/pdf`,
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
      const data = err?.response?.data;
      if (data?.error === 'Your premium subscription has expired') {
        const details = data?.details || {};
        const upgradeUrl = data?.upgradeUrl || '/pricing';
        setSubscriptionExpired({ message: details?.message || data.error, expiredDate: details?.expiredDate, upgradeUrl });
        toast.error(details?.message || data.error);
      } else {
        setFormError(data?.error || err.message || 'Failed to generate PDF.');
      }
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!savedId) return;
    setLoading(true);
    setFormError(null);
    try {
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      await axios.put(`${getApiUrl()}/api/cover-letter/${savedId}`, {
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
      const data = err?.response?.data;
      if (data?.error === 'Your premium subscription has expired') {
        const details = data?.details || {};
        const upgradeUrl = data?.upgradeUrl || '/pricing';
        setSubscriptionExpired({ message: details?.message || data.error, expiredDate: details?.expiredDate, upgradeUrl });
        toast.error(details?.message || data.error);
      } else {
        setFormError(data?.error || err.message || 'Failed to update cover letter.');
      }
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
      <PremiumGate 
        feature="Cover Letter Generation" 
        description={FEATURE_DESCRIPTIONS.COVER_LETTERS}
        forceGate={Boolean(subscriptionExpired)}
        gateTitle={subscriptionExpired ? 'Subscription Expired' : undefined}
        gateMessage={subscriptionExpired ? subscriptionExpired.message : undefined}
        upgradeUrl={subscriptionExpired?.upgradeUrl}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sticky Action Bar */}
          <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <Breadcrumbs />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  {!showForm && isPremium && !subscriptionExpired && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New Cover Letter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Spacer to prevent content overlap */}
          <div className="h-4"></div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Cover Letters
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Generate and manage AI-powered cover letters
                </p>
                <a
                  href="/blog/how-to-write-a-cover-letter-2025"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-3"
                >
                  Find expert advice on crafting cover letters.
                </a>
                {subscriptionExpired && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{subscriptionExpired.message}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => navigate(subscriptionExpired.upgradeUrl || '/pricing')}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Renew subscription
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showForm ? (
            <>
              <form id="cover-letter-form" onSubmit={handleGenerate} className="space-y-4 text-left w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
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
                
                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                  <button type="button" onClick={handleCancel} className="w-full sm:w-auto px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium">Cancel</button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
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
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <textarea
                      value={editableCover}
                      onChange={(e) => setEditableCover(e.target.value)}
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
                      placeholder="Your cover letter will appear here..."
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                      onClick={handleCopy}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={handleGeneratePDF}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                      disabled={pdfLoading || !savedId}
                    >
                      {pdfLoading ? 'Downloading PDF...' : 'Download PDF'}
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                      disabled={loading || !savedId}
                    >
                      {loading ? 'Saving...' : 'Save Cover Letter'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <CoverLetterList 
              onSelectCoverLetter={handleEdit}
              onExpired={(info) => setSubscriptionExpired({ message: info.message, upgradeUrl: info.upgradeUrl })}
            />
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default CoverLetters; 
