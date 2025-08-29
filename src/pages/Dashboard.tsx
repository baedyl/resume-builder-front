import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaMagic, FaEnvelope, FaBriefcase, FaCrown, FaBook, FaChartBar, FaCheckCircle, FaClock, FaTimes, FaHandshake, FaPause } from 'react-icons/fa';

type DashboardStats = {
  user?: {
    isPremium: boolean;
    planType: string;
    subscriptionStatus: string;
  };
  resumes?: {
    total: number;
  };
  coverLetters?: {
    total: number;
  };
  jobTracking?: {
    total: number;
    byStatus: {
      applied: number;
      interviewing: number;
      rejected: number;
      offer: number;
      withdrawn: number;
      pending: number;
      followUp: number;
    };
    metrics: {
      responseRate: number;
      interviewRate: number;
      offerRate: number;
    };
  };
};

const Dashboard: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const firstName = useMemo(() => {
    const name = (user?.name || user?.given_name || '').trim();
    return name ? name.split(' ')[0] : 'there';
  }, [user]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_API_AUDIENCE } as any);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!mounted) return;
        setStats(res.data || {});
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.response?.data?.error || e?.message || 'Failed to load dashboard stats');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getAccessTokenSilently]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <FaClock className="text-blue-500" />;
      case 'interviewing': return <FaCheckCircle className="text-green-500" />;
      case 'offer': return <FaHandshake className="text-purple-500" />;
      case 'rejected': return <FaTimes className="text-red-500" />;
      case 'withdrawn': return <FaPause className="text-gray-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'followUp': return <FaClock className="text-orange-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-600 dark:text-blue-400';
      case 'interviewing': return 'text-green-600 dark:text-green-400';
      case 'offer': return 'text-purple-600 dark:text-purple-400';
      case 'rejected': return 'text-red-600 dark:text-red-400';
      case 'withdrawn': return 'text-gray-600 dark:text-gray-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'followUp': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Action Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <Breadcrumbs />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/my-resumes"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FaMagic className="mr-2" />
                Create Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-12"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting + Important Actions */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mornin' {firstName}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Take a look into your career workspace</p>
        </div>

        {/* Error State */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '—' : (stats?.resumes?.total ?? 0)}</p>
              </div>
              <FaFileAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cover Letters</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '—' : (stats?.coverLetters?.total ?? 0)}</p>
              </div>
              <FaEnvelope className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Job Applications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '—' : (stats?.jobTracking?.total ?? 0)}</p>
              </div>
              <FaBriefcase className="text-purple-600 dark:text-purple-400 text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '—' : (stats?.jobTracking?.metrics?.responseRate ?? 0)}%</p>
              </div>
              <FaChartBar className="text-orange-600 dark:text-orange-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Job Tracking Status */}
        {stats?.jobTracking && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Application Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(stats.jobTracking.byStatus).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className="flex justify-center mb-2">
                    {getStatusIcon(status)}
                  </div>
                  <p className={`text-2xl font-bold ${getStatusColor(status)}`}>{count}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              ))}
            </div>
            
            {/* Metrics Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.jobTracking.metrics.responseRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interview Rate</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.jobTracking.metrics.interviewRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Offer Rate</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.jobTracking.metrics.offerRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status */}
        {stats?.user && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {stats.user.isPremium ? 'Premium Plan Active' : 'Free Plan'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stats.user.isPremium 
                    ? `You're on the ${stats.user.planType} plan with ${stats.user.subscriptionStatus} status`
                    : 'Upgrade to unlock advanced features and unlimited resumes'
                  }
                </p>
              </div>
              <div className="flex items-center">
                {stats.user.isPremium ? (
                  <FaCrown className="text-yellow-500 text-3xl" />
                ) : (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature Shortcuts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Workspace</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/resume" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">AI Resume Builder</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate impact‑driven content with AI</p>
              </div>
              <FaMagic className="text-blue-600 dark:text-blue-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/my-resumes" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">My Resumes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Edit and manage saved resumes</p>
              </div>
              <FaFileAlt className="text-indigo-600 dark:text-indigo-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/cover-letters" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Cover Letters</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create tailored cover letters</p>
              </div>
              <FaEnvelope className="text-green-600 dark:text-green-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/job-tracker" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Job Tracker</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track applications and follow‑ups</p>
              </div>
              <FaBriefcase className="text-purple-600 dark:text-purple-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/subscription" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Subscription</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your premium plan</p>
              </div>
              <FaCrown className="text-yellow-600 dark:text-yellow-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/blog" className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Career Guides</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tips for ATS, interviews, and more</p>
              </div>
              <FaBook className="text-rose-600 dark:text-rose-400 text-xl group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


