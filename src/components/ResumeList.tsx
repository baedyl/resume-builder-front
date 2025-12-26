import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ResumeFormData } from '../types/resume';
import { format } from 'date-fns';
import { encodeId } from '../utils/urlId';
import { getApiUrl, getApiAudience } from '../utils/api';
import LoadingOverlay from './LoadingOverlay';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDownload, FaEdit, FaPaperPlane, FaTrash } from 'react-icons/fa';

interface Resume {
  id: string;
  fullName: string;
  summary?: string;
  language?: string;
  template?: string;
  createdAt: string;
  updatedAt: string;
}

const ResumeList: React.FC<{ onSelectResume: (resume: ResumeFormData) => void }> = ({ onSelectResume }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const safeFilename = useMemo(() => {
    return (name: string) =>
      (name || 'Resume')
        .replace(/[^a-zA-Z0-9\- ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/ /g, '-');
  }, []);

  const formatDateToYYYYMM = (dateString: string | undefined) => {
    if (!dateString || !dateString.trim()) return '';
    try {
      // Handle ISO date format from API
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 7); // Return YYYY-MM
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const fetchResumes = async () => {
    try {
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      const response = await axios.get(`${getApiUrl()}/api/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(response.data);
    } catch (err) {
      setError('Failed to load resumes');
      console.error('Error fetching resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      await axios.delete(`${getApiUrl()}/api/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Resume deleted successfully!');
      setResumes((prev) => prev.filter(resume => resume.id !== id));
    } catch (err) {
      setError('Failed to delete resume');
      console.error('Error deleting resume:', err);
    }
  };

  const handleEdit = async (id: string) => {
    const encoded = await encodeId(id);
    navigate(`/my-resumes/${encoded}`);
  };

  const handleApply = async (id: string, language?: string) => {
    const encoded = await encodeId(id);
    navigate(`/my-resumes/${encoded}/apply`, { 
      state: { resumeLanguage: language || 'en' } 
    });
  };

  const downloadPdfFromResponse = async (response: Response): Promise<Blob> => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/pdf')) {
      const arrayBuffer = await response.arrayBuffer();
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    }
    if (contentType.includes('application/json')) {
      const json = await response.json();
      const base64Pdf = json.pdfBase64 || json.pdf || json.data?.pdfBase64 || json.data?.pdf;
      if (base64Pdf && typeof base64Pdf === 'string') {
        const bytes = Uint8Array.from(atob(base64Pdf), c => c.charCodeAt(0));
        return new Blob([bytes], { type: 'application/pdf' });
      }
      throw new Error('Unexpected JSON response when PDF was expected');
    }
    return await response.blob();
  };

  const handleDownload = async (resume: Resume) => {
    if (downloadingId) return;
    setDownloadingId(resume.id);
    try {
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      const url = `${getApiUrl()}/api/resumes/${resume.id}/html-pdf`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/pdf, application/json;q=0.9, */*;q=0.8',
        },
        body: JSON.stringify({
          template: resume.template || 'modern',
          language: resume.language || 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await downloadPdfFromResponse(response);
      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlObj;
      link.download = `${safeFilename(resume.fullName)}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(urlObj);
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 5000);
    } catch (err: any) {
      const message = err?.message || 'Failed to download resume';
      toast.error(message);
      console.error('Error downloading resume:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const ActionIconButton: React.FC<{
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    icon: React.ReactNode;
    colorClassName: string;
  }> = ({ label, onClick, disabled, icon, colorClassName }) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center p-2 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={colorClassName}>{icon}</span>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {label}
      </span>
    </button>
  );

  if (isLoading) {
    return <div aria-live="polite" aria-busy={true}>
      <LoadingOverlay />
    </div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100 transition-colors">My Resumes</h2>
      {resumes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-4 transition-colors text-sm sm:text-base">No resumes found. Create your first resume!</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => handleEdit(resume.id)}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors gap-3 sm:gap-0 cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 transition-colors">{resume.fullName}</h3>
                {resume.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors mt-1 line-clamp-2">
                    {resume.summary.length > 100 
                      ? `${resume.summary.substring(0, 100)}...` 
                      : resume.summary}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors mt-1">
                  Last updated: {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                  {resume.language && resume.language !== 'en' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {resume.language.toUpperCase()}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                <ActionIconButton
                  label={downloadingId === resume.id ? 'Downloading…' : 'Download'}
                  disabled={downloadingId === resume.id}
                  colorClassName="text-gray-700 dark:text-gray-200"
                  icon={<FaDownload />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(resume);
                  }}
                />
                <ActionIconButton
                  label="Apply"
                  colorClassName="text-green-600 dark:text-green-400"
                  icon={<FaPaperPlane />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(resume.id, resume.language);
                  }}
                />
                <ActionIconButton
                  label="Edit"
                  colorClassName="text-blue-600 dark:text-blue-400"
                  icon={<FaEdit />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(resume.id);
                  }}
                />
                <ActionIconButton
                  label="Delete"
                  colorClassName="text-red-600 dark:text-red-400"
                  icon={<FaTrash />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(resume.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList; 
