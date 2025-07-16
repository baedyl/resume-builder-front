import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export interface CoverLetterFormData {
  id?: string;
  name?: string;
  jobDescription: string;
  content?: string;
}

interface CoverLetterFormProps {
  initialData?: CoverLetterFormData;
  onSave?: (coverLetter: any) => void;
  onCancel?: () => void;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ initialData, onSave, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CoverLetterFormData>({
    defaultValues: initialData || {
      name: '',
      jobDescription: '',
      content: '',
    },
  });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CoverLetterFormData) => {
    try {
      const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
      let response;
      if (data.id) {
        // Only send fields present in the form
        const updatePayload = {
          name: data.name,
          jobDescription: data.jobDescription,
          content: data.content,
        };
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/cover-letter/${data.id}`, updatePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Cover letter updated successfully!');
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cover-letter`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Cover letter created successfully!');
      }
      if (onSave) onSave(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to save cover letter.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">Name</label>
          <input
            id="name"
            {...register('name')}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors p-3 text-sm sm:text-base"
          />
        </div>
        <div>
          <label htmlFor="jobDescription" className="block font-medium text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">Job Description{!initialData?.id && <span className="text-red-500">*</span>}</label>
          <textarea
            id="jobDescription"
            {...register('jobDescription', {
              validate: (value) => {
                if (!initialData?.id && !value.trim()) {
                  return 'Job description is required';
                }
                return true;
              },
            })}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors p-3 text-sm sm:text-base"
          />
          {errors.jobDescription && <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm transition-colors">{errors.jobDescription.message}</div>}
        </div>
        <div>
          <label htmlFor="content" className="block font-medium text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">Cover Letter Content</label>
          <textarea
            id="content"
            {...register('content')}
            rows={10}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors p-3 text-sm sm:text-base"
          />
          {errors.content && <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm transition-colors">{errors.content.message}</div>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 sm:px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">Cancel</button>
          )}
          <button
            type="submit"
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (initialData?.id ? 'Updating...' : 'Creating...') : (initialData?.id ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoverLetterForm; 