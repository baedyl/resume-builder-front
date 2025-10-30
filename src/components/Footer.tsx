import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center transition duration-300 hover:opacity-80">
                <img
                  src="/logo_dark_small.svg"
                  alt="Resume Builder"
                  className="h-16 sm:h-20 w-auto mr-3"
                  width={180}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Create professional resumes that stand out and get you hired.
              Powered by AI to help you craft the perfect resume for your dream job.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/baedyl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">X (formerly Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/proairesume/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/resume" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/cover-letters" className="text-gray-300 hover:text-white transition-colors">
                  Cover Letters
                </Link>
              </li>
              <li>
                <Link to="/job-tracker" className="text-gray-300 hover:text-white transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link to="/my-resumes" className="text-gray-300 hover:text-white transition-colors">
                  My Resumes
                </Link>
              </li>
              <li>
                <Link to="/my-resumes" className="text-gray-300 hover:text-white transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Blog Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/blog/category/ats-optimization" className="text-gray-300 hover:text-white transition-colors">
                  ATS Optimization
                </Link>
              </li>
              <li>
                <Link to="/blog/category/ai-resume" className="text-gray-300 hover:text-white transition-colors">
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/blog/category/career-branding" className="text-gray-300 hover:text-white transition-colors">
                  Career Branding
                </Link>
              </li>
              <li>
                <Link to="/blog/category/job-search" className="text-gray-300 hover:text-white transition-colors">
                  Job Search
                </Link>
              </li>
              <li>
                <Link to="/blog/category/resume-tips" className="text-gray-300 hover:text-white transition-colors">
                  Resume Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Resume Builder</h3>
              <p className="text-gray-400 text-sm">
                © 2025 Pro AI Resume Builder. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 