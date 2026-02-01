import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaBriefcase, FaArrowRight, FaStar } from 'react-icons/fa';
import LoadingOverlay from './LoadingOverlay';
import JobCard from './JobCard';
import { JobOpportunity } from '../types/job';
import { createJobOpportunitiesService } from '../services/jobOpportunitiesService';
import { mockJobOpportunitiesService } from '../services/mockJobOpportunitiesService';

const JobMatches: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use real service only when authenticated
  const jobService = useMemo(() => {
    if (isAuthenticated && !isLoading) {
      return createJobOpportunitiesService(getAccessTokenSilently);
    }
    return null;
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  useEffect(() => {
    const loadJobMatches = async () => {
      if (!jobService) return;

      try {
        setLoading(true);
        const response = await jobService.getJobMatches(1, 6); // Load first 6 matches
        setJobs(response.jobs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load job matches');
      } finally {
        setLoading(false);
      }
    };

    loadJobMatches();
  }, [jobService]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <FaBriefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Personalized Job Matches
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to see jobs that match your profile and get personalized recommendations.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In to View Matches
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Job Matches for You
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Personalized recommendations based on your profile
          </p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          View All Jobs
          <FaArrowRight className="ml-2" />
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} showMatchScore={true} compact={true} />
          ))}

          {jobs.length > 3 && (
            <div className="text-center pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                View {jobs.length - 3} More Matches
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaBriefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No matches found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete your profile to get better job recommendations.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse All Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobMatches;