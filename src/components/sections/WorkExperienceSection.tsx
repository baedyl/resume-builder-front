
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface WorkExperienceField {
  id: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  companyDescription?: string;
  techStack?: string | string[];
}

interface Props {
  register: UseFormRegister<any>;
  errors: any;
  workExperienceFields: WorkExperienceField[];
  removeWorkExperience: (index: number) => void;
  appendWorkExperience: (value: any) => void;
  resetToChronological: () => void;
  handleEnhanceDescription: (index: number) => void;
  isEnhancing: number | null;
}

const WorkExperienceSection: React.FC<Props> = ({
  register,
  errors,
  workExperienceFields,
  removeWorkExperience,
  appendWorkExperience,
  resetToChronological,
  handleEnhanceDescription,
  isEnhancing,
}) => {
  const { getValues, setValue, watch } = useFormContext();
  const currentDate = new Date().toISOString().slice(0, 7);

  const moveWorkExperience = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= workExperienceFields.length) return;
    
    const currentValues = getValues('workExperience');
    const newValues = [...currentValues];
    const [movedItem] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, movedItem);
    
    setValue('workExperience', newValues);
  };

  const handleCurrentJobChange = (index: number, isCurrent: boolean) => {
    if (isCurrent) {
      setValue(`workExperience.${index}.endDate`, 'Present');
    } else {
      setValue(`workExperience.${index}.endDate`, '');
    }
    setValue(`workExperience.${index}.isCurrent`, isCurrent);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={resetToChronological}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base font-medium transition-colors"
        >
          Reset to Chronological
        </button>
      </div>
      {errors.workExperience && (
        <p className="mb-2 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience.message}</p>
      )}
      <div className="space-y-4">
        {workExperienceFields.map((field, index) => {
          const isCurrent = watch(`workExperience.${index}.isCurrent`);
          const endDate = watch(`workExperience.${index}.endDate`);
          
          return (
            <div key={field.id} className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Experience {index + 1}</h4>
                  {workExperienceFields.length > 1 && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveWorkExperience(index, index - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        disabled={index === 0}
                      >
                        <FaArrowUp className={index === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'} size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveWorkExperience(index, index + 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        disabled={index === workExperienceFields.length - 1}
                      >
                        <FaArrowDown 
                          className={index === workExperienceFields.length - 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'} 
                          size={12} 
                        />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Company</label>
                  <input
                    {...register(`workExperience.${index}.company` as const)}
                    className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.workExperience?.[index]?.company ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Company"
                  />
                  {errors.workExperience?.[index]?.company && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience[index].company.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Job Title</label>
                  <input
                    {...register(`workExperience.${index}.jobTitle` as const)}
                    className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.workExperience?.[index]?.jobTitle ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Job Title"
                  />
                  {errors.workExperience?.[index]?.jobTitle && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience[index].jobTitle.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Location (Optional)</label>
                  <input
                    {...register(`workExperience.${index}.location` as const)}
                    className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.workExperience?.[index]?.location ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="City, Country (e.g., Paris, France)"
                  />
                  {errors.workExperience?.[index]?.location && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience[index].location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Start Date</label>
                  <input
                    {...register(`workExperience.${index}.startDate` as const)}
                    type="month"
                    className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.workExperience?.[index]?.startDate ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="YYYY-MM"
                    min="1900-01"
                    max={currentDate}
                  />
                  {errors.workExperience?.[index]?.startDate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience[index].startDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">End Date</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={isCurrent}
                        onChange={(e) => handleCurrentJobChange(index, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                        Current Job
                      </label>
                    </div>
                    {isCurrent ? (
                      <input
                        {...register(`workExperience.${index}.endDate` as const)}
                        value="Present"
                        readOnly
                        className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors"
                      />
                    ) : (
                      <input
                        {...register(`workExperience.${index}.endDate` as const)}
                        type="month"
                        className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.workExperience?.[index]?.endDate ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="YYYY-MM"
                        min={getValues(`workExperience.${index}.startDate`) || '1900-01'}
                        max={currentDate}
                      />
                    )}
                  </div>
                  {errors.workExperience?.[index]?.endDate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{errors.workExperience[index].endDate.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Description</label>
                <textarea
                  {...register(`workExperience.${index}.description` as const)}
                  className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="Describe your responsibilities and achievements"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Company Description (Optional)</label>
                  <textarea
                    {...register(`workExperience.${index}.companyDescription` as const)}
                    className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    placeholder="Briefly describe the company (size, industry, mission)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Tech Stack (Optional)</label>
                  <input
                    {...register(`workExperience.${index}.techStack` as const)}
                    className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    placeholder="Comma-separated (e.g., React, TypeScript, Node.js)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">We’ll format this as a list on export.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleEnhanceDescription(index)}
                disabled={isEnhancing === index}
                className={`mt-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium border ${isEnhancing === index
                  ? 'text-gray-500 border-gray-500 cursor-not-allowed'
                  : 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'}`}
              >
                {isEnhancing === index ? 'Enhancing...' : 'Enhance Description ✨'}
              </button>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => appendWorkExperience({ company: '', jobTitle: '', startDate: '', endDate: '', isCurrent: false, description: '', companyDescription: '', techStack: '', location: '' })}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base font-medium transition-colors"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default WorkExperienceSection; 