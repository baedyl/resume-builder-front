import React from 'react';
import { JobOpportunity } from '../types/job';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobOpportunity;
  showApplyButton?: boolean;
  onApply?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, showApplyButton = true, onApply }) => {
  const formatSalary = (salary: JobOpportunity['salary']) => {
    if (!salary) return 'Salary not specified';
    const { min, max, currency } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white shadow-md p-6 hover:scale-105 hover:bg-gray-50 transition-all duration-200 flex flex-col h-full border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            to={`/jobs/${job.id}`}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {job.title}
          </Link>
          <p className="text-lg text-gray-600 mt-1">{job.company}</p>
          <p className="text-gray-500 mt-1">{job.location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{formatDate(job.postedDate)}</p>
          <p className="text-sm text-gray-400 mt-1">{job.source}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3 text-sm flex-grow">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{job.jobType}</span>
          <span className="mx-2">•</span>
          <span>{job.experienceLevel}</span>
        </div>

        {showApplyButton && (
          <button
            onClick={() => onApply?.(job.id)}
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm hover:shadow-md"
          >
            Apply Now
          </button>
        )}
      </div>

      {job.matchScore && (
        <div className="mt-3 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${job.matchScore}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">{job.matchScore}% match</span>
        </div>
      )}
    </div>
  );
};

export default JobCard;