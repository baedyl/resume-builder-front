import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ResumeFormData } from '../types/resume';
import { format } from 'date-fns';

interface Resume {
  id: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

const ResumeList: React.FC<{ onSelectResume: (resume: ResumeFormData) => void }> = ({ onSelectResume }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const formatDateToYYYYMM = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 7);
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

      // Format dates in the response data
      const formattedData = {
        ...response.data,
        workExperience: response.data.workExperience.map((exp: any) => ({
          ...exp,
          startDate: formatDateToYYYYMM(exp.startDate),
          endDate: exp.endDate ? formatDateToYYYYMM(exp.endDate) : '',
        })),
        certifications: response.data.certifications.map((cert: any) => ({
          ...cert,
          issueDate: cert.issueDate ? formatDateToYYYYMM(cert.issueDate) : '',
        })),
      };

      onSelectResume(formattedData);
    } catch (err) {
      setError('Failed to load resume');
      console.error('Error loading resume:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors">My Resumes</h2>
      {resumes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-4 transition-colors">No resumes found. Create your first resume!</p>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">{resume.fullName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                  Last updated: {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(resume.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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