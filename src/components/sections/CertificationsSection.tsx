
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface CertificationField {
  id: string;
  name?: string;
  issuer?: string;
  issueDate?: string;
}

interface Props {
  register: UseFormRegister<any>;
  errors: any;
  certificationFields: CertificationField[];
  appendCertification: (value: any) => void;
  removeCertification: (index: number) => void;
}

const CertificationsSection: React.FC<Props> = ({ register, errors, certificationFields, appendCertification, removeCertification }) => {
  const { setValue, getValues } = useFormContext();

  const moveCertification = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= certificationFields.length) return;
    
    const currentValues = getValues('certifications');
    const newValues = [...currentValues];
    const [movedItem] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, movedItem);
    
    setValue('certifications', newValues);
  };

  return (
    <div className="space-y-4">
      {certificationFields.map((field, index) => (
        <div key={field.id} className="p-4 sm:p-6 border border-gray-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Certification {index + 1}</h4>
              {certificationFields.length > 1 && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveCertification(index, index - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={index === 0}
                  >
                    <FaArrowUp className={index === 0 ? 'text-gray-300' : 'text-gray-600'} size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCertification(index, index + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={index === certificationFields.length - 1}
                  >
                    <FaArrowDown 
                      className={index === certificationFields.length - 1 ? 'text-gray-300' : 'text-gray-600'} 
                      size={12} 
                    />
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Certification Name</label>
              <input
                {...register(`certifications.${index}.name`)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.certifications?.[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Certification Name"
              />
              {errors.certifications?.[index]?.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.certifications[index].name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Issuer</label>
              <input
                {...register(`certifications.${index}.issuer`)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.certifications?.[index]?.issuer ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Issuer"
              />
              {errors.certifications?.[index]?.issuer && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.certifications[index].issuer.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Issue Date (Optional)</label>
              <input
                {...register(`certifications.${index}.issueDate`)}
                type="month"
                className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="YYYY-MM"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendCertification({ name: '', issuer: '', issueDate: '' })}
        className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium"
      >
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsSection; 