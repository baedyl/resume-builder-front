import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { safeFetch, getApiAudience } from '../utils/api';

interface ResumeDisplayProps {
  resumeId: string;
  template?: string;
}

const getResumeHTML = async (resumeId: string, template: string = 'colorful', token: string) => {
  const response = await safeFetch(`/api/resumes/${resumeId}/html?template=${template}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch resume HTML');
  }
  
  return response.text();
};

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeId, template = 'colorful' }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  
  useEffect(() => {
    const fetchHTML = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
        const htmlContent = await getResumeHTML(resumeId, template, token as unknown as string);
        setHtml(htmlContent);
      } catch (err: any) {
        setError(err.message || 'Failed to load resume preview');
        console.error('Error fetching resume HTML:', err);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchHTML();
    }
  }, [resumeId, template, getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading resume preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview w-full h-full overflow-auto">
      <div 
        dangerouslySetInnerHTML={{ __html: html }} 
        className="resume-content w-full"
        style={{ 
          minHeight: '100%',
          backgroundColor: 'white',
          padding: '20px'
        }}
      />
    </div>
  );
};

export default ResumeDisplay; 