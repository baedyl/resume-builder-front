import React from 'react';
import { ResumeFormData } from '../types/resume';

interface ResumeTemplateProps {
  data: ResumeFormData;
  template: string;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ data, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="resume-template">
      {renderTemplate()}
    </div>
  );
};

const ModernTemplate: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600 dark:text-gray-300 transition-colors">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600 dark:text-blue-400 transition-colors">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Professional Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm transition-colors">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{exp.jobTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">{exp.company}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300 transition-colors">
                  {exp.description.split('\n').map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{edu.degree}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.institution}</p>
              {edu.major && <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600 dark:text-gray-300 transition-colors">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700 dark:text-gray-300 transition-colors">
                <span className="font-medium dark:text-gray-100 transition-colors">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{cert.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600 dark:text-gray-300 transition-colors">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClassicTemplate: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="border-b-2 border-gray-900 dark:border-gray-100 pb-4 mb-6 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600 dark:text-gray-300 transition-colors">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600 dark:text-blue-400 transition-colors">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Professional Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm transition-colors">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{exp.jobTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">{exp.company}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300 transition-colors">
                  {exp.description.split('\n').map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{edu.degree}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.institution}</p>
              {edu.major && <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600 dark:text-gray-300 transition-colors">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700 dark:text-gray-300 transition-colors">
                <span className="font-medium dark:text-gray-100 transition-colors">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-300 dark:border-gray-600 pb-1 transition-colors">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{cert.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600 dark:text-gray-300 transition-colors">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MinimalTemplate: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600 dark:text-gray-300 transition-colors">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600 dark:text-blue-400 transition-colors">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="text-gray-700 dark:text-gray-300 transition-colors">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{exp.jobTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">{exp.company}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300 transition-colors">
                  {exp.description.split('\n').map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{edu.degree}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.institution}</p>
              {edu.major && <p className="text-gray-600 dark:text-gray-300 transition-colors">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600 dark:text-gray-300 transition-colors">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700 dark:text-gray-300 transition-colors">
                <span className="font-medium dark:text-gray-100 transition-colors">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{cert.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600 dark:text-gray-300 transition-colors">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate; 