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
    phone?: string;
    summary?: string;
    skills: Skill[];
}

const ResumeForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ResumeFormData>();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/skills`)
            .then((res) => res.json())
            .then((data: Skill[]) => setSkills(data))
            .catch((error: Error) => {
                setError('Failed to load skills. Please try again.');
                console.error('Error fetching skills:', error);
            });
    }, []);

    const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
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
                className="w-full max-w-md bg-white shadow-xl rounded-xl p-8"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Build Your Resume</h2>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
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
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address',
                            },
                        })}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
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

                <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? ' generating...' : 'Generate Resume'}
                </button>
            </form>
        </div>
    );
};

export default ResumeForm;