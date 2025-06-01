import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import LoadingOverlay from './LoadingOverlay';
import { useAuth0 } from '@auth0/auth0-react';

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

type ResumeFormData = z.infer<typeof ResumeFormSchema>;
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

const ResumeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormSchema),
    defaultValues: {
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

  const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience, move: moveWorkExperience } = useFieldArray({
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
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ResumeFormData | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<number | null>(null);
  const [isManuallyOrdered, setIsManuallyOrdered] = useState(false);
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const { getAccessTokenSilently, user } = useAuth0();

  // Memoize sorted fields (unchanged)
  const sortedWorkExperienceFields = useMemo(() => {
    console.log('Memoizing sortedWorkExperienceFields', { isManuallyOrdered, fieldIds: workExperienceFields.map(f => f.id) });
    if (isManuallyOrdered) return workExperienceFields;
    return [...workExperienceFields].sort((a, b) => {
      const aEnd = a.endDate || '9999-12';
      const bEnd = b.endDate || '9999-12';
      if (aEnd === bEnd) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return new Date(bEnd).getTime() - new Date(aEnd).getTime();
    });
  }, [workExperienceFields, isManuallyOrdered]);

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
    setSelectedSkills(mockResumeData.skills);
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

  // Existing functions (unchanged)
  const handleEnhanceDescription = async (index: number) => {
    const { jobTitle, description } = getValues(`workExperience.${index}`);
    const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
    if (!description) {
      toast.error('Please enter a description to enhance.');
      return;
    }
    if (!jobTitle) {
      toast.error('Please enter a job title to enhance the description.');
      return;
    }
    setIsEnhancing(index);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resumes/enhance-description`, {
        jobTitle,
        description,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const enhancedDescription = response.data.enhancedDescription;
      if (!enhancedDescription || !enhancedDescription.trim() || !enhancedDescription.includes('•')) {
        throw new Error('Received empty or invalid enhanced description.');
      }
      setValue(`workExperience.${index}.description`, enhancedDescription);
      toast.success('Description enhanced successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to enhance description.';
      toast.error(message);
      console.error('Enhancement error:', error);
    } finally {
      setIsEnhancing(null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const sourceOriginalIndex = workExperienceFields.findIndex((f) => f.id === sortedWorkExperienceFields[sourceIndex].id);
    const destOriginalIndex = workExperienceFields.findIndex((f) => f.id === sortedWorkExperienceFields[destIndex].id);
    console.log(`Dragging from ${sourceIndex} (original: ${sourceOriginalIndex}) to ${destIndex} (original: ${destOriginalIndex})`);
    moveWorkExperience(sourceOriginalIndex, destOriginalIndex);
    setIsManuallyOrdered(true);
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

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    if (!preview) {
      data.workExperience = data.workExperience
        .filter((exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim())
        .sort((a, b) => {
          const aEnd = a.isCurrent || !a.endDate ? '9999-12' : a.endDate;
          const bEnd = b.isCurrent || !b.endDate ? '9999-12' : b.endDate;
          if (aEnd === bEnd) {
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          }
          return new Date(bEnd).getTime() - new Date(aEnd).getTime();
        });
      data.education = data.education.filter((edu) => edu.institution.trim() && edu.degree.trim());
      data.languages = data.languages.filter((lang) => lang.name.trim() && lang.proficiency.trim());
      data.certifications = data.certifications.filter((cert) => cert.name.trim() && cert.issuer.trim());
      console.log('Filtered and sorted data:', JSON.stringify(data, null, 2));
      setPreview(data);
      return;
    }

    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      // console.log('Token:', token); // Verify it’s retrieved
      setIsLoading(true);
      setFormError(null);
      data.skills = selectedSkills;
      data.workExperience = data.workExperience.sort((a, b) => {
        const aEnd = a.isCurrent || !a.endDate ? '9999-12' : a.endDate;
        const bEnd = b.isCurrent || !b.endDate ? '9999-12' : b.endDate;
        if (aEnd === bEnd) {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        return new Date(bEnd).getTime() - new Date(aEnd).getTime();
      });

      // console.log('Sending payload:', JSON.stringify(data, null, 2));
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error:', errorData);
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
      link.href = url;
      link.download = 'resume.pdf';
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div aria-live="polite" aria-busy={isEnhancing}>
        {(isEnhancing || isEnhancingSummary) && <LoadingOverlay />}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-4 sm:p-10 space-y-8"
      >
        {/* Development-only mock data button */}
        {import.meta.env.MODE === 'development' && (
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

        {/* Personal Information (unchanged) */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Full Name</label>
          <input
            {...register('fullName')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Full Name"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Email</label>
          <input
            {...register('email')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Phone (Optional)</label>
          <input
            {...register('phone')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Phone"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Address (Optional)</label>
          <input
            {...register('address')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Address"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">LinkedIn (Optional)</label>
          <input
            {...register('linkedIn')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="LinkedIn URL"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Website (Optional)</label>
          <input
            {...register('website')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Website URL"
          />
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Professional Summary (Optional)</label>
          <textarea
            {...register('summary')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Professional Summary"
            rows={5}
          />
          <button
            type="button"
            onClick={handleEnhanceSummary}
            disabled={isEnhancingSummary}
            className={`mt-2 px-4 py-2 rounded-lg text-base font-medium border ${isEnhancingSummary
              ? 'text-gray-500 border-gray-500 cursor-not-allowed'
              : 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
              }`}
          >
            {isEnhancingSummary ? 'Enhancing...' : 'Enhance With AI ✨'}
          </button>
        </div>

        {/* Skills (unchanged) */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-700">Skills</label>
          <CreatableSelect
            isMulti
            options={skills.map((skill) => ({ value: skill.id, label: skill.name }))}
            onChange={(selected) =>
              setSelectedSkills(
                selected.map((option, index) => ({
                  id: option.__isNew__ ? -index - 1 : option.value,
                  name: option.label,
                }))
              )
            }
            onCreateOption={(inputValue) => {
              const newSkill = { id: -skills.length - 1, name: inputValue };
              setSkills([...skills, newSkill]);
              setSelectedSkills([...selectedSkills, newSkill]);
            }}
            value={selectedSkills.map((skill) => ({ value: skill.id, label: skill.name }))}
            className="basic-multi-select"
            classPrefix="select"
          />
          {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
        </div>

        {/* Work Experience (unchanged) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
            <button
              type="button"
              onClick={resetToChronological}
              className="text-blue-600 hover:text-blue-800 text-base font-medium"
            >
              Reset to Chronological
            </button>
          </div>
          {errors.workExperience && (
            <p className="mb-2 text-sm text-red-600">{errors.workExperience.message}</p>
          )}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workExperiences">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sortedWorkExperienceFields.map((field, index) => {
                    const originalIndex = workExperienceFields.findIndex((f) => f.id === field.id);
                    const draggableId = `${field.id}-${index}`;
                    return (
                      <Draggable key={draggableId} draggableId={draggableId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-6 border border-gray-200 rounded-lg space-y-4 mb-4 bg-white cursor-move"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500 cursor-move" {...provided.dragHandleProps}>☰</span>
                                <h4 className="text-base font-medium text-gray-700">Experience {index + 1}</h4>
                              </div>
                              <div className="flex space-x-2">
                                {workExperienceFields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeWorkExperience(originalIndex)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-base font-medium text-gray-700">Company</label>
                                <input
                                  {...register(`workExperience.${originalIndex}.company`)}
                                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.company ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                  placeholder="Company"
                                />
                                {errors.workExperience?.[originalIndex]?.company && (
                                  <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].company.message}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="block text-base font-medium text-gray-700">Job Title</label>
                                <input
                                  {...register(`workExperience.${originalIndex}.jobTitle`)}
                                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.jobTitle ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                  placeholder="Job Title"
                                />
                                {errors.workExperience?.[originalIndex]?.jobTitle && (
                                  <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].jobTitle.message}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="block text-base font-medium text-gray-700">Start Date</label>
                                <input
                                  {...register(`workExperience.${originalIndex}.startDate`)}
                                  type="month"
                                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                  placeholder="YYYY-MM"
                                />
                                {errors.workExperience?.[originalIndex]?.startDate && (
                                  <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].startDate.message}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="block text-base font-medium text-gray-700">
                                  End Date {index === 0 && <span className="text-gray-500">(Optional)</span>}
                                </label>
                                <input
                                  {...register(`workExperience.${originalIndex}.endDate`)}
                                  type="month"
                                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.endDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                  placeholder="YYYY-MM or Present"
                                />
                                {errors.workExperience?.[originalIndex]?.endDate && (
                                  <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].endDate.message}</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-base font-medium text-gray-700">Description</label>
                              <textarea
                                {...register(`workExperience.${originalIndex}.description`)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                placeholder="Key responsibilities and achievements"
                                rows={4}
                              />
                              <button
                                type="button"
                                onClick={() => handleEnhanceDescription(originalIndex)}
                                disabled={isEnhancing === originalIndex}
                                className={`mt-2 px-4 py-2 rounded-lg text-base font-medium border ${isEnhancing === originalIndex
                                  ? 'text-gray-500 border-gray-500 cursor-not-allowed'
                                  : 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                                  }`}
                              >
                                {isEnhancing === originalIndex ? 'Enhancing...' : 'Enhance With AI ✨'}
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            type="button"
            onClick={() => {
              appendWorkExperience({ company: '', jobTitle: '', startDate: '', endDate: '', description: '' });
              setIsManuallyOrdered(true);
            }}
            className="text-blue-600 hover:text-blue-800 text-base font-medium"
          >
            + Add Work Experience
          </button>
        </div>

        {/* Education (unchanged) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Education</h3>
          {errors.education && <p className="mb-2 text-sm text-red-600">{errors.education.message}</p>}
          {educationFields.map((field, index) => (
            <div key={field.id} className="p-6 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-700">Education {index + 1}</h4>
                {educationFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Institution</label>
                  <input
                    {...register(`education.${index}.institution`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Institution"
                  />
                  {errors.education?.[index]?.institution && (
                    <p className="mt-1 text-sm text-red-600">{errors.education[index].institution.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Degree</label>
                  <input
                    {...register(`education.${index}.degree`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.degree ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Degree"
                  />
                  {errors.education?.[index]?.degree && (
                    <p className="mt-1 text-sm text-red-600">{errors.education[index].degree.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Major (Optional)</label>
                  <input
                    {...register(`education.${index}.major`)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Major"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Graduation Year (Optional)</label>
                  <input
                    {...register(`education.${index}.graduationYear`, { valueAsNumber: true })}
                    type="number"
                    min="1900"
                    max="9999"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.graduationYear ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="YYYY"
                  />
                  {errors.education?.[index]?.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.education[index].graduationYear.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendEducation({ institution: '', degree: '', major: '', graduationYear: undefined })}
            className="text-blue-600 hover:text-blue-800 text-base font-medium"
          >
            + Add Education
          </button>
        </div>

        {/* Languages (unchanged) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Languages (Optional)</h3>
          {languageFields.map((field, index) => (
            <div key={field.id} className="p-6 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-700">Language {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Language</label>
                  <input
                    {...register(`languages.${index}.name`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.languages?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Language"
                  />
                  {errors.languages?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages[index].name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Proficiency</label>
                  <select
                    {...register(`languages.${index}.proficiency`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.languages?.[index]?.proficiency ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select Proficiency</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  {errors.languages?.[index]?.proficiency && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages[index].proficiency.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendLanguage({ name: '', proficiency: '' })}
            className="text-blue-600 hover:text-blue-800 text-base font-medium"
          >
            + Add Language
          </button>
        </div>

        {/* Certifications (unchanged) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Certifications (Optional)</h3>
          {certificationFields.map((field, index) => (
            <div key={field.id} className="p-6 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-700">Certification {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Certification Name</label>
                  <input
                    {...register(`certifications.${index}.name`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.certifications?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Certification Name"
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.certifications[index].name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Issuer</label>
                  <input
                    {...register(`certifications.${index}.issuer`)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.certifications?.[index]?.issuer ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Issuer"
                  />
                  {errors.certifications?.[index]?.issuer && (
                    <p className="mt-1 text-sm text-red-600">{errors.certifications[index].issuer.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700">Issue Date (Optional)</label>
                  <input
                    {...register(`certifications.${index}.issueDate`)}
                    type="month"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="YYYY-MM"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendCertification({ name: '', issuer: '', issueDate: '' })}
            className="text-blue-600 hover:text-blue-800 text-base font-medium"
          >
            + Add Certification
          </button>
        </div>

        {/* Submit Button (unchanged) */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium ${isLoading || Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? 'Generating...' : preview ? 'Generate PDF' : 'Preview Resume'}
        </button>
      </form>

      {/* Preview Modal (unchanged) */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Resume Preview</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 text-lg">Personal Information</h4>
                <p><strong>Name:</strong> {preview.fullName}</p>
                <p><strong>Email:</strong> {preview.email}</p>
                {preview.phone && <p><strong>Phone:</strong> {preview.phone}</p>}
                {preview.address && <p><strong>Address:</strong> {preview.address}</p>}
                {preview.linkedIn && <p><strong>LinkedIn:</strong> {preview.linkedIn}</p>}
                {preview.website && <p><strong>Website:</strong> {preview.website}</p>}
              </div>
              {preview.summary && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Summary</h4>
                  <p>{preview.summary}</p>
                </div>
              )}
              {selectedSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Skills</h4>
                  <p>{selectedSkills.map((s) => s.name).join(', ')}</p>
                </div>
              )}
              {preview.workExperience.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Work Experience</h4>
                  {preview.workExperience.map((exp, index) => (
                    <div key={index} className="mb-3">
                      <p><strong>{exp.jobTitle}</strong> at {exp.company}</p>
                      <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
                      {exp.description && (
                        <ul className="list-disc ml-5">
                          {exp.description.split('\n').map((bullet, i) => (
                            <li key={i}>{bullet.replace(/^•\s*/, '')}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {preview.education.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Education</h4>
                  {preview.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <p><strong>{edu.degree}</strong>{edu.major ? `, ${edu.major}` : ''}</p>
                      <p>{edu.institution}{edu.graduationYear ? `, ${edu.graduationYear}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
              {preview.languages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Languages</h4>
                  {preview.languages.map((lang, index) => (
                    <div key={index} className="mb-3">
                      <p>{lang.name} – {lang.proficiency}</p>
                    </div>
                  ))}
                </div>
              )}
              {preview.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 text-lg">Certifications</h4>
                  {preview.certifications.map((cert, index) => (
                    <div key={index} className="mb-3">
                      <p><strong>{cert.name}</strong> – {cert.issuer}{cert.issueDate ? `, ${cert.issueDate}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="py-2 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-base"
              >
                Edit
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className={`py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;