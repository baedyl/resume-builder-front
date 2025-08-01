import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ResumeFormData } from '../types/resume';
import { format } from 'date-fns';
import LoadingOverlay from './LoadingOverlay';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Resume {
  id: string;
  fullName: string;
  summary?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

const ResumeList: React.FC<{ onSelectResume: (resume: ResumeFormData) => void }> = ({ onSelectResume }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

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
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`, {
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
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Resume deleted successfully!');
      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (err) {
      setError('Failed to delete resume');
      console.error('Error deleting resume:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Format dates in the response data with proper null checks
      const formattedData = {
        ...response.data,
        // Map workExperiences (API) to workExperience (form)
        workExperience: (response.data.workExperiences || []).map((exp: any) => ({
          company: exp.company || '',
          jobTitle: exp.jobTitle || '',
          location: exp.location || '',
          startDate: formatDateToYYYYMM(exp.startDate),
          endDate: exp.endDate ? formatDateToYYYYMM(exp.endDate) : '',
          description: exp.description || '',
          isCurrent: !exp.endDate || exp.endDate === '',
        })),
        // Map educations (API) to education (form)
        education: (response.data.educations || []).map((edu: any) => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          major: edu.major || '',
          graduationYear: edu.graduationYear || undefined,
          gpa: edu.gpa || undefined,
          description: edu.description || '',
        })),
        // Map certifications (already correct field name)
        certifications: (response.data.certifications || []).map((cert: any) => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.issueDate ? formatDateToYYYYMM(cert.issueDate) : '',
        })),
        // Map languages (already correct field name)
        languages: (response.data.languages || []).map((lang: any) => ({
          name: lang.name || '',
          proficiency: lang.proficiency || '',
        })),
        // Map skills (already correct field name)
        skills: response.data.skills || [],
      };

      onSelectResume(formattedData);
    } catch (err) {
      setError('Failed to load resume');
      console.error('Error loading resume:', err);
    }
  };

  const handleApply = (id: string, language?: string) => {
    navigate(`/resume/${id}/apply`, { 
      state: { resumeLanguage: language || 'en' } 
    });
  };

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
              <div className="flex gap-2">
                <button
                  onClick={() => handleApply(resume.id, resume.language)}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Apply
                </button>
                <button
                  onClick={() => handleEdit(resume.id)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(resume.id);
                  }}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList; 