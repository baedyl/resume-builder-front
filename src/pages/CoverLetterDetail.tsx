import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay';
import CoverLetterForm, { CoverLetterFormData } from '../components/CoverLetterForm';
import { decodeId } from '../utils/urlId';

const CoverLetterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CoverLetterFormData | null>(null);

  useEffect(() => {
    const fetchCL = async () => {
      if (!id) return;
      try {
        const decodedId = await decodeId(id);
        const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cover-letter/${decodedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load cover letter');
        console.error('Error loading cover letter:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCL();
  }, [id, getAccessTokenSilently]);

  if (loading) {
    return <div aria-live="polite" aria-busy={true}><LoadingOverlay /></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Cover letter not found'}</p>
          <button onClick={() => navigate('/cover-letters')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Cover Letters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 lg:px-4 md:px-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <button
          onClick={() => navigate('/cover-letters')}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to Cover Letters
        </button>
      </div>
      <CoverLetterForm initialData={data} />
    </div>
  );
};

export default CoverLetterDetail;

