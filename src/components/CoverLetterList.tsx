import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { CoverLetterFormData } from './CoverLetterForm';
import { format } from 'date-fns';

interface CoverLetterSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
}

const CoverLetterList: React.FC<{ onSelectCoverLetter: (coverLetter: CoverLetterFormData) => void }> = ({ onSelectCoverLetter }) => {
  const [coverLetters, setCoverLetters] = useState<CoverLetterSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const fetchCoverLetters = async () => {
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cover-letter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoverLetters(response.data);
    } catch (err) {
      setError('Failed to load cover letters');
      console.error('Error fetching cover letters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cover letter?')) {
      return;
    }
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cover-letter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoverLetters(coverLetters.filter(cl => cl.id !== id));
    } catch (err) {
      setError('Failed to delete cover letter');
      console.error('Error deleting cover letter:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cover-letter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSelectCoverLetter(response.data);
    } catch (err) {
      setError('Failed to load cover letter');
      console.error('Error loading cover letter:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-900 dark:text-gray-100 transition-colors">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 transition-colors">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100 transition-colors">My Cover Letters</h2>
      {coverLetters.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-4 transition-colors text-sm sm:text-base">No cover letters found. Create your first cover letter!</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors gap-3 sm:gap-0"
            >
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 transition-colors">{letter.fullName || letter.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">
                  Last updated: {format(new Date(letter.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(letter.id)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(letter.id)}
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

export default CoverLetterList; 