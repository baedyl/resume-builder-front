import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { CoverLetterFormData } from './CoverLetterForm';

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
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Cover Letters</h2>
      {coverLetters.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No cover letters found. Create your first cover letter!</p>
      ) : (
        <div className="space-y-4">
          {coverLetters.map((cl) => (
            <div
              key={cl.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold text-lg">{cl.fullName || cl.title}</h3>
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(cl.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cl.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cl.id)}
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

export default CoverLetterList; 