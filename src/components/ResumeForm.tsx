import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schemas
const WorkExperienceSchema = z.object({
    company: z.string().min(1, 'Company is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    startDate: z.string().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Start date must be YYYY-MM'),
    endDate: z.union([z.string().regex(/^\d{4}-\d{2}$/, 'End date must be YYYY-MM'), z.literal('')]).optional(),
    description: z.string().optional(),
}).refine(
    (data) => !data.endDate || (new Date(data.startDate).toString() !== 'Invalid Date' && new Date(data.endDate).toString() !== 'Invalid Date' && new Date(data.startDate) <= new Date(data.endDate)),
    {
        message: 'End date must be after start date',
        path: ['endDate'],
    }
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
    name: z.string().min(1, 'Language name is required').optional(),
    proficiency: z.string().min(1, 'Proficiency is required').optional(),
}).refine((data) => !data.name || !!data.proficiency, {
    message: 'Proficiency is required if language is provided',
    path: ['proficiency'],
}).refine((data) => !data.proficiency || !!data.name, {
    message: 'Language name is required if proficiency is provided',
    path: ['name'],
});

const CertificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required').optional(),
    issuer: z.string().min(1, 'Issuer is required').optional(),
    issueDate: z.string().optional(),
}).refine((data) => !data.name || !!data.issuer, {
    message: 'Issuer is required if certification name is provided',
    path: ['issuer'],
}).refine((data) => !data.issuer || !!data.name, {
    message: ' Sellőző certification name is required if issuer is provided',
    path: ['name'],
});

const ResumeFormSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    summary: z.string().optional(),
    skills: z.array(SkillSchema).default([]),
    workExperience: z.array(WorkExperienceSchema).min(1, 'At least one work experience is required'),
    education: z.array(EducationSchema).min(1, 'At least one education entry is required'),
    languages: z.array(LanguageSchema).default([]),
    certifications: z.array(CertificationSchema).default([]),
});

type ResumeFormData = z.infer<typeof ResumeFormSchema>;
type WorkExperience = z.infer<typeof WorkExperienceSchema>;
type Education = z.infer<typeof EducationSchema>;
type Skill = z.infer<typeof SkillSchema>;
type Language = z.infer<typeof LanguageSchema>;
type Certification = z.infer<typeof CertificationSchema>;

const ResumeForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setError,
    } = useForm<ResumeFormData>({
        resolver: zodResolver(ResumeFormSchema),
        defaultValues: {
            workExperience: [{ company: '', jobTitle: '', startDate: '', endDate: '', description: '' }],
            education: [{ institution: '', degree: '', major: '', graduationYear: undefined }],
            languages: [],
            certifications: [],
            skills: [],
        },
    });

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
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [preview, setPreview] = useState<ResumeFormData | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/skills`)
            .then((res) => res.json())
            .then((data: Skill[]) => setSkills(data))
            .catch((error: Error) => {
                setFormError('Failed to load skills. Please try again.');
                console.error('Error fetching skills:', error);
            });
    }, []);

    const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
        if (!preview) {
            data.workExperience = data.workExperience.filter(
                (exp) => exp.company.trim() && exp.jobTitle.trim() && exp.startDate.trim(),
            );
            data.education = data.education.filter(
                (edu) => edu.institution.trim() && edu.degree.trim(),
            );
            data.languages = data.languages.filter(
                (lang) => lang.name?.trim() && lang.proficiency?.trim(),
            );
            data.certifications = data.certifications.filter(
                (cert) => cert.name?.trim() && cert.issuer?.trim(),
            );
            console.log('Filtered data:', JSON.stringify(data, null, 2));
            setPreview(data);
            return;
        }

        try {
            setIsLoading(true);
            setFormError(null);
            data.skills = selectedSkills;
            console.log('Sending payload:', JSON.stringify(data, null, 2));
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Backend error:', errorData);
                if (errorData.details) {
                    errorData.details.forEach((err: { path: string[]; message: string }) => {
                        const path = err.path.join('.');
                        setError(path as any, { type: 'manual', message: err.message });
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
            <div className="w-[80%] max-w-6xl">
                <div className="sticky top-0 bg-white z-10 p-6 rounded-t-2xl shadow-md">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Build Your Resume</h2>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white shadow-2xl rounded-b-2xl p-10 space-y-8"
                >
                    {formError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-base">
                            {formError}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">Full Name</label>
                        <input
                            {...register('fullName')}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Full Name"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">Email</label>
                        <input
                            {...register('email')}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">Phone (Optional)</label>
                        <input
                            {...register('phone')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                            placeholder="Phone"
                        />
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">Professional Summary (Optional)</label>
                        <textarea
                            {...register('summary')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                            placeholder="Professional Summary"
                            rows={5}
                        />
                    </div>

                    {/* Skills */}
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
                                    })),
                                )
                            }
                            onCreateOption={(inputValue) => {
                                const newSkill = { id: -selectedSkills.length - 1, name: inputValue };
                                setSelectedSkills([...selectedSkills, newSkill]);
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                        {errors.skills && (
                            <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                        )}
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-4 border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
                        {errors.workExperience && (
                            <p className="mb-2 text-sm text-red-600">{errors.workExperience.message}</p>
                        )}
                        {workExperienceFields.map((field, index) => (
                            <div key={field.id} className="p-6 border border-gray-200 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-base font-medium text-gray-700">Experience {index + 1}</h4>
                                    {workExperienceFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeWorkExperience(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-base font-medium text-gray-700">Company</label>
                                        <input
                                            {...register(`workExperience.${index}.company`)}
                                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[index]?.company ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Company"
                                        />
                                        {errors.workExperience?.[index]?.company && (
                                            <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].company.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-base font-medium text-gray-700">Job Title</label>
                                        <input
                                            {...register(`workExperience.${index}.jobTitle`)}
                                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[index]?.jobTitle ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Job Title"
                                        />
                                        {errors.workExperience?.[index]?.jobTitle && (
                                            <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].jobTitle.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-base font-medium text-gray-700">Start Date</label>
                                        <input
                                            {...register(`workExperience.${index}.startDate`)}
                                            type="month"
                                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[index]?.startDate ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="YYYY-MM"
                                        />
                                        {errors.workExperience?.[index]?.startDate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].startDate.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-base font-medium text-gray-700">End Date (Optional)</label>
                                        <input
                                            {...register(`workExperience.${index}.endDate`)}
                                            type="month"
                                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[index]?.endDate ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="YYYY-MM or Present"
                                        />
                                        {errors.workExperience?.[index]?.endDate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].endDate.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-gray-700">Description</label>
                                    <textarea
                                        {...register(`workExperience.${index}.description`)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                        placeholder="Key responsibilities and achievements"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendWorkExperience({ company: '', jobTitle: '', startDate: '', endDate: '', description: '' })}
                            className="text-blue-600 hover:text-blue-800 text-base font-medium"
                        >
                            + Add Work Experience
                        </button>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                        {errors.education && (
                            <p className="mb-2 text-sm text-red-600">{errors.education.message}</p>
                        )}
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

                    {/* Languages */}
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

                    {/* Certifications */}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium ${isLoading || Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading || Object.keys(errors).length > 0}
                    >
                        {isLoading ? 'Generating...' : preview ? 'Generate PDF' : 'Preview Resume'}
                    </button>
                </form>
            </div>


            {/* Preview Modal */}
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
                                            <p>{exp.description}</p>
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