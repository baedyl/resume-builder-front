import React from 'react';
import { JobStats, JobStatus } from '../../types/job';

interface JobStatsCardProps {
  stats: JobStats;
  onStatusClick: (status: JobStatus | 'all') => void;
}

const JobStatsCard: React.FC<JobStatsCardProps> = ({ stats, onStatusClick }) => {
  const statusConfig = {
    total: { label: 'Total', color: 'bg-gray-500', textColor: 'text-gray-100' },
    applied: { label: 'Applied', color: 'bg-blue-500', textColor: 'text-blue-100' },
    interviewing: { label: 'Interviewing', color: 'bg-yellow-500', textColor: 'text-yellow-100' },
    offer: { label: 'Offers', color: 'bg-green-500', textColor: 'text-green-100' },
    rejected: { label: 'Rejected', color: 'bg-red-500', textColor: 'text-red-100' },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-400', textColor: 'text-gray-100' },
    pending: { label: 'Pending', color: 'bg-purple-500', textColor: 'text-purple-100' },
    followUp: { label: 'Follow-up', color: 'bg-orange-500', textColor: 'text-orange-100' },
  };

  const rateConfig = [
    { label: 'Response Rate', value: stats.responseRate, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Interview Rate', value: stats.interviewRate, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Offer Rate', value: stats.offerRate, color: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Application Statistics
        </h2>
      </div>
      
      <div className="p-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = stats[key as keyof JobStats] as number;
            return (
              <button
                key={key}
                onClick={() => onStatusClick(key === 'total' ? 'all' : key as JobStatus)}
                className={`${config.color} ${config.textColor} rounded-lg p-4 text-center hover:opacity-90 transition-opacity cursor-pointer`}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm font-medium">{config.label}</div>
              </button>
            );
          })}
        </div>

        {/* Rate Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rateConfig.map((rate) => (
            <div key={rate.label} className="text-center">
              <div className={`text-3xl font-bold ${rate.color}`}>
                {rate.value !== undefined && rate.value !== null ? rate.value.toFixed(1) : '0.0'}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {rate.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobStatsCard; 