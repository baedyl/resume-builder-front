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
import TemplateSelectionSection from './sections/TemplateSelectionSection';

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);

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

  // Helper function to clean null/undefined values
  const cleanValue = (value: any): string => {
    if (value === null || value === undefined || value === 'null' || value === 'undefined') {
      return '';
    }
    return String(value).trim();
  };

  // Function to format dates to YYYY-MM
  const formatDateToYYYYMM = (dateString: string | undefined) => {
    if (!dateString || !dateString.trim()) return '';
    try {
      // Handle YYYY-MM-DD format directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString.slice(0, 7); // Return YYYY-MM
      }
      // Handle other date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
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
    

    if (!preview) {
      
      const filteredData: ResumeFormData = {
        ...data,
        id: currentResumeId || undefined,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone?.trim() || '',
        address: data.address?.trim() || '',
        linkedIn: data.linkedIn?.trim() || '',
        website: data.website?.trim() || '',
        summary: data.summary?.trim() || '',
        skills: data.skills || [],
        workExperience: data.workExperience
          .filter((exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim())
          .map(exp => ({
            ...exp,
            startDate: exp.startDate,
            endDate: exp.endDate?.trim() || '',
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
          .filter((cert) => cert.name.trim())
          .map(cert => ({
            ...cert,
            issuer: cert.issuer?.trim() || '',
            issueDate: cert.issueDate?.trim() || ''
          })),
      };

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
        certifications: data.certifications
          .filter((cert) => cert.name.trim())
          .map(cert => ({
            ...cert,
            issuer: cert.issuer || '',
            issueDate: cert.issueDate || ''
          })),
      };

      

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
    
  }, [preview]);

  const handlePreviewClick = async () => {
    
    try {
      const formData = getValues();


      if (!preview) {
        const filteredData: ResumeFormData = {
          ...formData,
          id: currentResumeId || undefined,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone?.trim() || '',
          address: formData.address?.trim() || '',
          linkedIn: formData.linkedIn?.trim() || '',
          website: formData.website?.trim() || '',
          summary: formData.summary?.trim() || '',
          skills: formData.skills || [],
          workExperience: formData.workExperience
            .filter((exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim())
            .map(exp => ({
              ...exp,
              startDate: exp.startDate,
              endDate: exp.endDate?.trim() || '',
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
            .filter((cert) => cert.name.trim())
            .map(cert => ({
              ...cert,
              issuer: cert.issuer?.trim() || '',
              issueDate: cert.issueDate?.trim() || ''
            })),
        };

        setPreview(filteredData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error in handlePreviewClick:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
    const formData = new FormData();

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    formData.append('file', file);
    // Call API endpoint to upload file to OpenAI
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );



      // Try to parse JSON from the response
      try {
        let extracted = response.data.extracted || response.data;
        let parsedData;



        if (typeof extracted === 'string') {
          // Extract JSON from the response (it might be wrapped in markdown)
          const jsonMatch = extracted.match(/```json\s*([\s\S]*?)\s*```/) ||
            extracted.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            parsedData = JSON.parse(jsonStr);
          } else {
            throw new Error('No JSON found in response');
          }
        } else if (typeof extracted === 'object' && extracted !== null) {
          // Already parsed JSON
          parsedData = extracted;
        } else {
          throw new Error(`Unexpected format for extracted data. Type: ${typeof extracted}, Value: ${JSON.stringify(extracted)}`);
        }



        // Transform the data to match our form structure
        const resumeData: ResumeFormData = {
          fullName: cleanValue(parsedData.personal_info?.name || parsedData.personal_info?.fullName),
          email: cleanValue(parsedData.personal_info?.email),
          phone: cleanValue(parsedData.personal_info?.phone),
          address: cleanValue(parsedData.personal_info?.location || parsedData.personal_info?.address),
          linkedIn: cleanValue(parsedData.personal_info?.linkedin_url || parsedData.personal_info?.linkedIn),
          website: cleanValue(parsedData.personal_info?.website),
          summary: cleanValue(parsedData.professional_summary || parsedData.summary),
          skills: parsedData.skills?.technical_skills?.map((skill: string, index: number) => ({
            id: -index - 1,
            name: skill
          })) || parsedData.skills?.map((skill: any, index: number) => ({
            id: skill.id || -index - 1,
            name: skill.name
          })) || [],
          workExperience: parsedData.work_experience?.map((exp: any) => ({
            company: cleanValue(exp.company),
            jobTitle: cleanValue(exp.position || exp.jobTitle),
            startDate: cleanValue(exp.start_date || exp.startDate),
            endDate: cleanValue(exp.end_date || exp.endDate),
            description: exp.responsibilities ? exp.responsibilities.join('\n') : cleanValue(exp.description)
          })) || [],
          education: parsedData.education?.map((edu: any) => ({
            institution: cleanValue(edu.institution),
            degree: cleanValue(edu.degree),
            major: cleanValue(edu.field_of_study || edu.major),
            graduationYear: edu.graduation_year || edu.graduationYear || undefined
          })) || [],
          languages: parsedData.skills?.languages?.map((lang: string) => ({
            name: cleanValue(lang),
            proficiency: 'Fluent' // Default proficiency since it's not provided
          })) || parsedData.languages?.map((lang: any) => ({
            name: cleanValue(lang.name),
            proficiency: cleanValue(lang.proficiency)
          })) || [],
          certifications: parsedData.certifications?.map((cert: any) => ({
            name: cleanValue(cert.name),
            issuer: cleanValue(cert.issuing_organization || cert.issuer),
            issueDate: cleanValue(cert.date_obtained || cert.issue_date || cert.issueDate)
          })) || []
        };

        // Clean up empty strings and null values
        const cleanResumeData = {
          ...resumeData,
          phone: resumeData.phone?.trim() || '',
          address: resumeData.address?.trim() || '',
          linkedIn: resumeData.linkedIn?.trim() || '',
          website: resumeData.website?.trim() || '',
          summary: resumeData.summary?.trim() || '',
          workExperience: resumeData.workExperience.filter(exp =>
            exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim()
          ),
          education: resumeData.education.filter(edu =>
            edu.institution.trim() && edu.degree.trim()
          ),
          languages: resumeData.languages.filter(lang =>
            lang.name.trim() && lang.proficiency.trim()
          ),
          certifications: resumeData.certifications.filter(cert =>
            cert.name.trim()
          )
        };



        // Load the parsed data into the form
        loadResume(cleanResumeData);
        toast.success('Resume uploaded and parsed successfully!');
        return;
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        toast.error('Failed to parse resume data. Please try again or fill the form manually.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Step navigation
  const nextStep = async () => {
    // Validate current step before moving forward
    let valid = true;
    if (step === 1) {
      valid = await methods.trigger(['fullName', 'email', 'languages']);
    } else if (step === 2) {
      valid = await methods.trigger(['workExperience']);
    } else if (step === 3) {
      valid = await methods.trigger(['education', 'certifications']);
    }
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-4 px-0 sm:px-4 lg:px-8 transition-colors duration-300">
      <div aria-live="polite" aria-busy={Boolean(isEnhancing !== null || isEnhancingSummary)}>
        {(isEnhancing || isEnhancingSummary) && <LoadingOverlay />}
      </div>
      <FormProvider {...methods}>
        <form className="w-full sm:max-w-6xl bg-white dark:bg-gray-800 shadow-2xl rounded-none sm:rounded-2xl p-3 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 transition-colors">
          <ToastContainer position="top-right" autoClose={3000} />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-2 text-center transition-colors">Build Your Resume</h2>
          {formError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm sm:text-base transition-colors">{formError}</div>
          )}
          {/* Stepper Navigation */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <button type="button" className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} transition-colors`} onClick={() => setStep(1)}>Step 1</button>
            <button type="button" className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} transition-colors`} onClick={() => setStep(2)}>Step 2</button>
            <button type="button" className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} transition-colors`} onClick={() => setStep(3)}>Step 3</button>
          </div>
          {/* Step 1: Personal Info, Languages, Upload */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 transition-colors rounded-lg p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* File Upload Section */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Upload Existing Resume (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Upload your existing resume</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
                    </p>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`inline-flex items-center px-4 py-3 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Your resume data will be automatically parsed and filled into the form below
                    </p>
                  </div>
                </div>
              </div>
              <PersonalInfoSection />
              <LanguagesSection
                register={register}
                errors={errors}
                languageFields={languageFields as any}
                appendLanguage={appendLanguage}
                removeLanguage={removeLanguage}
              />
            </div>
          )}
          {/* Step 2: Professional Experience */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 transition-colors rounded-lg p-3 sm:p-6 space-y-4 sm:space-y-6">
              <SummarySection onEnhance={handleEnhanceSummary} isEnhancing={isEnhancingSummary} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Skills</h3>
              <SkillsSelect control={control} skills={skills} setSkills={setSkills as React.Dispatch<React.SetStateAction<any>>} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Work Experience</h3>
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
            </div>
          )}
          {/* Step 3: Education, Certifications, Template, Generate */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 transition-colors rounded-lg p-3 sm:p-6 space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Education</h3>
              <EducationSection
                register={register}
                errors={errors}
                educationFields={educationFields as any}
                appendEducation={appendEducation}
                removeEducation={removeEducation}
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Certifications (Optional)</h3>
              <CertificationsSection
                register={register}
                errors={errors}
                certificationFields={certificationFields as any}
                appendCertification={appendCertification}
                removeCertification={removeCertification}
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Choose a Template</h3>
              <TemplateSelectionSection selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
              {/* Generate Button */}
              <button
                type="button"
                onClick={handlePreviewClick}
                disabled={isLoading}
                className={`w-full py-3 sm:py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Generating...' : preview ? 'Generate PDF' : 'Preview Resume'}
              </button>
              {/* Save Resume Button - only visible on step 3 */}
              <button
                type="button"
                onClick={handleSubmit(saveResume)}
                disabled={isSaving}
                className={`w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base font-medium ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save Resume'}
              </button>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="px-4 sm:px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm sm:text-base">Previous</button>
            )}
            {step < 3 && (
              <button type="button" onClick={nextStep} className="ml-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base">Next</button>
            )}
          </div>
        </form>
      </FormProvider>
      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4 transition-colors"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Resume Preview</h3>
              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="flex-1 sm:flex-none py-2 px-4 sm:px-6 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 text-sm sm:text-base transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className={`flex-1 sm:flex-none py-2 px-4 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate PDF'}
                </button>
              </div>
            </div>
            <div className="resume-preview bg-white dark:bg-gray-900 shadow-lg overflow-x-auto transition-colors mt-4 sm:mt-0">
              <ResumeTemplate data={preview} template={selectedTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;