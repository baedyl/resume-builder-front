import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createJobService } from '../services/jobService';
import { JobApplication, JobStats, JobStatus } from '../types/job';
import type { JobFilters } from '../types/job';
import JobStatsCard from '../components/job-tracking/JobStatsCard';
import JobList from '../components/job-tracking/JobList';
import JobFiltersComponent from '../components/job-tracking/JobFilters';
import AddJobModal from '../components/job-tracking/AddJobModal';
import FollowUpsWidget from '../components/job-tracking/FollowUpsWidget';
import DeadlinesWidget from '../components/job-tracking/DeadlinesWidget';
import LoadingOverlay from '../components/LoadingOverlay';
import PremiumGate from '../components/PremiumGate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobTracker: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const jobService = createJobService(getAccessTokenSilently);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [jobsData, statsData] = await Promise.all([
        jobService.getJobs(filters),
        jobService.getStats()
      ]);
      
      setJobs(jobsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: any) => {
    try {
      const newJob = await jobService.createJob(jobData);
      setJobs(prev => [newJob, ...prev]);
      setShowAddModal(false);
      // await loadData(); // Refresh stats
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add job');
      setError(err instanceof Error ? err.message : 'Failed to add job');
    }
  };

  const handleUpdateJob = async (id: string, jobData: any) => {
    try {
      const updatedJob = await jobService.updateJob(id, jobData);
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      setSelectedJob(null);
      // await loadData(); // Refresh stats
      // toast.success('Job updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update job');
      setError(err instanceof Error ? err.message : 'Failed to update job');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    try {
      await jobService.deleteJob(id);
      setJobs(prev => prev.filter(job => job.id !== id));
      // await loadData(); // Refresh stats
      toast.success('Job deleted successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete job');
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  const handleStatusFilter = (status: JobStatus | 'all') => {
    if (status === 'all') {
      setFilters(prev => ({ ...prev, status: undefined }));
    } else {
      setFilters(prev => ({ ...prev, status }));
    }
  };

  const handleStatusUpdate = async (id: string, status: JobStatus) => {
    try {
      await jobService.updateJob(id, { status });
      await loadData();
      toast.success('Job status updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PremiumGate 
        feature="Job Application Tracking" 
        description="Track your job applications, manage deadlines, follow-ups, and get insights into your job search progress with detailed analytics."
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Job Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Track your job applications and stay organized
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Application
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {stats && (
            <div className="mb-8">
              <JobStatsCard stats={stats} onStatusClick={handleStatusFilter} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="mb-6">
                <JobFiltersComponent filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Job List */}
              <JobList
                jobs={jobs}
                onEdit={setSelectedJob}
                onDelete={handleDeleteJob}
                onStatusChange={handleStatusUpdate}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Follow-ups Widget */}
              <FollowUpsWidget />
              
              {/* Deadlines Widget */}
              <DeadlinesWidget />
            </div>
          </div>
        </div>

        {/* Add Job Modal */}
        {showAddModal && (
          <AddJobModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddJob}
          />
        )}

        {/* Edit Job Modal */}
        {selectedJob && (
          <AddJobModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSubmit={(data) => handleUpdateJob(selectedJob.id, data)}
          />
        )}
      </PremiumGate>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default JobTracker; 