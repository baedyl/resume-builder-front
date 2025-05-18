// src/components/ResumeForm.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Select from 'react-select';

interface Skill {
  id: number;
  name: string;
}

interface ResumeFormData {
  fullName: string;
  email: string;
  skills: Skill[];
}

const ResumeForm: React.FC = () => {
  const { register, handleSubmit } = useForm<ResumeFormData>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/skills')
      .then((res) => res.json())
      .then((data: Skill[]) => setSkills(data))
      .catch((error: Error) => console.error('Error fetching skills:', error));
  }, []);

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    try {
      data.skills = selectedSkills;
      const response = await fetch('http://localhost:3000/api/resumes', {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          {...register('fullName', { required: true })}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Skills</label>
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Generate Resume
      </button>
    </form>
  );
};

export default ResumeForm;