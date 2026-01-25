import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaStar,
  FaBuilding,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaFileAlt,
  FaEnvelope
} from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadingOverlay from '../components/LoadingOverlay';
import { JobOpportunity, CreateJobRequest } from '../types/job';
import { createJobOpportunitiesService } from '../services/jobOpportunitiesService';
import { mockJobOpportunitiesService } from '../services/mockJobOpportunitiesService';
import { createJobService } from '../services/jobService';
import { mockJobService } from '../services/mockJobService';
import AddJobModal from '../components/job-tracking/AddJobModal';
import { toast } from 'react-toastify';

const formatJobText = (text: string) => {
  if (!text) return null;

  // Check if text has bullet points
  if (text.includes('•')) {
    const parts = text.split('•').map(part => part.trim()).filter(part => part.length > 0);
    
    const startsWithBullet = text.trim().startsWith('•');
    
    if (startsWithBullet) {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {parts.map((part, index) => (
            <li key={index}>{part}</li>
          ))}
        </ul>
      );
    } else {
      const [intro, ...bullets] = parts;
      return (
        <div className="space-y-4">
          <p className="whitespace-pre-line leading-relaxed">{intro}</p>
          <ul className="list-disc pl-5 space-y-2">
            {bullets.map((part, index) => (
              <li key={index}>{part}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  return (
    <p className="whitespace-pre-line leading-relaxed">
      {text}
    </p>
  );
};

const extractSalaryFromDescription = (description: string): string | null => {
  if (!description) return null;
  
  // Regex to match salary patterns
  // Matches: $XX,XXX or $XX.XX
  // Optional range: - $YY,YYY
  // Optional frequency: /hr, annually, a week, etc.
  const salaryRegex = /(\$[\d,]+(\.\d{2})?(\s*(-|–|--|to)\s*\$[\d,]+(\.\d{2})?)?(\s*(\/hr|annually|per year|a week|weekly|hourly))?)/i;
  
  const match = description.match(salaryRegex);
  return match ? match[0] : null;
};

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [job, setJob] = useState<JobOpportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applying, setApplying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);

  // Use real service when authenticated, mock otherwise
  const jobOpportunitiesService = useMemo(() => {
    if (isAuthenticated && !isLoading) {
      return createJobOpportunitiesService(getAccessTokenSilently);
    }
    return mockJobOpportunitiesService;
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  const jobTrackingService = useMemo(() => {
    if (isAuthenticated && !isLoading) {
      return createJobService(getAccessTokenSilently);
    }
    return mockJobService;
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  useEffect(() => {
    const loadJob = async () => {
      if (!id || !jobOpportunitiesService) return;

      try {
        setLoading(true);
        const jobData = await jobOpportunitiesService.getJob(id);
        setJob(jobData);
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, jobOpportunitiesService]);

  const formatSalary = (salary: JobOpportunity['salary']) => {
    if (!salary) return 'Salary not specified';

    const { min, max, currency = 'USD' } = salary;
    if (typeof min === 'number' && typeof max === 'number') {
      return `${currency === 'USD' ? '$' : currency}${min.toLocaleString()} - ${currency === 'USD' ? '$' : currency}${max.toLocaleString()}`;
    } else if (typeof min === 'number') {
      return `${currency === 'USD' ? '$' : currency}${min.toLocaleString()}+`;
    } else if (typeof max === 'number') {
      return `Up to ${currency === 'USD' ? '$' : currency}${max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleApplySubmit = async (data: CreateJobRequest) => {
    try {
      setApplying(true);
      if (jobTrackingService) {
        await jobTrackingService.createJob(data);
      } else {
        await mockJobService.createJob(data);
      }
      setShowApplyModal(false);
      toast.success('Job application added to tracker!');
      window.location.href = '/job-tracker';
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add job application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Job not found'}
          </h2>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2301&q=80" 
          alt="Office background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pt-10">
          <Link
            to="/jobs"
            className="absolute top-6 left-6 inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {job.title}
          </h1>
          <div className="flex items-center text-blue-100 text-xl font-medium">
            <FaBuilding className="mr-2" />
            {job.company}
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/90">
             <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaMapMarkerAlt className="mr-2" />
                {job.location}
             </div>
             <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaBriefcase className="mr-2" />
                {job.jobType.replace('-', ' ')}
             </div>
             <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <FaDollarSign className="mr-2" />
                {job.salary ? formatSalary(job.salary) : (extractSalaryFromDescription(job.description) || 'Salary not specified')}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-center mb-10">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center"
                >
                  <FaPaperPlane className="mr-3" />
                  Apply for this Position
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                Job Description
              </h2>
              <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                {formatJobText(job.description)}
              </div>

              {job.requirements && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                    Requirements
                  </h2>
                  <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    {formatJobText(job.requirements)}
                  </div>
                </>
              )}
              
              {job.skills && job.skills.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                   <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Required Skills</h3>
                   <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Job Overview
                </h3>
                <dl className="space-y-4">
                  <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
                       <FaCalendarAlt />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Posted Date</dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white">{formatPostedDate(job.postedDate)}</dd>
                    </div>
                  </div>
                  
                  <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
                       <FaBriefcase />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Level</dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white capitalize">{job.experienceLevel}</dd>
                    </div>
                  </div>

                  <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
                       <FaClock />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Type</dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white capitalize">{job.jobType.replace('-', ' ')}</dd>
                    </div>
                  </div>
                  
                  {job.applicationDeadline && (
                    <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
                         <FaCalendarAlt />
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-white">{new Date(job.applicationDeadline).toLocaleDateString()}</dd>
                      </div>
                    </div>
                  )}
                </dl>
                
                {job.applicationUrl && (
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium flex items-center justify-center transition-colors"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Apply on Company Site
                    </a>
                  </div>
                )}
              </div>
              
              {/* Match Score Card */}
              {job.matchScore && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      Match Score
                   </h3>
                   <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                            {job.matchScore >= 80 ? 'Great Match' : job.matchScore >= 60 ? 'Good Match' : 'Fair Match'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-green-600">
                            {job.matchScore}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                        <div style={{ width: `${job.matchScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <AddJobModal
          job={{
            company: job.company,
            position: job.title,
            location: job.location,
            description: job.description,
            status: 'applied',
            dateApplied: new Date().toISOString().split('T')[0],
            jobUrl: window.location.href,
            salary: job.salary ? formatSalary(job.salary) : undefined
          } as any}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApplySubmit}
        />
      )}
    </div>
  );
};

export default JobDetail;