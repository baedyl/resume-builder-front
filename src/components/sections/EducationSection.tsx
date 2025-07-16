import React from 'react';
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface EducationField {
  id: string;
  institution?: string;
  degree?: string;
  major?: string;
  graduationYear?: number | undefined;
}

interface Props {
  register: UseFormRegister<any>;
  errors: any;
  educationFields: EducationField[];
  appendEducation: (value: any) => void;
  removeEducation: (index: number) => void;
}

const EducationSection: React.FC<Props> = ({ register, errors, educationFields, appendEducation, removeEducation }) => {
  const { setValue, getValues } = useFormContext();

  const moveEducation = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= educationFields.length) return;
    
    const currentValues = getValues('education');
    const newValues = [...currentValues];
    const [movedItem] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, movedItem);
    
    setValue('education', newValues);
  };

  return (
    <div className="space-y-4">
      {errors.education && <p className="mb-2 text-xs sm:text-sm text-red-600">{errors.education.message}</p>}
      {educationFields.map((field, index) => (
        <div key={field.id} className="p-4 sm:p-6 border border-gray-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Education {index + 1}</h4>
              {educationFields.length > 1 && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveEducation(index, index - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={index === 0}
                  >
                    <FaArrowUp className={index === 0 ? 'text-gray-300' : 'text-gray-600'} size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEducation(index, index + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={index === educationFields.length - 1}
                  >
                    <FaArrowDown 
                      className={index === educationFields.length - 1 ? 'text-gray-300' : 'text-gray-600'} 
                      size={12} 
                    />
                  </button>
                </div>
              )}
            </div>
            {educationFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Institution</label>
              <input
                {...register(`education.${index}.institution` as const)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.education?.[index]?.institution ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Institution"
              />
              {errors.education?.[index]?.institution && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.education[index].institution.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Degree</label>
              <input
                {...register(`education.${index}.degree` as const)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.education?.[index]?.degree ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Degree"
              />
              {errors.education?.[index]?.degree && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.education[index].degree.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Major (Optional)</label>
              <input
                {...register(`education.${index}.major` as const)}
                className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Major"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Graduation Year (Optional)</label>
              <input
                {...register(`education.${index}.graduationYear`, { valueAsNumber: true } as any)}
                type="number"
                min="1900"
                max="9999"
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.education?.[index]?.graduationYear ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="YYYY"
              />
              {errors.education?.[index]?.graduationYear && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.education[index].graduationYear.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendEducation({ institution: '', degree: '', major: '', graduationYear: undefined })}
        className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationSection; 