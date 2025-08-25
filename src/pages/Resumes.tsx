import { useState } from 'react';
import ResumeList from '../components/ResumeList';
import { ResumeFormData } from '../types/resume';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaShare, FaCopy, FaEye, FaChartLine, FaLightbulb, FaRocket } from 'react-icons/fa';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

const Resumes: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/my-resumes');
  };

  const handleEdit = (resume: ResumeFormData) => {
    navigate('/my-resumes', { state: { selectedResume: resume } });
  };

  return (
    <>
      <SEO
        title="My Resumes - Manage Your Professional Resumes"
        description="View, edit, and manage all your professional resumes. Track your resume performance and get personalized tips to improve your job applications."
        keywords="resume management, professional resumes, resume builder, job applications, career tools"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Sticky Action Bar */}
          <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <Breadcrumbs />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                  >
                    <FaPlus className="mr-2" />
                    Create New Resume
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer to prevent content overlap */}
          <div className="h-16"></div>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                  My Resumes
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
                  Manage your professional resumes and track your career progress
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaChartLine className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resumes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaEye className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Views This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaRocket className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaLightbulb className="text-blue-600 dark:text-blue-400 text-lg" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Pro Tip: Keep Your Resumes Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Regularly update your resumes with new skills and experiences. Recruiters prefer recent, relevant information that showcases your latest achievements.
                </p>
              </div>
            </div>
          </div>

          {/* Resume List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <ResumeList onSelectResume={handleEdit} />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FaDownload className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Export All</span>
            </button>

            <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FaShare className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share</span>
            </button>

            <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FaCopy className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duplicate</span>
            </button>

            <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FaEye className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resumes; 