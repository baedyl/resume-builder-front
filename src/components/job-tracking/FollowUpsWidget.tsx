import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { JobFollowUp } from '../../types/job';

const FollowUpsWidget: React.FC = () => {
  const [followUps, setFollowUps] = useState<JobFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else {
      return `In ${diffDays} days`;
    }
  };

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 0) return 'text-red-600 dark:text-red-400';
    if (daysUntil <= 1) return 'text-orange-600 dark:text-orange-400';
    if (daysUntil <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Follow-ups
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Follow-ups
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Next 7 days
          </span>
        </div>
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-center text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : followUps.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No upcoming follow-ups</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {followUp.company}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {followUp.position}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${getUrgencyColor(followUp.daysUntil)}`}>
                    {formatDate(followUp.followUpDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(followUp.followUpDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {followUps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.location.href = '/job-tracker'}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              View All Applications →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpsWidget; 