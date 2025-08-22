import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaMagic, FaDownload, FaStar, FaCheck, FaUsers, FaClipboardList, FaClock, FaFileAlt, FaBrain, FaChartLine } from 'react-icons/fa';
import SEO from '../components/SEO';

const AIResumeBuilder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO 
        title="AI Resume Builder - Free Professional Resume Creator with AI Technology"
        description="Create professional, ATS-optimized resumes with advanced AI assistance. Our AI resume builder provides intelligent suggestions, templates, and real-time optimization to help you land your dream job."
        keywords="ai resume builder, ai resume builder free, free ai resume builder, AI resume creator, professional resume builder, ATS optimized resume, resume templates, cover letter generator, job application tracker, career tools, job search, resume maker, cv builder"
        url="/ai-resume-builder"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
              <FaBrain className="mr-2" />
              Powered by Advanced AI Technology
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              The Most Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Resume Builder</span> Available
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of resume creation with our cutting-edge AI technology. Get intelligent suggestions, 
              real-time optimization, and professional templates designed to help you stand out in today's competitive job market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/resume"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaMagic className="mr-2" />
                Start Building Free
              </a>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              >
                <FaFileAlt className="mr-2" />
                Learn More
              </a>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Free AI resume builder
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Real-time AI suggestions
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                ATS optimized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Our AI Resume Builder Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our advanced AI technology analyzes your experience and provides intelligent recommendations to create the perfect resume.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaBrain className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Content Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your experience and suggests powerful action verbs, quantifiable achievements, and industry-specific keywords.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-Time ATS Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant feedback on how well your resume will perform with Applicant Tracking Systems used by 75% of companies.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaMagic className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Smart Template Selection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI recommends the best template for your industry and experience level to maximize your chances of success.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaClock className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Time-Saving Automation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create professional resumes in minutes, not hours. Our AI handles the heavy lifting while you focus on your content.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaClipboardList className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Intelligent Job Matching</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI helps you tailor your resume for specific job postings by identifying relevant keywords and requirements.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expert-Level Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get professional advice and best practices from career experts integrated into our AI system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI vs Traditional Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Resume Builder vs Traditional Methods
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how our AI technology revolutionizes the resume creation process
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">AI Resume Builder</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Intelligent content suggestions based on your experience</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Real-time ATS optimization feedback</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Industry-specific keyword recommendations</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Professional templates optimized for success</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Complete resume in 15-30 minutes</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Continuous learning and improvement</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-600 mb-6">Traditional Methods</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Manual content creation with limited guidance</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>No ATS optimization feedback</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Generic templates without customization</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Limited keyword optimization</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Hours of manual work required</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Static approach without updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories with Our AI Resume Builder
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how our AI technology has helped professionals land their dream jobs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "The AI suggestions were spot-on! I landed a 40% salary increase at a top tech company within 2 weeks of using this AI resume builder."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Amélie Lobe</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Senior Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "The ATS optimization feature is incredible. I went from 0 interviews to 5 callbacks in just one month!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Michael Rodriguez</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "As a career changer, the AI helped me translate my experience into relevant skills. Got my dream job in 3 weeks!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  J
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Bello Ishaga</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Data Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Experience the Power of AI Resume Building
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have transformed their careers with our advanced AI resume builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="/resume"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaRocket className="mr-2" />
              Start Building with AI Now
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <FaFileAlt className="mr-2" />
              View Premium Features
            </Link>
          </div>
          <p className="text-blue-100 text-sm">
            Free AI resume builder • Advanced AI technology • ATS optimized • Professional templates
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIResumeBuilder; 