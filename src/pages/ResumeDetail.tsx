import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay';
import ResumeForm from '../components/ResumeForm';
import { ResumeFormData } from '../types/resume';
import { decodeId } from '../utils/urlId';
import { getApiUrl, getApiAudience } from '../utils/api';

const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResumeFormData | null>(null);

  const formatDateToYYYYMM = (dateString: string | undefined) => {
    if (!dateString || !dateString.trim()) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 7);
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;
      try {
        const decodedId = await decodeId(id);
        const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
        const response = await axios.get(`${getApiUrl()}/api/resumes/${decodedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData: ResumeFormData = {
          ...response.data,
          workExperience: (response.data.workExperiences || []).map((exp: any) => ({
            company: exp.company || '',
            jobTitle: exp.jobTitle || '',
            location: exp.location || '',
            startDate: formatDateToYYYYMM(exp.startDate),
            endDate: exp.endDate ? (exp.endDate === 'Present' ? 'Present' : formatDateToYYYYMM(exp.endDate)) : '',
            description: exp.description || '',
            isCurrent: exp.endDate === 'Present' || !exp.endDate || exp.endDate === '',
            companyDescription: exp.companyDescription || '',
            techStack: Array.isArray(exp.techStack) ? exp.techStack.join(', ') : (exp.techStack || ''),
          })),
          education: (response.data.educations || []).map((edu: any) => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            major: edu.major || '',
            graduationYear: edu.graduationYear || undefined,
            gpa: edu.gpa || undefined,
            description: edu.description || '',
          })),
          certifications: (response.data.certifications || []).map((cert: any) => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            issueDate: cert.issueDate ? formatDateToYYYYMM(cert.issueDate) : '',
          })),
          languages: (response.data.languages || []).map((lang: any) => ({
            name: lang.name || '',
            proficiency: lang.proficiency || '',
          })),
          skills: response.data.skills || [],
          id: response.data.id,
          fullName: response.data.fullName || response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          linkedIn: response.data.linkedIn || '',
          website: response.data.website || '',
          summary: response.data.summary || '',
          language: response.data.language || 'en',
        } as ResumeFormData;

        setData(formattedData);
      } catch (err) {
        setError('Failed to load resume');
        console.error('Error loading resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, getAccessTokenSilently]);

  if (loading) {
    return <div aria-live="polite" aria-busy={true}><LoadingOverlay /></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Resume not found'}</p>
          <button onClick={() => navigate('/my-resumes')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to My Resumes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 lg:px-4 md:px-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <button
          onClick={() => navigate('/my-resumes')}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to Resume List
        </button>
      </div>
      <ResumeForm initialData={data} />
    </div>
  );
};

export default ResumeDetail;

