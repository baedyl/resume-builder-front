
import { useFormContext } from 'react-hook-form';

interface Props {
  onEnhance: () => void;
  isEnhancing: boolean;
}

const SummarySection: React.FC<Props> = ({ onEnhance, isEnhancing }) => {
  const { register } = useFormContext<any>();
  return (
    <div className="space-y-2">
      <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Professional Summary (Optional)</label>
      <textarea
        {...register('summary')}
        className="w-full p-3 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        placeholder="Professional Summary"
        rows={5}
      />
      <button
        type="button"
        onClick={onEnhance}
        disabled={isEnhancing}
        className={`mt-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium border ${isEnhancing
          ? 'text-gray-500 border-gray-500 cursor-not-allowed'
          : 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'}`}
      >
        {isEnhancing ? 'Enhancing...' : 'Enhance With AI ✨'}
      </button>
    </div>
  );
};

export default SummarySection; 