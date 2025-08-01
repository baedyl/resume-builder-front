import React from 'react';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

interface LanguageSelectionSectionProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  compact?: boolean; // For more compact display
}

const LanguageSelectionSection: React.FC<LanguageSelectionSectionProps> = ({
  selectedLanguage,
  onLanguageChange,
  compact = false,
}) => {
  const selectedOption = languageOptions.find(opt => opt.code === selectedLanguage);

  return (
    <div className="space-y-3">
      {!compact && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors mb-2">
            Resume Language
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Select the language for your resume generation.
          </p>
        </div>
      )}
      
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.flag} {option.name} ({option.code.toUpperCase()})
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {selectedOption && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-lg">{selectedOption.flag}</span>
          <span>
            Selected: <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOption.name}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelectionSection; 