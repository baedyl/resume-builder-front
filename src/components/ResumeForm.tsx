/// <reference types="vite/client" />
import { useForm, SubmitHandler, useFieldArray, FormProvider } from 'react-hook-form';
import { useState, useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './LoadingOverlay';
import { useAuth0 } from '@auth0/auth0-react';
import SkillsSelect from './SkillsSelect';
import PersonalInfoSection from './sections/PersonalInfoSection';
import SummarySection from './sections/SummarySection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import EducationSection from './sections/EducationSection';
import ResumeTemplate from './ResumeTemplate';
import { ResumeFormData } from '../types/resume';
import { Resolver } from 'react-hook-form';
import LanguagesSection from './sections/LanguagesSection';
import CertificationsSection from './sections/CertificationsSection';

// Zod schemas (unchanged)
const WorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  startDate: z.string().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Start date must be YYYY-MM'),
  endDate: z.union([z.string().regex(/^\d{4}-\d{2}$/, 'End date must be YYYY-MM'), z.literal('')]).optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
}).refine(
  (data) => !data.endDate || (new Date(data.startDate).toString() !== 'Invalid Date' && new Date(data.endDate).toString() !== 'Invalid Date' && new Date(data.startDate) <= new Date(data.endDate)),
  { message: 'End date must be after start date', path: ['endDate'] }
);

const EducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  major: z.string().optional(),
  graduationYear: z.number().int().min(1900, 'Graduation year must be a valid year').max(9999, 'Graduation year must be a valid year').optional(),
});

const SkillSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Skill name is required'),
});

const LanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  proficiency: z.string().min(1, 'Proficiency is required'),
});

const CertificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional(),
});

const ResumeFormSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  linkedIn: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(SkillSchema).default([]),
  workExperience: z.array(WorkExperienceSchema).min(1, 'At least one work experience is required'),
  education: z.array(EducationSchema).min(1, 'At least one education entry is required'),
  languages: z.array(LanguageSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
});

type Skill = z.infer<typeof SkillSchema>;

// Mock data object
const mockResumeData: ResumeFormData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA",
  linkedIn: "https://linkedin.com/in/johndoe",
  website: "https://johndoe.com",
  summary: "A motivated professional with experience in software development.",
  skills: [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "React" },
    { id: -1, name: "GraphQL" }, // Custom skill
  ],
  workExperience: [
    {
      company: "Tech Corp",
      jobTitle: "Software Engineer",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Developed web applications using React and Node.js.",
    },
    {
      company: "Startup Inc",
      jobTitle: "Intern",
      startDate: "2019-06",
      endDate: "2019-12",
      description: "Assisted in building REST APIs with Express.",
    },
  ],
  education: [
    {
      institution: "University of Example",
      degree: "Bachelor of Science",
      major: "Computer Science",
      graduationYear: 2019,
    },
  ],
  languages: [
    { name: "English", proficiency: "Fluent" },
    { name: "Spanish", proficiency: "Intermediate" },
  ],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon", issueDate: "2022-05" },
  ],
};

interface ResumeFormProps {
  initialData?: ResumeFormData;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ initialData }) => {
  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormSchema) as Resolver<ResumeFormData>,
    defaultValues: initialData || {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedIn: '',
      website: '',
      summary: '',
      skills: [],
      workExperience: [{ company: '', jobTitle: '', startDate: '', endDate: '', description: '' }],
      education: [{ institution: '', degree: '', major: '', graduationYear: undefined }],
      languages: [],
      certifications: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, control, setValue, getValues, watch, reset } = methods;

  const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education',
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages',
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: 'certifications',
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ResumeFormData | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<number | null>(null);
  const [isManuallyOrdered, setIsManuallyOrdered] = useState(false);
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const { getAccessTokenSilently, user } = useAuth0();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const modalRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Existing useEffect hooks (unchanged)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/skills`)
      .then((res) => res.json())
      .then((data: Skill[]) => setSkills(data))
      .catch((error: Error) => {
        setFormError('Failed to load skills. Please try again.');
        console.error('Error fetching skills:', error);
      });
  }, []);

  // Function to format dates to YYYY-MM
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

  // Function to fill form with mock data
  const fillWithMockData = () => {
    // Set static fields
    setValue('fullName', mockResumeData.fullName);
    setValue('email', mockResumeData.email);
    setValue('phone', mockResumeData.phone);
    setValue('address', mockResumeData.address);
    setValue('linkedIn', mockResumeData.linkedIn);
    setValue('website', mockResumeData.website);
    setValue('summary', mockResumeData.summary);

    // Set skills
    setValue('skills', mockResumeData.skills);

    // Clear and populate dynamic fields
    setValue('workExperience', []);
    mockResumeData.workExperience.forEach((exp) => {
      appendWorkExperience(exp);
    });

    setValue('education', []);
    mockResumeData.education.forEach((edu) => {
      appendEducation(edu);
    });

    setValue('languages', []);
    mockResumeData.languages.forEach((lang) => {
      appendLanguage(lang);
    });

    setValue('certifications', []);
    mockResumeData.certifications.forEach((cert) => {
      appendCertification(cert);
    });

    setIsManuallyOrdered(false); // Reset manual ordering to reflect mock data order
  };

  const handleEnhanceSummary = async () => {
    const summary = getValues('summary');
    const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
    if (!summary) {
      toast.error('Please enter a summary to enhance.');
      return;
    }
    setIsEnhancingSummary(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resumes/enhance-summary`, {
        summary,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const enhancedSummary = response.data.enhancedSummary;
      if (!enhancedSummary || !enhancedSummary.trim()) {
        throw new Error('Received empty enhanced summary.');
      }
      setValue('summary', enhancedSummary);
      toast.success('Summary enhanced successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to enhance summary.';
      toast.error(message);
      console.error('Enhancement error:', error);
    } finally {
      setIsEnhancingSummary(false);
    }
  };

  const handleEnhanceDescription = async (index: number) => {
    try {
      setIsEnhancing(index);
      const currentDescription = getValues(`workExperience.${index}.description`);
      const jobTitle = getValues(`workExperience.${index}.jobTitle`);
      const company = getValues(`workExperience.${index}.company`);
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/enhance-description`,
        {
          description: currentDescription,
          jobTitle,
          company,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setValue(`workExperience.${index}.description`, response.data.enhancedDescription);
      toast.success('Description enhanced successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to enhance description.';
      toast.error(message);
      console.error('Enhance error:', error);
    } finally {
      setIsEnhancing(null);
    }
  };

  const resetToChronological = () => {
    const sorted = [...getValues('workExperience')].sort((a, b) => {
      const aEnd = a.endDate || '9999-12';
      const bEnd = b.endDate || '9999-12';
      if (aEnd === bEnd) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return new Date(bEnd).getTime() - new Date(aEnd).getTime();
    });
    setValue('workExperience', sorted);
    setIsManuallyOrdered(false);
  };

  // Function to load resume data
  const loadResume = (resumeData: ResumeFormData) => {
    // Format dates in work experience
    const formattedWorkExperience = resumeData.workExperience.map(exp => ({
      ...exp,
      startDate: formatDateToYYYYMM(exp.startDate),
      endDate: exp.endDate ? formatDateToYYYYMM(exp.endDate) : '',
    }));

    // Format dates in certifications
    const formattedCertifications = resumeData.certifications.map(cert => ({
      ...cert,
      issueDate: cert.issueDate ? formatDateToYYYYMM(cert.issueDate) : '',
    }));

    // Create new resume data with formatted dates
    const formattedResumeData = {
      ...resumeData,
      workExperience: formattedWorkExperience,
      certifications: formattedCertifications,
    };

    reset(formattedResumeData);
    setCurrentResumeId(resumeData.id || null);
    setPreview(null);
  };

  // Function to save resume
  const saveResume = async (data: ResumeFormData) => {
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      setIsSaving(true);

      const url = currentResumeId
        ? `${import.meta.env.VITE_API_URL}/api/resumes/${currentResumeId}`
        : `${import.meta.env.VITE_API_URL}/api/resumes`;

      const response = await axios({
        method: currentResumeId ? 'put' : 'post',
        url,
        data: { ...data, template: selectedTemplate },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!currentResumeId) {
        setCurrentResumeId(response.data.id);
      }

      toast.success('Resume saved successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to save resume.';
      toast.error(message);
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    console.log('onSubmit called with data:', data);
    console.log('Current preview state:', preview);
    console.log('Current resume ID:', currentResumeId);

    if (!preview) {
      console.log('Creating preview with data');
      const filteredData: ResumeFormData = {
        ...data,
        id: currentResumeId || undefined,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        linkedIn: data.linkedIn || '',
        website: data.website || '',
        summary: data.summary || '',
        skills: data.skills || [],
        workExperience: data.workExperience
          .filter((exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim())
          .map(exp => ({
            ...exp,
            startDate: exp.startDate,
            endDate: exp.endDate || '',
            isCurrent: exp.isCurrent || false
          }))
          .sort((a, b) => {
            const aEnd = a.isCurrent || !a.endDate ? '9999-12' : a.endDate;
            const bEnd = b.isCurrent || !b.endDate ? '9999-12' : b.endDate;
            if (aEnd === bEnd) {
              return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            }
            return new Date(bEnd).getTime() - new Date(aEnd).getTime();
          }),
        education: data.education
          .filter((edu) => edu.institution.trim() && edu.degree.trim())
          .map(edu => ({
            ...edu,
            graduationYear: edu.graduationYear || undefined
          })),
        languages: data.languages
          .filter((lang) => lang.name.trim() && lang.proficiency.trim()),
        certifications: data.certifications
          .filter((cert) => cert.name.trim() && cert.issuer.trim())
          .map(cert => ({
            ...cert,
            issueDate: cert.issueDate || ''
          })),
      };
      console.log('Setting preview with filtered data:', filteredData);
      setPreview(filteredData);
      return;
    }

    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      setIsLoading(true);
      setFormError(null);

      // Format the data consistently for both new and existing resumes
      const formattedData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        linkedIn: data.linkedIn || '',
        website: data.website || '',
        summary: data.summary || '',
        template: selectedTemplate,
        skills: data.skills.map(skill => ({
          id: skill.id,
          name: skill.name
        })),
        workExperience: data.workExperience.map(exp => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          location: exp.location || '',
          startDate: exp.startDate,
          endDate: exp.endDate || '',
          description: exp.description || '',
          isCurrent: exp.isCurrent || false
        })),
        education: data.education.map(edu => ({
          degree: edu.degree,
          major: edu.major || '',
          institution: edu.institution,
          graduationYear: edu.graduationYear || 0,
          gpa: edu.gpa || 0,
          description: edu.description || ''
        })),
        languages: data.languages.map(lang => ({
          name: lang.name,
          proficiency: lang.proficiency
        })),
        certifications: data.certifications.map(cert => ({
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issueDate || ''
        }))
      };

      console.log('Sending data to server:', formattedData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${currentResumeId || 'new'}/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        if (errorData.details) {
          data.workExperience.forEach((_, index) => {
            const companyError = errorData.details.find((err: { path: string[] }) => err.path.join('.') === `workExperience.${index}.company`);
            const jobTitleError = errorData.details.find((err: { path: string[] }) => err.path.join('.') === `workExperience.${index}.jobTitle`);
            const startDateError = errorData.details.find((err: { path: string[] }) => err.path.join('.') === `workExperience.${index}.startDate`);
            if (companyError) setValue(`workExperience.${index}.company`, '');
            if (jobTitleError) setValue(`workExperience.${index}.jobTitle`, '');
            if (startDateError) setValue(`workExperience.${index}.startDate`, '');
          });
          data.education.forEach((_, index) => {
            const institutionError = errorData.details.find((err: { path: string[] }) => err.path.join('.') === `education.${index}.institution`);
            const degreeError = errorData.details.find((err: { path: string[] }) => err.path.join('.') === `education.${index}.degree`);
            if (institutionError) setValue(`education.${index}.institution`, '');
            if (degreeError) setValue(`education.${index}.degree`, '');
          });
          throw new Error('Validation failed');
        }
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      // Generate filename: FullName-JobTitle.pdf
      const safeFullName = (data.fullName || 'Resume').replace(/[^a-zA-Z0-9\- ]/g, '').replace(/\s+/g, ' ').trim().replace(/ /g, '-');
      const mostRecentJob = (data.workExperience && data.workExperience.length > 0 && data.workExperience[0].jobTitle)
        ? data.workExperience[0].jobTitle.replace(/[^a-zA-Z0-9\- ]/g, '').replace(/\s+/g, ' ').trim().replace(/ /g, '-')
        : 'Resume';
      link.href = url;
      link.download = `${safeFullName}-${mostRecentJob}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      setPreview(null);
    } catch (error: any) {
      setFormError(error.message || 'Failed to generate resume. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const watchedSkills = (watch('skills') as any[]) || [];

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setPreview(null);
      }
    };

    if (preview) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [preview]);

  // Add useEffect to monitor preview state changes
  useEffect(() => {
    console.log('Preview state changed:', preview);
  }, [preview]);

  const handlePreviewClick = async () => {
    console.log('Preview button clicked');
    try {
      const formData = getValues();
      console.log('Form data:', formData);
      
      if (!preview) {
        const filteredData: ResumeFormData = {
          ...formData,
          id: currentResumeId || undefined,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          address: formData.address || '',
          linkedIn: formData.linkedIn || '',
          website: formData.website || '',
          summary: formData.summary || '',
          skills: formData.skills || [],
          workExperience: formData.workExperience
            .filter((exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim())
            .map(exp => ({
              ...exp,
              startDate: exp.startDate,
              endDate: exp.endDate || '',
              isCurrent: exp.isCurrent || false
            }))
            .sort((a, b) => {
              const aEnd = a.isCurrent || !a.endDate ? '9999-12' : a.endDate;
              const bEnd = b.isCurrent || !b.endDate ? '9999-12' : b.endDate;
              if (aEnd === bEnd) {
                return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
              }
              return new Date(bEnd).getTime() - new Date(aEnd).getTime();
            }),
          education: formData.education
            .filter((edu) => edu.institution.trim() && edu.degree.trim())
            .map(edu => ({
              ...edu,
              graduationYear: edu.graduationYear || undefined
            })),
          languages: formData.languages
            .filter((lang) => lang.name.trim() && lang.proficiency.trim()),
          certifications: formData.certifications
            .filter((cert) => cert.name.trim() && cert.issuer.trim())
            .map(cert => ({
              ...cert,
              issueDate: cert.issueDate || ''
            })),
        };
        console.log('Setting preview with filtered data:', filteredData);
        setPreview(filteredData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error in handlePreviewClick:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div aria-live="polite" aria-busy={Boolean(isEnhancing !== null || isEnhancingSummary)}>
        {(isEnhancing || isEnhancingSummary) && <LoadingOverlay />}
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-4 sm:p-10 space-y-8"
        >
          {/* Development-only mock data button */}
          {(import.meta as any).env.MODE === 'development' && (
            <button
              type="button"
              onClick={fillWithMockData}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-base font-medium"
            >
              Fill with Mock Data
            </button>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Build Your Resume</h2>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-base">{formError}</div>
          )}

          {/* Personal Info */}
          <PersonalInfoSection />

          {/* Summary */}
          <SummarySection onEnhance={handleEnhanceSummary} isEnhancing={isEnhancingSummary} />

          {/* Skills */}
          <SkillsSelect control={control} skills={skills} setSkills={setSkills as React.Dispatch<React.SetStateAction<any>>} />

          {/* Work Experience */}
          <WorkExperienceSection
            register={register}
            errors={errors}
            workExperienceFields={workExperienceFields as any}
            removeWorkExperience={removeWorkExperience}
            appendWorkExperience={(payload: any) => {
              appendWorkExperience(payload);
              setIsManuallyOrdered(true);
            }}
            resetToChronological={resetToChronological}
            handleEnhanceDescription={handleEnhanceDescription}
            isEnhancing={isEnhancing}
          />

          {/* Education */}
          <EducationSection
            register={register}
            errors={errors}
            educationFields={educationFields as any}
            appendEducation={appendEducation}
            removeEducation={removeEducation}
          />

          {/* Languages */}
          <LanguagesSection
            register={register}
            errors={errors}
            languageFields={languageFields as any}
            appendLanguage={appendLanguage}
            removeLanguage={removeLanguage}
          />

          {/* Certifications */}
          <CertificationsSection
            register={register}
            errors={errors}
            certificationFields={certificationFields as any}
            appendCertification={appendCertification}
            removeCertification={removeCertification}
          />

          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Choose Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSelectedTemplate('modern')}
                className={`p-4 border rounded-lg text-center ${selectedTemplate === 'modern'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                  }`}
              >
                <h4 className="font-medium text-gray-900">Modern</h4>
                <p className="text-sm text-gray-600">Clean and professional design</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('classic')}
                className={`p-4 border rounded-lg text-center ${selectedTemplate === 'classic'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                  }`}
              >
                <h4 className="font-medium text-gray-900">Classic</h4>
                <p className="text-sm text-gray-600">Traditional and formal layout</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('minimal')}
                className={`p-4 border rounded-lg text-center ${selectedTemplate === 'minimal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                  }`}
              >
                <h4 className="font-medium text-gray-900">Minimal</h4>
                <p className="text-sm text-gray-600">Simple and elegant style</p>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSubmit(saveResume)}
            disabled={isSaving}
            className={`w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base font-medium mb-4 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Resume'}
          </button>

          {/* Preview/Generate Button */}
          <button
            type="button"
            onClick={handlePreviewClick}
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Generating...' : preview ? 'Generate PDF' : 'Preview Resume'}
          </button>
        </form>
      </FormProvider>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Resume Preview</h3>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="flex-1 sm:flex-none py-2 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-base"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className={`flex-1 sm:flex-none py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate PDF'}
                </button>
              </div>
            </div>
            <div className="resume-preview bg-white shadow-lg overflow-x-auto">
              <ResumeTemplate data={preview} template={selectedTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;