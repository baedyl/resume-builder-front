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
    <div className="p-8 max-w-[800px] mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              {edu.major && <p className="text-gray-600">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700">
                <span className="font-medium">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClassicTemplate: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              {edu.major && <p className="text-gray-600">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700">
                <span className="font-medium">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MinimalTemplate: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{data.fullName}</h1>
        <div className="flex justify-center gap-4 mt-2 text-gray-600">
          <span>{data.email}</span>
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedIn && <span>• <a href={data.linkedIn} className="text-blue-600">{data.linkedIn}</a></span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="text-gray-700">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc ml-5 mt-2 text-gray-700">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              {edu.major && <p className="text-gray-600">{edu.major}</p>}
              {edu.graduationYear && <p className="text-gray-600">Graduated: {edu.graduationYear}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="text-gray-700">
                <span className="font-medium">{lang.name}</span> - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              {cert.issueDate && <p className="text-gray-600">Issued: {cert.issueDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate; 