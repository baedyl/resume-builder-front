import React from 'react';

interface TemplateSelectionSectionProps {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  availableTemplates?: string[];
}

const defaultTemplates = [
  { key: 'modern', label: 'Modern', desc: 'Clean and professional design' },
  { key: 'classic', label: 'Classic', desc: 'Traditional and formal layout' },
  { key: 'minimal', label: 'Minimal', desc: 'Simple and elegant style' },
];

const TemplateSelectionSection: React.FC<TemplateSelectionSectionProps> = ({ selectedTemplate, setSelectedTemplate, availableTemplates }) => {
  const templates = availableTemplates
    ? defaultTemplates.filter(t => availableTemplates.includes(t.key))
    : defaultTemplates;
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {templates.map((tpl) => (
          <button
            key={tpl.key}
            type="button"
            onClick={() => setSelectedTemplate(tpl.key)}
            className={`p-4 border rounded-lg text-center flex-1 ${selectedTemplate === tpl.key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'}`}
          >
            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{tpl.label}</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{tpl.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelectionSection; 