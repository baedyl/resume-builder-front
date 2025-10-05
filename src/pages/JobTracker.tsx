import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createJobService } from '../services/jobService';
import { mockJobService } from '../services/mockJobService';
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
import { FEATURE_DESCRIPTIONS } from '../constants/subscription';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSubscription } from '../contexts/SubscriptionContext';
// import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const JobTracker: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { isPremium, isLoading: subscriptionLoading, subscription } = useSubscription();
  const jobService = createJobService(getAccessTokenSilently);
  // const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState<null | { message: string; upgradeUrl?: string }>(null);

  // Debug subscription status
  useEffect(() => {
    console.log('JobTracker - Subscription Debug:', {
      isPremium,
      subscriptionLoading,
      subscription,
      usingMockData
    });
  }, [isPremium, subscriptionLoading, subscription, usingMockData]);

  useEffect(() => {
    if (subscriptionLoading) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, subscriptionLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If user appears to have premium but we're getting 403s, fall back to mock data
      if (isPremium && !usingMockData) {
        try {
          const [jobsData, statsData] = await Promise.all([
            jobService.getJobs(filters),
            jobService.getStats()
          ]);
          
          setJobs(jobsData);
          setStats(statsData);
          setUsingMockData(false);
          return;
        } catch (err: any) {
          // If we get a 403 "Premium subscription required" error, fall back to mock data
          if (err?.response?.status === 403 && (err?.response?.data?.error === 'Premium subscription required' || err?.response?.data?.error === 'Your premium subscription has expired')) {
            console.warn('Backend returned 403 for premium user, falling back to mock data');
            if (err?.response?.data?.error === 'Your premium subscription has expired') {
              const details = err?.response?.data?.details || {};
              const upgradeUrl = err?.response?.data?.upgradeUrl || '/pricing';
              setSubscriptionExpired({ message: details?.message || err?.response?.data?.error, upgradeUrl });
              // Do not show toast; we will render PremiumGate overlay
              setUsingMockData(false);
              return; // stop here so we don't render mock
            }
            setUsingMockData(true);
            // Continue to mock data fallback below
          } else {
            // Re-throw other errors
            throw err;
          }
        }
      }
      
      // Use mock data as fallback
      if (usingMockData || (!isPremium && !subscriptionExpired)) {
        const [jobsData, statsData] = await Promise.all([
          mockJobService.getJobs(filters),
          mockJobService.getStats()
        ]);
        
        setJobs(jobsData);
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading job data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: any) => {
    try {
      if (usingMockData) {
        const newJob = await mockJobService.createJob(jobData);
        setJobs(prev => [newJob, ...prev]);
      } else {
        const newJob = await jobService.createJob(jobData);
        setJobs(prev => [newJob, ...prev]);
      }
      setShowAddModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add job');
      setError(err instanceof Error ? err.message : 'Failed to add job');
    }
  };

  const handleUpdateJob = async (id: string, jobData: any) => {
    try {
      if (usingMockData) {
        const updatedJob = await mockJobService.updateJob(id, jobData);
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      } else {
        const updatedJob = await jobService.updateJob(id, jobData);
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      }
      setSelectedJob(null);
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
      if (usingMockData) {
        await mockJobService.deleteJob(id);
      } else {
        await jobService.deleteJob(id);
      }
      setJobs(prev => prev.filter(job => job.id !== id));
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
      if (usingMockData) {
        await mockJobService.updateJob(id, { status });
      } else {
        await jobService.updateJob(id, { status });
      }
      await loadData();
      toast.success('Job status updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading || subscriptionLoading) {
    return <LoadingOverlay />;
  }

  // Show mock data warning if we're using fallback and subscription isn't expired
  const showMockWarning = usingMockData && isPremium && !subscriptionExpired;

  if (subscriptionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PremiumGate
          feature="Job Application Tracking"
          description={FEATURE_DESCRIPTIONS.JOB_TRACKER}
          forceGate
          gateTitle="Subscription Expired"
          gateMessage={subscriptionExpired.message}
          upgradeUrl={subscriptionExpired.upgradeUrl}
          showPreview={false}
        >
          <div />
        </PremiumGate>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-2 sm:px-4 lg:px-8 transition-colors duration-300">
      <PremiumGate 
        feature="Job Application Tracking" 
        description={FEATURE_DESCRIPTIONS.JOB_TRACKER}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sticky Action Bar */}
          <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <Breadcrumbs />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  {isPremium && !usingMockData && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Spacer to prevent content overlap */}
          <div className="h-12"></div>

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
                {showMockWarning && (
                  <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Using demo data - backend subscription check failed
                  </div>
                )}
              </div>
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