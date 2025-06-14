import React from 'react';
import { UseFormRegister } from 'react-hook-form';

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
  return (
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
                {...register(`education.${index}.institution` as const)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.institution ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Institution"
              />
              {errors.education?.[index]?.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index].institution.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Degree</label>
              <input
                {...register(`education.${index}.degree` as const)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.degree ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Degree"
              />
              {errors.education?.[index]?.degree && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index].degree.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Major (Optional)</label>
              <input
                {...register(`education.${index}.major` as const)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Major"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Graduation Year (Optional)</label>
              <input
                {...register(`education.${index}.graduationYear`, { valueAsNumber: true } as any)}
                type="number"
                min="1900"
                max="9999"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.education?.[index]?.graduationYear ? 'border-red-500' : 'border-gray-300'}`}
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
  );
};

export default EducationSection; 