import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Select from 'react-select';

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

interface Skill {
  id: number;
  name: string;
}

interface ResumeFormData {
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
}

const ResumeForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResumeFormData>({
    defaultValues: {
      workExperience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ institution: '', degree: '', fieldOfStudy: '', graduationYear: '' }],
    },
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ResumeFormData | null>(null);
  const [workExperiences, setWorkExperiences] = useState<number[]>([0]);
  const [educations, setEducations] = useState<number[]>([0]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/skills`)
      .then((res) => res.json())
      .then((data: Skill[]) => setSkills(data))
      .catch((error: Error) => {
        setError('Failed to load skills. Please try again.');
        console.error('Error fetching skills:', error);
      });
  }, []);

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, workExperiences.length]);
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([...educations, educations.length]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    if (!preview) {
      // Filter out empty entries
      data.workExperience = data.workExperience.filter(
        (exp) => exp.company || exp.position || exp.startDate || exp.endDate || exp.description,
      );
      data.education = data.education.filter(
        (edu) => edu.institution || edu.degree || edu.fieldOfStudy || edu.graduationYear,
      );
      setPreview(data);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      data.skills = selectedSkills;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      setPreview(null); // Close modal after generation
    } catch (error) {
      setError('Failed to generate resume. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Build Your Resume</h2>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Full Name"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
          <input
            {...register('phone')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary (Optional)</label>
          <textarea
            {...register('summary')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Professional Summary"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <Select
            isMulti
            options={skills.map((skill) => ({ value: skill.id, label: skill.name }))}
            onChange={(selected) =>
              setSelectedSkills(
                selected.map((option) => {
                  const skill = skills.find((s) => s.id === option.value);
                  return { id: option.value, name: skill?.name || '' };
                }),
              )
            }
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Experience</h3>
          {workExperiences.map((_, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Experience {index + 1}</h4>
                {workExperiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    {...register(`workExperience.${index}.company`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    {...register(`workExperience.${index}.position`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Position"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      {...register(`workExperience.${index}.startDate`)}
                      type="month"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input
                      {...register(`workExperience.${index}.endDate`)}
                      type="month"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="YYYY-MM or Present"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register(`workExperience.${index}.description`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Key responsibilities and achievements"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addWorkExperience}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Work Experience
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
          {educations.map((_, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Education {index + 1}</h4>
                {educations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    {...register(`education.${index}.institution`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Institution"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    {...register(`education.${index}.degree`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Degree"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    {...register(`education.${index}.fieldOfStudy`)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Field of Study"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input
                    {...register(`education.${index}.graduationYear`)}
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Education
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Preview Resume'}
        </button>
      </form>

      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Preview</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Personal Information</h4>
                <p><strong>Name:</strong> {preview.fullName}</p>
                <p><strong>Email:</strong> {preview.email}</p>
                {preview.phone && <p><strong>Phone:</strong> {preview.phone}</p>}
              </div>
              {preview.summary && (
                <div>
                  <h4 className="font-semibold text-gray-700">Summary</h4>
                  <p>{preview.summary}</p>
                </div>
              )}
              {selectedSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Skills</h4>
                  <p>{selectedSkills.map((s) => s.name).join(', ')}</p>
                </div>
              )}
              {preview.workExperience.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Work Experience</h4>
                  {preview.workExperience.map((exp, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>{exp.position}</strong> at {exp.company}</p>
                      <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {preview.education.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700">Education</h4>
                  {preview.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>{edu.degree}</strong>, {edu.fieldOfStudy}</p>
                      <p>{edu.institution}, {edu.graduationYear}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Edit
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className={`py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
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