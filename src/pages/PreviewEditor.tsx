import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingOverlay from '../components/LoadingOverlay';
import { getApiUrl, getApiAudience } from '../utils/api';
import { ResumeFormData } from '../types/resume';

interface PreviewEditorLocationState {
  formData: ResumeFormData;
  selectedTemplate: string;
  selectedLanguage: string;
  currentResumeId?: string | null;
}

const PreviewEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently } = useAuth0();
  const { formData, selectedTemplate, selectedLanguage, currentResumeId } = (location.state || {}) as PreviewEditorLocationState;

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Right pane content temporarily disabled; coming soon

  useEffect(() => {
    // Ensure the page starts at the top when opening Advanced Preview
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch {}

    const fetchHtml = async () => {
      if (!formData) {
        setError('Missing resume data.');
        return;
      }
      if (!currentResumeId) {
        setError('Advanced Preview requires an existing saved resume. Please go back and save first.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
        const endpoint = `${getApiUrl()}/api/resumes/${currentResumeId}/html?template=${selectedTemplate}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || '',
            address: formData.address || '',
            linkedIn: formData.linkedIn || '',
            website: formData.website || '',
            summary: formData.summary || '',
            template: selectedTemplate,
            language: selectedLanguage,
            skills: (formData.skills || []).map(s => ({ id: s.id, name: s.name })),
            workExperience: (formData.workExperience || []).map(exp => ({
              jobTitle: exp.jobTitle,
              company: exp.company,
              location: exp.location || '',
              startDate: exp.startDate,
              endDate: exp.endDate || '',
              description: exp.description || '',
              isCurrent: exp.isCurrent || false,
            })),
            education: (formData.education || []).map(edu => ({
              degree: edu.degree,
              major: edu.major || '',
              institution: edu.institution,
              graduationYear: edu.graduationYear || 0,
              gpa: edu.gpa || 0,
              description: edu.description || '',
            })),
            languages: (formData.languages || []).map(l => ({ name: l.name, proficiency: l.proficiency })),
            certifications: (formData.certifications || []).map(c => ({ name: c.name, issuer: c.issuer, issueDate: c.issueDate || '' })),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate preview HTML');
        }
        const html = await response.text();

        // Make the HTML document editable by injecting a small script and style
        const editableHtml = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>html,body{height:100%;} body{outline:none;}</style></head><body contenteditable="true">${html}<script>document.body.setAttribute('contenteditable','true');</script></body></html>`;
        setHtmlContent(editableHtml);
      } catch (err: any) {
        setError(err.message || 'Failed to load editable preview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHtml();
  }, [formData, selectedTemplate, selectedLanguage, currentResumeId, getAccessTokenSilently]);

  // Whenever the iframe content changes, scroll the iframe viewport to the top
  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      // Small delay to allow srcDoc to render before scrolling
      const id = setTimeout(() => {
        try {
          frame.contentWindow?.scrollTo(0, 0);
        } catch {}
      }, 50);
      return () => clearTimeout(id);
    } catch {}
  }, [htmlContent]);

  const extractEditedHtml = (): string | null => {
    const frame = iframeRef.current;
    if (!frame) return null;
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) return null;
    // Grab the edited body content and wrap in minimal HTML for server
    const body = doc.body?.innerHTML || '';
    return `<!doctype html><html><head><meta charset="utf-8"/></head><body>${body}</body></html>`;
  };

  const handleDownloadPdf = async () => {
    if (!formData || !currentResumeId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently({ audience: getApiAudience() } as any);
      // Prefer existing endpoints used in the modal flow
      const url = `${getApiUrl()}/api/resumes/${currentResumeId}/html-pdf`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/pdf, application/json;q=0.9, */*;q=0.8'
        },
        body: JSON.stringify({
          template: selectedTemplate,
          language: selectedLanguage,
          // Optionally pass edited HTML if backend can consume it for rendering
          editedHtml: extractEditedHtml(),
        }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      // Handle PDF download similarly to modal
      const contentType = response.headers.get('content-type') || '';
      let blob: Blob;
      if (contentType.includes('application/pdf')) {
        const arrayBuffer = await response.arrayBuffer();
        blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      } else if (contentType.includes('application/json')) {
        const json = await response.json();
        const base64Pdf = json.pdfBase64 || json.pdf || json.data?.pdfBase64 || json.data?.pdf;
        if (base64Pdf) {
          const bytes = Uint8Array.from(atob(base64Pdf), c => c.charCodeAt(0));
          blob = new Blob([bytes], { type: 'application/pdf' });
        } else {
          throw new Error('Unexpected JSON response when PDF was expected');
        }
      } else {
        blob = await response.blob();
      }

      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlObj;
      link.download = `${(formData.fullName || 'Resume').replace(/[^a-zA-Z0-9\- ]/g, '').replace(/\s+/g, '-')}-.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(urlObj);
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to download PDF');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {loading && <LoadingOverlay />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Builder
          </button>
          <div className="flex gap-2">
            <button onClick={handleDownloadPdf} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download PDF</button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Editable Preview - 70% */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <iframe
              ref={iframeRef}
              title="Editable Resume Preview"
              className="w-full h-[80vh]"
              srcDoc={htmlContent}
              onLoad={() => {
                try {
                  iframeRef.current?.contentWindow?.scrollTo(0, 0);
                } catch {}
              }}
            />
          </div>

          {/* Suggestions - 30% */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewEditor;


