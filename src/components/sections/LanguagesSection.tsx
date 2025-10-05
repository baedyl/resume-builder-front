
import { UseFormRegister, useFormContext } from 'react-hook-form';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface LanguageField {
  id: string;
  name?: string;
  proficiency?: string;
}

interface Props {
  register: UseFormRegister<any>;
  errors: any;
  languageFields: LanguageField[];
  appendLanguage: (value: any) => void;
  removeLanguage: (index: number) => void;
}

const LanguagesSection: React.FC<Props> = ({ register, errors, languageFields, appendLanguage, removeLanguage }) => {
  const { setValue, getValues } = useFormContext();

  const moveLanguage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= languageFields.length) return;
    
    const currentValues = getValues('languages');
    const newValues = [...currentValues];
    const [movedItem] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, movedItem);
    
    setValue('languages', newValues);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Languages</h3>
      {languageFields.map((field, index) => (
        <div key={field.id} className="p-4 sm:p-6 border border-gray-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Language {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeLanguage(index)}
              className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Language</label>
              <select
                {...register(`languages.${index}.name`)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 ${errors.languages?.[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={getValues(`languages.${index}.name`) || ''}
              >
                <option value="">Select a language</option>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="arabic">Arabic</option>
                <option value="chinese">Chinese</option>
                <option value="hindi">Hindi</option>
                <option value="bengali">Bengali</option>
                <option value="portuguese">Portuguese</option>
                <option value="russian">Russian</option>
                <option value="urdu">Urdu</option>
                <option value="indonesian">Indonesian</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
                <option value="turkish">Turkish</option>
                <option value="italian">Italian</option>
                <option value="korean">Korean</option>
                <option value="vietnamese">Vietnamese</option>
                <option value="polish">Polish</option>
                <option value="dutch">Dutch</option>
                <option value="swedish">Swedish</option>
              </select>
              {errors.languages?.[index]?.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.languages[index].name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Proficiency</label>
              <select
                {...register(`languages.${index}.proficiency`)}
                className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 ${errors.languages?.[index]?.proficiency ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={getValues(`languages.${index}.proficiency`) || ''}
              >
                <option value="">Select proficiency</option>
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
                <option value="Beginner">Beginner</option>
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
              </select>
              {errors.languages?.[index]?.proficiency && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.languages[index].proficiency.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendLanguage({ name: '', proficiency: '' })}
        className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium"
      >
        + Add Language
      </button>
    </div>
  );
};

export default LanguagesSection; 